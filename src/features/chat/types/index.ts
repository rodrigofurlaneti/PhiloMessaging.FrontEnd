export type ChatType = 'Private' | 'Group' | 'Broadcast';

export const ChatTypeValues = {
    Private: 0,
    Group: 1,
    Broadcast: 2
} as const;

export interface ChatDto {
    id: number;
    type: ChatType;
    name?: string;
    description?: string;
    avatarUrl?: string;
    createdBy: number;
    createdAt: string;
}

export interface ChatFeedItemDto {
    chatId: number;
    type: ChatType;
    chatName?: string;
    avatarUrl?: string;
    lastActivityAt?: string;
    lastMessageContent?: string;
    lastMessageType?: string;
    lastMessageSenderId?: number;
    lastMessageSentAt?: string;
    isPinned: boolean;
    mutedUntil?: string;
    unreadCount: number;
}

export interface CreateChatRequest {
    type: number;
    name?: string;
    description?: string;
    initialMemberIds?: number[];
}

export interface SendMessageSagaResult {
    messageId: number | null;
    sagaId: string;
    isCompleted: boolean;
}

/** Payload para POST /chats/{chatId}/messages (usado pelo useSendMessageSaga) */
export interface SendMessageRequest {
    type: number;
    content: string;
    contentEncrypted: boolean;
    replyToId?: number | null;
    forwardedFromId?: number | null;
}

/** Mensagem persistida que veio do backend */
export interface MessageDto {
    id: number;
    chatId: number;
    senderId: number;
    type: string;
    content: string | null;
    contentEncrypted: boolean;
    replyToId: number | null;
    forwardedFromId: number | null;
    sentAt: string;
    editedAt: string | null;
    deletedForEveryone: boolean;
}

/**
 * Mensagem otimista — exibida imediatamente na UI enquanto aguarda
 * a confirmação do backend. Estende MessageDto com campos de estado.
 */
export interface OptimisticMessage extends MessageDto {
    /** Sempre true enquanto a confirmação do backend não chegou */
    isOptimistic: true;
    /** true = aguardando resposta da API */
    isPending: boolean;
    /** true = a API retornou erro (compensação ocorreu) */
    isFailed: boolean;
}

/**
 * União de mensagem real (backend) e otimista (UI temporária).
 * Usada nas listas de mensagens do chat para aceitar ambos os estados.
 */
export type AnyMessage = MessageDto | OptimisticMessage;
