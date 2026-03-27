export interface PollOptionDto {
  id: number;
  optionText: string;
  position: number;
  voteCount: number;
  voted: boolean;
}

export interface PollDto {
  messageId: number;
  question: string;
  isAnonymous: boolean;
  multiChoice: boolean;
  expiresAt?: string;
  isExpired: boolean;
  totalVotes: number;
  options: PollOptionDto[];
}

export interface CreatePollRequest {
  chatId: number;
  question: string;
  options: string[];
  isAnonymous?: boolean;
  multiChoice?: boolean;
  expiresAt?: string;
}

export interface VotePollRequest {
  optionId: number;
}
