Lee el CLAUDE.md de este proyecto.

Lee estos archivos del vault ANTES de empezar — son OBLIGATORIOS:
- C:/Users/Alvaro/workspace/obsidian/Flama-Vault/Proyectos/multiplicador-vehiculos/08-investigacion-competitiva-profunda.md (COMPLETO — investigación de DealCar, Inventario.pro, Walcu, Coches.net PRO)
- C:/Users/Alvaro/workspace/obsidian/Flama-Vault/Proyectos/multiplicador-vehiculos/07-modulos-panel.md (módulos definidos del panel)
- C:/Users/Alvaro/workspace/obsidian/Flama-Vault/04-Reglas-Proyecto/reglas-anti-dribbble.md (reglas de diseño)

Lee también el estado actual de estos archivos del proyecto para saber qué existe:
- src/data/mock-data.ts (interfaces + datos actuales)
- src/components/pages/dashboard-page.tsx
- src/components/pages/vehicles-page.tsx
- src/components/pages/upload-page.tsx
- src/components/pages/leads-page.tsx
- src/components/pages/reports-page.tsx
- src/components/pages/config-page.tsx
- src/components/layout/app-sidebar.tsx
- src/components/layout/mobile-nav.tsx

---

# MEGA PROMPT: Fix encoding + Nuevas funcionalidades competitivas + Ajuste diseño

CONTEXTO: Estamos construyendo una demo de AutoMulti, un panel de multipublicación de vehículos para concesionarios en España. Nuestro cliente piloto es Paco Núñez Motor (Málaga). La demo se va a enseñar a Paco y luego a Coches.net para pedirles acceso a su API. Tiene que verse como un producto SaaS premium a la altura de DealCar (dealcar.io) o Inventario.pro.

Hemos investigado a fondo a los competidores y hemos encontrado features CLAVE que TODOS tienen y nosotros no. Sin estas features, la demo parecerá incompleta ante cualquier profesional del sector. Este prompt añade esas features.

IMPORTANTE SOBRE ENCODING: Claude Code en iteraciones anteriores escribió caracteres españoles como secuencias Unicode literales (\u00ed en vez de í, \u20AC en vez de €, etc.). En TODOS los strings que escribas, usa SIEMPRE caracteres UTF-8 directos. NUNCA uses secuencias de escape Unicode. Escribe "vehículo" NO "veh\u00edculo". Escribe "€" NO "\u20AC". Escribe "ñ" NO "\u00f1".

---

## PARTE 0: FIX DE ENCODING (HACER ANTES DE TODO LO DEMÁS)

Ejecuta estos comandos para arreglar TODOS los escapes Unicode que hay actualmente en el proyecto:

```bash
cd "C:/Users/Alvaro/workspace/auto-multi-demo"

# Ver qué archivos están afectados
grep -rn '\\u00\|\\u20' src/ --include="*.tsx" --include="*.ts"

# Reemplazar TODOS los escapes del español y símbolo €
find src/ -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/\\u00ed/í/g'
find src/ -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/\\u00f3/ó/g'
find src/ -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/\\u00e9/é/g'
find src/ -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/\\u00e1/á/g'
find src/ -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/\\u00fa/ú/g'
find src/ -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/\\u00f1/ñ/g'
find src/ -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/\\u00cd/Í/g'
find src/ -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/\\u00d3/Ó/g'
find src/ -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/\\u00c9/É/g'
find src/ -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/\\u00c1/Á/g'
find src/ -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/\\u00da/Ú/g'
find src/ -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/\\u00d1/Ñ/g'
find src/ -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/\\u20AC/€/g'
find src/ -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/\\u00ba/º/g'
find src/ -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/\\u00aa/ª/g'

# Verificar que no quedan escapes
grep -rn '\\u00\|\\u20' src/ --include="*.tsx" --include="*.ts"
```

Si grep aún encuentra escapes, arreglar manualmente leyendo el archivo y editando.
Verificar: npx tsc -b --noEmit (debe dar 0 errores tras el fix de encoding)

---

## PARTE 1: ACTUALIZAR MOCK-DATA (src/data/mock-data.ts)

Este es el cambio más grande. Hay que ampliar significativamente los datos para que cada vehículo tenga toda la información que un concesionario real espera ver. Los competidores (DealCar, Inventario.pro, Coches.net PRO) todos muestran: matrícula, bastidor VIN, datos técnicos completos, extras del vehículo, documentación adjunta, precio de compra vs precio de venta (margen), precio de mercado (Eurotax), días en stock, estado (publicado/reservado/vendido), historial de precios.

### 1.1 Nuevos types e interfaces

Añadir ANTES de las interfaces existentes:

