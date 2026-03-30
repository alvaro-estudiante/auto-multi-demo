import { Clock, TrendingUp, Zap, Lock } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table'
import {
  portalStats,
  monthlyLeads,
  getAvgDaysInStock,
  getAvgMargin,
  getReservedCount,
  getDaysColor,
} from '@/data/mock-data'

// ─── Portal chart colors ───────────────────────────────────────────

const PORTAL_COLORS: Record<string, string> = {
  cochesNet: '#1e40af',
  wallapop: '#059669',
  milanuncios: '#64748b',
  autoScout24: '#94a3b8',
  autocasion: '#cbd5e1',
}

function getPortalColor(slug: string) {
  return PORTAL_COLORS[slug] ?? '#94a3b8'
}

// ─── Connection type by slug ──────────────────────────────────────

function getConnectionType(slug: string): { label: string; className: string } {
  switch (slug) {
    case 'cochesNet':
    case 'wallapop':
      return { label: 'API', className: 'bg-blue-50 text-blue-700 border-blue-200' }
    case 'milanuncios':
      return { label: 'CSV', className: 'bg-slate-100 text-slate-600 border-slate-200' }
    case 'autoScout24':
    case 'autocasion':
      return { label: 'XML/SFTP', className: 'bg-slate-100 text-slate-600 border-slate-200' }
    default:
      return { label: 'API', className: 'bg-slate-100 text-slate-600 border-slate-200' }
  }
}

// ─── Computed data ─────────────────────────────────────────────────

const totalCost = portalStats.reduce((a, p) => a + p.cost, 0)
const totalLeads = portalStats.reduce((a, p) => a + p.leadsMonth, 0)
const totalSales = portalStats.reduce((a, p) => a + p.sales, 0)

const totalsByMonth = monthlyLeads.map(m => ({
  month: m.month,
  total: m.cochesNet + m.wallapop + m.milanuncios + m.autoScout24 + m.autocasion,
}))

const horizontalBarData = portalStats.map(p => ({
  name: p.name,
  leads: p.leadsMonth,
  color: getPortalColor(p.slug),
}))

const donutData = portalStats
  .filter(p => p.cost > 0)
  .map(p => ({
    name: p.name,
    value: p.cost,
    color: getPortalColor(p.slug),
  }))

// ─── Shared styles ─────────────────────────────────────────────────

const tooltipStyle: React.CSSProperties = {
  borderRadius: '6px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
  fontSize: '12px',
}

// ─── KPI Cards ────────────────────────────────────────────────────

