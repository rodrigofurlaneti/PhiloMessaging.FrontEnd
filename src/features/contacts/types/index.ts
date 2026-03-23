export interface ContactDto {
    id: number;
    contactUserId: number; // Mantemos o ID aqui, pois ele é útil para rotas de Delete/Block
    displayName: string;
    nickname?: string;
    phoneNumber?: string;
    avatarUrl?: string;
    isBlocked: boolean;
}

export interface AddContactRequest {
    phoneNumber: string;
    nickname?: string;
}

export interface UpdateNicknameRequest {
    contactUserId: number;
    newNickname: string;
}