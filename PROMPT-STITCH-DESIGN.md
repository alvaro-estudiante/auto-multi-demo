Lee el CLAUDE.md de este proyecto.

Lee el archivo de referencia del vault:
- C:/Users/Alvaro/workspace/obsidian/Flama-Vault/13-CSS-Avanzado/glassmorphism-y-efectos-modernos.md

Lee también el estado actual de estos archivos:
- src/index.css
- src/components/layout/app-sidebar.tsx
- src/components/layout/mobile-nav.tsx
- src/components/layout/dashboard-layout.tsx
- src/components/pages/dashboard-page.tsx
- src/components/pages/vehicles-page.tsx
- src/components/pages/upload-page.tsx
- src/components/pages/leads-page.tsx
- src/components/pages/reports-page.tsx
- src/components/pages/config-page.tsx

---

# REDISEÑO VISUAL PREMIUM — Estilo Stitch/Glassmorphism

CONTEXTO: Hemos generado un diseño de referencia con Google Stitch que nos encanta. Queremos aplicar EXACTAMENTE este patrón de diseño a nuestro proyecto React actual. El diseño tiene un look mucho más premium que el actual: header con gradiente morado que se extiende detrás de los KPIs, cards glassmorphism con backdrop-blur, tipografía extrabold, border-radius más generosos (rounded-3xl en cards), y un sidebar más oscuro con radial gradient overlay.

NO borrar ninguna funcionalidad. NO tocar los datos de mock-data.ts. Solo cambiar la ESTÉTICA VISUAL de todos los componentes para que sigan este nuevo patrón.

IMPORTANTE ENCODING: En TODOS los strings del código, usar SIEMPRE caracteres UTF-8 directos. NUNCA usar secuencias de escape Unicode (\u00xx). Escribir "vehículo" NO "veh\u00edculo". Escribir "€" NO "\u20AC".

---

## NUEVO SISTEMA DE DISEÑO (aplicar en index.css)

Reescribir index.css con estas clases y variables:

```css
/* Variables de color (mantener las existentes, solo ajustar estas) */
:root {
  --background: #f8fafc;
  --foreground: #0f172a;
  --primary: #4648d4;
  --primary-foreground: #ffffff;
  --radius: 0.375rem;
  --sidebar: #0f172a;
  /* ... mantener el resto ... */
}

/* Clases premium nuevas */

/* Sidebar con gradiente oscuro + radial glow */
.sidebar-gradient {
  background: linear-gradient(165deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%);
  position: relative;
  overflow: hidden;
}
.sidebar-gradient::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: radial-gradient(circle at 20% 30%, rgba(79, 70, 229, 0.15) 0%, transparent 50%);
  pointer-events: none;
}

/* Header premium con gradiente morado */
.premium-header-gradient {
  background: linear-gradient(135deg, #4648d4 0%, #6b38d4 50%, #9333ea 100%);
  position: relative;
  overflow: hidden;
}
.premium-header-gradient::before {
  content: '';
  position: absolute;
  top: -20%;
  right: -10%;
  width: 60%;
  height: 140%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
  transform: rotate(-15deg);
}

/* Card glassmorphism premium */
.glass-card-premium {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
}

/* Card de error glassmorphism */
.glass-error {
  background: rgba(254, 226, 226, 0.4);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(239, 68, 68, 0.1);
}

/* Botón premium con hover elevado */
.btn-premium {
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.btn-premium:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 15px -3px rgba(70, 72, 212, 0.3), 0 0 8px 0 rgba(255, 255, 255, 0.5);
}

/* Tabular nums */
.tabular { font-variant-numeric: tabular-nums; }
```

Mantener las clases existentes que ya funcionan (.card-hover, .link-underline, .grain-overlay, etc.) pero AÑADIR estas nuevas.

---

## SIDEBAR (app-sidebar.tsx) — Rediseño premium

El sidebar debe verse EXACTAMENTE como el de la referencia de Stitch:

ESTRUCTURA:
- Ancho: mantener el actual de shadcn sidebar
- Fondo: aplicar la clase .sidebar-gradient (NO un simple linear-gradient inline)
- Todos los elementos dentro deben tener position: relative y z-index: 10 para estar encima del ::after pseudo-element

LOGO (header del sidebar):
- Icono coche dentro de: w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10
- Título "AutoMulti" en text-xl font-extrabold tracking-tight text-white
- Subtítulo "Flama Studio" en text-[9px] text-white/40 tracking-[0.2em] uppercase font-bold

