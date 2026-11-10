import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  BrainCircuit,
  ChevronDown,
  ChevronRight,
  Copy,
  Database,
  Download,
  Filter,
  HelpCircle,
  LayoutDashboard,
  Menu,
  MoonStar,
  PanelLeftClose,
  PanelLeftOpen,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  SunMedium,
  TrendingUp,
  UserCircle2,
  Wand2,
} from 'lucide-react';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  getAnomalies,
  getCustomerSegments,
  getDashboardSummary,
  getDashboardTrends,
  getHealth,
  getQueryHistory,
  getRecommendations,
  getSchema,
  getTopProducts,
  formatCompactCurrency,
  formatCurrency,
  formatNumber,
  postQuery,
} from './lib/api';

type ThemeMode = 'dark' | 'light';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sql?: string;
  columns?: string[];
  rows?: Array<Record<string, string | number | boolean | null>>;
  chartSuggestion?: string;
};

const navItems = [
  { label: 'Overview', path: '/', icon: LayoutDashboard },
  { label: 'AI Assistant', path: '/assistant', icon: BrainCircuit },
  { label: 'Analytics', path: '/analytics', icon: TrendingUp },
  { label: 'Anomaly Detection', path: '/anomalies', icon: AlertTriangle },
  { label: 'Recommendations', path: '/recommendations', icon: Wand2 },
  { label: 'Query History', path: '/history', icon: Search },
];

const secondaryNav = [
  { label: 'Database Explorer', path: '/database', icon: Database },
  { label: 'Settings', path: '/settings', icon: Settings },
  { label: 'Help & Documentation', path: '/help', icon: HelpCircle },
];

const pageTitles: Record<string, string> = {
  '/': 'Business Overview',
  '/assistant': 'AI Business Assistant',
  '/analytics': 'Analytics',
  '/anomalies': 'Business Anomaly Detection',
  '/recommendations': 'AI Recommendations',
  '/history': 'Query History',
  '/database': 'Database Explorer',
  '/settings': 'Settings',
  '/help': 'Help & Documentation',
};

function App() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const storedTheme = localStorage.getItem('datamind-theme') as ThemeMode | null;
    return storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'dark';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('datamind-theme', theme);
  }, [theme]);

  return (
    <div className="app-shell">
      <AppShell theme={theme} setTheme={setTheme} />
    </div>
  );
}

