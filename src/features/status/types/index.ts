export type StatusMediaType = 'Text' | 'Image' | 'Video';
export type StatusPrivacy = 'AllContacts' | 'Selected' | 'Except';

export interface UserStatusDto {
  id: number;
  userId: number;
  displayName?: string;
  avatarUrl?: string;
  type: string;
  content: string;
  expiresAt: string;
  privacy: string;
  viewsCount: number;
  createdAt: string;
}

export interface StatusViewDto {
  statusId: number;
  viewerId: number;
  viewerName?: string;
  viewedAt: string;
}

export interface CreateStatusRequest {
  type: string;
  content: string;
  privacy: string;
}
