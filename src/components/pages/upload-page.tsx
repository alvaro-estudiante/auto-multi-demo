import { useState } from 'react'
import {
  Check,
  CheckCircle2,
  Mic,
  Camera,
  FileText,
  Globe,
  Sparkles,
  Plus,
  ArrowLeft,
  ArrowRight,
  Image,
  Video,
  Car,
  Bike,
  Truck,
  Search,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Section } from '@/App'

interface UploadPageProps {
  onNavigate: (section: Section) => void
}

const STEPS = [
  { id: 1, label: 'Tipo' },
  { id: 2, label: 'Portales' },
  { id: 3, label: 'Método' },
  { id: 4, label: 'Datos' },
  { id: 5, label: 'Fotos' },
  { id: 6, label: 'Confirmar' },
]

const PORTALS = [
  { id: 'cochesNet', name: 'Coches.net' },
  { id: 'wallapop', name: 'Wallapop Motor' },
  { id: 'milanuncios', name: 'Milanuncios' },
  { id: 'autoScout24', name: 'AutoScout24' },
  { id: 'autocasion', name: 'Autocasión' },
  { id: 'webPropia', name: 'Web propia' },
]

const EXTRAS = [
  'Navegación GPS',
  'Sensores aparcamiento',
  'Cámara trasera',
  'Climatizador bizona',
  'Asientos calefactados',
  'Asientos eléctricos',
  'Techo panorámico',
  'Apple CarPlay',
  'Android Auto',
  'Control crucero adaptativo',
  'Faros LED',
  'Llantas aleación',
  'Start/Stop',
  'Bluetooth',
  'Tapicería cuero',
  'Volante multifunción',
  'Keyless entry',
  'Head-up display',
  'Cargador inalámbrico',
  'Asistente cambio carril',
  'Frenada emergencia',
  'Portón eléctrico',
  'Retrovisores eléctricos',
  'Luces ambientales',
  'Sistema sonido premium',
]

const PRESELECTED_EXTRAS = new Set([
  'Navegación GPS',
  'Sensores aparcamiento',
  'Cámara trasera',
  'Climatizador bizona',
  'Asientos calefactados',
  'Asientos eléctricos',
  'Techo panorámico',
  'Apple CarPlay',
  'Android Auto',
  'Control crucero adaptativo',
  'Faros LED',
  'Llantas aleación',
  'Tapicería cuero',
  'Volante multifunción',
])

// ─── Progress Bar ────────────────────────────────────────

function ProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-8">
      {/* Desktop */}
      <div className="hidden sm:flex items-center justify-between relative">
        {/* Background line */}
        <div className="absolute left-0 right-0 top-4 h-0.5 bg-slate-200" />
        {/* Filled line */}
        <div
          className="absolute left-0 top-4 h-0.5 bg-blue-600 transition-all duration-200"
          style={{
            width: `${((currentStep) / (STEPS.length - 1)) * 100}%`,
          }}
        />

        {STEPS.map((step, i) => (
          <div key={step.id} className="relative flex flex-col items-center gap-1.5 z-10">
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-semibold transition-all duration-200',
                i < currentStep
                  ? 'bg-blue-600 text-white'
                  : i === currentStep
                    ? 'border-2 border-blue-600 bg-white text-blue-700'
                    : 'border-2 border-slate-200 bg-white text-slate-400'
              )}
            >
              {i < currentStep ? <Check className="h-4 w-4" /> : step.id}
            </div>
            <span
              className={cn(
                'text-[11px] font-medium',
                i <= currentStep ? 'text-slate-900' : 'text-slate-400'
              )}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* Mobile: simple bar */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] font-medium text-slate-700">
            Paso {currentStep + 1} de {STEPS.length}: {STEPS[currentStep].label}
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-200"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}

// ─── Step 1: Vehicle Type ────────────────────────────────

