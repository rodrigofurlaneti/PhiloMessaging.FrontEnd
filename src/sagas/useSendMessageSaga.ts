import { useState, useCallback } from 'react';
import { generateId as uuidv4 } from './uuid';
import { chatApi } from '@/features/chat/api/chatApi';
import type { AnyMessage, OptimisticMessage } from '@/features/chat/types';
import {
  SagaStatus,
  SendMessageSagaStep,
  type SendMessageSagaState,
} from './types';

interface UseSendMessageSagaOptions {
  chatId: number;
  senderId: number;
  onOptimisticAdd?: (msg: OptimisticMessage) => void;
  onConfirm?: (tempId: string, realMessage: AnyMessage) => void;
  onCompensate?: (tempId: string) => void;
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
        type: messageType === 1 ? 'Text' : 'Other',
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

        // ── Step 3: OptimisticUpdate (confirmar) ──────────────────────────
        setSagaState(prev => ({
          ...prev,
          currentStep: SendMessageSagaStep.OptimisticUpdate,
          sagaResultMessageId: result.messageId,
        }));

        if (result.messageId) {
          // Substitui mensagem otimista pela real (ou recarrega lista)
          const confirmedMsg: AnyMessage = {
            ...optimisticMsg,
            id: result.messageId,
            isOptimistic: true,
            isPending: false,
            isFailed: false,
          };
          onConfirm?.(tempId, confirmedMsg);
        }

        // ── Step 4: RefreshFeed ───────────────────────────────────────────
        setSagaState(prev => ({ ...prev, currentStep: SendMessageSagaStep.RefreshFeed }));
        await onRefreshFeed?.();

        // ── Completed ─────────────────────────────────────────────────────
        setSagaState(prev => ({
          ...prev,
          currentStep: SendMessageSagaStep.Completed,
          status: SagaStatus.Completed,
          isCompleted: true,
          createdMessageId: result.messageId,
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