```ts
export type VehicleStatus = 'publicado' | 'reservado' | 'vendido'

export interface VehicleDocument {
  id: string
  name: string
  type: 'itv' | 'contrato' | 'informe' | 'garantia' | 'otro'
  date: string
}

export interface PriceChange {
  date: string
  oldPrice: number
  newPrice: number
  reason?: string
}
```

### 1.2 Ampliar el interface Vehicle

Añadir estos campos al interface Vehicle existente (NO borrar los existentes):

```ts
export interface Vehicle {
  // --- CAMPOS EXISTENTES (no tocar) ---
  id: string
  brand: string
  model: string
  year: number
  price: number
  km: number
  fuel: 'Gasolina' | 'Diésel' | 'Híbrido' | 'Eléctrico'
  color: string
  image: string
  description: string
  portalStatus: Record<string, PortalStatus>
  leads: number
  views: number
  createdAt: string

  // --- CAMPOS NUEVOS ---
  status: VehicleStatus
  matricula: string
  vin: string
  potencia: number               // CV
  potenciaKw: number             // kW
  cilindrada: number             // cc
  cambio: 'Manual' | 'Automático'
  puertas: number
  plazas: number
  etiquetaAmbiental: 'C' | 'B' | 'ECO' | '0' | 'Sin etiqueta'
  traccion: 'Delantera' | 'Trasera' | 'Total'
  garantia: 'Sin garantía' | '3 meses' | '6 meses' | '12 meses' | '24 meses'
  precioCompra: number
  precioAnterior?: number
  precioMercado: number
  propietariosAnteriores: number
  fechaItv: string
  colorInterior: string
  version: string                // Acabado/versión: "M Sport", "S-Line", "AMG Line", etc.
  extras: string[]
  documentos: VehicleDocument[]
  historialPrecios: PriceChange[]
}
```

### 1.3 Actualizar CADA vehículo con datos realistas

Para CADA uno de los 8 vehículos existentes, añadir TODOS los campos nuevos con datos coherentes y realistas. Aquí los datos EXACTOS para cada coche:

**v1 — BMW Serie 3 320d (2021)**
status: 'publicado', matricula: '4521 KMN', vin: 'WBAPK5C55BA952631', potencia: 190, potenciaKw: 140, cilindrada: 1995, cambio: 'Automático', puertas: 4, plazas: 5, etiquetaAmbiental: 'C', traccion: 'Trasera', garantia: '12 meses', precioCompra: 23500, precioAnterior: 30900, precioMercado: 29200, propietariosAnteriores: 1, fechaItv: '2027-02-15', colorInterior: 'Negro Dakota', version: 'M Sport',
extras: ['Navegación GPS', 'Sensores aparcamiento', 'Cámara trasera', 'Climatizador bizona', 'Apple CarPlay', 'Android Auto', 'Faros LED', 'Llantas aleación 18"', 'Asientos calefactados', 'Tapicería cuero', 'Control crucero adaptativo', 'Start/Stop', 'Volante multifunción'],
documentos: [
  { id: 'd1', name: 'ITV vigente', type: 'itv', date: '2025-02-15' },
  { id: 'd2', name: 'Contrato de compra', type: 'contrato', date: '2026-02-10' },
  { id: 'd3', name: 'Informe CARFAX', type: 'informe', date: '2026-02-12' },
],
historialPrecios: [
  { date: '2026-02-15', oldPrice: 30900, newPrice: 29900, reason: 'Ajuste de mercado' },
  { date: '2026-03-10', oldPrice: 29900, newPrice: 28900, reason: 'Reducción por rotación' },
]

**v2 — Audi A4 Avant 2.0 TDI (2020)**
status: 'publicado', matricula: '7834 HLS', vin: 'WAUZZZ8K5BA012345', potencia: 150, potenciaKw: 110, cilindrada: 1968, cambio: 'Automático', puertas: 5, plazas: 5, etiquetaAmbiental: 'C', traccion: 'Delantera', garantia: '6 meses', precioCompra: 19800, precioAnterior: undefined, precioMercado: 25100, propietariosAnteriores: 2, fechaItv: '2026-11-20', colorInterior: 'Negro Alcantara', version: 'S-Line',
extras: ['Navegación GPS', 'Techo panorámico', 'Cámara trasera 360°', 'Climatizador bizona', 'Apple CarPlay', 'Faros LED Matrix', 'Llantas aleación 19"', 'Asientos eléctricos', 'Control crucero adaptativo', 'Arranque sin llave', 'Head-up display'],
documentos: [
  { id: 'd4', name: 'ITV vigente', type: 'itv', date: '2025-11-20' },
  { id: 'd5', name: 'Contrato de compra', type: 'contrato', date: '2026-02-18' },
],
historialPrecios: []

