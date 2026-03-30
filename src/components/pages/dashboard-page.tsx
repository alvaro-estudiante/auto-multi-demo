import {
  ArrowUpRight,
  AlertTriangle,
  ArrowRight,
  Clock,
  RefreshCw,
  CheckCircle2,
  ChevronRight,
  Bell,
} from 'lucide-react'
import {
  vehicles,
  leads,
  monthlyLeads,
  portalStats,
  getVehicleErrors,
  getTotalLeadsThisMonth,
  getAvgDaysInStock,
  getVehiclesByStatus,
} from '@/data/mock-data'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { Section } from '@/App'

// --- Constants ---------------------------------------------------

const AUTOCASION = 'Autocasión'

// --- Props -------------------------------------------------------

interface DashboardPageProps {
  onNavigate: (section: Section) => void
}

// --- Computed data -----------------------------------------------

const totalViews = vehicles.reduce((a, v) => a + v.views, 0)
const totalLeads = getTotalLeadsThisMonth()
const activeVehicles = vehicles.filter(v => v.status === 'publicado').length
const avgDays = getAvgDaysInStock()
const stockByStatus = getVehiclesByStatus()

const febLeads = monthlyLeads[4]
const prevMonthTotal =
  febLeads.cochesNet + febLeads.wallapop + febLeads.milanuncios +
  febLeads.autoScout24 + febLeads.autocasion
const leadsGrowth = prevMonthTotal > 0
  ? (((totalLeads - prevMonthTotal) / prevMonthTotal) * 100).toFixed(0)
  : '0'

const chartData = monthlyLeads.map(m => ({
  month: m.month,
  'Coches.net': m.cochesNet,
  AutoScout24: m.autoScout24,
  Wallapop: m.wallapop,
  Milanuncios: m.milanuncios,
  [AUTOCASION]: m.autocasion,
}))

const portalChartColors: Record<string, string> = {
  'Coches.net': '#1e40af',
  AutoScout24: '#64748b',
  Wallapop: '#059669',
  Milanuncios: '#94a3b8',
  [AUTOCASION]: '#cbd5e1',
}

const recentLeads = [...leads]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 5)

const vehicleErrors = getVehicleErrors()

const portalColors: Record<string, string> = {
  'Coches.net': '#1e40af',
  Wallapop: '#059669',
  Milanuncios: '#94a3b8',
  AutoScout24: '#64748b',
  [AUTOCASION]: '#cbd5e1',
}

const avatarBgs = [
  'bg-slate-100 text-slate-600',
  'bg-slate-200 text-slate-700',
  'bg-blue-50 text-blue-700',
  'bg-slate-100 text-slate-600',
  'bg-slate-200 text-slate-700',
]