BOTÓN "SUBIR VEHÍCULO":
- w-full bg-white text-indigo-700 font-bold py-3.5 px-4 rounded-2xl
- Clase .btn-premium para el hover con elevación
- Icono Plus que rota 90° en hover: transition-transform group-hover:rotate-90
- margin-bottom grande (mb-10) para separar de la navegación

ITEMS DE NAVEGACIÓN:
- Item activo: bg-white/10 text-white font-semibold rounded-xl px-4 py-3
- Items inactivos: text-white/60 hover:text-white px-4 py-3 rounded-xl hover:bg-white/5
- Iconos: text-[22px] (un poco más grandes que ahora)
- Texto: text-sm font-medium
- Badge de leads: bg-primary/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-primary/20
- Badge de reservados: bg-white/10 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/10
- Separador "PRINCIPAL": NO visible o muy muy sutil

FOOTER (avatar):
- border-t border-white/5 con padding-top
- Avatar: w-11 h-11 rounded-2xl bg-indigo-500 font-bold border border-white/20 shadow-lg
- Dot verde de online: w-3.5 h-3.5 bg-emerald-500 border-2 border-[#1e1b4b] rounded-full, posición absolute -bottom-1 -right-1
- Nombre: font-bold text-sm tracking-tight
- Rol: text-[10px] text-white/40 uppercase font-bold tracking-widest → "Administrador" (no "Admin")

---

## DASHBOARD (dashboard-page.tsx) — Rediseño completo del layout

Este es el cambio más grande. El dashboard necesita un LAYOUT COMPLETAMENTE DIFERENTE:

### ESTRUCTURA NUEVA:

```
┌──────────────────────────────────────────────────┐
│  PREMIUM HEADER GRADIENT (gradiente morado)       │
│  pt-8 pb-32 px-12                                │
│                                                  │
│  [Breadcrumb: Admin > Dashboard]     [🔔 notif]  │
│                                                  │
│  Buenos días, Paco                               │
│  (text-4xl font-extrabold text-white)            │
│  Resumen de Paco Núñez Motor — 29 de marzo 2026  │
│  (text-white/70 font-medium text-lg)             │
│                                                  │
└──────────────────────────────────────────────────┘
     ↕ OVERLAP: KPIs con -mt-20 se solapan sobre el header
┌──────────────────────────────────────────────────┐
│  KPI 1 glass  │  KPI 2 glass  │  KPI 3  │ KPI 4 │
│  (rounded-3xl, glass-card-premium)               │
└──────────────────────────────────────────────────┘
│  ● 6 publicados  ● 1 reservados  ● 1 vendidos   │
│                                                  │
│  ┌──── Leads por portal ────┐ ┌─ Leads rec. ──┐ │
│  │  (2/3 width)             │ │ (1/3 width)    │ │
│  │  Bar chart + toggle      │ │ Lista leads    │ │
│  │  glass-card-premium      │ │ glass-card     │ │
│  └──────────────────────────┘ └────────────────┘ │
│                                                  │
│  ┌────── Errores de publicación ─────────────┐   │
│  │  glass-error (fondo rojo translúcido)      │   │
│  └───────────────────────────────────────────┘   │
```

### IMPLEMENTACIÓN:

El main content del dashboard se divide en DOS secciones:

**SECCIÓN 1: Premium Header** (fuera del padding normal):
```tsx
<section className="premium-header-gradient pt-8 pb-32 px-12">
  {/* Header con breadcrumb y notificación */}
  <header className="flex justify-between items-center mb-10">
    <nav className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/60">
      <span className="text-white">Admin</span>
      <ChevronRight className="h-3 w-3" />
      <span className="text-white/40">Dashboard</span>
    </nav>
    <button className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white relative backdrop-blur-md border border-white/10">
      <Bell className="h-5 w-5" />
      <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-white rounded-full" />
    </button>
  </header>
  
  {/* Saludo */}
  <div>
    <h2 className="text-4xl font-extrabold tracking-[-0.035em] text-white mb-2">Buenos días, Paco</h2>
    <p className="text-white/70 font-medium text-lg">
      Resumen de <span className="text-white font-semibold">Paco Núñez Motor</span> — 29 de marzo de 2026
    </p>
  </div>
</section>
```

**SECCIÓN 2: Contenido con overlap** (sobre el header):
```tsx
<div className="px-12 -mt-20 max-w-7xl mx-auto pb-20">
  {/* KPIs, charts, errores aquí */}
</div>
```

IMPORTANTE: Para que esto funcione, el dashboard-page NO debe estar dentro de un contenedor con padding/overflow que bloquee el overlap. El dashboard necesita renderizar el header a sangre completa (full width dentro del area de contenido). Si el layout actual (dashboard-layout.tsx) pone padding alrededor del contenido de las páginas, el dashboard debe poder saltarse ese padding para su header.

Posible solución: en dashboard-layout.tsx, NO poner padding en el contenedor del contenido dinámico. Que cada página gestione su propio padding. O pasar una prop para indicar que el dashboard necesita layout a sangre.

### KPIs (glass cards):

Las 4 cards de KPI deben usar:
- Clase: glass-card-premium
- Border radius: rounded-3xl (24px) — MÁS que el actual
- Padding: p-8
- Border top: border-t-2 border-white/20 (sutil, translúcido)
- Label: text-[10px] font-extrabold tracking-[0.15em] text-slate-500 uppercase, con mb-5
- Número: text-5xl font-extrabold tracking-tighter tabular (MUCHO más grande que ahora)
- Badge de crecimiento: bg-emerald-100/80 text-emerald-700 text-[11px] font-bold px-2 py-1 rounded-lg backdrop-blur-sm
- Subtexto: text-xs text-slate-500 font-bold uppercase tracking-wider mt-4
- Icono del KPI de días en stock (reloj): posición top-right, text-amber-500

Cada KPI mantiene su dato actual pero con este estilo nuevo. El KPI de "Días en stock" tiene el número en text-amber-600 (no fondo oscuro).

### Status dots:
```tsx
<div className="flex gap-8 mb-12 text-xs font-bold tracking-widest text-slate-400 px-1 uppercase">
  <span className="flex items-center gap-2.5">
    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shadow-lg shadow-indigo-500/30" />
    6 publicados
  </span>
  <span className="flex items-center gap-2.5">
    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-lg shadow-amber-500/30" />
    1 reservados
  </span>
  <span className="flex items-center gap-2.5">
    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30" />
    1 vendidos
  </span>
</div>
```

### Gráfico "Leads por portal":
- Card: glass-card-premium rounded-3xl p-10
- Ocupa lg:col-span-2 en un grid de 3 columnas
- Título: text-xl font-extrabold tracking-tight
- Subtítulo: text-xs text-slate-400 font-bold uppercase tracking-wider
- Toggle pills: bg-slate-100 p-1.5 rounded-xl border border-slate-200/50. Activa: bg-white rounded-lg shadow-sm text-primary font-extrabold. Inactiva: text-slate-500
- El gráfico de barras de Recharts se mantiene pero con un contenedor: bg-slate-50/50 rounded-2xl backdrop-blur-sm (fondo sutil dentro de la card)
- Gap entre chart y leads: gap-10

### Leads recientes:
- Card: glass-card-premium rounded-3xl (sin padding, el padding va en las sub-secciones)
- Header de la card: p-8 border-b border-slate-200/40
- Título: text-lg font-extrabold tracking-tight
- Link "Ver todos →": text-[10px] font-extrabold text-primary uppercase tracking-widest
- Cada lead item: p-6 hover:bg-white/40 transition-all
- Avatar: w-12 h-12 rounded-2xl (no rounded-full) con colores variados, font-bold text-sm, shadow-sm border border-[color]-200/30, group-hover:scale-105 transition-transform
- Nombre: text-sm font-extrabold text-slate-900
- Vehículo: text-[11px] text-slate-400 font-medium
- Fecha: text-[10px] font-bold text-slate-400 uppercase tracking-tighter
- Badge de estado: text-[9px] font-extrabold uppercase tracking-wider rounded-lg, con backdrop-blur-sm
  - Pendiente: bg-amber-100/60 text-amber-700
  - Contactado: bg-primary/10 text-primary
  - Vendido: bg-emerald-500/10 text-emerald-600
  - Descartado: bg-slate-100/60 text-slate-500

### Errores de publicación:
- Card: glass-error rounded-3xl p-10 border border-red-200/20
- Icono: w-10 h-10 bg-red-500/10 rounded-xl con icono AlertTriangle text-red-600
- Título: text-xl font-extrabold text-red-900 tracking-tight
- Subtítulo: text-xs text-red-700/60 font-bold uppercase tracking-widest "Requiere atención inmediata"
- Cada error: bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/50 hover:bg-white/80
- Imagen del coche: w-20 h-16 object-cover rounded-xl shadow-lg
- Portal con error: font-extrabold text-red-600 uppercase tracking-wider
- Botón "Solucionar": bg-slate-900 text-white px-6 py-2.5 text-xs font-bold rounded-xl hover:bg-slate-800 shadow-xl shadow-slate-900/10

---

## TODAS LAS DEMÁS PÁGINAS — Aplicar estilo glass

Para las páginas que NO son el dashboard (vehículos, leads, reportes, config, upload):
- NO tienen el premium-header-gradient (solo el dashboard lo tiene)
- PERO todas las cards deben usar glass-card-premium rounded-3xl en vez de las cards normales
- Los border-radius de cards deben subir a rounded-3xl (24px)
- Los border-radius de badges se quedan en rounded-lg
- Los border-radius de buttons suben a rounded-xl (12px)
- Los border-radius de inputs suben a rounded-xl
- Los border-radius de avatares: rounded-2xl (no rounded-full, excepto dots de estado)
- La tipografía de títulos debe ser font-extrabold tracking-tight
- Las labels deben ser text-[10px] font-extrabold tracking-[0.15em] uppercase
- Los números grandes deben usar la clase .tabular y ser más grandes (text-3xl o text-4xl)

### Vehículos:
- La tabla se envuelve en glass-card-premium rounded-3xl
- Headers de tabla: text-[10px] font-extrabold tracking-[0.15em] uppercase text-slate-400
- El modal de detalle: rounded-3xl, header con imagen + overlay gradiente
- Los tabs del modal: font-bold, tab activa con border-bottom indigo

### Upload wizard:
- Las cards de selección (tipo, portales): glass-card-premium rounded-3xl
- El bloque de matrícula: bg-indigo-50/50 border border-indigo-100 rounded-2xl
- El footer del wizard: bg-white/80 backdrop-blur-md

### Leads:
- La tabla se envuelve en glass-card-premium rounded-3xl
- Los avatares: rounded-2xl (cuadrados redondeados, NO circulares)
- Los badges de estado: rounded-lg con backdrop-blur-sm

### Reportes:
- Las cards de KPI: glass-card-premium rounded-3xl
- Los gráficos: envueltos en glass-card-premium rounded-3xl

### Config:
- Las cards de portal: glass-card-premium rounded-3xl
- Los tabs: font-extrabold

---

## LAYOUT (dashboard-layout.tsx) — Ajustar para permitir el header a sangre

El layout actual probablemente tiene un padding-x en el contenedor del contenido. Para que el dashboard pueda renderizar su header gradient a full width, hay dos opciones:

OPCIÓN A (preferida): Quitar el padding del contenedor de contenido en el layout. Que cada página gestione su propio padding. Esto significa que TODAS las páginas deben añadir su propio `px-12 max-w-7xl mx-auto` en su contenido.

OPCIÓN B: Pasar una prop al layout que indique si la página actual necesita layout a sangre (solo el dashboard) y condicionalmente quitar el padding.

Implementar la que sea más limpia.

El header sticky de la app (con el título de sección y el botón de notificación) debe DESAPARECER en el dashboard, ya que el dashboard tiene su propio header dentro del gradiente. En las demás páginas, el header sticky se mantiene.

---

## MOBILE NAV (mobile-nav.tsx)

Mantener el gradiente dark actual pero ajustar los border-radius de los botones para que sean rounded-2xl. El botón central "Subir" debe ser rounded-2xl (no rounded-full).

---

## VERIFICACIÓN

1. Arreglar cualquier escape Unicode (\u00xx, \u20AC) que encuentres — reemplazar por caracteres directos
2. npx tsc -b --noEmit → 0 errores
3. npx vite build → build exitoso
4. Screenshots Playwright (1400x1000) de:
   - Dashboard completo (mostrando el header gradient con overlap de KPIs)
   - Dashboard scrolleado (gráfico + leads recientes + errores)
   - Vehículos (tabla con glass cards)
   - Modal de detalle de vehículo
   - Wizard de subida paso 2 (portales)
   - Wizard de subida paso 4 (datos con matrícula)
   - Leads (tabla con avatares cuadrados)
   - Reportes
   - Configuración
