import { useState } from 'react'
import { Clock, Phone, Mail, Copy, MessageSquare } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { leads, type Lead } from '@/data/mock-data'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

// ─── Types ──────────────────────────────────────────────

type LeadStatus = 'todos' | 'pendiente' | 'contactado' | 'vendido' | 'descartado'

// ─── Constants ──────────────────────────────────────────

const statusConfig: Record<string, { label: string; classes: string }> = {
  pendiente: {
    label: 'Pendiente',
    classes: 'bg-amber-50 text-amber-700 border border-amber-200',
  },
  contactado: {
    label: 'Contactado',
    classes: 'bg-blue-50 text-blue-700 border border-blue-200',
  },
  vendido: {
    label: 'Vendido',
    classes: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  },
  descartado: {
    label: 'Descartado',
    classes: 'bg-slate-100 text-slate-500 border border-slate-200',
  },
}

const portalColors: Record<string, string> = {
  'Coches.net': '#1e40af',
  'Wallapop': '#059669',
  'Milanuncios': '#64748b',
  'AutoScout24': '#94a3b8',
  'Autocasión': '#cbd5e1',
}

// ─── Helpers ────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date('2026-03-29')
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  )
  if (diffDays === 0) return 'Hoy'
  if (diffDays === 1) return 'Ayer'
  if (diffDays < 7) return `Hace ${diffDays}d`
  return `Hace ${Math.floor(diffDays / 7)} sem`
}

function formatFullDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr)
  date.setDate(date.getDate() + days)
  return date.toISOString().split('T')[0]
}

// ─── Status Badge ───────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status]
  if (!config) return null
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium',
        config.classes
      )}
    >
      {config.label}
    </span>
  )
}

// ─── Portal Badge ───────────────────────────────────────

function PortalBadge({ portal }: { portal: string }) {
  const color = portalColors[portal] || '#6b7280'
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-lg px-2 py-0.5 text-[11px] font-medium border"
      style={{
        backgroundColor: color + '0C',
        color: color,
        borderColor: color + '30',
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      {portal}
    </span>
  )
}

// ─── Status Filter Pills ────────────────────────────────

function StatusFilter({
  active,
  onChange,
}: {
  active: LeadStatus
  onChange: (status: LeadStatus) => void
}) {
  const counts: Record<LeadStatus, number> = {
    todos: leads.length,
    pendiente: leads.filter((l) => l.status === 'pendiente').length,
    contactado: leads.filter((l) => l.status === 'contactado').length,
    vendido: leads.filter((l) => l.status === 'vendido').length,
    descartado: leads.filter((l) => l.status === 'descartado').length,
  }

  const filters: { key: LeadStatus; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'pendiente', label: 'Pendientes' },
    { key: 'contactado', label: 'Contactados' },
    { key: 'vendido', label: 'Vendidos' },
    { key: 'descartado', label: 'Descartados' },
  ]

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
      {filters.map((f) => (
        <button
          key={f.key}
          onClick={() => onChange(f.key)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors shrink-0',
            active === f.key
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          )}
        >
          {f.label}
          <span
            className={cn(
              'inline-flex h-4 min-w-4 items-center justify-center rounded-lg px-1 text-[10px] font-semibold tabular-nums',
              active === f.key
                ? 'bg-white/15 text-white'
                : 'bg-white text-slate-500'
            )}
          >
            {counts[f.key]}
          </span>
        </button>
      ))}
    </div>
  )
}

// ─── Status Dropdown ────────────────────────────────────

function StatusDropdown({
  status,
  onChange,
}: {
  status: string
  onChange?: (newStatus: string) => void
}) {
  return (
    <select
      value={status}
      onChange={(e) => onChange?.(e.target.value)}
      className="rounded-xl border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
      onClick={(e) => e.stopPropagation()}
    >
      <option value="pendiente">Pendiente</option>
      <option value="contactado">Contactado</option>
      <option value="vendido">Vendido</option>
      <option value="descartado">Descartado</option>
    </select>
  )
}

// ─── Lead Detail Dialog ─────────────────────────────────