**v3 — Mercedes-Benz Clase C 200 (2022)** — ESTE SERÁ RESERVADO
status: 'reservado', matricula: '1298 JTR', vin: 'WDD2050091A123456', potencia: 204, potenciaKw: 150, cilindrada: 1496, cambio: 'Automático', puertas: 4, plazas: 5, etiquetaAmbiental: 'C', traccion: 'Trasera', garantia: '24 meses', precioCompra: 28500, precioAnterior: 36900, precioMercado: 34500, propietariosAnteriores: 1, fechaItv: '2028-01-10', colorInterior: 'Beige Silk', version: 'AMG Line',
extras: ['Navegación GPS', 'MBUX 11.9"', 'Conducción semi-autónoma', 'Digital Light', 'Climatizador automático', 'Apple CarPlay', 'Android Auto', 'Cámara trasera', 'Sensores aparcamiento', 'Asientos calefactados', 'Tapicería cuero Artico', 'Llantas AMG 18"', 'Volante multifunción', 'Bluetooth'],
documentos: [
  { id: 'd6', name: 'ITV vigente', type: 'itv', date: '2026-01-10' },
  { id: 'd7', name: 'Contrato de compra', type: 'contrato', date: '2026-01-05' },
  { id: 'd8', name: 'Informe CARFAX', type: 'informe', date: '2026-01-06' },
  { id: 'd9', name: 'Garantía Mercedes-Benz', type: 'garantia', date: '2026-01-05' },
],
historialPrecios: [
  { date: '2026-01-15', oldPrice: 36900, newPrice: 34900, reason: 'Ajuste competitivo' },
]

**v4 — Volkswagen Golf 8 GTI (2023)**
status: 'publicado', matricula: '9012 MPK', vin: 'WVWZZZ1KZPM012345', potencia: 245, potenciaKw: 180, cilindrada: 1984, cambio: 'Automático', puertas: 5, plazas: 5, etiquetaAmbiental: 'C', traccion: 'Delantera', garantia: '12 meses', precioCompra: 32000, precioAnterior: undefined, precioMercado: 37800, propietariosAnteriores: 1, fechaItv: '2027-03-01', colorInterior: 'Negro/Rojo Clark', version: 'Performance',
extras: ['Navegación Discover Pro', 'Diferencial XDS', 'Cuadro Digital Cockpit Pro', 'Climatizador bizona', 'Apple CarPlay', 'Android Auto', 'Faros LED IQ.Light', 'Llantas aleación 19"', 'Asientos deportivos', 'Control crucero adaptativo', 'Start/Stop', 'USB-C', 'Bluetooth', 'ESP deportivo'],
documentos: [
  { id: 'd10', name: 'ITV vigente', type: 'itv', date: '2027-03-01' },
  { id: 'd11', name: 'Contrato de compra', type: 'contrato', date: '2026-02-25' },
  { id: 'd12', name: 'Garantía Volkswagen', type: 'garantia', date: '2026-02-25' },
],
historialPrecios: []

**v5 — SEAT León FR 1.5 TSI (2022)**
status: 'publicado', matricula: '5643 LFN', vin: 'VSSZZZKL7NR012345', potencia: 150, potenciaKw: 110, cilindrada: 1498, cambio: 'Manual', puertas: 5, plazas: 5, etiquetaAmbiental: 'C', traccion: 'Delantera', garantia: '6 meses', precioCompra: 17200, precioAnterior: 22900, precioMercado: 21500, propietariosAnteriores: 1, fechaItv: '2026-09-05', colorInterior: 'Negro Dinamica', version: 'FR',
extras: ['Virtual Cockpit', 'Navegación GPS', 'Cámara trasera', 'Sensores aparcamiento', 'Climatizador automático', 'Bluetooth', 'USB', 'Llantas aleación 17"', 'Control crucero', 'ABS', 'ESP', 'Airbags laterales'],
documentos: [
  { id: 'd13', name: 'ITV vigente', type: 'itv', date: '2025-09-05' },
  { id: 'd14', name: 'Contrato de compra', type: 'contrato', date: '2026-03-02' },
],
historialPrecios: [
  { date: '2026-03-20', oldPrice: 22900, newPrice: 21900, reason: 'Reducción por rotación' },
]

**v6 — Toyota Corolla Hybrid 180H (2023)**
status: 'publicado', matricula: '3187 KRT', vin: 'SB1K23BE30E012345', potencia: 140, potenciaKw: 103, cilindrada: 1798, cambio: 'Automático', puertas: 5, plazas: 5, etiquetaAmbiental: 'ECO', traccion: 'Delantera', garantia: '24 meses', precioCompra: 22000, precioAnterior: undefined, precioMercado: 27200, propietariosAnteriores: 1, fechaItv: '2027-02-28', colorInterior: 'Negro Tela', version: 'Style Plus',
extras: ['Safety Sense 3.0', 'Head-up display', 'JBL Premium Audio', 'Navegación GPS', 'Apple CarPlay', 'Android Auto', 'Climatizador bizona', 'Sensores aparcamiento', 'Cámara trasera', 'Control crucero adaptativo', 'Start/Stop', 'Bluetooth', 'Llantas aleación 17"', 'Faros LED'],
documentos: [
  { id: 'd15', name: 'ITV vigente', type: 'itv', date: '2027-02-28' },
  { id: 'd16', name: 'Contrato de compra', type: 'contrato', date: '2026-02-20' },
  { id: 'd17', name: 'Garantía Toyota', type: 'garantia', date: '2026-02-20' },
],
historialPrecios: []

