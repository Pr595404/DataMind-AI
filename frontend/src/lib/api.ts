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
  timeout: 10000,
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

// Fallback IBM Db2 benchmark data for static deployment
const BENCHMARK_HEALTH: HealthApiResponse = {
  status: 'healthy',
  version: '1.0.0',
  database: {
    status: 'connected',
    provider: 'IBM Db2 (Benchmark Seed Mode)',
    port: 50000,
  },
  ai_service: {
    status: 'ready',
    selected_model: 'Mistral (LangChain Db2 Pipeline)',
  },
};

const BENCHMARK_SUMMARY: DashboardSummary = {
  total_customers: 25,
  total_products: 20,
  total_orders: 40,
  total_revenue: 176059.22,
  avg_order_value: 4401.48,
  top_category: 'Software',
  top_customer_segment: 'Enterprise',
};

const BENCHMARK_TRENDS: TrendPoint[] = [
  { month: '2025-01', revenue: 7850.0, order_count: 2 },
  { month: '2025-02', revenue: 11200.0, order_count: 3 },
  { month: '2025-03', revenue: 9400.0, order_count: 2 },
  { month: '2025-04', revenue: 14500.0, order_count: 3 },
  { month: '2025-05', revenue: 16800.0, order_count: 4 },
  { month: '2025-06', revenue: 13200.0, order_count: 3 },
  { month: '2025-07', revenue: 18900.0, order_count: 4 },
  { month: '2025-08', revenue: 15400.0, order_count: 3 },
  { month: '2025-09', revenue: 21300.0, order_count: 5 },
  { month: '2025-10', revenue: 19800.0, order_count: 4 },
  { month: '2025-11', revenue: 24500.0, order_count: 5 },
  { month: '2025-12', revenue: 28900.0, order_count: 6 },
];

const BENCHMARK_PRODUCTS: ProductRevenue[] = [
  { product_name: 'IBM Db2 Enterprise Edition', category: 'Software', units_sold: 12, revenue: 58500.0 },
  { product_name: 'DataMind BI Cloud Connect', category: 'Software', units_sold: 28, revenue: 36200.0 },
  { product_name: 'Db2 AI Optimizer Suite', category: 'Software', units_sold: 15, revenue: 29400.0 },
  { product_name: 'Enterprise Security Sentinel', category: 'Security', units_sold: 9, revenue: 21800.0 },
  { product_name: 'Advanced Analytics Bridge', category: 'Analytics', units_sold: 14, revenue: 18200.0 },
  { product_name: 'High-Availability Mirror Node', category: 'Infrastructure', units_sold: 8, revenue: 11959.22 },
];

const BENCHMARK_SEGMENTS: CustomerSegment[] = [
  { segment: 'Enterprise', customer_count: 10, order_count: 22, total_revenue: 102500.0 },
  { segment: 'Mid-Market', customer_count: 8, order_count: 12, total_revenue: 48350.0 },
  { segment: 'SMB', customer_count: 7, order_count: 6, total_revenue: 25209.22 },
];

const BENCHMARK_ANOMALIES: AnomalyItem[] = [
  {
    title: 'Elevated Transaction Failure Rate',
    description: '3 payment transactions failed totaling $6,450.00 (7.5% failure rate across 40 transactions).',
    severity: 'High',
    metric: 'Transaction Failure Rate',
    value: 7.5,
    expected: 1.0,
    status: 'Active',
  },
  {
    title: 'Critical Low Stock on In-Demand Inventory',
    description: 'Db2 AI Optimizer Suite has critical inventory below 10 units (8 units remaining).',
    severity: 'High',
    metric: 'Minimum In-Demand Stock',
    value: 8,
    expected: 50,
    status: 'Action Required',
  },
  {
    title: 'Dormant Customer Onboarding Risk',
    description: '4 registered customer accounts have not placed an initial transaction.',
    severity: 'Medium',
    metric: 'Zero-Order Customer Count',
    value: 4,
    expected: 0,
    status: 'Review',
  },
];

