export interface LoginCommand {
    phoneNumber: string;
    password?: string;
}

export interface RegisterRequest {
    phoneNumber: string;
    countryCode: string; 
    displayName: string;
    password: string;
}

export interface AuthResponse {
    id: string;
    displayName: string;
    phoneNumber: string;
    countryCode: string;
    token: string;
    refreshToken: string;
    expiresAt: string;
}

export interface RegisterCommand {
    phoneNumber: string;
    countryCode: string;
    displayName: string;
    password: string;
    email: string; 
    username?: string;
}
export interface AuthResponseDto {
    id: number;
    displayName: string;
    phoneNumber: string;
    countryCode: string;
    token: string;
    refreshToken: string;
    expiresAt: string;
}