**v7 — Peugeot 3008 GT Pack (2021)**
status: 'publicado', matricula: '8456 HSM', vin: 'VF3MCYHZRML012345', potencia: 180, potenciaKw: 132, cilindrada: 1499, cambio: 'Automático', puertas: 5, plazas: 5, etiquetaAmbiental: 'C', traccion: 'Delantera', garantia: '6 meses', precioCompra: 24500, precioAnterior: 31900, precioMercado: 30500, propietariosAnteriores: 1, fechaItv: '2027-03-10', colorInterior: 'Negro Alcantara', version: 'GT Pack',
extras: ['i-Cockpit amplificado', 'Night Vision', 'Grip Control', 'Climatizador bizona', 'Navegación GPS 3D', 'Apple CarPlay', 'Cámara trasera 360°', 'Sensores aparcamiento', 'Techo panorámico', 'Asientos eléctricos', 'Faros LED', 'Llantas aleación 19"', 'Arranque sin llave', 'Start/Stop'],
documentos: [
  { id: 'd18', name: 'ITV vigente', type: 'itv', date: '2025-03-10' },
  { id: 'd19', name: 'Contrato de compra', type: 'contrato', date: '2026-03-08' },
],
historialPrecios: [
  { date: '2026-03-15', oldPrice: 31900, newPrice: 29900, reason: 'Ajuste de mercado' },
]

**v8 — Ford Focus ST-Line 1.0 EcoBoost (2022)** — ESTE SERÁ VENDIDO
status: 'vendido', matricula: '2765 JWR', vin: 'WF0XXXGCDXNY12345', potencia: 125, potenciaKw: 92, cilindrada: 999, cambio: 'Manual', puertas: 5, plazas: 5, etiquetaAmbiental: 'C', traccion: 'Delantera', garantia: '3 meses', precioCompra: 15200, precioAnterior: 20900, precioMercado: 19500, propietariosAnteriores: 2, fechaItv: '2026-12-15', colorInterior: 'Negro Tela', version: 'ST-Line',
extras: ['SYNC 3', 'Navegación GPS', 'Llantas aleación 18"', 'Suspensión deportiva', 'Climatizador automático', 'Bluetooth', 'USB', 'Sensores aparcamiento traseros', 'Control crucero', 'ABS', 'ESP', 'Faros LED'],
documentos: [
  { id: 'd20', name: 'ITV vigente', type: 'itv', date: '2025-12-15' },
  { id: 'd21', name: 'Contrato de compra', type: 'contrato', date: '2026-03-12' },
  { id: 'd22', name: 'Contrato de venta', type: 'contrato', date: '2026-03-25' },
],
historialPrecios: [
  { date: '2026-03-18', oldPrice: 20900, newPrice: 19900, reason: 'Negociación con comprador' },
]

### 1.4 Nuevas funciones helper

Añadir estas funciones al final de mock-data.ts:

```ts
// Calcular días en stock de un vehículo
export function getDaysInStock(createdAt: string): number {
  return Math.floor((new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24))
}

// Media de días en stock de vehículos publicados
export function getAvgDaysInStock(): number {
  const published = vehicles.filter(v => v.status === 'publicado')
  if (published.length === 0) return 0
  return Math.round(published.reduce((acc, v) => acc + getDaysInStock(v.createdAt), 0) / published.length)
}

// Conteo por estado
export function getVehiclesByStatus() {
  return {
    publicado: vehicles.filter(v => v.status === 'publicado').length,
    reservado: vehicles.filter(v => v.status === 'reservado').length,
    vendido: vehicles.filter(v => v.status === 'vendido').length,
  }
}

// Margen medio de vehículos vendidos
export function getAvgMargin(): number {
  const sold = vehicles.filter(v => v.status === 'vendido')
  if (sold.length === 0) return 0
  return Math.round(sold.reduce((acc, v) => acc + (v.price - v.precioCompra), 0) / sold.length)
}

// Conteo de vehículos reservados (para badge sidebar)
export function getReservedCount(): number {
  return vehicles.filter(v => v.status === 'reservado').length
}

// Obtener color según días en stock
export function getDaysColor(days: number): string {
  if (days < 30) return 'text-emerald-600'
  if (days < 60) return 'text-amber-600'
  return 'text-red-600'
}

// Obtener color de fondo según días en stock
export function getDaysBgColor(days: number): string {
  if (days < 30) return 'bg-emerald-50 text-emerald-700'
  if (days < 60) return 'bg-amber-50 text-amber-700'
  return 'bg-red-50 text-red-700'
}

// Comparar precio con mercado
export function getPriceComparison(price: number, marketPrice: number): { label: string, color: string } {
  if (price < marketPrice * 0.95) return { label: 'Buen precio', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
  if (price > marketPrice * 1.05) return { label: 'Por encima del mercado', color: 'bg-red-50 text-red-700 border-red-200' }
  return { label: 'Precio correcto', color: 'bg-slate-100 text-slate-600 border-slate-200' }
}
```

