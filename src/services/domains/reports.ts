import { api } from "../api"

export const getReports = () => api<Report[]>('/reports')
export const generateReport = (id: string) =>
  api<{ url: string }>(`/reports/${id}/generate`, { method: 'POST' })