const statusStyles: Record<string, { label: string; bg: string; text: string; border: string }> = {
  pendiente: { label: 'Pendiente', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  contactado: { label: 'Contactado', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  vendido: { label: 'Vendido', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  descartado: { label: 'Descartado', bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-200' },
}

// --- Helpers -----------------------------------------------------

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date('2026-03-29')
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Hoy'
  if (diffDays === 1) return 'Ayer'
  if (diffDays < 7) return `Hace ${diffDays}d`
  return `Hace ${Math.floor(diffDays / 7)} sem`
}

function daysColorForDark(days: number): string {
  if (days < 30) return 'text-emerald-600'
  if (days < 60) return 'text-amber-600'
  return 'text-red-600'
}

// --- ZONA 1: KPIs ------------------------------------------------

function KpiCards() {
  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Vehículos activos */}
        <div className="glass-card-light rounded-2xl p-6">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400 mb-4">
            Vehículos activos
          </p>
          <p className="text-4xl font-bold tabular-nums text-slate-900">
            {activeVehicles}
          </p>
          <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mt-3">
            en 5 portales
          </p>
        </div>

        {/* Card 2: Leads este mes */}
        <div className="glass-card-light rounded-2xl p-6">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400 mb-4">
            Leads este mes
          </p>
          <div className="flex items-baseline gap-3">
            <p className="text-4xl font-bold tabular-nums text-slate-900">
              {totalLeads}
            </p>
            <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-medium px-2 py-1 rounded-md">
              <ArrowUpRight className="h-3 w-3" />
              {leadsGrowth}%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mt-3">
            vs. mes anterior
          </p>
        </div>

        {/* Card 3: Visitas totales */}
        <div className="glass-card-light rounded-2xl p-6">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400 mb-4">
            Visitas totales
          </p>
          <p className="text-4xl font-bold tabular-nums text-slate-900">
            {totalViews.toLocaleString('es-ES')}
          </p>
          <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mt-3">
            últimos 30 días
          </p>
        </div>

        {/* Card 4: Días en stock */}
        <div className="glass-card-light rounded-2xl p-6">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400 mb-4">
            Días en stock (media)
          </p>
          <p className={`text-4xl font-bold tabular-nums ${daysColorForDark(avgDays)}`}>
            {avgDays}
          </p>
          <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mt-3">
            media de stock activo
          </p>
        </div>
      </div>

      {/* Status dots */}
      <div className="flex gap-8 mt-6 text-[11px] font-medium tracking-wider text-slate-400 px-1 uppercase">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          {stockByStatus.publicado} publicados
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          {stockByStatus.reservado} reservados
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          {stockByStatus.vendido} vendidos
        </span>
      </div>
    </div>
  )
}

// --- ZONA 2a: Chart ----------------------------------------------

function LeadsChart() {
  const periodOptions = [
    { value: '3m', label: 'Últimos 3 meses' },
    { value: '6m', label: 'Últimos 6 meses' },
    { value: '12m', label: 'Último año' },
  ]

  return (
    <div className="card-surface rounded-2xl p-8 lg:col-span-2">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-semibold tracking-tight text-slate-900">
          Leads por portal
        </h3>
        <div className="bg-slate-100 p-1 rounded-lg flex items-center gap-1">
          {periodOptions.map(opt => (
            <button
              key={opt.value}
              className={`px-3 py-1.5 text-[11px] rounded-md transition-all duration-150 ${
                opt.value === '6m'
                  ? 'bg-white shadow-sm font-medium text-slate-900'
                  : 'text-slate-500 hover:text-slate-700 font-medium'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={1} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              width={28}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                fontSize: '12px',
                padding: '10px 14px',
                backdropFilter: 'blur(8px)',
                background: 'rgba(255,255,255,0.95)',
              }}
              cursor={{ fill: 'rgba(0,0,0,0.02)' }}
            />
            <Legend
              iconType="circle"
              iconSize={7}
              wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }}
            />
            <Bar dataKey="Coches.net" fill={portalChartColors['Coches.net']} radius={[4, 4, 0, 0]} />
            <Bar dataKey="AutoScout24" fill={portalChartColors['AutoScout24']} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Wallapop" fill={portalChartColors['Wallapop']} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Milanuncios" fill={portalChartColors['Milanuncios']} radius={[4, 4, 0, 0]} />
            <Bar dataKey={AUTOCASION} fill={portalChartColors[AUTOCASION]} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// --- ZONA 2b: Recent Leads ---------------------------------------

function RecentLeads({ onNavigate }: { onNavigate: (section: Section) => void }) {
  return (
    <div className="card-surface rounded-2xl lg:col-span-1 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex items-center justify-between">
        <h3 className="text-base font-semibold tracking-tight text-slate-900">
          Leads recientes
        </h3>
        <button
          onClick={() => onNavigate('leads')}
          className="link-underline inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 transition-all duration-150"
        >
          Ver todos
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
      <div className="divide-y divide-slate-100">
        {recentLeads.map((lead, idx) => {
          const st = statusStyles[lead.status]
          const avatarClass = avatarBgs[idx % avatarBgs.length]
          return (
            <div
              key={lead.id}
              className="flex items-start gap-3.5 px-6 py-4 transition-all duration-150 hover:bg-slate-50/60 cursor-pointer"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${avatarClass}`}
              >
                {getInitials(lead.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {lead.name}
                  </p>
                  <span
                    className={`shrink-0 inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium ${st.bg} ${st.text} ${st.border}`}
                  >
                    {st.label}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-1">
                  {lead.vehicleLabel}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: portalColors[lead.portal] || '#64748b' }}
                  />
                  <span className="text-[10px] text-slate-400">{lead.portal}</span>
                  <span className="text-slate-300 text-[10px]">·</span>
                  <span className="flex items-center gap-0.5 text-[10px] text-slate-400">
                    <Clock className="h-2.5 w-2.5" />
                    {formatRelativeDate(lead.date)}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// --- ZONA 3: Errores de publicación ------------------------------

function PublicationErrors() {
  if (vehicleErrors.length === 0) return null

  return (
    <div className="bg-red-50/60 border border-red-200 rounded-2xl p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100">
          <AlertTriangle className="h-5 w-5 text-red-600" />
        </div>
        <h3 className="text-base font-semibold text-red-900">
          {vehicleErrors.length}{' '}
          {vehicleErrors.length === 1
            ? 'vehículo con error de publicación'
            : 'vehículos con errores de publicación'}
        </h3>
      </div>
      <div className="space-y-3">
        {vehicleErrors.map(({ vehicle, portals }) => (
          <div
            key={vehicle.id}
            className="flex items-center gap-4 bg-white p-5 rounded-xl border border-red-100 transition-all duration-150"
          >
            <img
              src={vehicle.image}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-20 h-16 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {vehicle.brand} {vehicle.model}
              </p>
              <p className="text-[11px] text-red-600 mt-1 font-medium">
                Error en: {portals.join(', ')}
              </p>
            </div>
            <button className="flex items-center gap-2 shrink-0 bg-slate-900 text-white px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200 hover:bg-slate-800 hover:shadow-md">
              <RefreshCw className="h-3.5 w-3.5" />
              Solucionar
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// --- ZONA 4: Portales activos ------------------------------------

function ActivePortals() {
  return (
    <div>
      <h3 className="text-[10px] font-medium uppercase tracking-wider text-slate-400 mb-4 px-1">
        Portales conectados
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
        {portalStats.map(portal => (
          <div
            key={portal.slug}
            className="card-surface flex items-center gap-2.5 shrink-0 rounded-xl px-4 py-3 text-[12px] font-semibold text-slate-900 transition-all duration-150 hover:shadow-md"
          >
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: portal.color }}
            />
            {portal.name}
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 ml-0.5" />
          </div>
        ))}
      </div>
    </div>
  )
}

// --- Page --------------------------------------------------------

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  return (
    <>
      {/* SECTION 1: Premium header */}
      <section className="premium-header pt-8 pb-28 px-6 md:px-12">
        <header className="flex justify-between items-center mb-10 relative z-10">
          <nav className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-slate-400">
            <span className="text-slate-500">Admin</span>
            <ChevronRight className="h-3 w-3" />
            <span>Dashboard</span>
          </nav>
          <button className="p-2.5 rounded-lg bg-white text-slate-500 transition-colors relative border border-slate-200 shadow-sm hover:bg-slate-50">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-600 rounded-full" />
          </button>
        </header>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
            Buenos días, Paco
          </h2>
          <p className="text-slate-500 text-base">
            Resumen de <span className="text-slate-700 font-semibold">Paco Núñez Motor</span> — 29 de marzo de 2026
          </p>
        </div>
      </section>

      {/* SECTION 2: Content overlapping header */}
      <div className="px-6 md:px-12 -mt-16 max-w-7xl mx-auto pb-20 space-y-10 relative z-10">
        {/* ZONA 1: KPIs + stock status */}
        <KpiCards />

        {/* ZONA 2: Chart + Recent Leads */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <LeadsChart />
          <RecentLeads onNavigate={onNavigate} />
        </div>

        {/* ZONA 3: Publication errors */}
        <PublicationErrors />

        {/* ZONA 4: Active portals */}
        <ActivePortals />
      </div>
    </>
  )
}
