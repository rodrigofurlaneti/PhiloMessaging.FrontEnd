export interface PinnedMessageDto {
  chatId: number;
  messageId: number;
  pinnedBy: number;
  pinnedByName?: string;
  messageContent?: string;
  messageType?: string;
  pinnedAt: string;
}
