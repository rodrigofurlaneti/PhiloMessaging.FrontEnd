export interface InviteLinkDto {
  id: number;
  chatId: number;
  token: string;
  expiresAt?: string;
  maxUses?: number;
  useCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface CreateInviteLinkRequest {
  expiresAt?: string;
  maxUses?: number;
}
