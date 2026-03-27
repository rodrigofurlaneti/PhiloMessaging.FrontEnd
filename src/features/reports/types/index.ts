export type ReportTargetType = 'User' | 'Message' | 'Group';
export type ReportStatus = 'Pending' | 'Reviewed' | 'Resolved' | 'Dismissed';

export interface ReportDto {
  id: number;
  reporterId: number;
  targetType: string;
  targetId: number;
  reason: string;
  status: string;
  reviewNotes?: string;
  createdAt: string;
  reviewedAt?: string;
}

export interface CreateReportRequest {
  targetType: string;
  targetId: number;
  reason: string;
}

export interface ReviewReportRequest {
  action: string;
  notes: string;
}
