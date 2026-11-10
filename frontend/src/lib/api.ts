import axios, { type AxiosError } from 'axios';

import type {
  AnomalyItem,
  CustomerSegment,
  DashboardSummary,
  HealthApiResponse,
  ProductRevenue,
  QueryHistoryItem,
  QueryResponse,
  RecommendationItem,
  SchemaApiResponse,
  TrendPoint,
} from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ detail?: string; error?: string }>) => {
    const detail = error.response?.data?.detail ?? error.response?.data?.error ?? error.message;
    return Promise.reject(new Error(detail || 'Request failed'));
  },
);

export async function getHealth(): Promise<HealthApiResponse> {
  const { data } = await apiClient.get<HealthApiResponse>('/api/health');
  return data;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const { data } = await apiClient.get<DashboardSummary>('/api/dashboard/summary');
  return data;
}

export async function getDashboardTrends(): Promise<TrendPoint[]> {
  const { data } = await apiClient.get<{ trends?: TrendPoint[]; error?: string }>('/api/dashboard/trends');
  return data.trends ?? [];
}

export async function getTopProducts(): Promise<ProductRevenue[]> {
  const { data } = await apiClient.get<{ products?: ProductRevenue[]; error?: string }>('/api/dashboard/top-products');
  return data.products ?? [];
}

export async function getCustomerSegments(): Promise<CustomerSegment[]> {
  const { data } = await apiClient.get<{ segments?: CustomerSegment[]; error?: string }>('/api/dashboard/customer-segments');
  return data.segments ?? [];
}

export async function postQuery(question: string, maxRows = 50): Promise<QueryResponse> {
  const { data } = await apiClient.post<QueryResponse>('/api/query', { question, max_rows: maxRows });
  return data;
}

export async function getQueryHistory(limit = 50): Promise<QueryHistoryItem[]> {
  const { data } = await apiClient.get<{ history?: QueryHistoryItem[]; count?: number }>(`/api/query/history?limit=${limit}`);
  return data.history ?? [];
}

export async function getSchema(): Promise<SchemaApiResponse> {
  const { data } = await apiClient.get<SchemaApiResponse>('/api/schema');
  return data;
}

export async function getAnomalies(): Promise<AnomalyItem[]> {
  const { data } = await apiClient.get<{ anomalies?: AnomalyItem[]; analysis_summary?: string }>('/api/anomalies');
  return data.anomalies ?? [];
}

export async function getRecommendations(): Promise<RecommendationItem[]> {
  const { data } = await apiClient.get<{ recommendations?: RecommendationItem[] }>('/api/recommendations');
  return data.recommendations ?? [];
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value);
}

export function formatCompactCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
}