---

## PARTE 2: SIDEBAR — Badge de vehículos reservados

En app-sidebar.tsx, añadir un badge ámbar junto al item "Vehículos" cuando hay coches reservados. Similar al badge de leads pendientes que ya existe.

Importar `getReservedCount` de mock-data.
En el item de Vehículos del sidebar, si `getReservedCount() > 0`, mostrar el número con un badge: `bg-amber-400/80 text-white`

Hacer lo mismo en mobile-nav.tsx: si hay reservados, mostrar un dot ámbar junto al icono de Vehículos.

---

## PARTE 3: DASHBOARD — Nuevos datos y KPIs

### 3.1 KPI "Días en stock (media)"
Sustituir el KPI de "Conversión" (o añadir un 5º) por "Días en stock (media)". Usar `getAvgDaysInStock()`. El número debe tener el color según el rango:
- <30 días: texto emerald-600 (verde)
- 30-60 días: texto amber-600 (amarillo)
- >60 días: texto red-600 (rojo)
Icono: Clock

### 3.2 Mini widget de estado de stock
Añadir una fila compacta debajo de los KPIs (o dentro de uno de ellos) que muestre:
- Dot azul + "X publicados"
- Dot ámbar + "X reservados"
- Dot verde + "X vendidos"
Usar `getVehiclesByStatus()`.

### 3.3 Ajustar conteo de vehículos activos
El KPI de "Vehículos activos" debe contar solo los que tienen status 'publicado', no todos.

---

## PARTE 4: VEHÍCULOS — Mejoras significativas

### 4.1 Columna "Días" en la tabla
Añadir columna que muestre los días en stock calculados con `getDaysInStock(v.createdAt)`. Usar badge con `getDaysBgColor()` para el color. Posición: después de "Km" y antes de "Leads".

### 4.2 Columna "Estado" del vehículo
Añadir badge de estado del vehículo:
- "Publicado" → `bg-blue-50 text-blue-700 border border-blue-200 rounded-md px-2 py-0.5 text-[11px] font-medium`
- "Reservado" → `bg-amber-50 text-amber-700 border border-amber-200` + icono Lock (de Lucide, h-3 w-3)
- "Vendido" → `bg-emerald-50 text-emerald-700 border border-emerald-200` + icono CheckCircle2 (h-3 w-3)
Posición: primera columna visible después de la imagen/marca.

### 4.3 Filtro por estado
Añadir una fila de toggle pills encima de la tabla:
- "Todos (8)" | "Publicados (6)" | "Reservados (1)" | "Vendidos (1)"
- Estilo: pills con bg-slate-100 inactivas, bg-indigo-600 text-white la activa
- Filtrar la tabla según el estado seleccionado
- Los números entre paréntesis se calculan dinámicamente

### 4.4 Modal/Sheet de detalle del vehículo — RECONSTRUIR CON TABS

El modal actual necesita ser MUCHO más completo. Usar un Dialog grande (max-w-4xl) o Sheet lateral con 5 tabs:

**Tab "General" (default)**:
- Header: imagen del coche (h-52 w-full object-cover rounded-t-lg) con overlay gradiente oscuro en la parte inferior. Sobre el overlay: marca + modelo + año en blanco bold, badge de estado.
- Debajo: fila con precio grande (text-3xl font-extrabold tabular-nums) + badge comparación mercado (usar `getPriceComparison()`). Al lado: "Precio mercado: XX.XXX€" en texto muted con fuente del dato "Eurotax" debajo.
- Fila de stats: 4 mini-cards: Leads (número), Visitas (número), Días en stock (con color), Margen bruto (precio - precioCompra, en €, verde si positivo).
- Matrícula y VIN en texto mono small.
- Descripción del vehículo con botón "Mejorar con IA" (icono Sparkles, bg-indigo-50 text-indigo-700 hover:bg-indigo-100).
- Si hay historialPrecios: sección "Historial de precios" con mini-timeline. Cada entrada: dot + línea vertical + fecha en muted + "De XX.XXX€ a XX.XXX€" con flecha + motivo en texto small. Los precios antiguos tachados.

