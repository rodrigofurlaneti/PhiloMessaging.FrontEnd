export type ChatType = 'Private' | 'Group' | 'Broadcast';
// Espelha o enum ChatType do Backend C#: Private=1, Group=2, Broadcast=3
export const ChatTypeValues = {
    Private: 1,
    Group: 2,
    Broadcast: 3,
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

/**
 * Corpo da requisição para POST /api/v1/chats/{chatId}/messages
 * Espelha o SendMessageRequest do Backend.
 * MessageType: 1=Text, 2=Image, 3=Video, 4=Audio, 5=Sticker, 6=Document, 7=Location, 8=Contact, 9=Poll, 10=System
 */
export interface SendMessageRequest {
    type: number;
    content?: string | null;
    contentEncrypted?: boolean;
    replyToId?: number | null;
    forwardedFromId?: number | null;
}

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

/** Mensagem otimista (criada localmente antes da confirmação do Backend) */
export interface OptimisticMessage extends MessageDto {
    isOptimistic: true;
    isPending: boolean;
    isFailed: boolean;
}

export type AnyMessage = MessageDto | OptimisticMessage;

export function isOptimisticMessage(msg: AnyMessage): msg is OptimisticMessage {
    return (msg as OptimisticMessage).isOptimistic === true;
}