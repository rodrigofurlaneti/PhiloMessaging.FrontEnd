export interface UserDeviceDto {
  id: number;
  deviceToken: string;
  deviceType: string;
  deviceName?: string;
  platform?: string;
  lastActive: string;
}

export interface RegisterDeviceRequest {
  deviceToken: string;
  deviceType: string;
  deviceName?: string;
  platform?: string;
}
