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