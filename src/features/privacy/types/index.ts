export type VisibilityOption = 'Everyone' | 'Contacts' | 'Nobody';

export interface PrivacySettingsDto {
  lastSeenVisible: string;
  profilePhoto: string;
  aboutVisible: string;
  statusVisible: string;
  readReceipts: boolean;
  groupsAdd: string;
  liveLocation: boolean;
}

export interface UpdatePrivacySettingsRequest {
  lastSeenVisible: string;
  profilePhoto: string;
  aboutVisible: string;
  statusVisible: string;
  readReceipts: boolean;
  groupsAdd: string;
  liveLocation: boolean;
}