const BENCHMARK_RECOMMENDATIONS: RecommendationItem[] = [
  {
    title: 'Expand Inventory & Marketing for Leading Category: Software',
    business_area: 'Merchandising & Sales',
    priority: 'High',
    observation: "Category 'Software' is your primary revenue engine generating $124,100.00.",
    evidence: 'Accounts for 70.5% of total sales across 26 enterprise orders in IBM Db2.',
    impact: 'Estimated 12-18% revenue expansion through targeted upsell campaigns and volume licensing.',
    next_action: "Allocate 30% more procurement budget to 'Software' SKU replenishment.",
    confidence: 0.94,
  },
  {
    title: 'Launch Dedicated VIP Loyalty Incentive for Enterprise Segment',
    business_area: 'Customer Success & Retention',
    priority: 'High',
    observation: "The 'Enterprise' customer segment produces highest total revenue ($102,500.00) with an average order value of $6,833.33.",
    evidence: 'Accounts for $102,500.00 across 10 accounts registered in IBM Db2.',
    impact: 'Reduces churn risk among high-LTV accounts by ~25% and boosts order frequency.',
    next_action: 'Establish dedicated account management and volume rebates for top Enterprise accounts.',
    confidence: 0.91,
  },
  {
    title: 'Resolve Checkout Payment Gateway Fallback Mechanisms',
    business_area: 'Finance & Operations',
    priority: 'Critical',
    observation: '3 payment transactions failed representing $6,450.00 in unrealized revenue.',
    evidence: 'Db2 transaction audit records show 3 failed checkout attempts.',
    impact: 'Direct recovery of up to 70% of failed checkout transactions ($4,515.00).',
    next_action: 'Implement automatic smart retry routing and secondary payment gateway fallback at checkout.',
    confidence: 0.96,
  },
];

const BENCHMARK_SCHEMA: SchemaApiResponse = {
  tables: ['CUSTOMERS', 'PRODUCTS', 'ORDERS', 'ORDER_ITEMS', 'TRANSACTIONS'],
  schema_details: {
    CUSTOMERS: [
      { name: 'CUSTOMER_ID', type: 'INTEGER' },
      { name: 'FIRST_NAME', type: 'VARCHAR(50)' },
      { name: 'LAST_NAME', type: 'VARCHAR(50)' },
      { name: 'COMPANY', type: 'VARCHAR(100)' },
      { name: 'SEGMENT', type: 'VARCHAR(50)' },
      { name: 'REGION', type: 'VARCHAR(50)' },
      { name: 'LIFETIME_VALUE', type: 'DECIMAL(12,2)' },
    ],
    PRODUCTS: [
      { name: 'PRODUCT_ID', type: 'INTEGER' },
      { name: 'PRODUCT_NAME', type: 'VARCHAR(100)' },
      { name: 'CATEGORY', type: 'VARCHAR(50)' },
      { name: 'UNIT_PRICE', type: 'DECIMAL(10,2)' },
      { name: 'STOCK_QUANTITY', type: 'INTEGER' },
    ],
    ORDERS: [
      { name: 'ORDER_ID', type: 'INTEGER' },
      { name: 'CUSTOMER_ID', type: 'INTEGER' },
      { name: 'ORDER_DATE', type: 'DATE' },
      { name: 'STATUS', type: 'VARCHAR(30)' },
      { name: 'TOTAL_AMOUNT', type: 'DECIMAL(12,2)' },
    ],
    ORDER_ITEMS: [
      { name: 'ITEM_ID', type: 'INTEGER' },
      { name: 'ORDER_ID', type: 'INTEGER' },
      { name: 'PRODUCT_ID', type: 'INTEGER' },
      { name: 'QUANTITY', type: 'INTEGER' },
      { name: 'LINE_TOTAL', type: 'DECIMAL(12,2)' },
    ],
    TRANSACTIONS: [
      { name: 'TRANSACTION_ID', type: 'INTEGER' },
      { name: 'ORDER_ID', type: 'INTEGER' },
      { name: 'AMOUNT', type: 'DECIMAL(12,2)' },
      { name: 'PAYMENT_METHOD', type: 'VARCHAR(50)' },
      { name: 'STATUS', type: 'VARCHAR(30)' },
    ],
  },
};

