export interface UserProfileDto {
  id: number;
  phoneNumber: string;
  countryCode: string;
  username?: string;
  displayName: string;
  email?: string;
  isEmailVerified: boolean;
  about?: string;
  avatarUrl?: string;
  status: string;
  lastSeen?: string;
  isOnline: boolean;
  createdAt: string;
}

export interface UpdateProfileRequest {
  displayName: string;
  about?: string;
  username?: string;
}

export interface UpdateAvatarRequest {
  avatarUrl: string;
}
