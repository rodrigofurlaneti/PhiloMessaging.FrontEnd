import { api } from '@/services/api';
import type { ReportDto, CreateReportRequest, ReviewReportRequest } from '../types';

export const reportsApi = {
  create: (data: CreateReportRequest) =>
    api.post<ReportDto>('/reports', data).then(r => r.data),

  getByStatus: (status: string, page = 1, pageSize = 20) =>
    api.get<ReportDto[]>('/reports', { params: { status, page, pageSize } }).then(r => r.data),

  review: (reportId: number, data: ReviewReportRequest) =>
    api.patch<ReportDto>(`/reports/${reportId}/review`, data).then(r => r.data),
};
