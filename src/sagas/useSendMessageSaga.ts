import { useState, useCallback } from 'react';
import { generateId as uuidv4 } from './uuid';
import { chatApi } from '@/features/chat/api/chatApi';
import type { AnyMessage, OptimisticMessage } from '@/features/chat/types';
import {
  SagaStatus,
  SendMessageSagaStep,
  type SendMessageSagaState,
} from './types';

/** Converte o messageType numérico para o nome string esperado pelo backend/UI */
const messageTypeToString = (t: number): string => {
  const map: Record<number, string> = {
    1: 'Text', 2: 'Image', 3: 'Video', 4: 'Audio', 5: 'Document',
    6: 'Sticker', 7: 'Gif', 8: 'Location', 9: 'Contact', 10: 'Poll', 11: 'System',
  };
  return map[t] ?? 'Text';
};

interface UseSendMessageSagaOptions {
  chatId: number;
  senderId: number;
  /** Callback para adicionar mensagem otimista no estado local */
  onOptimisticAdd?: (msg: OptimisticMessage) => void;
  /**
   * Callback para confirmar mensagem (substitui otimista pelo real).
   * Chamado sincronamente após a API responder — SEM refetch completo,
   * evitando o piscar/flicker nas mensagens já exibidas.
   */
  onConfirm?: (tempId: string, realMessage: AnyMessage) => void;
  /** Callback para remover mensagem otimista em caso de falha (compensação) */
  onCompensate?: (tempId: string) => void;
  /** Callback ao concluir para atualizar feed */
  onRefreshFeed?: () => void | Promise<void>;
}

const initialState = (): SendMessageSagaState => ({
  sagaId: uuidv4(),
  currentStep: null,
  status: SagaStatus.Idle,
  isCompleted: false,
  isCompensated: false,
  errorMessage: null,
  chatId: null,
  content: null,
  messageType: 1,
  replyToId: null,
  forwardedFromId: null,
  createdMessageId: null,
  sagaResultMessageId: null,
});

/**
 * useSendMessageSaga
 *
 * Implementa o padrão SAGA no Frontend para envio de mensagens,
 * espelhando o SendMessageSaga do Backend C#.
 *
 * Passos:
 * 1. ValidateInput   — valida dados localmente antes de chamar a API
 * 2. CallApi         — chama POST /chats/{chatId}/messages (Backend SAGA)
 * 3. OptimisticUpdate— aplica mensagem otimista / confirma no estado local
 * 4. RefreshFeed     — atualiza o feed de conversas
 * 5. Completed
 *
 * Compensação: remove a mensagem otimista se a API falhar.
 */
export const useSendMessageSaga = (options: UseSendMessageSagaOptions) => {
  const { chatId, senderId, onOptimisticAdd, onConfirm, onCompensate, onRefreshFeed } = options;
  const [sagaState, setSagaState] = useState<SendMessageSagaState>(initialState());

  const execute = useCallback(
    async (
      content: string,
      messageType = 1,
      replyToId?: number | null,
      forwardedFromId?: number | null
    ) => {
      // Gera um ID temporário único para rastrear a mensagem otimista
      const tempId = uuidv4();
      const sagaId = uuidv4();

      setSagaState({
        sagaId,
        currentStep: SendMessageSagaStep.ValidateInput,
        status: SagaStatus.Running,
        isCompleted: false,
        isCompensated: false,
        errorMessage: null,
        chatId,
        content,
        messageType,
        replyToId: replyToId ?? null,
        forwardedFromId: forwardedFromId ?? null,
        createdMessageId: null,
        sagaResultMessageId: null,
      });

      // ── Step 1: ValidateInput ─────────────────────────────────────────────
      if (!content.trim() && messageType === 1) {
        setSagaState(prev => ({
          ...prev,
          status: SagaStatus.Failed,
          errorMessage: 'Mensagem de texto não pode ser vazia.',
        }));
        return null;
      }

      // ── Mensagem Otimista (antes da API responder) ─────────────────────────
      const optimisticMsg: OptimisticMessage = {
        id: -Date.now(), // ID temporário negativo para não conflitar com BD
        chatId,
        senderId,
        type: messageTypeToString(messageType),
        content,
        contentEncrypted: true,
        replyToId: replyToId ?? null,
        forwardedFromId: forwardedFromId ?? null,
        sentAt: new Date().toISOString(),
        editedAt: null,
        deletedForEveryone: false,
        isOptimistic: true,
        isPending: true,
        isFailed: false,
      };

      // Injeta mensagem otimista imediatamente na UI
      onOptimisticAdd?.(optimisticMsg);

      // ── Step 2: CallApi ───────────────────────────────────────────────────
      setSagaState(prev => ({ ...prev, currentStep: SendMessageSagaStep.CallApi }));

      try {
        const result = await chatApi.sendMessage(chatId, {
          type: messageType,
          content,
          contentEncrypted: true,
          replyToId,
          forwardedFromId,
        });

        // ── Step 3: OptimisticUpdate ─────────────────────────────────────
        //    Substitui a mensagem otimista (-tempId) pela mensagem real
        //    retornada da API (id positivo do banco).
        //    Usamos onConfirm para uma troca ATÔMICA sem refetch completo,
        //    evitando o "piscar" das mensagens já exibidas.
        setSagaState(prev => ({
          ...prev,
          currentStep: SendMessageSagaStep.OptimisticUpdate,
          sagaResultMessageId: result.messageId,
          createdMessageId: result.messageId,
        }));

        if (result.messageId) {
          const confirmedMsg: AnyMessage = {
            ...optimisticMsg,
            id: result.messageId,
            isOptimistic: false,   // Mensagem real, não otimista
            isPending: false,
            isFailed: false,
          } as AnyMessage;
          onConfirm?.(tempId, confirmedMsg);
        }

        // ── Step 4: RefreshFeed ───────────────────────────────────────────
        setSagaState(prev => ({ ...prev, currentStep: SendMessageSagaStep.RefreshFeed }));
        try {
          await onRefreshFeed?.();
        } catch {
          // Feed refresh falhou — não crítico, não compensa
        }

        // ── Completed ─────────────────────────────────────────────────────
        setSagaState(prev => ({
          ...prev,
          currentStep: SendMessageSagaStep.Completed,
          status: SagaStatus.Completed,
          isCompleted: true,
        }));

        return result;
      } catch (error: unknown) {
        // ── Compensação: remove mensagem otimista ─────────────────────────
        setSagaState(prev => ({
          ...prev,
          currentStep: SendMessageSagaStep.Compensating,
          status: SagaStatus.Compensating,
          errorMessage: error instanceof Error ? error.message : 'Erro ao enviar mensagem.',
        }));

        onCompensate?.(tempId);

        setSagaState(prev => ({
          ...prev,
          status: SagaStatus.Compensated,
          isCompensated: true,
        }));

        return null;
      }
    },
    [chatId, senderId, onOptimisticAdd, onConfirm, onCompensate, onRefreshFeed]
  );

  const reset = useCallback(() => setSagaState(initialState()), []);

  return {
    sagaState,
    execute,
    reset,
    isRunning: sagaState.status === SagaStatus.Running,
    isCompleted: sagaState.isCompleted,
    isCompensated: sagaState.isCompensated,
    error: sagaState.errorMessage,
  };
};
