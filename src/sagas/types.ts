/**
 * Tipos base para implementação do padrão SAGA no Frontend.
 * Espelha a estrutura de SAGAs do Backend (C#/.NET).
 *
 * NOTA: Usamos `const` + `as const` em vez de `enum` porque o tsconfig
 * tem "erasableSyntaxOnly": true — enums TypeScript geram código JS em
 * runtime e não são considerados "erasable". O padrão `const` + tipo
 * derivado é 100% equivalente e compatível com esta configuração.
 */

// ── SagaStatus ─────────────────────────────────────────────────────────────
export const SagaStatus = {
  Idle: 'idle',
  Running: 'running',
  Completed: 'completed',
  Compensating: 'compensating',
  Compensated: 'compensated',
  Failed: 'failed',
} as const;
export type SagaStatus = typeof SagaStatus[keyof typeof SagaStatus];

// ── SagaState base ─────────────────────────────────────────────────────────
export interface SagaState<TStep extends string> {
  sagaId: string;
  currentStep: TStep | null;
  status: SagaStatus;
  isCompleted: boolean;
  isCompensated: boolean;
  errorMessage: string | null;
}

// ── SendMessage Saga Steps ─────────────────────────────────────────────────
export const SendMessageSagaStep = {
  ValidateInput: 'ValidateInput',
  CallApi: 'CallApi',
  OptimisticUpdate: 'OptimisticUpdate',
  RefreshFeed: 'RefreshFeed',
  Completed: 'Completed',
  Compensating: 'Compensating',
} as const;
export type SendMessageSagaStep = typeof SendMessageSagaStep[keyof typeof SendMessageSagaStep];

export interface SendMessageSagaState extends SagaState<SendMessageSagaStep> {
  chatId: number | null;
  content: string | null;
  messageType: number;
  replyToId?: number | null;
  forwardedFromId?: number | null;
  createdMessageId: number | null;
  sagaResultMessageId: number | null;
}

// ── DeleteMessage Saga Steps ───────────────────────────────────────────────
export const DeleteMessageSagaStep = {
  ValidateWindow: 'ValidateWindow',
  CallApi: 'CallApi',
  UpdateLocalState: 'UpdateLocalState',
  Completed: 'Completed',
  Compensating: 'Compensating',
} as const;
export type DeleteMessageSagaStep = typeof DeleteMessageSagaStep[keyof typeof DeleteMessageSagaStep];

export interface DeleteMessageSagaState extends SagaState<DeleteMessageSagaStep> {
  chatId: number | null;
  messageId: number | null;
  sentAt: string | null;
}

// ── JoinGroup Saga Steps ───────────────────────────────────────────────────
export const JoinGroupSagaStep = {
  ValidateToken: 'ValidateToken',
  CallApi: 'CallApi',
  RefreshFeed: 'RefreshFeed',
  Completed: 'Completed',
  Compensating: 'Compensating',
} as const;
export type JoinGroupSagaStep = typeof JoinGroupSagaStep[keyof typeof JoinGroupSagaStep];

export interface JoinGroupSagaState extends SagaState<JoinGroupSagaStep> {
  token: string | null;
}

// ── CreateChat (Handshake) Saga Steps ─────────────────────────────────────
export const CreateChatSagaStep = {
  ValidateInput: 'ValidateInput',
  CreateChat: 'CreateChat',
  SendMessage: 'SendMessage',
  RefreshFeed: 'RefreshFeed',
  Completed: 'Completed',
  Compensating: 'Compensating',
} as const;
export type CreateChatSagaStep = typeof CreateChatSagaStep[keyof typeof CreateChatSagaStep];

export interface CreateChatSagaState extends SagaState<CreateChatSagaStep> {
  contactUserId: number | null;
  contactName: string | null;
  initialMessage: string | null;
  createdChatId: number | null;
  createdMessageId: number | null;
}
