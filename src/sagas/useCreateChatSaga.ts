import { useState, useCallback } from 'react';
import { generateId as uuidv4 } from './uuid';
import { chatApi } from '@/features/chat/api/chatApi';
import type { ChatDto } from '@/features/chat/types';
import {
  SagaStatus,
  CreateChatSagaStep,
  type CreateChatSagaState,
} from './types';

interface UseCreateChatSagaOptions {
  onRefreshFeed?: () => void | Promise<void>;
  onChatCreated?: (chat: ChatDto) => void;
}

const initialState = (): CreateChatSagaState => ({
  sagaId: uuidv4(),
  currentStep: null,
  status: SagaStatus.Idle,
  isCompleted: false,
  isCompensated: false,
  errorMessage: null,
  contactUserId: null,
  contactName: null,
  initialMessage: null,
  createdChatId: null,
  createdMessageId: null,
});

/**
 * useCreateChatSaga — "Handshake SAGA"
 *
 * Implementa o fluxo de criação de chat + envio da primeira mensagem.
 * Este é um SAGA orquestrado no Frontend que coordena duas chamadas ao Backend
 * (cada uma executa seu próprio SAGA internamente).
 *
 * Passos:
 * 1. ValidateInput  — valida contato e mensagem
 * 2. CreateChat     — POST /chats (cria o chat privado)
 * 3. SendMessage    — POST /chats/{chatId}/messages (Backend: SendMessage SAGA)
 * 4. RefreshFeed    — recarrega o feed
 * 5. Completed
 *
 * Compensação:
 * - Se SendMessage falhar após CreateChat, o chat criado fica vazio
 *   (aceitável — o usuário pode tentar enviar novamente)
 */
export const useCreateChatSaga = (options: UseCreateChatSagaOptions = {}) => {
  const { onRefreshFeed, onChatCreated } = options;
  const [sagaState, setSagaState] = useState<CreateChatSagaState>(initialState());

  const execute = useCallback(
    async (
      contactUserId: number,
      contactName: string,
      initialMessage: string
    ): Promise<ChatDto | null> => {
      const sagaId = uuidv4();

      setSagaState({
        sagaId,
        currentStep: CreateChatSagaStep.ValidateInput,
        status: SagaStatus.Running,
        isCompleted: false,
        isCompensated: false,
        errorMessage: null,
        contactUserId,
        contactName,
        initialMessage,
        createdChatId: null,
        createdMessageId: null,
      });

      // ── Step 1: ValidateInput ─────────────────────────────────────────────
      if (!initialMessage.trim()) {
        setSagaState(prev => ({
          ...prev,
          status: SagaStatus.Failed,
          errorMessage: 'A mensagem de iniciação não pode ser vazia.',
        }));
        return null;
      }

      // ── Step 2: CreateChat ────────────────────────────────────────────────
      setSagaState(prev => ({ ...prev, currentStep: CreateChatSagaStep.CreateChat }));

      let newChat: ChatDto;
      try {
        newChat = await chatApi.createChat({
          type: 1, // ChatType.Private = 1 (backend: Private=1, Group=2, Broadcast=3)
          name: contactName,
          initialMemberIds: [contactUserId],
        });

        setSagaState(prev => ({
          ...prev,
          createdChatId: newChat.id,
        }));
      } catch (error: unknown) {
        setSagaState(prev => ({
          ...prev,
          currentStep: CreateChatSagaStep.Compensating,
          status: SagaStatus.Compensated,
          isCompensated: true,
          errorMessage: error instanceof Error ? error.message : 'Erro ao criar conversa.',
        }));
        return null;
      }

      // ── Step 3: SendMessage ───────────────────────────────────────────────
      setSagaState(prev => ({ ...prev, currentStep: CreateChatSagaStep.SendMessage }));

      try {
        const msgResult = await chatApi.sendMessageText(newChat.id, initialMessage);

        setSagaState(prev => ({
          ...prev,
          createdMessageId: msgResult.messageId,
        }));
      } catch (error: unknown) {
        // Compensação parcial: chat foi criado, mas mensagem falhou.
        // Retornamos o chat para que o usuário possa tentar novamente.
        setSagaState(prev => ({
          ...prev,
          currentStep: CreateChatSagaStep.Compensating,
          status: SagaStatus.Compensated,
          isCompensated: true,
          errorMessage:
            error instanceof Error
              ? `Chat criado, mas falha ao enviar mensagem: ${error.message}`
              : 'Chat criado, mas falha ao enviar mensagem.',
        }));
        // Retorna o chat para que o usuário possa reabri-lo
        onChatCreated?.(newChat);
        await onRefreshFeed?.();
        return newChat;
      }

      // ── Step 4: RefreshFeed ───────────────────────────────────────────────
      setSagaState(prev => ({ ...prev, currentStep: CreateChatSagaStep.RefreshFeed }));
      await onRefreshFeed?.();

      // ── Completed ─────────────────────────────────────────────────────────
      setSagaState(prev => ({
        ...prev,
        currentStep: CreateChatSagaStep.Completed,
        status: SagaStatus.Completed,
        isCompleted: true,
      }));

      onChatCreated?.(newChat);
      return newChat;
    },
    [onRefreshFeed, onChatCreated]
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
    currentStep: sagaState.currentStep,
  };
};