function KpiCards() {
  const avgDays = getAvgDaysInStock()
  const avgMargin = getAvgMargin()
  const reserved = getReservedCount()
  const daysColor = getDaysColor(avgDays)

  const kpis = [
    {
      label: 'Días en stock (media)',
      value: `${avgDays}d`,
      icon: Clock,
      valueColor: daysColor,
    },
    {
      label: 'Margen medio',
      value: `${avgMargin.toLocaleString('es-ES')}€`,
      icon: TrendingUp,
      valueColor: avgMargin >= 0 ? 'text-emerald-600' : 'text-red-600',
    },
    {
      label: 'Tiempo resp. leads',
      value: '18 min',
      icon: Zap,
      valueColor: 'text-emerald-600',
    },
    {
      label: 'Reservados',
      value: `${reserved}`,
      icon: Lock,
      valueColor: 'text-amber-600',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {kpis.map(kpi => {
        const Icon = kpi.icon
        return (
          <div
            key={kpi.label}
            className="card-surface border border-border rounded-2xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 bg-slate-50 shrink-0">
                <Icon className="h-4 w-4 text-slate-500" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wide text-slate-400 font-medium truncate">
                  {kpi.label}
                </p>
                <p className={`text-xl font-bold tabular-nums ${kpi.valueColor}`}>
                  {kpi.value}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── ZONA 0: Area Chart ───────────────────────────────────────────

function LeadsEvolutionChart() {
  return (
    <Card className="card-surface rounded-2xl">
      <CardHeader className="border-b">
        <CardTitle className="text-sm font-bold">Evolución de leads</CardTitle>
        <CardAction>
          <span className="text-[11px] text-slate-400">Últimos 6 meses</span>
        </CardAction>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={totalsByMonth} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="leadsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e40af" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1e40af" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => [`${value} leads`, 'Total']}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#1e40af"
                strokeWidth={2}
                fill="url(#leadsGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── ZONA 1: Portal Summary Cards ─────────────────────────────────

function PortalSummaryCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      {portalStats.map(portal => {
        const color = getPortalColor(portal.slug)
        const costPerLead = portal.leadsMonth > 0
          ? (portal.cost / portal.leadsMonth).toFixed(0)
          : '0'
        const conn = getConnectionType(portal.slug)

        return (
          <Card
            key={portal.slug}
            className="card-surface rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:[box-shadow:0_1px_3px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.04)]"
          >
            <CardContent className="pt-1">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="text-[12px] font-medium text-foreground truncate">
                  {portal.name}
                </span>
                <span className={`ml-auto inline-flex items-center rounded border px-1.5 py-0 text-[9px] font-medium leading-[18px] shrink-0 ${conn.className}`}>
                  {conn.label}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-[11px] text-slate-400">Leads</span>
                  <span className="text-[12px] font-semibold tabular-nums">
                    {portal.leadsMonth}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[11px] text-slate-400">Coste</span>
                  <span className="text-[12px] font-semibold tabular-nums">
                    {portal.cost > 0 ? `${portal.cost}€` : 'Incl.'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[11px] text-slate-400">€/lead</span>
                  <span className="text-[12px] font-semibold tabular-nums">
                    {costPerLead}€
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[11px] text-slate-400">Ventas</span>
                  <span className="text-[12px] font-semibold tabular-nums">
                    {portal.sales}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

// ─── ZONA 2 LEFT: Horizontal Bar Chart ────────────────────────────

function LeadsByPortalChart() {
  return (
    <Card className="card-surface rounded-2xl">
      <CardHeader className="border-b">
        <CardTitle className="text-sm font-bold">Leads por portal</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={horizontalBarData} layout="vertical" barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                width={90}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="leads" radius={[0, 4, 4, 0]}>
                {horizontalBarData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── ZONA 2 RIGHT: Donut Chart ────────────────────────────────────

function SpendingDonutChart() {
  return (
    <Card className="card-surface rounded-2xl">
      <CardHeader className="border-b">
        <CardTitle className="text-sm font-bold">Distribución de gasto</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="relative h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                nameKey="name"
              >
                {donutData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => `${value}€/mes`}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-xl font-bold tabular-nums">
                {totalCost.toLocaleString('es-ES')}€
              </p>
              <p className="text-[10px] text-slate-400">/mes</p>
            </div>
          </div>
        </div>
        {/* Legend */}
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {donutData.map(entry => (
            <div key={entry.name} className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-[11px] text-slate-400">{entry.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ─── ZONA 3: Profitability Table ──────────────────────────────────

function ProfitabilityTable() {
  const thClass = 'bg-slate-50/80 uppercase tracking-widest text-[10px] font-medium text-slate-400'

  return (
    <Card className="card-surface rounded-2xl">
      <CardHeader className="border-b">
        <CardTitle className="text-sm font-bold">Tabla de rentabilidad</CardTitle>
        <CardAction>
          <span className="text-[11px] text-slate-400">Marzo 2026</span>
        </CardAction>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className={thClass}>Portal</TableHead>
                <TableHead className={`${thClass} text-right`}>Gasto/mes</TableHead>
                <TableHead className={`${thClass} text-right`}>Leads</TableHead>
                <TableHead className={`${thClass} text-right`}>Ventas</TableHead>
                <TableHead className={`${thClass} text-right`}>€/lead</TableHead>
                <TableHead className={`${thClass} text-right hidden md:table-cell`}>€/venta</TableHead>
                <TableHead className={`${thClass} text-right`}>Conv.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {portalStats.map(portal => {
                const color = getPortalColor(portal.slug)
                const costPerLead = portal.leadsMonth > 0 ? portal.cost / portal.leadsMonth : 0
                const costPerSale = portal.sales > 0 ? portal.cost / portal.sales : 0
                const conversion = portal.leadsMonth > 0
                  ? (portal.sales / portal.leadsMonth) * 100
                  : 0

                const conversionColor =
                  conversion >= 12
                    ? 'text-emerald-600'
                    : conversion < 10
                      ? 'text-red-600'
                      : 'text-amber-600'

                return (
                  <TableRow key={portal.slug}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-[13px] font-medium">{portal.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-[13px] tabular-nums">
                      {portal.cost > 0 ? `${portal.cost}€` : 'Incluido'}
                    </TableCell>
                    <TableCell className="text-right text-[13px] font-medium tabular-nums">
                      {portal.leadsMonth}
                    </TableCell>
                    <TableCell className="text-right text-[13px] font-medium tabular-nums">
                      {portal.sales}
                    </TableCell>
                    <TableCell className="text-right text-[13px] tabular-nums">
                      {costPerLead.toFixed(0)}€
                    </TableCell>
                    <TableCell className="text-right text-[13px] tabular-nums hidden md:table-cell">
                      {costPerSale.toFixed(0)}€
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`text-[12px] font-semibold tabular-nums ${conversionColor}`}>
                        {conversion.toFixed(1)}%
                      </span>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
            <TableFooter>
              <TableRow className="bg-slate-50/80">
                <TableCell className="text-[13px] font-semibold">TOTAL</TableCell>
                <TableCell className="text-right text-[13px] font-semibold tabular-nums">
                  {totalCost}€
                </TableCell>
                <TableCell className="text-right text-[13px] font-semibold tabular-nums">
                  {totalLeads}
                </TableCell>
                <TableCell className="text-right text-[13px] font-semibold tabular-nums">
                  {totalSales}
                </TableCell>
                <TableCell className="text-right text-[13px] font-semibold tabular-nums">
                  {totalLeads > 0 ? (totalCost / totalLeads).toFixed(0) : 0}€
                </TableCell>
                <TableCell className="text-right text-[13px] font-semibold tabular-nums hidden md:table-cell">
                  {totalSales > 0 ? (totalCost / totalSales).toFixed(0) : 0}€
                </TableCell>
                <TableCell className="text-right text-[13px] font-semibold tabular-nums">
                  {totalLeads > 0 ? ((totalSales / totalLeads) * 100).toFixed(1) : 0}%
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Page ─────────────────────────────────────────────────────────

export function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Reportes y analítica</h2>
          <p className="text-[13px] text-slate-400 mt-0.5">
            Rendimiento de tus portales de publicación
          </p>
        </div>
        <div className="inline-flex bg-slate-100 rounded-xl p-1 self-start">
          <button className="rounded-md bg-white px-3 py-1 text-[12px] font-medium text-foreground [box-shadow:0_1px_2px_rgba(0,0,0,0.06)]">
            Mes
          </button>
          <button className="rounded-md px-3 py-1 text-[12px] font-medium text-slate-400 hover:text-foreground transition-colors">
            Trimestre
          </button>
          <button className="rounded-md px-3 py-1 text-[12px] font-medium text-slate-400 hover:text-foreground transition-colors">
            Año
          </button>
        </div>
      </div>

      {/* KPI mini cards */}
      <KpiCards />

      {/* ZONA 0: Area chart - leads evolution */}
      <LeadsEvolutionChart />

      {/* ZONA 1: Portal summary cards */}
      <PortalSummaryCards />

      {/* ZONA 2: Charts side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LeadsByPortalChart />
        <SpendingDonutChart />
      </div>

      {/* ZONA 3: Profitability table */}
      <ProfitabilityTable />
    </div>
  )
}
