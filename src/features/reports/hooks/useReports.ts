import { useState, useCallback } from 'react';
import { reportsApi } from '../api/reportsApi';
import type { ReportDto, CreateReportRequest, ReviewReportRequest } from '../types';

export const useReports = () => {
  const [reports, setReports] = useState<ReportDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReports = useCallback(async (status = 'Pending', page = 1, pageSize = 20) => {
    setIsLoading(true);
    try {
      const data = await reportsApi.getByStatus(status, page, pageSize);
      setReports(data);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createReport = async (data: CreateReportRequest) => {
    const report = await reportsApi.create(data);
    return report;
  };

  const reviewReport = async (reportId: number, data: ReviewReportRequest) => {
    const updated = await reportsApi.review(reportId, data);
    setReports(prev => prev.map(r => r.id === reportId ? updated : r));
    return updated;
  };

  return { reports, isLoading, fetchReports, createReport, reviewReport };
};