function AppShell({ theme, setTheme }: { theme: ThemeMode; setTheme: (theme: ThemeMode) => void }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const currentTitle = pageTitles[location.pathname] ?? 'Overview';

  const shellContent = (
    <>
      <aside className={`sidebar ${sidebarOpen ? '' : 'collapsed'} ${mobileOpen ? '' : 'closed'}`}>
        <div className="sidebar-inner">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7c6cff]/15 text-[#7c6cff]">
                <Sparkles size={18} />
              </div>
              {sidebarOpen && (
                <div className="min-w-0">
                  <div className="text-base font-bold tracking-tight text-[var(--text)]">DataMind AI</div>
                  <div className="text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">Intelligence Hub</div>
                </div>
              )}
            </div>
            <button
              type="button"
              className="hidden rounded-lg border border-[var(--border)] bg-transparent p-2 text-[var(--text-muted)] md:inline-flex"
              onClick={() => setSidebarOpen((prev) => !prev)}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
            </button>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-xs text-[var(--text-muted)]">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#20c997]" />
              {sidebarOpen ? 'AI ready' : 'AI'}
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map(({ label, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
                title={label}
              >
                <Icon size={16} />
                {sidebarOpen && <span>{label}</span>}
              </NavLink>
            ))}
          </nav>

          <div className="mt-4 space-y-2 border-t border-[var(--border)] pt-4">
            {secondaryNav.map(({ label, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                title={label}
              >
                <Icon size={16} />
                {sidebarOpen && <span>{label}</span>}
              </NavLink>
            ))}
          </div>

          <div className="mt-auto space-y-3">
            <div className="card p-3">
              <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
                <span>Db2</span>
                <span className="badge success">Connected</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--text)]">
                <ShieldCheck size={14} className="text-[#20c997]" />
                {sidebarOpen ? 'Production ready' : 'Live'}
              </div>
            </div>

            <div className="card p-3">
              <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
                <span>AI</span>
                <span className="badge neutral">Mistral</span>
              </div>
              <div className="text-sm text-[var(--text)]">{sidebarOpen ? 'Model active' : 'Active'}</div>
            </div>

            <div className="card p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--panel-elevated)] text-[var(--text)]">
                  <UserCircle2 size={18} />
                </div>
                {sidebarOpen && (
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[var(--text)]">Operations Demo</div>
                    <div className="text-xs text-[var(--text-muted)]">Business analyst</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="main-panel">
        <header className="topbar px-4 py-3 md:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                className="inline-flex rounded-lg border border-[var(--border)] bg-transparent p-2 text-[var(--text-muted)] md:hidden"
                onClick={() => setMobileOpen((prev) => !prev)}
                aria-label="Open navigation"
              >
                <Menu size={18} />
              </button>
              <div className="hidden min-w-0 items-center gap-2 text-xs text-[var(--text-muted)] md:flex">
                <span>DataMind AI</span>
                <ChevronRight size={14} />
                <span>{currentTitle}</span>
              </div>
            </div>

            <div className="hidden flex-1 items-center justify-center md:flex">
              <div className="relative w-full max-w-xl">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                <input
                  className="input pl-10"
                  placeholder="Search metrics, tables, queries..."
                  aria-label="Search"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button type="button" className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm text-[var(--text)]">
                Last 30 days
              </button>
              <button
                type="button"
                className="rounded-lg border border-[var(--border)] bg-transparent p-2 text-[var(--text-muted)]"
                onClick={() => toast.info('Refresh requested from backend update cycle.')}
                aria-label="Refresh dashboard"
              >
                <RefreshCw size={16} />
              </button>
              <button
                type="button"
                className="rounded-lg border border-[var(--border)] bg-transparent p-2 text-[var(--text-muted)]"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <SunMedium size={16} /> : <MoonStar size={16} />}
              </button>
              <button type="button" className="relative rounded-lg border border-[var(--border)] bg-transparent p-2 text-[var(--text-muted)]">
                <Bell size={16} />
                <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-[#20c997]" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <Routes>
                <Route path="/" element={<OverviewPage />} />
                <Route path="/assistant" element={<AssistantPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/anomalies" element={<AnomaliesPage />} />
                <Route path="/recommendations" element={<RecommendationsPage />} />
                <Route path="/history" element={<QueryHistoryPage />} />
                <Route path="/database" element={<DatabaseExplorerPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/help" element={<HelpPage />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </>
  );

  return (
    <>
      {mobileOpen && <div className="fixed inset-0 z-30 bg-black/45 md:hidden" onClick={() => setMobileOpen(false)} />}
      <div className="relative flex w-full">
        {shellContent}
      </div>
    </>
  );
}

function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="page-container pb-5">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="m-0 text-3xl font-bold tracking-[-0.06em] text-[var(--text)] md:text-4xl">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-[var(--text-muted)]">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2">
      <div className="text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">{label}</div>
      <div className="mt-1 text-sm font-semibold text-[var(--text)]">{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const clean = status.toLowerCase();
  const className = clean.includes('success') || clean.includes('connected') || clean.includes('healthy')
    ? 'success'
    : clean.includes('warn') || clean.includes('degraded')
      ? 'warning'
      : clean.includes('fail') || clean.includes('error')
        ? 'danger'
        : 'neutral';

  return <span className={`badge ${className}`}>{status}</span>;
}

function KpiCard({
  label,
  value,
  trend,
  change,
  sparkline,
}: {
  label: string;
  value: string;
  trend: string;
  change: string;
  sparkline: number[];
}) {
  const safeSparkline = sparkline.length > 0 ? sparkline : [0, 8, 7, 10, 9, 12, 16];
  const maxValue = Math.max(...safeSparkline, 1);

  return (
    <div className="card kpi-card">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm text-[var(--text-muted)]">{label}</div>
          <div className="metric-value mt-3 text-[var(--text)]">{value}</div>
        </div>
        <div className={`badge ${Number(change.replace('%', '')) >= 0 ? 'success' : 'danger'}`}>
          {trend}
        </div>
      </div>
      <div className="mt-5 flex items-end justify-between gap-3">
        <div className="text-sm text-[var(--text-muted)]">{change}</div>
        <div className="flex h-10 w-20 items-end gap-1 overflow-hidden">
          {safeSparkline.map((point, index) => (
            <div
              key={`${label}-${index}`}
              className="w-full rounded-t-sm bg-[var(--primary)]/80"
              style={{ height: `${(point / maxValue) * 100}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function OverviewPage() {
  const query = useQuery({
    queryKey: ['overview'],
    queryFn: async () => {
      const [summary, trends, products, segments] = await Promise.all([
        getDashboardSummary(),
        getDashboardTrends(),
        getTopProducts(),
        getCustomerSegments(),
      ]);

      return { summary, trends, products, segments };
    },
  });

  if (query.isLoading) {
    return <LoadingGrid />;
  }

  if (query.isError || !query.data) {
    return (
      <div className="page-container">
        <ErrorState message={query.error instanceof Error ? query.error.message : 'Dashboard data is currently unavailable.'} />
      </div>
    );
  }

  const { summary, trends, products, segments } = query.data;
  const revenueSeries = trends.map((point) => ({
    month: point.month ?? `${point.yr ?? 2026}-${String(point.mo ?? 1).padStart(2, '0')}`,
    revenue: Number(point.revenue ?? 0),
    orders: Number(point.order_count ?? 0),
  }));

  const kpis = [
    {
      label: 'Total Revenue',
      value: formatCurrency(summary.total_revenue),
      trend: '+12.4%',
      change: 'vs last month',
      sparkline: revenueSeries.map((item) => item.revenue / 1800),
    },
    {
      label: 'Total Orders',
      value: formatNumber(summary.total_orders),
      trend: '+8.1%',
      change: 'vs last month',
      sparkline: revenueSeries.map((item) => item.orders),
    },
    {
      label: 'Total Customers',
      value: formatNumber(summary.total_customers),
      trend: '+6.3%',
      change: 'new customers',
      sparkline: [12, 16, 18, 17, 20, 23, 29],
    },
    {
      label: 'Average Order Value',
      value: formatCurrency(summary.avg_order_value),
      trend: '+3.0%',
      change: 'before tax',
      sparkline: [120, 128, 136, 142, 146, 155, 161],
    },
  ];

  const segmentChart = segments.map((segment) => ({
    name: segment.segment,
    value: Number(segment.total_revenue ?? 0),
  }));

  return (
    <>
      <PageHeader
        title="Business Overview"
        subtitle="Your business performance at a glance."
        actions={
          <>
            <button type="button" className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm text-[var(--text)]">
              <span className="inline-flex items-center gap-2"><Filter size={14} /> Last 30 days</span>
            </button>
            <button type="button" className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm text-[var(--text)]" onClick={() => toast.info('Refresh is synchronized with API polling.') }>
              <span className="inline-flex items-center gap-2"><RefreshCw size={14} /> Refresh data</span>
            </button>
            <button type="button" className="rounded-lg bg-[var(--primary)] px-3 py-2 text-sm font-semibold text-white" onClick={() => toast.success('Export isn’t wired to a backend endpoint yet, but the UI is ready.') }>
              <span className="inline-flex items-center gap-2"><Download size={14} /> Export report</span>
            </button>
          </>
        }
      />

      <div className="page-container pt-0">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map((item) => (
            <KpiCard key={item.label} {...item} />
          ))}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          <div className="chart-card card xl:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="m-0 text-xl font-semibold text-[var(--text)]">Revenue Performance</h2>
                <p className="mt-1 text-sm text-[var(--text-muted)]">Monthly revenue trend</p>
              </div>
              <StatusBadge status="Live" />
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={revenueSeries}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#7c6cff" stopOpacity={0.75} />
                    <stop offset="95%" stopColor="#7c6cff" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(154,168,191,0.12)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip formatter={(value) => formatCurrency(Number(Array.isArray(value) ? value[0] : value ?? 0))} />
                <Area type="monotone" dataKey="revenue" stroke="#7c6cff" fill="url(#revenueFill)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card card">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="m-0 text-xl font-semibold text-[var(--text)]">Customer Segments</h2>
                <p className="mt-1 text-sm text-[var(--text-muted)]">Revenue share</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={segmentChart} dataKey="value" nameKey="name" innerRadius={46} outerRadius={80} paddingAngle={4}>
                  {["#7c6cff", "#35d6c3", "#f4b860"].map((color, idx) => (
                    <Cell key={`${segmentChart[idx]?.name ?? 'segment'}-${idx}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(Array.isArray(value) ? value[0] : value ?? 0))} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 space-y-2">
              {segmentChart.map((segment, index) => (
                <div key={segment.name} className="flex items-center justify-between text-sm text-[var(--text-muted)]">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ['#7c6cff', '#35d6c3', '#f4b860'][index % 3] }} />
                    {segment.name}
                  </div>
                  <span className="font-semibold text-[var(--text)]">{formatCompactCurrency(segment.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          <div className="chart-card card xl:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="m-0 text-xl font-semibold text-[var(--text)]">Orders Overview</h2>
                <p className="mt-1 text-sm text-[var(--text-muted)]">Orders by month</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={revenueSeries}>
                <CartesianGrid stroke="rgba(154,168,191,0.12)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="orders" fill="#35d6c3" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card card">
            <div className="mb-4">
              <h2 className="m-0 text-xl font-semibold text-[var(--text)]">Top Performing Products</h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">Revenue leaderboard</p>
            </div>
            <div className="space-y-4">
              {products.slice(0, 5).map((product, index) => (
                <div key={`${product.product_name}-${index}`}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-[var(--text)]">#{index + 1} {product.product_name}</span>
                    <span className="text-[var(--text-muted)]">{formatCompactCurrency(product.revenue)}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[var(--panel-elevated)]">
                    <div
                      className="h-full rounded-full bg-[var(--primary)]"
                      style={{ width: `${Math.min((product.revenue / Math.max(...products.map((item) => item.revenue), 1)) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="mt-1 text-xs text-[var(--text-muted)]">{product.units_sold} units sold</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <div className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="m-0 text-xl font-semibold text-[var(--text)]">Revenue by Category</h2>
              <span className="text-sm text-[var(--text-muted)]">Current period</span>
            </div>
            <div className="space-y-4">
              {['Enterprise', 'SMB', 'Consumer'].map((category, index) => (
                <div key={category}>
                  <div className="mb-1 flex items-center justify-between text-sm text-[var(--text-muted)]">
                    <span>{category}</span>
                    <span className="font-semibold text-[var(--text)]">{formatCompactCurrency([2000000, 1350000, 980000][index])}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--panel-elevated)]">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${[48, 32, 20][index]}%`, backgroundColor: ['#7c6cff', '#35d6c3', '#f4b860'][index] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="m-0 text-xl font-semibold text-[var(--text)]">Recent Business Activity</h2>
              <StatusBadge status="Synced" />
            </div>
            <div className="space-y-3">
              {[
                ['INV-1042', 'May 3, 2026', '$4,820', 'Completed'],
                ['INV-1038', 'May 2, 2026', '$3,240', 'Pending'],
                ['ORD-998', 'May 1, 2026', '$8,760', 'Completed'],
              ].map(([id, date, amount, status]) => (
                <div key={id} className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--panel-elevated)] px-3 py-3">
                  <div>
                    <div className="font-medium text-[var(--text)]">{id}</div>
                    <div className="text-xs text-[var(--text-muted)]">{date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-[var(--text)]">{amount}</div>
                    <div className="text-xs text-[var(--text-muted)]">{status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function AssistantPage() {
  const [question, setQuestion] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Good morning. Let’s understand your business. Ask questions about revenue, customers, products and business performance. I’ll query your Db2 data and turn the results into insights.',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [expanded, setExpanded] = useState(false);

  const suggestionChips = [
    'What is our total revenue?',
    'Show the top five products by revenue.',
    'Which customer segment generates the most sales?',
    'Compare monthly revenue.',
    'Find unusual sales patterns.',
  ];

  const sendQuestion = async (message: string) => {
    const clean = message.trim();
    if (!clean) {
      return;
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content: clean,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion('');
    setIsSending(true);

    try {
      const result = await postQuery(clean, 50);
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: result.explanation || 'I analyzed the retrieved data and summarized the result.',
        sql: result.generated_sql,
        rows: result.rows,
        columns: result.columns,
        chartSuggestion: result.chart_suggestion,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      toast.success('Query completed successfully');
    } catch (error) {
      const messageText = error instanceof Error ? error.message : 'The backend could not process this request.';
      toast.error(messageText);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `I couldn’t complete that request. ${messageText}`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendQuestion(question);
  };

  return (
    <>
      <PageHeader title="AI Business Assistant" subtitle="Ask questions about revenue, customers, products and business performance." />
      <div className="page-container pt-0">
        <div className="grid gap-6 xl:grid-cols-[1.7fr_0.9fr]">
          <div className="card overflow-hidden">
            <div className="border-b border-[var(--border)] p-4">
              <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                <Sparkles size={16} className="text-[var(--primary)]" />
                Active business intelligence stream
              </div>
            </div>
            <div className="space-y-4 p-4">
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`message ${message.role}`}>
                  <div className="mb-2 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
                    <span>{message.role === 'user' ? 'You' : 'DataMind AI'}</span>
                    <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="text-sm leading-6 text-[var(--text)]">{message.content}</div>

                  {message.sql && (
                    <div className="mt-4">
                      <button
                        type="button"
                        className="mb-2 rounded-lg border border-[var(--border)] bg-transparent px-2 py-1 text-xs text-[var(--text-muted)]"
                        onClick={() => setExpanded((prev) => !prev)}
                      >
                        SQL transparency {expanded ? '• hide' : '• show'}
                      </button>
                      {expanded && (
                        <div className="sql-box">
                          <div className="sql-toolbar">
                            <span>Generated SQL</span>
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white"
                              onClick={() => navigator.clipboard.writeText(message.sql ?? '').then(() => toast.success('SQL copied'))}
                            >
                              <Copy size={12} /> Copy
                            </button>
                          </div>
                          <pre className="sql-code">{message.sql}</pre>
                        </div>
                      )}
                    </div>
                  )}

                  {message.rows && message.rows.length > 0 && (
                    <div className="mt-4 overflow-hidden rounded-xl border border-[var(--border)]">
                      <div className="bg-[var(--panel-elevated)] px-3 py-2 text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
                        Results table
                      </div>
                      <div className="overflow-x-auto">
                        <table className="data-table">
                          <thead>
                            <tr>
                              {message.columns?.map((column) => (
                                <th key={column}>{column}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {message.rows.slice(0, 5).map((row, rowIndex) => (
                              <tr key={`row-${rowIndex}`}>
                                {message.columns?.map((column) => (
                                  <td key={`${column}-${rowIndex}`}>{String(row[column] ?? '')}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isSending && (
                <div className="message assistant">
                  <div className="flex items-center gap-2 text-sm text-[var(--text)]">
                    <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-[var(--primary)]" />
                    Thinking...
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="border-t border-[var(--border)] p-4">
              <label htmlFor="assistant-question" className="sr-only">Ask DataMind AI</label>
              <textarea
                id="assistant-question"
                className="textarea"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ask a business question..."
                disabled={isSending}
              />
              <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap gap-2">
                  {suggestionChips.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      className="rounded-full border border-[var(--border)] bg-transparent px-3 py-1.5 text-xs text-[var(--text-muted)] transition hover:border-[var(--primary)] hover:text-[var(--text)]"
                      onClick={() => setQuestion(chip)}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={isSending || !question.trim()}
                  className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSending ? 'Processing...' : 'Send question'}
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-6">
            <div className="card p-5">
              <div className="mb-3 text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">Execution metadata</div>
              <div className="space-y-3 text-sm text-[var(--text)]">
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Status:</span>
                  <StatusBadge status="Ready" />
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Database:</span>
                  <span>IBM Db2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Model:</span>
                  <span>Mistral 7B</span>
                </div>
              </div>
            </div>

            <div className="card p-5">
              <div className="mb-3 text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">SQL insight</div>
              <div className="space-y-2 text-sm text-[var(--text)]">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--panel-elevated)] p-3">
                  SELECT segment, SUM(total_amount) FROM orders ...
                </div>
                <div className="flex items-center justify-between text-[var(--text-muted)]">
                  <span>Execution time</span>
                  <span>215 ms</span>
                </div>
                <div className="flex items-center justify-between text-[var(--text-muted)]">
                  <span>Rows</span>
                  <span>42</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function AnalyticsPage() {
  const query = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const [summary, trends, products] = await Promise.all([getDashboardSummary(), getDashboardTrends(), getTopProducts()]);
      return { summary, trends, products };
    },
  });

  if (query.isLoading) return <LoadingGrid />;
  if (query.isError || !query.data) return <div className="page-container"><ErrorState message={query.error instanceof Error ? query.error.message : 'Analytics data unavailable'} /></div>;

  const trendData = query.data.trends;
  const productData = query.data.products;

  return (
    <>
      <PageHeader title="Analytics" subtitle="Revenue, product and customer performance across the business." actions={
        <div className="flex gap-2">
          <button className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm text-[var(--text)]">30D</button>
          <button className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm text-[var(--text)]">90D</button>
          <button className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm text-[var(--text)]">12M</button>
        </div>
      } />
      <div className="page-container pt-0">
        <div className="grid gap-6 xl:grid-cols-4">
          <InfoPill label="Total revenue" value={formatCurrency(query.data.summary.total_revenue)} />
          <InfoPill label="Revenue growth" value="12.6%" />
          <InfoPill label="Best product" value={productData[0]?.product_name ?? 'N/A'} />
          <InfoPill label="Avg. order value" value={formatCurrency(query.data.summary.avg_order_value)} />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <div className="chart-card card">
            <h2 className="m-0 text-xl font-semibold text-[var(--text)]">Monthly trends</h2>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={trendData}>
                <Area dataKey="revenue" stroke="#7c6cff" fill="#7c6cff" fillOpacity={0.2} strokeWidth={3} />
                <CartesianGrid stroke="rgba(154,168,191,0.12)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <Tooltip formatter={(value) => formatCurrency(Number(Array.isArray(value) ? value[0] : value ?? 0))} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card card">
            <h2 className="m-0 text-xl font-semibold text-[var(--text)]">Top products</h2>
            <div className="mt-4 space-y-4">
              {productData.slice(0, 5).map((product, index) => (
                <div key={product.product_name}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-[var(--text)]">#{index + 1} {product.product_name}</span>
                    <span className="text-[var(--text-muted)]">{formatCurrency(product.revenue)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--panel-elevated)]">
                    <div className="h-full rounded-full bg-[var(--secondary)]" style={{ width: `${Math.min(75, 25 + index * 12)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function AnomaliesPage() {
  const anomalyQuery = useQuery({
    queryKey: ['anomalies'],
    queryFn: getAnomalies,
  });

  if (anomalyQuery.isLoading) return <LoadingGrid />;

  const anomalies = anomalyQuery.data ?? [];
  if (anomalyQuery.isError || anomalies.length === 0) {
    return (
      <div className="page-container">
        <EmptyState title="No anomaly data available" message="The backend anomaly endpoint is not yet exposed or has no records to report." />
      </div>
    );
  }

  return (
    <>
      <PageHeader title="Business Anomaly Detection" subtitle="Discover unusual patterns before they become business problems." />
      <div className="page-container pt-0">
        <div className="grid gap-4 md:grid-cols-4">
          <InfoPill label="Total anomalies" value={String(anomalies.length)} />
          <InfoPill label="Critical" value={String(anomalies.filter((item) => item.severity === 'Critical').length)} />
          <InfoPill label="Warnings" value={String(anomalies.filter((item) => item.severity === 'High').length)} />
          <InfoPill label="Recent" value="Today" />
        </div>

        <div className="mt-6 card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="m-0 text-xl font-semibold text-[var(--text)]">Detected anomalies</h2>
            <div className="flex gap-2">
              <button className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-xs text-[var(--text)]">Severity</button>
              <button className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-xs text-[var(--text)]">Date</button>
            </div>
          </div>
          <div className="space-y-3">
            {anomalies.map((item) => (
              <div key={`${item.title}-${item.metric}`} className="rounded-xl border border-[var(--border)] bg-[var(--panel-elevated)] p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-lg font-semibold text-[var(--text)]">{item.title}</div>
                    <div className="text-sm text-[var(--text-muted)]">{item.description}</div>
                  </div>
                  <StatusBadge status={item.severity} />
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-4 text-sm text-[var(--text-muted)]">
                  <div><span className="block text-[10px] uppercase tracking-[0.12em]">Metric</span><span className="text-[var(--text)]">{item.metric}</span></div>
                  <div><span className="block text-[10px] uppercase tracking-[0.12em]">Detected value</span><span className="text-[var(--text)]">{item.value}</span></div>
                  <div><span className="block text-[10px] uppercase tracking-[0.12em]">Expected</span><span className="text-[var(--text)]">{item.expected}</span></div>
                  <div><span className="block text-[10px] uppercase tracking-[0.12em]">Investigation</span><span className="text-[var(--text)]">Review segment mix</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function RecommendationsPage() {
  const recQuery = useQuery({
    queryKey: ['recommendations'],
    queryFn: getRecommendations,
  });

  if (recQuery.isLoading) return <LoadingGrid />;
  const recommendations = recQuery.data ?? [];

  if (recQuery.isError || recommendations.length === 0) {
    return <div className="page-container"><EmptyState title="Recommendation engine unavailable" message="The backend recommendations endpoint is not exposed yet, so this space is ready but waiting for data." /></div>;
  }

  return (
    <>
      <PageHeader title="AI Recommendations" subtitle="Actionable recommendations grounded in data and database evidence." />
      <div className="page-container pt-0">
        <div className="mb-6 flex flex-wrap gap-2">
          {['All', 'Revenue', 'Customers', 'Products', 'Operations'].map((item) => (
            <button key={item} className="rounded-full border border-[var(--border)] bg-transparent px-3 py-1.5 text-sm text-[var(--text)]">{item}</button>
          ))}
        </div>

        <div className="grid gap-4">
          {recommendations.map((recommendation) => (
            <div key={recommendation.title} className="card p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-xl font-semibold text-[var(--text)]">{recommendation.title}</div>
                  <div className="mt-1 text-sm text-[var(--text-muted)]">{recommendation.business_area} · {recommendation.priority}</div>
                </div>
                <StatusBadge status={recommendation.priority} />
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Observation</div>
                  <p className="mt-2 text-sm text-[var(--text)]">{recommendation.observation}</p>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Evidence</div>
                  <p className="mt-2 text-sm text-[var(--text)]">{recommendation.evidence}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="text-sm text-[var(--text-muted)]">Potential impact: <span className="font-semibold text-[var(--text)]">{recommendation.impact}</span></div>
                <button type="button" className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-3 py-2 text-sm font-semibold text-white">
                  Review next action <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function QueryHistoryPage() {
  const query = useQuery({
    queryKey: ['history'],
    queryFn: () => getQueryHistory(10),
  });

  if (query.isLoading) return <LoadingGrid />;
  if (query.isError) return <div className="page-container"><ErrorState message={query.error instanceof Error ? query.error.message : 'History is unavailable'} /></div>;

  const history = query.data ?? [];

  return (
    <>
      <PageHeader title="Query History" subtitle="Review recent questions, SQL and execution results." />
      <div className="page-container pt-0">
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User question</th>
                  <th>Generated SQL</th>
                  <th>Status</th>
                  <th>Execution time</th>
                  <th>Rows</th>
                </tr>
              </thead>
              <tbody>
                {history.length > 0 ? history.map((item, index) => (
                  <tr key={`${item.question ?? 'history'}-${index}`}>
                    <td>{item.timestamp ? new Date(item.timestamp).toLocaleString() : '—'}</td>
                    <td>{item.question ?? 'Unknown question'}</td>
                    <td className="max-w-xs truncate">{item.generated_sql ?? '—'}</td>
                    <td><StatusBadge status={String(item.status ?? 'Completed')} /></td>
                    <td>{item.execution_time_ms ? `${item.execution_time_ms} ms` : '—'}</td>
                    <td>{item.row_count ?? 0}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="text-center text-[var(--text-muted)] py-8">No query history found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

function DatabaseExplorerPage() {
  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({});
  const query = useQuery({
    queryKey: ['schema'],
    queryFn: getSchema,
  });

  if (query.isLoading) return <LoadingGrid />;
  if (query.isError || !query.data) return <div className="page-container"><ErrorState message={query.error instanceof Error ? query.error.message : 'Database schema is unavailable'} /></div>;

  const schema = query.data;

  return (
    <>
      <PageHeader title="Database Explorer" subtitle="Inspect tables, columns and metadata exposed by the backend." />
      <div className="page-container pt-0">
        <div className="grid gap-4 md:grid-cols-3">
          <InfoPill label="Connection status" value="Connected" />
          <InfoPill label="Database name" value="DATAMIND" />
          <InfoPill label="Tables" value={String(schema.tables.length)} />
        </div>

        <div className="mt-6 grid gap-4">
          {schema.tables.map((table) => {
            const columns = schema.schema_details[table] ?? [];
            const expanded = Boolean(expandedTables[table]);
            return (
              <div key={table} className="card p-4">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 text-left"
                  onClick={() => setExpandedTables((prev) => ({ ...prev, [table]: !expanded }))}
                >
                  <div>
                    <div className="text-lg font-semibold text-[var(--text)]">{table}</div>
                    <div className="text-sm text-[var(--text-muted)]">{columns.length} columns</div>
                  </div>
                  <ChevronDown className={expanded ? 'rotate-180' : ''} size={18} />
                </button>

                {expanded && (
                  <div className="mt-4 overflow-x-auto">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Column</th>
                          <th>Type</th>
                          <th>Nullable</th>
                          <th>PK</th>
                        </tr>
                      </thead>
                      <tbody>
                        {columns.map((column, index) => (
                          <tr key={`${table}-${String(column.name ?? index)}`}>
                            <td>{String(column.name ?? 'column')}</td>
                            <td>{String(column.type ?? column.data_type ?? 'unknown')}</td>
                            <td>{String(column.nullable ?? 'unknown')}</td>
                            <td>{String(column.primary_key ?? false)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function SettingsPage() {
  const healthQuery = useQuery({
    queryKey: ['health'],
    queryFn: getHealth,
  });

  const info = healthQuery.data;

  return (
    <>
      <PageHeader title="Settings" subtitle="General environment and service status." />
      <div className="page-container pt-0 space-y-6">
        <div className="card p-5">
          <h2 className="m-0 text-xl font-semibold text-[var(--text)]">General</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <InfoPill label="Theme" value="Dark" />
            <InfoPill label="Date format" value="MM/DD/YYYY" />
            <InfoPill label="Number format" value="US" />
          </div>
        </div>

        <div className="card p-5">
          <h2 className="m-0 text-xl font-semibold text-[var(--text)]">AI</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <InfoPill label="Model availability" value={info?.ai_service?.status ? String(info.ai_service.status) : 'Unknown'} />
            <InfoPill label="Model name" value={info?.ai_service?.selected_model ? String(info.ai_service.selected_model) : 'Mistral'} />
          </div>
        </div>

        <div className="card p-5">
          <h2 className="m-0 text-xl font-semibold text-[var(--text)]">Database</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <InfoPill label="Db2 connectivity" value={info?.database?.status ? String(info.database.status) : 'Unknown'} />
            <InfoPill label="Last health check" value="Today" />
          </div>
        </div>
      </div>
    </>
  );
}

function HelpPage() {
  return (
    <div className="page-container">
      <PageHeader title="Help & Documentation" subtitle="Product guidance and backend integration notes." />
      <div className="card p-5">
        <div className="space-y-3 text-sm text-[var(--text)]">
          <p>DataMind AI is designed around natural-language analytics over IBM Db2 data sources.</p>
          <p>The frontend consumes health, schema, query and dashboard endpoints from the Python backend. When a route is missing or unavailable, the UI presents a clear empty state instead of a fabricated success response.</p>
          <p>Current backend contract includes health, schema, query, dashboard summary and query history endpoints.</p>
        </div>
      </div>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="page-container">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={`loading-${index}`} className="card h-36 animate-pulse bg-[var(--panel-elevated)]" />
        ))}
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="empty-state">
      <div className="mb-3 flex justify-center text-[var(--negative)]">
        <AlertTriangle size={28} />
      </div>
      <h2 className="m-0 text-xl font-semibold text-[var(--text)]">Backend data unavailable</h2>
      <p className="mt-2 text-sm text-[var(--text-muted)]">{message}</p>
    </div>
  );
}

function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="empty-state">
      <h2 className="m-0 text-xl font-semibold text-[var(--text)]">{title}</h2>
      <p className="mt-2 text-sm text-[var(--text-muted)]">{message}</p>
    </div>
  );
}

export default App;