**Tab "Datos técnicos"**:
- Título de grupo "Datos básicos" → grid 3 columnas: Marca, Modelo, Versión/Acabado, Año, Combustible, Cambio, Color exterior, Color interior, Puertas, Plazas. Cada campo: label en text-[11px] uppercase tracking-wider text-muted-foreground, valor en text-sm font-medium.
- Título de grupo "Motor y rendimiento" → grid 3 columnas: Cilindrada (mostrar con "cc"), Potencia (mostrar con "CV" y "(XXX kW)"), Etiqueta ambiental (usar colores DGT: C → bg-yellow-100 text-yellow-800, B → bg-green-100 text-green-800, ECO → bg-teal-100 text-teal-800, 0 → bg-blue-100 text-blue-800), Tracción.
- Título de grupo "Identificación" → grid 3 columnas: Matrícula (monospace font), VIN/Bastidor (monospace, text-xs, con botón copiar al portapapeles), Fecha ITV, Nº propietarios anteriores.
- Título de grupo "Precio y garantía" → grid 3 columnas: Precio venta (bold, tabular-nums), Precio compra (muted), Precio anterior (tachado si existe), Precio mercado + badge comparación, Garantía, Margen bruto (verde si positivo, rojo si negativo).
- Sección "Extras del vehículo" → chips/badges en flex-wrap: cada extra como `bg-slate-100 text-slate-700 border border-slate-200 rounded-md px-2.5 py-1 text-xs font-medium`. Agrupar visualmente — no necesita scroll.
- Botón "Editar datos" al final (solo visual, outline style).

**Tab "Portales"**:
- Tabla sencilla con 5 filas (una por portal):
  - Columna "Portal": dot de color del portal + nombre
  - Columna "Estado": badge verde "Publicado" si ok, rojo "Error" si error, gris "Pendiente" si pending
  - Columna "Conexión": badge tipo de feed — "API" (azul) para Coches.net y Wallapop, "CSV" (gris) para Milanuncios, "XML/SFTP" (gris) para AutoScout24 y Autocasión
  - Columna "Acciones": botón "Ver anuncio ↗" (link-underline, solo visual) + botón "Reintentar" (rojo outline, solo si error)
- Debajo de la tabla: toggles (Switch de shadcn/ui) por portal para activar/desactivar la publicación. Label: "Publicar en [nombre del portal]". Todos activados por defecto excepto los que tienen error. Solo visual, no funcional.

**Tab "Documentos"**:
- Lista de documentos del vehículo. Cada documento:
  - Icono según tipo: FileText para itv, FileSignature para contrato, Shield para informe, BadgeCheck para garantia, File para otro (importar de Lucide)
  - Nombre del documento (font-medium)
  - Fecha (muted, text-sm)
  - Botón "Descargar" (solo visual)
- Botón "Subir documento" arriba (Plus icon, outline style, solo visual)
- Si el vehículo tiene pocos documentos, mostrar un mensaje: "Añade documentos como ITV, contratos, informes CARFAX o garantías para tener un expediente completo del vehículo."

**Tab "Fotos"**:
- Grid 3 columnas de thumbnails (usar la imagen del mock del vehículo repetida con diferentes crop parameters: ?w=200&h=150&fit=crop&crop=top, ?w=200&h=150&fit=crop&crop=center, ?w=200&h=150&fit=crop&crop=bottom, ?w=200&h=150&fit=crop&crop=left, etc.). Poner 6 fotos fake.
- La primera foto tiene un badge "Portada" encima (bg-indigo-600 text-white text-[10px] absolute top-2 left-2 px-2 py-0.5 rounded).
- Debajo del grid: nota "Arrastra para reordenar. La primera foto es la portada del anuncio." en texto muted.
- Botón "Añadir fotos" (outline, solo visual).

**Footer del modal**:
- Izquierda: "Marcar como reservado" (bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200) — solo visible si status es 'publicado'. "Marcar como vendido" (bg-red-50 text-red-700 hover:bg-red-100 border border-red-200) — visible si status es 'publicado' o 'reservado'.
- Derecha: "Guardar cambios" (bg-indigo-600 text-white hover:bg-indigo-700).

---

## PARTE 5: SUBIR VEHÍCULO — Autocompletado por matrícula (killer feature)

En la upload-page.tsx, en el Paso 4 (Datos del vehículo):

### 5.1 Bloque de matrícula arriba del formulario

Añadir un bloque destacado ANTES de todos los campos del formulario:

```
┌─────────────────────────────────────────────────────────────┐
│  🔍 Rellena la ficha automáticamente                        │
│                                                             │
│  Matrícula del vehículo  [         4521 KMN         ] [Buscar] │
│                                                             │
│  Conectado con Eurotax · El 99% de los vehículos se        │
│  identifican automáticamente por matrícula                   │
└─────────────────────────────────────────────────────────────┘
```