function Step1({ onSelect }: { onSelect: (type: string) => void }) {
  const vehicles = [
    { type: 'coche', icon: Car, label: 'Coche' },
    { type: 'moto', icon: Bike, label: 'Moto' },
    { type: 'furgoneta', icon: Truck, label: 'Furgoneta' },
  ]

  return (
    <div className="text-center">
      <h3 className="font-heading text-lg font-bold tracking-tight text-slate-900">
        ¿Qué quieres subir?
      </h3>
      <p className="text-[13px] text-slate-500 mt-1 mb-6">
        Selecciona el tipo de vehículo
      </p>
      <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
        {vehicles.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.type}
              onClick={() => onSelect(item.type)}
              className="flex flex-col items-center gap-3 card-surface rounded-2xl border-2 border-slate-200 p-6 transition-all duration-150 hover:border-blue-300 hover:bg-blue-50/30"
            >
              <Icon className="h-10 w-10 text-slate-500" />
              <span className="text-[13px] font-semibold text-slate-700">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Step 2: Portal Selection ────────────────────────────

function Step2() {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(PORTALS.map((p) => p.id))
  )

  const toggle = (id: string) => {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelected(next)
  }

  return (
    <div>
      <h3 className="font-heading text-lg font-bold tracking-tight text-center text-slate-900">
        ¿Dónde quieres publicar?
      </h3>
      <p className="text-[13px] text-slate-500 mt-1 mb-6 text-center">
        Selecciona los portales destino
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
        {PORTALS.map((portal) => {
          const isSelected = selected.has(portal.id)
          return (
            <button
              key={portal.id}
              onClick={() => toggle(portal.id)}
              className={cn(
                'flex items-center gap-2.5 rounded-2xl border-2 px-4 py-3 transition-all duration-150 text-left',
                isSelected
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              )}
            >
              <div
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all duration-150',
                  isSelected
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-300'
                )}
              >
                {isSelected && <Check className="h-3 w-3" />}
              </div>
              <div className="min-w-0 flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="text-[12px] font-medium text-slate-700">{portal.name}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Step 3: Input Method ────────────────────────────────

function Step3() {
  const [method, setMethod] = useState<'voice' | 'manual' | null>(null)
  const [recording, setRecording] = useState(false)

  const handleMicPress = () => {
    setRecording((prev) => !prev)
  }

  return (
    <div>
      <h3 className="font-heading text-lg font-bold tracking-tight text-center text-slate-900">
        ¿Cómo prefieres introducir los datos?
      </h3>
      <p className="text-[13px] text-slate-500 mt-1 mb-6 text-center">
        Elige tu método preferido
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
        {/* Option A: Voice + Photo (featured) */}
        <button
          onClick={() => setMethod('voice')}
          className={cn(
            'rounded-2xl border-2 p-5 text-left transition-all duration-150',
            method === 'voice'
              ? 'border-blue-400 bg-blue-50'
              : 'border-blue-200 bg-blue-50 hover:border-blue-300'
          )}
        >
          <div className="flex items-center gap-2 mb-2">
            <Mic className="h-5 w-5 text-blue-700" />
            <Camera className="h-5 w-5 text-blue-700" />
          </div>
          <p className="text-[14px] font-semibold text-slate-900">
            Por voz + foto ficha técnica
          </p>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Graba un audio y sube foto de la ficha técnica. La IA rellena todo
            automáticamente.
          </p>
        </button>

        {/* Option B: Manual */}
        <button
          onClick={() => {
            setMethod('manual')
            setRecording(false)
          }}
          className={cn(
            'rounded-2xl border-2 p-5 text-left transition-all duration-150',
            method === 'manual'
              ? 'border-slate-300 bg-slate-50'
              : 'border-slate-200 bg-slate-50 hover:border-slate-300'
          )}
        >
          <div className="mb-2">
            <FileText className="h-5 w-5 text-slate-500" />
          </div>
          <p className="text-[14px] font-semibold text-slate-900">
            Rellenar manualmente
          </p>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Introduce todos los datos del vehículo a mano.
          </p>
        </button>
      </div>

      {/* Voice + Camera capture zone */}
      {method === 'voice' && (
        <div className="mt-6 max-w-lg mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-6 rounded-lg border-2 border-dashed border-blue-200 bg-blue-50/50 p-6">
            {/* Mic button */}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={handleMicPress}
                className={cn(
                  'relative flex h-20 w-20 items-center justify-center rounded-full transition-all duration-200',
                  recording
                    ? 'bg-blue-700 text-white'
                    : 'bg-blue-700 text-white hover:bg-blue-800 active:scale-95'
                )}
              >
                {recording && (
                  <>
                    <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-30" />
                    <span className="absolute -inset-1.5 rounded-full border-2 border-blue-400 animate-pulse" />
                  </>
                )}
                <Mic className="h-8 w-8 relative z-10" />
              </button>
              <span className="text-[11px] font-medium text-blue-800">
                {recording ? 'Grabando...' : 'Mantén pulsado para grabar'}
              </span>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-16 bg-blue-200" />
            <div className="sm:hidden h-px w-full bg-blue-200" />

            {/* Camera upload zone */}
            <div className="flex-1 w-full">
              <div className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-blue-200 bg-white/60 p-4 transition-all duration-150 hover:border-blue-300 cursor-pointer">
                <Camera className="h-6 w-6 text-blue-400" />
                <span className="text-[12px] font-medium text-blue-800">
                  Foto ficha técnica
                </span>
                <span className="text-[11px] text-slate-500">
                  Arrastra o haz click
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Step 4: Vehicle Data Form ───────────────────────────

interface FieldDef {
  label: string
  value: string
  type?: 'text' | 'select'
  options?: string[]
  empty?: boolean
}

interface FieldGroupDef {
  title: string
  fields: FieldDef[]
}

const FIELD_GROUPS_BEFORE_SEARCH: FieldGroupDef[] = [
  {
    title: 'Datos básicos',
    fields: [
      { label: 'Marca', value: '' },
      { label: 'Modelo', value: '' },
      { label: 'Versión / Acabado', value: '' },
      { label: 'Año', value: '' },
      {
        label: 'Combustible',
        value: '',
        type: 'select',
        options: ['', 'Gasolina', 'Diésel', 'Híbrido', 'Eléctrico', 'GLP', 'GNC'],
      },
      {
        label: 'Cambio',
        value: '',
        type: 'select',
        options: ['', 'Manual', 'Automático'],
      },
      { label: 'Color exterior', value: '' },
      { label: 'Color interior', value: '' },
    ],
  },
  {
    title: 'Motor',
    fields: [
      { label: 'Cilindrada', value: '' },
      { label: 'Potencia CV', value: '' },
      { label: 'Potencia kW', value: '' },
      { label: 'Emisiones CO2', value: '' },
      {
        label: 'Etiqueta ambiental',
        value: '',
        type: 'select',
        options: ['', '0 Emisiones', 'ECO', 'C', 'B', 'Sin etiqueta'],
      },
      {
        label: 'Tracción',
        value: '',
        type: 'select',
        options: ['', 'Delantera', 'Trasera', 'Total (AWD)'],
      },
    ],
  },
  {
    title: 'Identificación',
    fields: [
      { label: 'Matrícula', value: '' },
      { label: 'Nº bastidor VIN', value: '' },
      { label: 'Fecha ITV', value: '' },
      { label: 'Nº propietarios anteriores', value: '' },
    ],
  },
  {
    title: 'Estado y precio',
    fields: [
      { label: 'Kilómetros', value: '' },
      { label: 'Precio venta', value: '' },
      { label: 'Precio compra', value: '' },
      {
        label: 'Garantía',
        value: '',
        type: 'select',
        options: ['', 'Sin garantía', '3 meses', '6 meses', '12 meses', '24 meses'],
      },
    ],
  },
]

function buildFieldGroupsAfterSearch(matricula: string): FieldGroupDef[] {
  return [
    {
      title: 'Datos básicos',
      fields: [
        { label: 'Marca', value: 'BMW' },
        { label: 'Modelo', value: 'Serie 3 320d' },
        { label: 'Versión / Acabado', value: 'M Sport' },
        { label: 'Año', value: '2021' },
        {
          label: 'Combustible',
          value: 'Diésel',
          type: 'select',
          options: ['Gasolina', 'Diésel', 'Híbrido', 'Eléctrico', 'GLP', 'GNC'],
        },
        {
          label: 'Cambio',
          value: 'Automático',
          type: 'select',
          options: ['Manual', 'Automático'],
        },
        { label: 'Color exterior', value: 'Gris Mineral' },
        { label: 'Color interior', value: 'Negro Dakota' },
      ],
    },
    {
      title: 'Motor',
      fields: [
        { label: 'Cilindrada', value: '1995 cc' },
        { label: 'Potencia CV', value: '190' },
        { label: 'Potencia kW', value: '140' },
        { label: 'Emisiones CO2', value: '119 g/km' },
        {
          label: 'Etiqueta ambiental',
          value: 'C',
          type: 'select',
          options: ['0 Emisiones', 'ECO', 'C', 'B', 'Sin etiqueta'],
        },
        {
          label: 'Tracción',
          value: 'Trasera',
          type: 'select',
          options: ['Delantera', 'Trasera', 'Total (AWD)'],
        },
      ],
    },
    {
      title: 'Identificación',
      fields: [
        { label: 'Matrícula', value: matricula.toUpperCase() },
        { label: 'Nº bastidor VIN', value: 'WBAPK5100MA123456' },
        { label: 'Fecha ITV', value: '15/06/2027' },
        { label: 'Nº propietarios anteriores', value: '1' },
      ],
    },
    {
      title: 'Estado y precio',
      fields: [
        { label: 'Kilómetros', value: '', empty: true },
        { label: 'Precio venta', value: '', empty: true },
        { label: 'Precio compra', value: '', empty: true },
        {
          label: 'Garantía',
          value: '',
          type: 'select',
          options: ['', 'Sin garantía', '3 meses', '6 meses', '12 meses', '24 meses'],
          empty: true,
        },
      ],
    },
  ]
}

function Step4() {
  const [matriculaInput, setMatriculaInput] = useState('')
  const [searchState, setSearchState] = useState<'idle' | 'loading' | 'success'>('idle')
  const [searchedMatricula, setSearchedMatricula] = useState('')
  const [selectedExtras, setSelectedExtras] = useState<Set<string>>(new Set())

  const fieldGroups = searchState === 'success'
    ? buildFieldGroupsAfterSearch(searchedMatricula)
    : FIELD_GROUPS_BEFORE_SEARCH

  const handleSearch = () => {
    const trimmed = matriculaInput.trim()
    if (!trimmed) return
    setSearchState('loading')
    setTimeout(() => {
      setSearchedMatricula(trimmed)
      setSearchState('success')
      setSelectedExtras(new Set(PRESELECTED_EXTRAS))
    }, 1200)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
  }

  const toggleExtra = (extra: string) => {
    const next = new Set(selectedExtras)
    if (next.has(extra)) next.delete(extra)
    else next.add(extra)
    setSelectedExtras(next)
  }

  const isFieldEmpty = (field: FieldDef): boolean => {
    if (field.empty) return true
    return !field.value
  }

  const isFieldFilled = (field: FieldDef): boolean => {
    return !!field.value && !field.empty
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h3 className="font-heading text-lg font-bold tracking-tight text-slate-900">Datos del vehículo</h3>
          <p className="text-[13px] text-slate-500 mt-0.5">
            {searchState === 'success'
              ? 'Datos pre-rellenados por Eurotax — revisa y corrige si es necesario'
              : 'Introduce la matrícula para rellenar la ficha automáticamente'}
          </p>
        </div>
      </div>

      {/* Matrícula autocompletado block */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Search className="h-4 w-4 text-blue-700" />
          <span className="text-[14px] font-semibold text-slate-900">
            Rellena la ficha automáticamente
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-1.5 block">
              Matrícula
            </label>
            <input
              type="text"
              value={matriculaInput}
              onChange={(e) => setMatriculaInput(e.target.value.toUpperCase())}
              onKeyDown={handleKeyDown}
              placeholder="Ej: 4521 KMN"
              className="w-full h-11 rounded-xl border border-slate-200 bg-white px-4 text-lg uppercase tracking-wider text-slate-900 placeholder:text-slate-300 placeholder:normal-case placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300"
              disabled={searchState === 'loading'}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={searchState === 'loading' || !matriculaInput.trim()}
              className={cn(
                'h-11 px-5 rounded-xl text-[13px] font-semibold text-white transition-all duration-150 flex items-center gap-2 whitespace-nowrap',
                searchState === 'loading'
                  ? 'bg-blue-400 cursor-wait'
                  : 'bg-blue-700 hover:bg-blue-800 active:scale-[0.98] disabled:bg-blue-300 disabled:cursor-not-allowed'
              )}
            >
              {searchState === 'loading' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Buscando...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Buscar datos
                </>
              )}
            </button>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
          Conectado con Eurotax — El 99% de los vehículos se identifican automáticamente por matrícula
        </p>
      </div>

      {/* Success banner */}
      {searchState === 'success' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 mb-6 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-[13px] font-semibold text-emerald-800">
              Datos encontrados para matrícula {searchedMatricula.toUpperCase()}
            </p>
            <p className="text-[12px] text-emerald-600 mt-0.5">
              15 campos rellenados automáticamente vía Eurotax
            </p>
          </div>
        </div>
      )}

      {/* Field groups */}
      <div className="space-y-6">
        {fieldGroups.map((group) => (
          <div key={group.title}>
            <h4 className="text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-3">
              {group.title}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.fields.map((field) => {
                const empty = isFieldEmpty(field)
                const filled = isFieldFilled(field)
                const showBorderIndicator = searchState === 'success'
                return (
                  <div key={field.label}>
                    <label className="text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-1.5 block">
                      {field.label}
                    </label>
                    {field.type === 'select' ? (
                      <select
                        defaultValue={field.value}
                        className={cn(
                          'w-full rounded-xl border bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 appearance-none',
                          showBorderIndicator && 'border-l-[3px]',
                          showBorderIndicator && empty && 'border-l-amber-400 border-amber-200 bg-amber-50/30',
                          showBorderIndicator && filled && 'border-l-blue-400 border-slate-200',
                          !showBorderIndicator && 'border-slate-200'
                        )}
                      >
                        {field.options?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt || 'Seleccionar...'}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        defaultValue={field.value}
                        placeholder={empty ? 'Pendiente...' : ''}
                        className={cn(
                          'w-full rounded-xl border bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30',
                          showBorderIndicator && 'border-l-[3px]',
                          showBorderIndicator && empty && 'border-l-amber-400 border-amber-200 bg-amber-50/30',
                          showBorderIndicator && filled && 'border-l-blue-400 border-slate-200',
                          !showBorderIndicator && 'border-slate-200'
                        )}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Extras chips */}
      <div className="mt-6">
        <h4 className="text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-3">
          Extras
        </h4>
        <div className="flex flex-wrap gap-2">
          {EXTRAS.map((extra) => {
            const isSelected = selectedExtras.has(extra)
            return (
              <button
                key={extra}
                onClick={() => toggleExtra(extra)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[12px] font-medium transition-all duration-150',
                  isSelected
                    ? 'bg-blue-100 text-blue-900 border-blue-300'
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300'
                )}
              >
                {isSelected && <Check className="h-3 w-3" />}
                {extra}
              </button>
            )
          })}
        </div>
      </div>

      {/* Description textarea */}
      <div className="mt-6">
        <label className="text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-1.5 block">
          Descripción
        </label>
        <textarea
          rows={4}
          defaultValue={searchState === 'success'
            ? 'BMW Serie 3 320d en perfecto estado. Paquete M Sport, navegación profesional, asientos calefactados. Único propietario, mantenimiento oficial BMW. Libro de revisiones completo.'
            : ''}
          placeholder={searchState !== 'success' ? 'Describe el vehículo...' : ''}
          className={cn(
            'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none',
            searchState === 'success' && 'border-l-[3px] border-l-blue-400'
          )}
        />
        <div className="flex items-center gap-2 mt-2">
          <button className="flex items-center gap-1.5 rounded-md bg-blue-50 border border-blue-200 px-3 py-1.5 text-[11px] font-medium text-blue-800 transition-all duration-150 hover:bg-blue-100">
            <Sparkles className="h-3 w-3" />
            Generar con IA
          </button>
          <button className="flex items-center gap-1.5 rounded-md bg-blue-50 border border-blue-200 px-3 py-1.5 text-[11px] font-medium text-blue-800 transition-all duration-150 hover:bg-blue-100">
            <Sparkles className="h-3 w-3" />
            Mejorar con IA
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Step 5: Photos ──────────────────────────────────────

function Step5() {
  return (
    <div>
      <h3 className="font-heading text-lg font-bold tracking-tight text-slate-900">Fotos y vídeo</h3>
      <p className="text-[13px] text-slate-500 mt-0.5 mb-6">
        Máximo 20 fotos + 1 vídeo. Se comprimen automáticamente.
      </p>

      {/* Photo grid 3x2 */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex aspect-square items-center justify-center rounded-lg bg-slate-100 border border-slate-200"
          >
            <Image className="h-6 w-6 text-slate-300" />
          </div>
        ))}
        {[1, 2].map((i) => (
          <button
            key={`add-${i}`}
            className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-white transition-all duration-150 hover:border-blue-300 hover:bg-blue-50/30"
          >
            <Plus className="h-5 w-5 text-slate-400" />
          </button>
        ))}
      </div>

      {/* Photo progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[12px] text-slate-500 flex items-center gap-1.5">
            <Image className="h-3.5 w-3.5" />
            4 / 20 fotos
          </span>
        </div>
        <div className="h-1 w-full rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-200"
            style={{ width: '20%' }}
          />
        </div>
      </div>

      {/* Video zone */}
      <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center mb-4">
        <Video className="h-8 w-8 text-slate-300 mx-auto mb-3" />
        <p className="text-[13px] font-medium text-slate-700">
          Arrastra un vídeo aquí
        </p>
        <p className="text-[11px] text-slate-500 mt-1">
          Compresión automática vía Cloudinary
        </p>
      </div>

      {/* Info note */}
      <p className="text-[11px] text-slate-400 leading-relaxed">
        Las fotos se reordenan arrastrando. La primera foto es la portada del
        anuncio.
      </p>
    </div>
  )
}

// ─── Step 6: Confirm ─────────────────────────────────────

function Step6({ onPublish }: { onPublish: () => void }) {
  const portalCount = 5

  return (
    <div className="text-center py-8">
      <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-6" />

      <h3 className="font-heading text-xl font-bold tracking-tight text-slate-900 mb-2">
        Todo listo para publicar
      </h3>
      <p className="text-[13px] text-slate-500 mb-6">
        Revisa el resumen antes de publicar
      </p>

      <div className="max-w-sm mx-auto space-y-3 text-left mb-8">
        <div className="flex justify-between py-2 border-b border-slate-200">
          <span className="text-[12px] text-slate-500">Vehículo</span>
          <span className="text-[12px] font-medium text-slate-900">BMW Serie 3 320d M Sport</span>
        </div>
        <div className="flex justify-between py-2 border-b border-slate-200">
          <span className="text-[12px] text-slate-500">Precio</span>
          <span className="text-[12px] font-medium text-slate-900">28.900 €</span>
        </div>
        <div className="flex justify-between py-2 border-b border-slate-200">
          <span className="text-[12px] text-slate-500">Kilómetros</span>
          <span className="text-[12px] font-medium text-slate-900">45.000 km</span>
        </div>
        <div className="flex justify-between py-2 border-b border-slate-200">
          <span className="text-[12px] text-slate-500">Combustible</span>
          <span className="text-[12px] font-medium text-slate-900">Diésel</span>
        </div>
        <div className="flex justify-between py-2 border-b border-slate-200">
          <span className="text-[12px] text-slate-500">Fotos</span>
          <span className="text-[12px] font-medium text-slate-900">4 fotos</span>
        </div>
        <div className="py-2">
          <span className="text-[12px] text-slate-500 block mb-2">
            Portales destino
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PORTALS.slice(0, portalCount).map((p) => (
              <span
                key={p.id}
                className="inline-flex items-center gap-1 rounded-md bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[11px] font-medium text-blue-800"
              >
                {p.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <Button
        onClick={onPublish}
        size="lg"
        className="bg-blue-700 hover:bg-blue-800 text-white text-[14px] px-8 rounded-xl transition-all duration-150"
      >
        Publicar en {portalCount} portales
      </Button>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────

export function UploadPage({ onNavigate }: UploadPageProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [published, setPublished] = useState(false)

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep((s) => s + 1)
  }

  const handleBack = () => {
    if (currentStep === 0) {
      onNavigate('dashboard')
    } else {
      setCurrentStep((s) => s - 1)
    }
  }

  const handlePublish = () => {
    setPublished(true)
    setTimeout(() => onNavigate('vehiculos'), 1500)
  }

  if (published) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
        <h3 className="font-heading text-xl font-bold tracking-tight text-emerald-700">
          Publicado con éxito
        </h3>
        <p className="text-[13px] text-slate-500 mt-1">
          Redirigiendo a vehículos...
        </p>
      </div>
    )
  }

  const isStep1 = currentStep === 0
  const isLastStep = currentStep === STEPS.length - 1

  return (
    <div className="max-w-3xl mx-auto">
      <ProgressBar currentStep={currentStep} />

      {/* Step content */}
      <div className="pb-24">
        {currentStep === 0 && <Step1 onSelect={() => handleNext()} />}
        {currentStep === 1 && <Step2 />}
        {currentStep === 2 && <Step3 />}
        {currentStep === 3 && <Step4 />}
        {currentStep === 4 && <Step5 />}
        {currentStep === 5 && <Step6 onPublish={handlePublish} />}
      </div>

      {/* Navigation footer - fixed at bottom */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 md:left-[var(--sidebar-width)] bg-white/80 backdrop-blur-md border-t border-slate-200 py-3 px-4 sm:px-6 z-40">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="text-slate-500 rounded-xl transition-all duration-150"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            {isStep1 ? 'Cancelar' : 'Atrás'}
          </Button>

          {!isLastStep && (
            <Button
              onClick={handleNext}
              className="bg-blue-700 hover:bg-blue-800 text-white rounded-xl transition-all duration-150"
            >
              Siguiente
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
