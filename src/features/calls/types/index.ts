export type CallType = 'Audio' | 'Video';
export type CallStatus = 'Ringing' | 'Ongoing' | 'Ended' | 'Missed' | 'Declined' | 'NoAnswer';

export interface CallDto {
  id: number;
  chatId: number;
  initiatedBy: number;
  type: string;
  status: string;
  startedAt: string;
  endedAt?: string;
  durationSeconds?: number;
  participants: CallParticipantDto[];
}

export interface CallParticipantDto {
  callId: number;
  userId: number;
  displayName?: string;
  joinedAt: string;
  leftAt?: string;
  wasMuted: boolean;
  wasVideo: boolean;
}

export interface InitiateCallRequest {
  chatId: number;
  type: string;
}

export interface UpdateCallStatusRequest {
  status: string;
}
