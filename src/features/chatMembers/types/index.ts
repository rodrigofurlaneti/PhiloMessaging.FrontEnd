export interface ChatMemberDto {
  id: number;
  chatId: number;
  userId: number;
  displayName?: string;
  avatarUrl?: string;
  role: string;
  joinedAt: string;
  leftAt?: string;
  isPinned: boolean;
  isMuted: boolean;
}

export interface AddMemberRequest {
  userId: number;
}
