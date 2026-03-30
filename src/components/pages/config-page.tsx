import {
  CheckCircle2,
  Shield,
  Plus,
  Upload,
  Download,
  Settings,
  MoreHorizontal,
} from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { portalStats, teamMembers, getTotalMonthlyCost } from '@/data/mock-data'

// ─── Connection type badges per portal ───────────────────

const portalConnectionType: Record<string, { label: string; style: string }> = {
  cochesNet: { label: 'API', style: 'bg-blue-50 text-blue-700 border border-blue-200 rounded-md' },
  wallapop: { label: 'API', style: 'bg-blue-50 text-blue-700 border border-blue-200 rounded-md' },
  milanuncios: { label: 'CSV', style: 'bg-slate-100 text-slate-600 border border-slate-200 rounded-md' },
  autoScout24: { label: 'XML/SFTP', style: 'bg-slate-100 text-slate-600 border border-slate-200 rounded-md' },
  autocasion: { label: 'XML/SFTP', style: 'bg-slate-100 text-slate-600 border border-slate-200 rounded-md' },
}

// ─── Tab 1: Portales ─────────────────────────────────────

function PortalesTab() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-heading text-[15px] font-semibold">
          Portales conectados
        </h3>
        <p className="text-[12px] text-muted-foreground mt-0.5">
          Configuración gestionada por Flama Studio
        </p>
      </div>

      <div className="space-y-2">
        {portalStats.map((portal) => {
          const connection = portalConnectionType[portal.slug]
          return (
            <div
              key={portal.slug}
              className="card-surface flex items-center justify-between rounded-2xl border border-border px-4 py-3 transition-all duration-150 hover:[box-shadow:0_1px_3px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.04)]"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-medium">{portal.name}</p>
                    {connection && (
                      <span className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium ${connection.style}`}>
                        {connection.label}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {portal.plan}
                    {portal.cost > 0 && (
                      <span className="ml-2 text-slate-500">
                        {portal.cost} EUR/mes
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                  Conectado
                </span>
                <Button variant="outline" size="sm" className="text-[12px] rounded-xl transition-all duration-150">
                  <Settings className="h-3 w-3 mr-1" />
                  Configurar
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-[11px] text-muted-foreground">
        La configuración de portales es gestionada por Flama Studio durante el onboarding. Contacta con soporte para modificaciones.
      </p>
    </div>
  )
}

// ─── Tab 2: Usuarios ─────────────────────────────────────

const lastAccessDates: Record<string, string> = {
  t1: '29 mar 2026, 10:15',
  t2: '28 mar 2026, 18:42',
  t3: '27 mar 2026, 09:30',
}

function UsuariosTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-[15px] font-semibold">Equipo</h3>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            {teamMembers.length} miembros
          </p>
        </div>
        <Button size="sm" className="text-[12px] rounded-xl transition-all duration-150">
          <Plus className="h-3.5 w-3.5 mr-1" />
          Invitar usuario
        </Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Usuario
              </TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium hidden sm:table-cell">
                Email
              </TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Rol
              </TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium hidden md:table-cell">
                Último acceso
              </TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium w-10">
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="text-[11px] font-semibold bg-blue-50 text-blue-800">
                        {member.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[13px] font-medium">
                      {member.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <span className="text-[12px] text-muted-foreground">
                    {member.email}
                  </span>
                </TableCell>
                <TableCell>
                  {member.role === 'admin' ? (
                    <span className="inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-800">
                      Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                      Operador
                    </span>
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="text-[12px] text-muted-foreground">
                    {lastAccessDates[member.id] ?? '-'}
                  </span>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon-sm">
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Roles info */}
      <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4">
        <div className="flex items-start gap-2.5">
          <Shield className="h-4 w-4 text-blue-700 mt-0.5 shrink-0" />
          <div className="text-[12px] text-slate-900 space-y-1.5">
            <p className="font-semibold">Roles del sistema</p>
            <p>
              <span className="font-medium">Admin:</span> acceso total —
              configuración, facturación, usuarios, vehículos, leads y reportes.
            </p>
            <p>
              <span className="font-medium">Operador:</span> vehículos, leads y
              subida — sin acceso a facturación ni configuración.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Tab 3: Concesionario ────────────────────────────────

function ConcesionarioTab() {
  const fields = [
    { label: 'Nombre comercial', value: 'Paco Nuñez Motor' },
    { label: 'CIF / NIF', value: 'B29123456' },
    { label: 'Dirección', value: 'Av. de Velázquez 74' },
    { label: 'Ciudad', value: 'Málaga' },
    { label: 'Código postal', value: '29004' },
    { label: 'Provincia', value: 'Málaga' },
    { label: 'Teléfono', value: '+34 952 123 456' },
    { label: 'Email', value: 'info@paconunezmotors.es' },
    { label: 'Web', value: 'www.paconunezmotors.es' },
    { label: 'Horario', value: 'L-V 9:00-19:00, S 10:00-14:00' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-[15px] font-semibold">
          Datos del concesionario
        </h3>
        <p className="text-[12px] text-muted-foreground mt-0.5">
          Información de tu negocio
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={field.label}>
            <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5 block">
              {field.label}
            </label>
            <input
              type="text"
              defaultValue={field.value}
              className="w-full rounded-xl border border-input bg-white px-3 py-2 text-sm text-foreground transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-400"
            />
          </div>
        ))}
      </div>

      {/* Logo upload */}
      <div>
        <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5 block">
          Logo del concesionario
        </label>
        <div className="flex items-center justify-center rounded-2xl border-2 border-dashed border-border py-10 px-6 transition-all duration-150 hover:border-blue-400/40 hover:bg-muted/30 cursor-pointer">
          <div className="flex flex-col items-center gap-2 text-center">
            <Upload className="h-6 w-6 text-muted-foreground" />
            <p className="text-[13px] text-muted-foreground">
              Arrastra tu logo aquí
            </p>
            <p className="text-[11px] text-muted-foreground/60">
              PNG, JPG o SVG (max. 2MB)
            </p>
          </div>
        </div>
      </div>

      <Button className="text-[12px] rounded-xl transition-all duration-150">
        Guardar cambios
      </Button>
    </div>
  )
}

// ─── Tab 4: Suscripción ─────────────────────────────────

const invoices = [
  {
    id: 'inv-03',
    date: '01/03/2026',
    concept: 'AutoMulti PRO - Marzo 2026',
    amount: '99,00 EUR',
  },
  {
    id: 'inv-02',
    date: '01/02/2026',
    concept: 'AutoMulti PRO - Febrero 2026',
    amount: '99,00 EUR',
  },
  {
    id: 'inv-01',
    date: '01/01/2026',
    concept: 'AutoMulti PRO - Enero 2026',
    amount: '99,00 EUR',
  },
]

const planFeatures = [
  'Multipublicación a 5 portales',
  'IA generativa para descripciones',
  'Entrada por voz y OCR',
  'Soporte prioritario',
  'Onboarding personalizado',
]

function SuscripcionTab() {
  const totalPortalCost = getTotalMonthlyCost()

  return (
    <div className="space-y-6">
      {/* Plan card */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-700 to-slate-700 p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/70">
              Tu plan actual
            </p>
            <h3 className="font-heading text-2xl font-bold mt-1">
              AutoMulti PRO
            </h3>
            <p className="text-[13px] text-white/80 mt-2 max-w-sm">
              Gestión multipublicación completa con IA, CRM de leads y analítica
              avanzada por portal.
            </p>
            <ul className="mt-3 space-y-1">
              {planFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-[12px] text-white/90">
                  <CheckCircle2 className="h-3.5 w-3.5 text-white/70 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="text-right">
            <p className="font-heading text-3xl font-bold">99 EUR</p>
            <p className="text-[11px] text-white/70">/mes</p>
          </div>
        </div>
      </div>

      {/* Usage stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="card-surface rounded-2xl">
          <CardContent className="pt-1 text-center">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">
              Vehículos subidos
            </p>
            <p className="font-heading text-2xl font-bold mt-1">
              8{' '}
              <span className="text-[14px] text-muted-foreground font-normal">
                / 50
              </span>
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">16%</p>
            <div className="h-1.5 w-full rounded-full bg-muted mt-2 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: '16%' }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="card-surface rounded-2xl">
          <CardContent className="pt-1 text-center">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">
              Usuarios
            </p>
            <p className="font-heading text-2xl font-bold mt-1">
              3{' '}
              <span className="text-[14px] text-muted-foreground font-normal">
                / ilimitado
              </span>
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Sin límite
            </p>
            <div className="h-1.5 w-full rounded-full bg-muted mt-2 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                style={{ width: '100%' }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="card-surface rounded-2xl">
          <CardContent className="pt-1 text-center">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">
              Portales
            </p>
            <p className="font-heading text-2xl font-bold mt-1">
              5{' '}
              <span className="text-[14px] text-muted-foreground font-normal">
                / 6
              </span>
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">83%</p>
            <div className="h-1.5 w-full rounded-full bg-muted mt-2 overflow-hidden">
              <div
                className="h-full rounded-full bg-amber-500 transition-all duration-300"
                style={{ width: '83%' }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Total portal spend */}
      <div className="flex items-center justify-between rounded-lg border border-border bg-slate-50 px-4 py-3">
        <p className="text-[13px] font-medium text-slate-700">
          Gasto total en portales
        </p>
        <p className="text-[15px] font-bold text-slate-900">
          {totalPortalCost.toLocaleString('es-ES')}{' '}EUR/mes
        </p>
      </div>

      {/* Facturación */}
      <div className="space-y-3">
        <h3 className="font-heading text-[15px] font-semibold">Facturación</h3>
        <div className="card-surface rounded-2xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                  Fecha
                </TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                  Concepto
                </TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium text-right">
                  Importe
                </TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                  Estado
                </TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium w-10">
                  <span className="sr-only">Descargar</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="text-[12px] text-muted-foreground">
                    {invoice.date}
                  </TableCell>
                  <TableCell className="text-[13px] font-medium">
                    {invoice.concept}
                  </TableCell>
                  <TableCell className="text-[13px] font-medium text-right">
                    {invoice.amount}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                      Pagada
                    </span>
                  </TableCell>
                  <TableCell>
                    <button className="inline-flex items-center gap-1 text-[12px] text-blue-700 underline underline-offset-2 hover:text-blue-600 transition-all duration-150">
                      <Download className="h-3 w-3" />
                      Descargar
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Button variant="outline" className="text-[12px] rounded-xl transition-all duration-150">
        Cambiar plan
      </Button>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────

export function ConfigPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading text-xl font-bold tracking-tight">
          Configuración
        </h2>
        <p className="text-[13px] text-muted-foreground mt-0.5">
          Ajustes de tu cuenta y concesionario
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="portales">
        <TabsList variant="line">
          <TabsTrigger value="portales" className="font-bold">Portales</TabsTrigger>
          <TabsTrigger value="usuarios" className="font-bold">Usuarios</TabsTrigger>
          <TabsTrigger value="concesionario" className="font-bold">Concesionario</TabsTrigger>
          <TabsTrigger value="suscripcion" className="font-bold">Suscripción</TabsTrigger>
        </TabsList>

        <TabsContent value="portales" className="mt-6">
          <PortalesTab />
        </TabsContent>
        <TabsContent value="usuarios" className="mt-6">
          <UsuariosTab />
        </TabsContent>
        <TabsContent value="concesionario" className="mt-6">
          <ConcesionarioTab />
        </TabsContent>
        <TabsContent value="suscripcion" className="mt-6">
          <SuscripcionTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
