import { useState, useCallback } from 'react';
import { generateId as uuidv4 } from './uuid';
import { chatApi } from '@/features/chat/api/chatApi';
import {
  SagaStatus,
  JoinGroupSagaStep,
  type JoinGroupSagaState,
} from './types';

interface UseJoinGroupSagaOptions {
  onRefreshFeed?: () => void | Promise<void>;
}

const initialState = (): JoinGroupSagaState => ({
  sagaId: uuidv4(),
  currentStep: null,
  status: SagaStatus.Idle,
  isCompleted: false,
  isCompensated: false,
  errorMessage: null,
  token: null,
});

/**
 * useJoinGroupSaga
 *
 * Implementa o padrão SAGA no Frontend para entrada em grupos via link,
 * espelhando o JoinGroupSaga do Backend C#.
 *
 * Passos:
 * 1. ValidateToken — valida o formato do token localmente
 * 2. CallApi       — POST /chats/join/{token} (Backend executa a SAGA completa)
 * 3. RefreshFeed   — recarrega a lista de chats para mostrar o novo grupo
 * 4. Completed
 *
 * Nota: A compensação completa (sair do grupo se algo falhar após o join)
 * é gerenciada pelo Backend SAGA. O Frontend apenas trata falhas de rede.
 */
export const useJoinGroupSaga = (options: UseJoinGroupSagaOptions = {}) => {
  const { onRefreshFeed } = options;
  const [sagaState, setSagaState] = useState<JoinGroupSagaState>(initialState());

  const execute = useCallback(
    async (token: string): Promise<boolean> => {
      const sagaId = uuidv4();

      setSagaState({
        sagaId,
        currentStep: JoinGroupSagaStep.ValidateToken,
        status: SagaStatus.Running,
        isCompleted: false,
        isCompensated: false,
        errorMessage: null,
        token,
      });

      // ── Step 1: ValidateToken ─────────────────────────────────────────────
      if (!token || token.trim().length < 8) {
        setSagaState(prev => ({
          ...prev,
          status: SagaStatus.Failed,
          errorMessage: 'Token de convite inválido.',
        }));
        return false;
      }

      // ── Step 2: CallApi ───────────────────────────────────────────────────
      setSagaState(prev => ({ ...prev, currentStep: JoinGroupSagaStep.CallApi }));

      try {
        await chatApi.joinViaLink(token.trim());

        // ── Step 3: RefreshFeed ───────────────────────────────────────────
        setSagaState(prev => ({ ...prev, currentStep: JoinGroupSagaStep.RefreshFeed }));
        await onRefreshFeed?.();

        // ── Completed ─────────────────────────────────────────────────────
        setSagaState(prev => ({
          ...prev,
          currentStep: JoinGroupSagaStep.Completed,
          status: SagaStatus.Completed,
          isCompleted: true,
        }));

        return true;
      } catch (error: unknown) {
        setSagaState(prev => ({
          ...prev,
          currentStep: JoinGroupSagaStep.Compensating,
          status: SagaStatus.Compensated,
          isCompensated: true,
          errorMessage: error instanceof Error ? error.message : 'Erro ao entrar no grupo.',
        }));

        return false;
      }
    },
    [onRefreshFeed]
  );

  const reset = useCallback(() => setSagaState(initialState()), []);

  return {
    sagaState,
    execute,
    reset,
    isRunning: sagaState.status === SagaStatus.Running,
    isCompleted: sagaState.isCompleted,
    error: sagaState.errorMessage,
  };
};