- El bloque tiene fondo: bg-indigo-50/50 border border-indigo-100 rounded-lg p-5
- Icono Search (Lucide) en el título, no emoji
- Input grande (h-11, text-lg, placeholder "Ej: 4521 KMN", uppercase tracking-wider)
- Botón "Buscar datos" (bg-indigo-600 text-white)
- Texto explicativo debajo en text-xs text-muted-foreground

### 5.2 Simulación del autocompletado

Cuando el usuario hace click en "Buscar datos":
1. El botón cambia a un spinner (icono Loader2 de Lucide con className animate-spin) + texto "Buscando..."
2. Después de 1200ms (setTimeout):
   - Se rellenan los campos del formulario con datos hardcodeados (BMW Serie 3 320d, 2021, etc. — los mismos datos del vehículo v1)
   - Se muestra un banner de éxito arriba del formulario: fondo bg-emerald-50 border border-emerald-200 con icono CheckCircle2 verde + texto "Datos encontrados para matrícula 4521 KMN — 15 campos rellenados automáticamente vía Eurotax"
   - Los campos rellenados por la "IA/Eurotax" tienen un indicador visual: border-left 3px solid indigo-400
   - Los campos que quedan vacíos (km, precio, descripción) tienen: border-left 3px solid amber-400

### 5.3 Campos del formulario ampliados

El Paso 4 debe tener MUCHOS más campos que ahora. Organizados en grupos con títulos:

**Grupo "Datos básicos"** (grid 3 columnas desktop, 2 tablet, 1 mobile):
Marca (select), Modelo (input), Versión/Acabado (input), Año primera matriculación (input number), Combustible (select: Gasolina/Diésel/Híbrido/Eléctrico), Cambio (select: Manual/Automático), Color exterior (input), Color interior (input)

**Grupo "Motor y rendimiento"**:
Cilindrada cc (input number), Potencia CV (input number), Potencia kW (input number), Emisiones CO2 g/km (input number), Etiqueta ambiental (select: C/B/ECO/0/Sin etiqueta), Tracción (select: Delantera/Trasera/Total)

**Grupo "Identificación"**:
Matrícula (input, ya rellena del bloque superior), Nº bastidor VIN (input), Fecha ITV (input date), Nº propietarios anteriores (input number)

**Grupo "Estado y precio"**:
Kilómetros (input number), Precio de venta € (input number), Precio de compra € (input number), Garantía (select: Sin garantía/3 meses/6 meses/12 meses/24 meses)

**Grupo "Extras del vehículo"** — Chips clickables:
Un bloque con chips/badges seleccionables. El usuario hace click para activar/desactivar cada extra. Extras disponibles (mostrar TODOS): Navegación GPS, Sensores aparcamiento, Cámara trasera, Climatizador bizona, Apple CarPlay, Android Auto, Control crucero, Control crucero adaptativo, Faros LED, Faros Xenón, Llantas aleación, Bluetooth, Tapicería cuero, Techo panorámico, Start/Stop, Arranque sin llave, Volante multifunción, Asientos eléctricos, Asientos calefactados, ABS, ESP, Airbags laterales, USB, Head-up display, Dirección asistida.
Los chips activos: bg-indigo-100 text-indigo-800 border-indigo-300. Los inactivos: bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300.
Cuando el autocompletado rellena, algunos chips se pre-activan (los del array de extras del BMW v1).

**Grupo "Descripción"**:
Textarea grande (min-h-[120px]) con placeholder. Dos botones debajo: "Generar con IA" (icono Sparkles, bg-indigo-600) y "Mejorar con IA" (icono Sparkles, outline indigo).

---

## PARTE 6: LEADS — Mejoras en el modal

En leads-page.tsx, en el Dialog/Sheet de detalle de un lead:

### 6.1 Vehículo de interés
Mostrar una mini-card del vehículo con: imagen (h-16 w-24 object-cover rounded), marca/modelo, año, precio. Clickable (solo visual).

### 6.2 Tiempo de respuesta
Añadir un campo "Tiempo de respuesta" con un dato fake:
- Para leads con status 'contactado': "Respondido en 12 min" (verde si <15min, amarillo si 15-60, rojo si >60)
- Para leads con status 'pendiente': "Sin respuesta — Xx horas" en rojo con icono AlertTriangle
- Debajo: nota en text-xs muted: "Los leads contactados en menos de 5 minutos tienen el doble de probabilidad de conversión"

---

## PARTE 7: REPORTES — Nuevos KPIs y mejoras

