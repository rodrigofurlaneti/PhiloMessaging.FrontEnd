export interface ReactionDto {
  messageId: number;
  userId: number;
  displayName?: string;
  emoji: string;
  reactedAt: string;
}

export interface AddReactionRequest {
  emoji: string;
}