function LeadDetailDialog({
  lead,
  open,
  onClose,
}: {
  lead: Lead | null
  open: boolean
  onClose: () => void
}) {
  if (!lead) return null

  const portalColor = portalColors[lead.portal] || '#6b7280'
  const lastContactDate = addDays(lead.date, 1)

  const timeline = [
    { label: 'Llamada realizada', date: lastContactDate },
    { label: 'Email de seguimiento enviado', date: lead.date },
    { label: `Lead recibido via ${lead.portal}`, date: lead.date },
  ]

  return (
    <Dialog open={open} onOpenChange={(dialogOpen) => { if (!dialogOpen) onClose() }}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="sr-only">Detalle del lead</DialogTitle>
          <DialogDescription className="sr-only">
            {`Información completa del lead ${lead.name}`}
          </DialogDescription>
        </DialogHeader>

        {/* Header: Avatar + Contact info */}
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12 shrink-0 rounded-2xl">
            <AvatarFallback
              className="text-sm font-semibold"
              style={{
                backgroundColor: portalColor + '14',
                color: portalColor,
              }}
            >
              {getInitials(lead.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-lg font-bold text-slate-900 leading-tight">{lead.name}</p>
            <div className="flex items-center gap-1.5 mt-1 text-[13px] text-slate-500">
              <Mail className="h-3 w-3 shrink-0" />
              <span className="truncate">{lead.email}</span>
              <span className="text-[10px] text-slate-400 flex items-center gap-0.5 ml-1">
                <Copy className="h-2.5 w-2.5" />
                copiar
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 text-[13px] text-slate-500">
              <Phone className="h-3 w-3 shrink-0" />
              <span>{lead.phone}</span>
              <span className="text-[10px] text-slate-400 flex items-center gap-0.5 ml-1">
                <Copy className="h-2.5 w-2.5" />
                copiar
              </span>
            </div>
          </div>
        </div>

        {/* Message */}
        {lead.message && (
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
            <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-1.5">
              <MessageSquare className="h-3 w-3" />
              Mensaje original
            </div>
            <p className="text-[13px] text-slate-900 leading-relaxed">
              {lead.message}
            </p>
          </div>
        )}

        {/* Vehiculo de interes */}
        <div>
          <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-2">
            Vehículo de interés
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium text-slate-900">{lead.vehicleLabel}</span>
            <PortalBadge portal={lead.portal} />
          </div>
        </div>

        {/* Estado */}
        <div>
          <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-2">
            Estado
          </p>
          <div className="flex items-center gap-3">
            <StatusBadge status={lead.status} />
            <StatusDropdown status={lead.status} />
          </div>
        </div>

        {/* Fechas */}
        <div>
          <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-2">
            Fechas
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[11px] text-slate-400">Entrada</p>
              <p className="text-[13px] font-medium text-slate-900 tabular-nums">
                {formatFullDate(lead.date)}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Último contacto</p>
              <p className="text-[13px] font-medium text-slate-900 tabular-nums">
                {formatFullDate(lastContactDate)}
              </p>
            </div>
          </div>
        </div>

        {/* Notas */}
        <div>
          <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-2">
            Notas
          </p>
          <textarea
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-900 placeholder:text-slate-400/60 focus:outline-none focus:ring-1 focus:ring-blue-600 resize-none"
            rows={2}
            placeholder="Añade notas sobre este lead..."
          />
        </div>

        {/* Historial */}
        <div>
          <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-3">
            Historial
          </p>
          <div className="relative pl-5">
            {/* Vertical line */}
            <div className="absolute left-[5px] top-1.5 bottom-1.5 w-px bg-slate-200" />

            <div className="space-y-4">
              {timeline.map((entry, i) => (
                <div key={i} className="relative">
                  {/* Dot */}
                  <div
                    className={cn(
                      'absolute -left-5 top-1 h-[11px] w-[11px] rounded-full border-2 border-white',
                      i === 0
                        ? 'bg-blue-600'
                        : 'bg-slate-300'
                    )}
                  />
                  <p className="text-[13px] font-medium text-slate-900 leading-tight">
                    {entry.label}
                  </p>
                  <p className="text-[11px] text-slate-400 tabular-nums mt-0.5">
                    {formatFullDate(entry.date)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Mobile Card ────────────────────────────────────────

function LeadCard({
  lead,
  onClick,
}: {
  lead: Lead
  onClick: () => void
}) {
  const portalColor = portalColors[lead.portal] || '#6b7280'

  return (
    <Card
      className="card-surface rounded-2xl cursor-pointer transition-colors hover:bg-slate-50/50"
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-9 w-9 shrink-0 rounded-2xl">
            <AvatarFallback
              className="text-[10px] font-semibold"
              style={{
                backgroundColor: portalColor + '14',
                color: portalColor,
              }}
            >
              {getInitials(lead.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[13px] font-medium text-slate-900 truncate">{lead.name}</p>
              <StatusBadge status={lead.status} />
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">
              {lead.vehicleLabel}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <PortalBadge portal={lead.portal} />
              <span className="flex items-center gap-0.5 text-[10px] text-slate-400 tabular-nums">
                <Clock className="h-2.5 w-2.5" />
                {formatRelativeDate(lead.date)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Page ───────────────────────────────────────────────

export function LeadsPage() {
  const [statusFilter, setStatusFilter] = useState<LeadStatus>('todos')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const isMobile = useIsMobile()

  const filteredLeads =
    statusFilter === 'todos'
      ? leads
      : leads.filter((l) => l.status === statusFilter)

  function openLeadDetail(lead: Lead) {
    setSelectedLead(lead)
    setDialogOpen(true)
  }

  function closeLeadDetail() {
    setDialogOpen(false)
    setTimeout(() => setSelectedLead(null), 200)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-baseline gap-2">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Leads / CRM
          </h2>
          <span className="text-[13px] text-slate-400 tabular-nums">
            {leads.length} contactos
          </span>
        </div>
      </div>

      {/* Filters */}
      <StatusFilter active={statusFilter} onChange={setStatusFilter} />

      {/* Desktop Table */}
      {!isMobile ? (
        <div className="card-surface rounded-2xl border border-slate-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="bg-slate-50/80 text-[10px] font-bold tracking-wider uppercase text-slate-400">
                  Contacto
                </TableHead>
                <TableHead className="bg-slate-50/80 text-[10px] font-bold tracking-wider uppercase text-slate-400">
                  Portal
                </TableHead>
                <TableHead className="bg-slate-50/80 text-[10px] font-bold tracking-wider uppercase text-slate-400">
                  Vehículo
                </TableHead>
                <TableHead className="bg-slate-50/80 text-[10px] font-bold tracking-wider uppercase text-slate-400 hidden lg:table-cell">
                  Fecha
                </TableHead>
                <TableHead className="bg-slate-50/80 text-[10px] font-bold tracking-wider uppercase text-slate-400">
                  Estado
                </TableHead>
                <TableHead className="bg-slate-50/80 text-[10px] font-bold tracking-wider uppercase text-slate-400 text-right">
                  Acción
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => {
                const portalColor = portalColors[lead.portal] || '#6b7280'

                return (
                  <TableRow
                    key={lead.id}
                    className="hover:bg-slate-50/50 cursor-pointer transition-colors"
                    onClick={() => openLeadDetail(lead)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 shrink-0 rounded-2xl">
                          <AvatarFallback
                            className="text-[10px] font-semibold"
                            style={{
                              backgroundColor: portalColor + '14',
                              color: portalColor,
                            }}
                          >
                            {getInitials(lead.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-[13px] font-medium text-slate-900">
                            {lead.name}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {lead.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <PortalBadge portal={lead.portal} />
                    </TableCell>
                    <TableCell>
                      <span className="text-[13px] text-slate-900">
                        {lead.vehicleLabel}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="flex items-center gap-1 text-[12px] text-slate-500 tabular-nums">
                        <Clock className="h-3 w-3" />
                        {formatRelativeDate(lead.date)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={lead.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <StatusDropdown status={lead.status} />
                    </TableCell>
                  </TableRow>
                )
              })}
              {filteredLeads.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-slate-400"
                  >
                    No hay leads con este filtro
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        /* Mobile Cards */
        <div className="space-y-3">
          {filteredLeads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onClick={() => openLeadDetail(lead)}
            />
          ))}
          {filteredLeads.length === 0 && (
            <p className="text-center text-[13px] text-slate-400 py-12">
              No hay leads con este filtro
            </p>
          )}
        </div>
      )}

      {/* Lead Detail Dialog */}
      <LeadDetailDialog
        lead={selectedLead}
        open={dialogOpen}
        onClose={closeLeadDetail}
      />
    </div>
  )
}