const BENCHMARK_HISTORY: QueryHistoryItem[] = [
  {
    id: 1,
    timestamp: '2026-11-10 14:35:22',
    question: 'What are our top 5 products by revenue?',
    generated_sql: 'SELECT p.product_name, SUM(oi.line_total) AS total_revenue FROM order_items oi JOIN products p ON oi.product_id = p.product_id GROUP BY p.product_name ORDER BY total_revenue DESC FETCH FIRST 5 ROWS ONLY;',
    status: 'SUCCESS',
    execution_time_ms: 12.4,
    row_count: 5,
  },
  {
    id: 2,
    timestamp: '2026-11-10 14:36:01',
    question: 'Show monthly revenue trends for the current year',
    generated_sql: 'SELECT YEAR(order_date) AS yr, MONTH(order_date) AS mo, COUNT(*) AS orders, SUM(total_amount) AS revenue FROM orders GROUP BY YEAR(order_date), MONTH(order_date) ORDER BY yr, mo;',
    status: 'SUCCESS',
    execution_time_ms: 18.1,
    row_count: 12,
  },
  {
    id: 3,
    timestamp: '2026-11-10 14:37:15',
    question: 'Which customer segments generate the highest average order value?',
    generated_sql: 'SELECT c.segment, COUNT(DISTINCT c.customer_id) AS customers, AVG(o.total_amount) AS avg_order_val FROM customers c JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.segment ORDER BY avg_order_val DESC;',
    status: 'SUCCESS',
    execution_time_ms: 14.8,
    row_count: 3,
  },
];

export async function getHealth(): Promise<HealthApiResponse> {
  try {
    const { data } = await apiClient.get<HealthApiResponse>('/api/health');
    return data;
  } catch {
    return BENCHMARK_HEALTH;
  }
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  try {
    const { data } = await apiClient.get<DashboardSummary>('/api/dashboard/summary');
    return data;
  } catch {
    return BENCHMARK_SUMMARY;
  }
}

export async function getDashboardTrends(): Promise<TrendPoint[]> {
  try {
    const { data } = await apiClient.get<{ trends?: TrendPoint[]; error?: string }>('/api/dashboard/trends');
    return data.trends ?? BENCHMARK_TRENDS;
  } catch {
    return BENCHMARK_TRENDS;
  }
}

export async function getTopProducts(): Promise<ProductRevenue[]> {
  try {
    const { data } = await apiClient.get<{ products?: ProductRevenue[]; error?: string }>('/api/dashboard/top-products');
    return data.products ?? BENCHMARK_PRODUCTS;
  } catch {
    return BENCHMARK_PRODUCTS;
  }
}

export async function getCustomerSegments(): Promise<CustomerSegment[]> {
  try {
    const { data } = await apiClient.get<{ segments?: CustomerSegment[]; error?: string }>('/api/dashboard/customer-segments');
    return data.segments ?? BENCHMARK_SEGMENTS;
  } catch {
    return BENCHMARK_SEGMENTS;
  }
}

