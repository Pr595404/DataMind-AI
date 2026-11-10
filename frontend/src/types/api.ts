export type HealthApiResponse = {
  status: string;
  database: Record<string, unknown>;
  ai_service: Record<string, unknown>;
  version: string;
};

export type DashboardSummary = {
  total_customers: number;
  total_products: number;
  total_orders: number;
  total_revenue: number;
  avg_order_value: number;
  top_category: string;
  top_customer_segment: string;
};

export type TrendPoint = {
  yr?: number;
  mo?: number;
  month?: string;
  order_count?: number;
  revenue?: number;
  [key: string]: string | number | undefined;
};

export type ProductRevenue = {
  product_name: string;
  category: string;
  units_sold: number;
  revenue: number;
};

export type CustomerSegment = {
  segment: string;
  customer_count: number;
  order_count: number;
  total_revenue: number;
};

export type QueryResponse = {
  question: string;
  generated_sql: string;
  is_safe: boolean;
  columns: string[];
  rows: Array<Record<string, string | number | boolean | null>>;
  row_count: number;
  explanation: string;
  chart_suggestion: string;
  execution_time_ms: number;
  error?: string | null;
};

export type QueryHistoryItem = {
  id?: number | string;
  timestamp?: string;
  question?: string;
  generated_sql?: string;
  status?: string;
  execution_time_ms?: number;
  row_count?: number;
  [key: string]: string | number | undefined;
};

export type SchemaDetails = Record<string, Array<Record<string, unknown>>>;

export type SchemaApiResponse = {
  tables: string[];
  schema_details: SchemaDetails;
};

export type AnomalyItem = {
  title: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | string;
  metric: string;
  value: number;
  expected: number;
  date?: string;
  status?: string;
};

export type RecommendationItem = {
  title: string;
  business_area: string;
  priority: string;
  observation: string;
  evidence: string;
  impact: string;
  next_action: string;
  confidence?: number;
};
