import { useState, useCallback } from 'react';
import { generateId as uuidv4 } from './uuid';
import { chatApi } from '@/features/chat/api/chatApi';
import {
  SagaStatus,
  DeleteMessageSagaStep,
  type DeleteMessageSagaState,
} from './types';

interface UseDeleteMessageSagaOptions {
  /** Callback para marcar mensagem como deletada localmente (antes da API) */
  onMarkDeleted?: (messageId: number) => void;
  /** Callback para restaurar mensagem se a API falhar (compensação) */
  onRestore?: (messageId: number) => void;
}

const initialState = (): DeleteMessageSagaState => ({
  sagaId: uuidv4(),
  currentStep: null,
  status: SagaStatus.Idle,
  isCompleted: false,
  isCompensated: false,
  errorMessage: null,
  chatId: null,
  messageId: null,
  sentAt: null,
});

/** Verifica se a mensagem ainda está dentro da janela de 60 minutos */
function isWithinDeleteWindow(sentAt: string): boolean {
  const sent = new Date(sentAt).getTime();
  const now = Date.now();
  const sixtyMinutes = 60 * 60 * 1000;
  return now - sent <= sixtyMinutes;
}

/**
 * useDeleteMessageSaga
 *
 * Implementa o padrão SAGA no Frontend para exclusão de mensagens,
 * espelhando o DeleteMessageSaga do Backend C#.
 *
 * Passos:
 * 1. ValidateWindow  — verifica janela de 60 minutos (cliente-side check)
 * 2. CallApi         — DELETE /chats/{chatId}/messages/{messageId}/for-everyone
 * 3. UpdateLocalState— atualiza estado local imediatamente
 * 4. Completed
 *
 * Compensação: restaura a mensagem visualmente se a API falhar.
 */
export const useDeleteMessageSaga = (options: UseDeleteMessageSagaOptions = {}) => {
  const { onMarkDeleted, onRestore } = options;
  const [sagaState, setSagaState] = useState<DeleteMessageSagaState>(initialState());

  const execute = useCallback(
    async (chatId: number, messageId: number, sentAt: string): Promise<boolean> => {
      const sagaId = uuidv4();

      setSagaState({
        sagaId,
        currentStep: DeleteMessageSagaStep.ValidateWindow,
        status: SagaStatus.Running,
        isCompleted: false,
        isCompensated: false,
        errorMessage: null,
        chatId,
        messageId,
        sentAt,
      });

      // ── Step 1: ValidateWindow ────────────────────────────────────────────
      if (!isWithinDeleteWindow(sentAt)) {
        setSagaState(prev => ({
          ...prev,
          status: SagaStatus.Failed,
          errorMessage: 'Só é possível apagar mensagens enviadas nos últimos 60 minutos.',
        }));
        return false;
      }

      // Marca otimisticamente como deletada na UI
      onMarkDeleted?.(messageId);

      // ── Step 2: CallApi ───────────────────────────────────────────────────
      setSagaState(prev => ({ ...prev, currentStep: DeleteMessageSagaStep.CallApi }));

      try {
        await chatApi.deleteMessageForEveryone(chatId, messageId);

        // ── Step 3: UpdateLocalState ──────────────────────────────────────
        setSagaState(prev => ({
          ...prev,
          currentStep: DeleteMessageSagaStep.UpdateLocalState,
        }));

        // ── Completed ─────────────────────────────────────────────────────
        setSagaState(prev => ({
          ...prev,
          currentStep: DeleteMessageSagaStep.Completed,
          status: SagaStatus.Completed,
          isCompleted: true,
        }));

        return true;
      } catch (error: unknown) {
        // ── Compensação: restaura mensagem ────────────────────────────────
        setSagaState(prev => ({
          ...prev,
          currentStep: DeleteMessageSagaStep.Compensating,
          status: SagaStatus.Compensating,
          errorMessage: error instanceof Error ? error.message : 'Erro ao apagar mensagem.',
        }));

        onRestore?.(messageId);

        setSagaState(prev => ({
          ...prev,
          status: SagaStatus.Compensated,
          isCompensated: true,
        }));

        return false;
      }
    },
    [onMarkDeleted, onRestore]
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