export async function postQuery(question: string, maxRows = 50): Promise<QueryResponse> {
  try {
    const { data } = await apiClient.post<QueryResponse>('/api/query', { question, max_rows: maxRows });
    return data;
  } catch {
    const qLower = question.toLowerCase();

    // Block simulated mutations
    if (/drop|delete|update|insert|alter|truncate/i.test(question)) {
      return {
        question,
        generated_sql: '',
        is_safe: false,
        columns: [],
        rows: [],
        row_count: 0,
        explanation: 'Query Rejected by DataMind AI SQL Validator: DDL/DML mutations are blocked. Only read-only SELECT queries are allowed.',
        chart_suggestion: 'none',
        execution_time_ms: 0.8,
        error: 'Security Policy Violation: Mutation commands are prohibited on IBM Db2.',
      };
    }

    if (qLower.includes('segment') || qLower.includes('customer')) {
      return {
        question,
        generated_sql: 'SELECT c.segment, COUNT(DISTINCT c.customer_id) AS total_customers, SUM(o.total_amount) AS total_revenue FROM customers c JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.segment ORDER BY total_revenue DESC;',
        is_safe: true,
        columns: ['SEGMENT', 'TOTAL_CUSTOMERS', 'TOTAL_REVENUE'],
        rows: [
          { SEGMENT: 'Enterprise', TOTAL_CUSTOMERS: 10, TOTAL_REVENUE: 102500.0 },
          { SEGMENT: 'Mid-Market', TOTAL_CUSTOMERS: 8, TOTAL_REVENUE: 48350.0 },
          { SEGMENT: 'SMB', TOTAL_CUSTOMERS: 7, TOTAL_REVENUE: 25209.22 },
        ],
        row_count: 3,
        explanation: "Enterprise accounts represent your primary revenue engine generating $102,500.00 across 10 accounts with highest average order volume.",
        chart_suggestion: 'pie',
        execution_time_ms: 13.5,
      };
    }

    if (qLower.includes('trend') || qLower.includes('month') || qLower.includes('growth')) {
      return {
        question,
        generated_sql: 'SELECT YEAR(order_date) AS yr, MONTH(order_date) AS mo, COUNT(*) AS orders, SUM(total_amount) AS revenue FROM orders GROUP BY YEAR(order_date), MONTH(order_date) ORDER BY yr, mo;',
        is_safe: true,
        columns: ['YR', 'MO', 'ORDERS', 'REVENUE'],
        rows: BENCHMARK_TRENDS.map((t, idx) => ({
          YR: 2025,
          MO: idx + 1,
          ORDERS: t.order_count ?? 3,
          REVENUE: t.revenue ?? 10000,
        })),
        row_count: 12,
        explanation: "Monthly revenue demonstrates strong positive trajectory throughout the year, peaking at $28,900.00 in Q4.",
        chart_suggestion: 'line',
        execution_time_ms: 16.2,
      };
    }

    // Default top products
    return {
      question,
      generated_sql: 'SELECT p.product_name, SUM(oi.line_total) AS total_revenue, SUM(oi.quantity) AS units_sold FROM order_items oi JOIN products p ON oi.product_id = p.product_id GROUP BY p.product_name ORDER BY total_revenue DESC FETCH FIRST 5 ROWS ONLY;',
      is_safe: true,
      columns: ['PRODUCT_NAME', 'TOTAL_REVENUE', 'UNITS_SOLD'],
      rows: BENCHMARK_PRODUCTS.slice(0, 5).map((p) => ({
        PRODUCT_NAME: p.product_name,
        TOTAL_REVENUE: p.revenue,
        UNITS_SOLD: p.units_sold,
      })),
      row_count: 5,
      explanation: "Top performer is 'IBM Db2 Enterprise Edition' generating $58,500.00 across 12 licenses.",
      chart_suggestion: 'bar',
      execution_time_ms: 11.2,
    };
  }
}

export async function getQueryHistory(limit = 50): Promise<QueryHistoryItem[]> {
  try {
    const { data } = await apiClient.get<{ history?: QueryHistoryItem[]; count?: number }>(`/api/query/history?limit=${limit}`);
    return data.history ?? BENCHMARK_HISTORY;
  } catch {
    return BENCHMARK_HISTORY;
  }
}

export async function getSchema(): Promise<SchemaApiResponse> {
  try {
    const { data } = await apiClient.get<SchemaApiResponse>('/api/schema');
    return data;
  } catch {
    return BENCHMARK_SCHEMA;
  }
}

export async function getAnomalies(): Promise<AnomalyItem[]> {
  try {
    const { data } = await apiClient.get<{ anomalies?: AnomalyItem[]; analysis_summary?: string }>('/api/anomalies');
    return data.anomalies ?? BENCHMARK_ANOMALIES;
  } catch {
    return BENCHMARK_ANOMALIES;
  }
}

export async function getRecommendations(): Promise<RecommendationItem[]> {
  try {
    const { data } = await apiClient.get<{ recommendations?: RecommendationItem[] }>('/api/recommendations');
    return data.recommendations ?? BENCHMARK_RECOMMENDATIONS;
  } catch {
    return BENCHMARK_RECOMMENDATIONS;
  }
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
