import { useState } from 'react'
import {
  Search,
  Plus,
  MoreHorizontal,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Eye,
  Users,
  Lock,
  CheckCircle2,
  Clock,
  FileText,
  Shield,
  Upload,
} from 'lucide-react'
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
  DialogFooter,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  vehicles,
  portalNames,
  getDaysInStock,
  getDaysBgColor,
  getPriceComparison,
  type Vehicle,
  type PortalStatus,
} from '@/data/mock-data'
import { useIsMobile } from '@/hooks/use-mobile'
import type { Section } from '@/App'

interface VehiclesPageProps {
  onNavigate: (section: Section) => void
}

type StatusFilter = 'todos' | 'publicado' | 'reservado' | 'vendido'

const portalKeys = ['cochesNet', 'wallapop', 'milanuncios', 'autoScout24', 'autocasion'] as const

const portalConnectionType: Record<string, { label: string; color: string }> = {
  cochesNet: { label: 'API', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  wallapop: { label: 'API', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  milanuncios: { label: 'CSV', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  autoScout24: { label: 'XML/SFTP', color: 'bg-slate-50 text-slate-700 border-slate-200' },
  autocasion: { label: 'XML/SFTP', color: 'bg-slate-50 text-slate-700 border-slate-200' },
}

const documentIcons: Record<string, typeof FileText> = {
  itv: FileText,
  contrato: FileText,
  informe: Shield,
  garantia: CheckCircle2,
  otro: FileText,
}

// ── Helpers ────────────────────────────────────────────

function StatusDot({ status, title }: { status: PortalStatus; title?: string }) {
  const colors: Record<PortalStatus, string> = {
    ok: 'bg-emerald-500',
    error: 'bg-red-500',
    pending: 'bg-amber-400',
  }
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full ${colors[status]}`}
      title={title ?? status}
    />
  )
}

function formatKm(km: number): string {
  return km >= 1000 ? `${Math.round(km / 1000)}K km` : `${km} km`
}

function formatPrice(price: number): string {
  return price.toLocaleString('es-ES') + ' €'
}

function getStatusBadge(status: Vehicle['status']) {
  const map = {
    publicado: {
      label: 'Publicado',
      className: 'bg-blue-50 text-blue-700 border border-blue-200',
      icon: null,
    },
    reservado: {
      label: 'Reservado',
      className: 'bg-amber-50 text-amber-700 border border-amber-200',
      icon: Lock,
    },
    vendido: {
      label: 'Vendido',
      className: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      icon: CheckCircle2,
    },
  }
  const cfg = map[status]
  const Icon = cfg.icon
  return (
    <span className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[11px] font-medium ${cfg.className}`}>
      {Icon && <Icon className="h-3 w-3" />}
      {cfg.label}
    </span>
  )
}

function getEtiquetaColor(etiqueta: Vehicle['etiquetaAmbiental']): string {
  const map: Record<string, string> = {
    '0': 'bg-blue-100 text-blue-800 border-blue-300',
    'ECO': 'bg-teal-100 text-teal-800 border-teal-300',
    'C': 'bg-green-100 text-green-800 border-green-300',
    'B': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'Sin etiqueta': 'bg-slate-100 text-slate-600 border-slate-300',
  }
  return map[etiqueta] ?? 'bg-slate-100 text-slate-600 border-slate-300'
}

// ── Detail Dialog ──────────────────────────────────────

function VehicleDetailDialog({
  vehicle,
  onClose,
}: {
  vehicle: Vehicle | null
  onClose: () => void
}) {
  if (!vehicle) return null

  const days = getDaysInStock(vehicle.createdAt)
  const margin = vehicle.price - vehicle.precioCompra
  const comparison = getPriceComparison(vehicle.price, vehicle.precioMercado)

  const vehiclePhotos = [
    vehicle.image.replace('fit=crop', 'fit=crop&crop=center'),
    vehicle.image.replace('fit=crop', 'fit=crop&crop=top'),
    vehicle.image.replace('fit=crop', 'fit=crop&crop=bottom'),
    vehicle.image.replace('fit=crop', 'fit=crop&crop=left'),
    vehicle.image.replace('fit=crop', 'fit=crop&crop=right'),
    vehicle.image.replace('fit=crop', 'fit=crop&crop=entropy'),
  ]

  return (
    <Dialog open={!!vehicle} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="sr-only">
            {vehicle.brand} {vehicle.model}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Detalle del vehículo {vehicle.brand} {vehicle.model}
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <Tabs defaultValue="general">
          <TabsList variant="line" className="w-full justify-start">
            <TabsTrigger value="general" className="text-[13px]">General</TabsTrigger>
            <TabsTrigger value="datos" className="text-[13px]">Datos</TabsTrigger>
            <TabsTrigger value="portales" className="text-[13px]">Portales</TabsTrigger>
            <TabsTrigger value="documentos" className="text-[13px]">Documentos</TabsTrigger>
            <TabsTrigger value="fotos" className="text-[13px]">Fotos</TabsTrigger>
          </TabsList>

          {/* Tab: General */}
          <TabsContent value="general" className="space-y-5 pt-2">
            {/* Hero image */}
            <div className="relative -mx-4 overflow-hidden rounded-t-xl">
              <img
                src={vehicle.image}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="h-52 w-full object-cover rounded-t-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-4">
                <div>
                  <p className="text-lg font-bold text-white leading-tight">
                    {vehicle.brand} {vehicle.model}
                  </p>
                  <p className="text-[12px] text-white/70 mt-0.5">
                    {vehicle.year} · {vehicle.fuel} · {formatKm(vehicle.km)}
                  </p>
                </div>
                {getStatusBadge(vehicle.status)}
              </div>
            </div>

            {/* Price row */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-3xl font-bold text-slate-900 tabular-nums">
                {formatPrice(vehicle.price)}
              </span>
              <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium ${comparison.color}`}>
                {comparison.label}
              </span>
              <span className="text-[13px] text-slate-400">
                Precio mercado: {formatPrice(vehicle.precioMercado)}
              </span>
              <span className="text-[11px] text-slate-300">Fuente: Eurotax</span>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="card-surface rounded-2xl border border-[rgba(0,0,0,0.06)] p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Users className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-bold tracking-wider uppercase">Leads</span>
                </div>
                <p className="text-3xl font-bold text-slate-900 tabular">{vehicle.leads}</p>
              </div>
              <div className="card-surface rounded-2xl border border-[rgba(0,0,0,0.06)] p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Eye className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-bold tracking-wider uppercase">Visitas</span>
                </div>
                <p className="text-3xl font-bold text-slate-900 tabular">{vehicle.views}</p>
              </div>
              <div className="card-surface rounded-2xl border border-[rgba(0,0,0,0.06)] p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-bold tracking-wider uppercase">Días en stock</span>
                </div>
                <p className={`text-3xl font-bold tabular ${getDaysBgColor(days).includes('emerald') ? 'text-emerald-700' : getDaysBgColor(days).includes('amber') ? 'text-amber-700' : 'text-red-700'}`}>{days}</p>
              </div>
              <div className="card-surface rounded-2xl border border-[rgba(0,0,0,0.06)] p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="text-[10px] font-bold tracking-wider uppercase">Margen bruto</span>
                </div>
                <p className={`text-3xl font-bold tabular ${margin >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                  {margin >= 0 ? '+' : ''}{formatPrice(margin)}
                </p>
              </div>
            </div>

            {/* Matrícula + VIN */}
            <div className="flex gap-6">
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400">Matrícula</p>
                <p className="text-[14px] font-mono font-medium text-slate-900">{vehicle.matricula}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400">VIN</p>
                <p className="text-[14px] font-mono font-medium text-slate-900">{vehicle.vin}</p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                Descripción
              </p>
              <p className="text-[13px] text-slate-500 leading-relaxed">
                {vehicle.description}
              </p>
              <button className="flex items-center gap-2 rounded-md bg-blue-50 border border-blue-100 px-3 py-1.5 text-[12px] font-medium text-blue-800 transition-all duration-150 hover:bg-blue-100">
                <Sparkles className="h-3.5 w-3.5" />
                Mejorar con IA
              </button>
            </div>

            {/* Price history timeline */}
            {vehicle.historialPrecios.length > 0 && (
              <div className="space-y-3">
                <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                  Historial de precios
                </p>
                <div className="space-y-0">
                  {vehicle.historialPrecios.map((change, idx) => (
                    <div key={idx} className="flex items-start gap-3 relative pb-4 last:pb-0">
                      {/* Dot + line */}
                      <div className="flex flex-col items-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-blue-600 mt-1 shrink-0" />
                        {idx < vehicle.historialPrecios.length - 1 && (
                          <div className="w-px flex-1 bg-slate-200 mt-1" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] text-slate-400">{change.date}</p>
                        <p className="text-[13px] text-slate-700">
                          De <span className="line-through text-slate-400">{formatPrice(change.oldPrice)}</span> a <span className="font-medium text-slate-900">{formatPrice(change.newPrice)}</span>
                        </p>
                        {change.reason && (
                          <p className="text-[11px] text-slate-400 mt-0.5">{change.reason}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Tab: Datos */}
          <TabsContent value="datos" className="space-y-5 pt-2">
            {/* Datos básicos */}
            <FieldGroup title="Datos básicos" fields={[
              { label: 'Marca', value: vehicle.brand },
              { label: 'Modelo', value: vehicle.model },
              { label: 'Versión', value: vehicle.version },
              { label: 'Año', value: String(vehicle.year) },
              { label: 'Combustible', value: vehicle.fuel },
              { label: 'Cambio', value: vehicle.cambio },
              { label: 'Color ext.', value: vehicle.color },
              { label: 'Color int.', value: vehicle.colorInterior },
              { label: 'Puertas', value: String(vehicle.puertas) },
              { label: 'Plazas', value: String(vehicle.plazas) },
            ]} />

            {/* Motor */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                Motor
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                <FieldItem label="Cilindrada" value={`${vehicle.cilindrada.toLocaleString('es-ES')} cc`} />
                <FieldItem label="Potencia" value={`${vehicle.potencia} CV (${vehicle.potenciaKw} kW)`} />
                <div className="space-y-1">
                  <label className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                    Etiqueta ambiental
                  </label>
                  <div>
                    <span className={`inline-flex items-center rounded-md border px-2 py-1 text-[12px] font-semibold ${getEtiquetaColor(vehicle.etiquetaAmbiental)}`}>
                      {vehicle.etiquetaAmbiental}
                    </span>
                  </div>
                </div>
                <FieldItem label="Tracción" value={vehicle.traccion} />
              </div>
            </div>

            {/* Identificación */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                Identificación
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold tracking-wider uppercase text-slate-400">Matrícula</label>
                  <p className="font-mono text-[13px] text-slate-900 bg-slate-50 rounded-md border border-[rgba(0,0,0,0.06)] px-2.5 py-1.5">{vehicle.matricula}</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-bold tracking-wider uppercase text-slate-400">VIN</label>
                  <p className="font-mono text-xs text-slate-900 bg-slate-50 rounded-md border border-[rgba(0,0,0,0.06)] px-2.5 py-1.5">{vehicle.vin}</p>
                </div>
                <FieldItem label="Fecha ITV" value={vehicle.fechaItv} />
                <FieldItem label="Propietarios ant." value={String(vehicle.propietariosAnteriores)} />
              </div>
            </div>

            {/* Precio */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                Precio
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold tracking-wider uppercase text-slate-400">Precio venta</label>
                  <p className="text-[14px] font-bold text-slate-900 bg-slate-50 rounded-md border border-[rgba(0,0,0,0.06)] px-2.5 py-1.5">{formatPrice(vehicle.price)}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold tracking-wider uppercase text-slate-400">Precio compra</label>
                  <p className="text-[13px] text-slate-500 bg-slate-50 rounded-md border border-[rgba(0,0,0,0.06)] px-2.5 py-1.5">{formatPrice(vehicle.precioCompra)}</p>
                </div>
                {vehicle.precioAnterior && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold tracking-wider uppercase text-slate-400">Precio anterior</label>
                    <p className="text-[13px] text-slate-400 line-through bg-slate-50 rounded-md border border-[rgba(0,0,0,0.06)] px-2.5 py-1.5">{formatPrice(vehicle.precioAnterior)}</p>
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold tracking-wider uppercase text-slate-400">Precio mercado</label>
                  <div className="flex items-center gap-2 bg-slate-50 rounded-md border border-[rgba(0,0,0,0.06)] px-2.5 py-1.5">
                    <span className="text-[13px] text-slate-900">{formatPrice(vehicle.precioMercado)}</span>
                    <span className={`inline-flex items-center rounded-md border px-1.5 py-0 text-[10px] font-medium ${comparison.color}`}>
                      {comparison.label}
                    </span>
                  </div>
                </div>
                <FieldItem label="Garantía" value={vehicle.garantia} />
                <div className="space-y-1">
                  <label className="text-[10px] font-bold tracking-wider uppercase text-slate-400">Margen</label>
                  <p className={`text-[13px] font-medium bg-slate-50 rounded-md border border-[rgba(0,0,0,0.06)] px-2.5 py-1.5 ${margin >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                    {margin >= 0 ? '+' : ''}{formatPrice(margin)}
                  </p>
                </div>
              </div>
            </div>

            {/* Extras */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                Extras
              </p>
              <div className="flex flex-wrap gap-1.5">
                {vehicle.extras.map((extra) => (
                  <span
                    key={extra}
                    className="inline-flex items-center bg-slate-100 text-slate-700 border border-slate-200 rounded-md px-2.5 py-1 text-xs font-medium"
                  >
                    {extra}
                  </span>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Tab: Portales */}
          <TabsContent value="portales" className="pt-2">
            <div className="rounded-lg border border-[rgba(0,0,0,0.06)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[rgba(0,0,0,0.06)] bg-slate-50/80">
                    <th className="px-3 py-2 text-left text-[10px] font-bold tracking-wider uppercase text-slate-400">Portal</th>
                    <th className="px-3 py-2 text-left text-[10px] font-bold tracking-wider uppercase text-slate-400">Estado</th>
                    <th className="px-3 py-2 text-left text-[10px] font-bold tracking-wider uppercase text-slate-400">Conexión</th>
                    <th className="px-3 py-2 text-right text-[10px] font-bold tracking-wider uppercase text-slate-400">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(vehicle.portalStatus).map(([key, status]) => {
                    const connection = portalConnectionType[key]
                    return (
                      <tr key={key} className="border-b border-[rgba(0,0,0,0.06)] last:border-b-0">
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-2">
                            <StatusDot status={status} />
                            <span className="text-[13px] font-medium text-slate-900">
                              {portalNames[key]}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-2.5">
                          {status === 'ok' && (
                            <span className="inline-flex items-center rounded-lg bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[11px] font-medium text-emerald-700">Activo</span>
                          )}
                          {status === 'error' && (
                            <span className="inline-flex items-center rounded-lg bg-red-50 border border-red-200 px-2 py-0.5 text-[11px] font-medium text-red-700">Error</span>
                          )}
                          {status === 'pending' && (
                            <span className="inline-flex items-center rounded-lg bg-amber-50 border border-amber-200 px-2 py-0.5 text-[11px] font-medium text-amber-700">Pendiente</span>
                          )}
                        </td>
                        <td className="px-3 py-2.5">
                          {connection && (
                            <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium ${connection.color}`}>
                              {connection.label}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {status === 'ok' && (
                              <button className="inline-flex items-center gap-1 rounded-md border border-[rgba(0,0,0,0.06)] px-2 py-1 text-[10px] font-medium text-slate-500 hover:bg-slate-50 transition-all duration-150">
                                <ExternalLink className="h-2.5 w-2.5" />
                                Ver anuncio
                              </button>
                            )}
                            {status === 'error' && (
                              <button className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-1 text-[10px] font-medium text-red-700 hover:bg-red-100 transition-all duration-150">
                                <RefreshCw className="h-2.5 w-2.5" />
                                Reintentar
                              </button>
                            )}
                            {status === 'pending' && (
                              <span className="text-[10px] text-amber-600 font-medium">Procesando...</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Tab: Documentos */}
          <TabsContent value="documentos" className="space-y-4 pt-2">
            {vehicle.documentos.length > 0 ? (
              <div className="rounded-lg border border-[rgba(0,0,0,0.06)] overflow-hidden divide-y divide-[rgba(0,0,0,0.06)]">
                {vehicle.documentos.map((doc) => {
                  const Icon = documentIcons[doc.type] ?? FileText
                  return (
                    <div key={doc.id} className="flex items-center justify-between px-3 py-2.5">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-8 w-8 rounded-md bg-slate-100">
                          <Icon className="h-4 w-4 text-slate-500" />
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-slate-900">{doc.name}</p>
                          <p className="text-[11px] text-slate-400">{doc.date}</p>
                        </div>
                      </div>
                      <button className="inline-flex items-center gap-1 rounded-md border border-[rgba(0,0,0,0.06)] px-2.5 py-1 text-[11px] font-medium text-slate-500 hover:bg-slate-50 transition-all duration-150">
                        Descargar
                      </button>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-[13px] text-slate-400 text-center py-6">Sin documentos</p>
            )}
            <button className="flex items-center gap-2 rounded-md bg-slate-100 border border-slate-200 px-3 py-1.5 text-[12px] font-medium text-slate-700 transition-all duration-150 hover:bg-slate-200">
              <Upload className="h-3.5 w-3.5" />
              Subir documento
            </button>
          </TabsContent>

          {/* Tab: Fotos */}
          <TabsContent value="fotos" className="space-y-4 pt-2">
            <div className="grid grid-cols-3 gap-2">
              {vehiclePhotos.map((src, i) => (
                <div key={i} className="relative">
                  <img
                    src={src}
                    alt={`Foto ${i + 1} de ${vehicle.brand} ${vehicle.model}`}
                    className="h-32 w-full rounded-md object-cover border border-[rgba(0,0,0,0.06)]"
                  />
                  {i === 0 && (
                    <span className="absolute top-1.5 left-1.5 inline-flex items-center rounded bg-black/60 backdrop-blur-sm px-1.5 py-0.5 text-[10px] font-medium text-white">
                      Portada
                    </span>
                  )}
                </div>
              ))}
            </div>
            <button className="flex items-center gap-2 rounded-md bg-slate-100 border border-slate-200 px-3 py-1.5 text-[12px] font-medium text-slate-700 transition-all duration-150 hover:bg-slate-200">
              <Upload className="h-3.5 w-3.5" />
              Añadir fotos
            </button>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <DialogFooter className="gap-2">
          {vehicle.status === 'publicado' && (
            <button className="rounded-md bg-amber-50 border border-amber-200 px-3 py-1.5 text-[12px] font-medium text-amber-700 hover:bg-amber-100 transition-all duration-150">
              <Lock className="inline h-3 w-3 mr-1" />
              Marcar como reservado
            </button>
          )}
          {(vehicle.status === 'publicado' || vehicle.status === 'reservado') && (
            <button className="rounded-md bg-red-50 border border-red-200 px-3 py-1.5 text-[12px] font-medium text-red-700 hover:bg-red-100 transition-all duration-150">
              Marcar como vendido
            </button>
          )}
          <Button className="rounded-xl bg-blue-700 text-white hover:bg-blue-800 text-[12px] transition-all duration-150">
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Field helpers ─────────────────────────────────────

function FieldItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
        {label}
      </label>
      <p className="text-[13px] text-slate-900 bg-slate-50 rounded-md border border-[rgba(0,0,0,0.06)] px-2.5 py-1.5">
        {value || <span className="text-slate-300">Sin datos</span>}
      </p>
    </div>
  )
}

function FieldGroup({ title, fields }: { title: string; fields: { label: string; value: string }[] }) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
        {title}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
        {fields.map((f) => (
          <FieldItem key={f.label} label={f.label} value={f.value} />
        ))}
      </div>
    </div>
  )
}

// ── Mobile Card ────────────────────────────────────────

function VehicleCard({ vehicle, onClick }: { vehicle: Vehicle; onClick: () => void }) {
  const days = getDaysInStock(vehicle.createdAt)
  return (
    <Card
      className="card-surface cursor-pointer transition-all duration-150 hover:[box-shadow:0_1px_3px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.04)] rounded-2xl"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <img
          src={vehicle.image}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="h-36 w-full object-cover rounded-t-3xl"
        />
        <div className="p-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[14px] font-semibold text-slate-900 leading-tight truncate">
                {vehicle.brand} {vehicle.model}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {vehicle.year} · {vehicle.fuel} · {formatKm(vehicle.km)}
              </p>
            </div>
            <p className="text-[15px] font-bold text-blue-700 tabular-nums shrink-0">
              {formatPrice(vehicle.price)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {getStatusBadge(vehicle.status)}
            <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium tabular-nums ${getDaysBgColor(days)}`}>
              {days}d
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {portalKeys.map((key) => (
              <StatusDot key={key} status={vehicle.portalStatus[key]} title={portalNames[key]} />
            ))}
            <span className="ml-auto flex items-center gap-1 text-[10px] text-slate-500 tabular-nums">
              <Users className="h-3 w-3" /> {vehicle.leads}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Page ───────────────────────────────────────────────

export function VehiclesPage({ onNavigate }: VehiclesPageProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos')
  const isMobile = useIsMobile()

  const counts = {
    todos: vehicles.length,
    publicado: vehicles.filter(v => v.status === 'publicado').length,
    reservado: vehicles.filter(v => v.status === 'reservado').length,
    vendido: vehicles.filter(v => v.status === 'vendido').length,
  }

  const filteredVehicles = statusFilter === 'todos'
    ? vehicles
    : vehicles.filter(v => v.status === statusFilter)

  const filterPills: { key: StatusFilter; label: string }[] = [
    { key: 'todos', label: `Todos (${counts.todos})` },
    { key: 'publicado', label: `Publicados (${counts.publicado})` },
    { key: 'reservado', label: `Reservados (${counts.reservado})` },
    { key: 'vendido', label: `Vendidos (${counts.vendido})` },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-bold tracking-tight text-slate-900">
            Vehículos
          </h2>
          <p className="text-[13px] text-slate-500 mt-0.5">
            {vehicles.length} vehículos en stock
          </p>
        </div>
        <Button
          onClick={() => onNavigate('subir')}
          className="self-start sm:self-auto rounded-xl bg-blue-700 text-white hover:bg-blue-800 transition-all duration-150"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Subir vehículo
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar vehículo..."
            className="w-full rounded-xl border border-[rgba(0,0,0,0.06)] bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300 transition-all duration-150"
          />
        </div>
        <select className="rounded-xl border border-[rgba(0,0,0,0.06)] bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300 transition-all duration-150">
          <option>Todos</option>
          <option>Gasolina</option>
          <option>Diésel</option>
          <option>Híbrido</option>
          <option>Eléctrico</option>
        </select>
      </div>

      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2">
        {filterPills.map((pill) => (
          <button
            key={pill.key}
            onClick={() => setStatusFilter(pill.key)}
            className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition-all duration-150 ${
              statusFilter === pill.key
                ? 'bg-primary text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Desktop Table */}
      {!isMobile ? (
        <div className="card-surface rounded-2xl border border-[rgba(0,0,0,0.06)] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-slate-50/80">
                <TableHead className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                  Vehículo
                </TableHead>
                <TableHead className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                  Estado
                </TableHead>
                <TableHead className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                  Precio
                </TableHead>
                <TableHead className="text-[10px] font-bold tracking-wider uppercase text-slate-400 hidden md:table-cell">
                  Km
                </TableHead>
                <TableHead className="text-[10px] font-bold tracking-wider uppercase text-slate-400 hidden md:table-cell">
                  Días
                </TableHead>
                {portalKeys.map((key) => (
                  <TableHead
                    key={key}
                    className="text-[10px] font-bold tracking-wider uppercase text-slate-400 text-center w-8"
                    title={portalNames[key]}
                  >
                    <span className="inline-block h-2 w-2 rounded-full bg-slate-200" />
                  </TableHead>
                ))}
                <TableHead className="text-[10px] font-bold tracking-wider uppercase text-slate-400 text-center w-14">
                  Leads
                </TableHead>
                <TableHead className="text-[10px] font-bold tracking-wider uppercase text-slate-400 text-center w-14 hidden sm:table-cell">
                  Visitas
                </TableHead>
                <TableHead className="w-8" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.map((vehicle) => {
                const days = getDaysInStock(vehicle.createdAt)
                return (
                  <TableRow
                    key={vehicle.id}
                    className="cursor-pointer transition-colors hover:bg-slate-50/50"
                    onClick={() => setSelectedVehicle(vehicle)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={vehicle.image}
                          alt={`${vehicle.brand} ${vehicle.model}`}
                          className="h-10 w-14 shrink-0 rounded-sm object-cover"
                        />
                        <div>
                          <p className="text-[13px] font-medium text-slate-900">
                            {vehicle.brand} {vehicle.model}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {vehicle.year} · {vehicle.fuel}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(vehicle.status)}
                    </TableCell>
                    <TableCell>
                      <span className="text-[14px] font-semibold text-slate-900 tabular-nums">
                        {formatPrice(vehicle.price)}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-[13px] text-slate-500 tabular-nums">
                        {formatKm(vehicle.km)}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium tabular-nums ${getDaysBgColor(days)}`}>
                        {days}
                      </span>
                    </TableCell>
                    {portalKeys.map((key) => (
                      <TableCell key={key} className="text-center">
                        <StatusDot status={vehicle.portalStatus[key]} title={portalNames[key]} />
                      </TableCell>
                    ))}
                    <TableCell className="text-center">
                      <span className="text-[13px] font-medium text-slate-900 tabular-nums">{vehicle.leads}</span>
                    </TableCell>
                    <TableCell className="text-center hidden sm:table-cell">
                      <span className="text-[13px] text-slate-500 tabular-nums">{vehicle.views}</span>
                    </TableCell>
                    <TableCell>
                      <MoreHorizontal className="h-4 w-4 text-slate-400/60" />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        /* Mobile Cards */
        <div className="grid grid-cols-1 gap-3">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onClick={() => setSelectedVehicle(vehicle)}
            />
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <VehicleDetailDialog
        vehicle={selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
      />
    </div>
  )
}
