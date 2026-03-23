export interface AuthResponseDto {
    userId: number;
    displayName: string;
    phoneNumber: string;
    countryCode: string;
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
}

export interface RegisterCommand {
    displayName: string;
    phoneNumber: string;
    countryCode: string;
    password?: string;
}

export interface LoginCommand {
    phoneNumber: string;
    password?: string;
}