### 7.1 Fila de mini-KPIs arriba
Añadir 4 mini-cards compactas encima de los gráficos existentes:
1. "Días en stock (media)" → número con color según rango + icono Clock
2. "Margen medio" → usar `getAvgMargin()`, mostrar en € + icono TrendingUp
3. "Tiempo resp. leads" → "18 min" (dato fake) + icono Zap + color verde
4. "Reservados" → número de reservados + icono Lock + color ámbar

### 7.2 Asegurarse de que los gráficos renderizan
En la iteración anterior los gráficos de Recharts tenían problemas. Verificar que:
- El area chart de evolución tiene datos correctos y se ve el gradiente
- El bar chart horizontal muestra barras con colores
- El donut muestra segmentos con los colores de cada portal
- El label central del donut dice "1.435€" + "/mes" (con el símbolo € correcto, no \u20AC)

### 7.3 Tabla de rentabilidad
- Verificar que los valores monetarios se muestran con € (no \u20AC)
- La conversión debe tener color: verde si >12%, rojo si <10%, ámbar si 10-12%
- Fila TOTAL con bg-slate-50 font-bold

---

## PARTE 8: CONFIGURACIÓN — Mejoras

### Tab Portales
Cada card de portal debe mostrar:
- Plan contratado: "Pack Premium" para Coches.net, "PRO Motor" para Wallapop, "Advance-ON Profesional" para Milanuncios, "Sumauto Estándar" para AutoScout24, "Incluido con AutoScout24" para Autocasión
- Coste mensual: 890€, 120€, 85€, 340€, 0€ respectivamente
- Badge de tipo de conexión: "API" (bg-blue-50 text-blue-700 border-blue-200) para Coches.net y Wallapop, "CSV" (bg-slate-100 text-slate-600 border-slate-200) para Milanuncios, "XML/SFTP" (bg-slate-100 text-slate-600 border-slate-200) para AutoScout24 y Autocasión
- Nota al pie del tab: "La configuración de portales es gestionada por Flama Studio durante el onboarding. Contacta con soporte para modificaciones."

### Tab Suscripción
- En la card del plan, añadir lista de lo que incluye: "Multipublicación a 5 portales · IA generativa para descripciones · Entrada por voz y OCR · Soporte prioritario · Onboarding personalizado"
- Añadir debajo: "Gasto total en portales: 1.435€/mes" (sumando los costes de todos los portales)

---

## PARTE 9: AJUSTE DE DISEÑO (para acercar más a la referencia Corporate UI Dashboard PRO)

### 9.1 Barra decorativa de gradiente
En el dashboard, añadir una barra horizontal decorativa con gradiente indigo ENCIMA de la fila de KPIs:
```tsx
<div className="h-1 w-full rounded-full mb-5" style={{ background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 35%, #a78bfa 65%, #c4b5fd 100%)' }} />
```

### 9.2 KPIs con iconos tipo referencia
En la referencia, cada KPI tiene un icono dentro de un cuadrado con borde fino (no fondo de color fuerte). Ajustar:
- Icono dentro de div con: `w-10 h-10 rounded-lg border border-border flex items-center justify-center bg-slate-50`
- Label arriba en `text-[11px] text-muted-foreground font-medium uppercase tracking-wider`
- Número grande debajo en `text-2xl font-extrabold tabular-nums`
- Badge de crecimiento: `text-[11px] font-medium` con colores (verde ↑, rojo ↓)

### 9.3 Cards con bordes más visibles
La referencia tiene cards con bordes claros y definidos. Verificar que TODAS las cards en todas las pantallas usan `border border-border` y NO dependen de sombras para definir sus límites. Fondo #ffffff sobre el #f8fafc general.

---

## INSTRUCCIONES TÉCNICAS FINALES

1. EJECUTAR el fix de encoding PRIMERO (Parte 0)
2. ACTUALIZAR mock-data.ts con todos los nuevos datos (Parte 1)
3. ACTUALIZAR sidebar y mobile-nav (Parte 2)
4. ACTUALIZAR las 6 páginas (Partes 3-8)
5. AJUSTAR diseño (Parte 9)
6. En TODOS los strings del código, usar UTF-8 directo. NUNCA \uXXXX.
7. npx tsc -b --noEmit → 0 errores
8. npx vite build → build exitoso
9. Screenshots con Playwright (1400x1000) de:
   - Dashboard completo (con barra gradiente, KPI días en stock, estado de stock)
   - Vehículos con filtro de estado + columnas "Días" y "Estado"
   - Modal vehículo tab "General" (precio mercado, margen, historial precios)
   - Modal vehículo tab "Datos técnicos" (campos completos + extras como chips)
   - Modal vehículo tab "Portales" (con toggles y badges de tipo conexión)
   - Modal vehículo tab "Documentos"
   - Wizard subida paso 4 con bloque matrícula y autocompletado
   - Reportes con mini-KPIs
   - Config tab portales con planes y tipo conexión
