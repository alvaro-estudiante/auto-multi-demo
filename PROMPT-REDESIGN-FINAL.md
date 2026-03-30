Lee el CLAUDE.md de este proyecto.

Lee estos archivos del vault ANTES de empezar:
- C:/Users/Alvaro/workspace/obsidian/Flama-Vault/13-CSS-Avanzado/glassmorphism-y-efectos-modernos.md (COMPLETO — los 4 pilares, valores óptimos, regla de oro)
- C:/Users/Alvaro/workspace/obsidian/Flama-Vault/20-Tipografia-Color-Estilo/paletas-color-premium-por-sector.md (ver sección SaaS/Tech y la regla de 2-3 colores)
- C:/Users/Alvaro/workspace/obsidian/Flama-Vault/04-Reglas-Proyecto/reglas-anti-dribbble.md (ver sección "Color como Acento, no como Relleno")

Lee también TODOS los archivos del proyecto que vas a modificar:
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

# REDISEÑO VISUAL: PALETA PROFESIONAL + GLASSMORPHISM CORRECTO

## PROBLEMA ACTUAL

El diseño actual tiene demasiados colores (indigo, violet, purple, amber, emerald, teal, orange...) y eso le resta seriedad. Parece una app de consumo, no una herramienta B2B para concesionarios que facturan 50K-200K€/mes en coches. Además el glassmorphism actual es muy básico (solo rgba + blur, sin cuidar los valores óptimos).

## PRINCIPIOS DE ESTE REDISEÑO

1. **SOLO 2 COLORES PRINCIPALES + 1 ACENTO**: El vault dice "90% neutros, 10% color de impacto. Cuanto menos color uses, más poderoso es cuando aparece." Vamos a seguir esto al pie de la letra.

2. **PALETA SECTOR AUTOMOCIÓN**: Los concesionarios son gente seria que mueve dinero. No quieren una app "bonita" — quieren una herramienta que transmita confianza y control. La paleta debe inspirar confianza, no diversión.

3. **GLASSMORPHISM BIEN HECHO**: El vault dice que los valores óptimos son opacity 15-25%, blur 12-16px, border opacity 15-20%, shadow blur 32px. Y la regla de oro: "glassmorphism necesita un fondo visualmente interesante detrás". Solo usarlo donde tiene sentido (header del dashboard), no en todas las cards.

---

## NUEVA PALETA (ESTRICTA — solo estos colores)

### Neutros (90% de la UI):
```
Sidebar fondo:      #0f172a → #1e293b  (slate-900 → slate-800, gradiente OSCURO pero NO morado)
Fondo principal:    #f8fafc            (slate-50)
Cards:              #ffffff            (blanco puro)
Texto principal:    #0f172a            (slate-900)
Texto secundario:   #64748b            (slate-500)
Texto muted:        #94a3b8            (slate-400)
Bordes:             #e2e8f0            (slate-200)
Separadores:        #f1f5f9            (slate-100)
```

### Color principal (8% de la UI — solo CTAs, links activos, elementos seleccionados):
```
Primary:            #1e40af            (blue-800 — azul OSCURO, serio, no chillón)
Primary hover:      #1e3a8a            (blue-900)
Primary light:      #dbeafe            (blue-100 — para fondos sutiles de badges)
Primary surface:    #eff6ff            (blue-50 — para highlights muy sutiles)
```

### Color de acento (2% de la UI — solo alertas, éxito, peligro, badges especiales):
```
Éxito:              #059669            (emerald-600)
Error:              #dc2626            (red-600)
Warning/Reservado:  #d97706            (amber-600)
```

NADA MÁS. No hay violeta, no hay teal, no hay naranja, no hay indigo chillón. Todo se construye con slate + blue-800 + semánticos.

### Gradiente del header (SOLO en el dashboard):
```
background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e3a5f 100%)
```
Es un gradiente OSCURO slate/navy, NO morado ni púrpura. Serio, corporate, como un traje de ejecutivo. Con un radial glow MUY sutil de azul (#1e40af al 8% opacity) para dar profundidad.

---

## GLASSMORPHISM — VALORES CORRECTOS (según vault)

### Glass card sobre el header gradient (dashboard KPIs):
```css
.glass-card-header {
  background: rgba(255, 255, 255, 0.12);   /* opacity 12% — sutil */
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.15);  /* border opacity 15% */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);   /* sombra con blur 32px */
}
```
NOTA: Estas cards de KPI van SOBRE el gradiente oscuro del header, por eso el glassmorphism funciona aquí (regla de oro del vault: "necesita un fondo visualmente interesante detrás").

### Cards normales sobre fondo claro (resto de la app):
```css
.card-surface {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: none;  /* SIN sombra en reposo */
  border-radius: 16px;
}
.card-surface:hover {
  box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.04);
}
```
NOTA: Sobre fondo blanco/claro, el glassmorphism NO funciona (el vault lo dice explícitamente). Usar cards sólidas blancas con borde sutil.

---

## IMPLEMENTACIÓN POR COMPONENTE

### index.css — Variables y clases

Reescribir las variables CSS:
```css
:root {
  --background: #f8fafc;
  --foreground: #0f172a;
  --card: #ffffff;
  --card-foreground: #0f172a;
  --primary: #1e40af;
  --primary-foreground: #ffffff;
  --secondary: #f1f5f9;
  --secondary-foreground: #0f172a;
  --muted: #f1f5f9;
  --muted-foreground: #64748b;
  --accent: #f1f5f9;
  --accent-foreground: #0f172a;
  --destructive: #dc2626;
  --border: #e2e8f0;
  --input: #e2e8f0;
  --ring: #1e40af;
  --radius: 0.375rem;
  --sidebar: #0f172a;
  --sidebar-foreground: #ffffff;
  --sidebar-primary: #ffffff;
  --sidebar-primary-foreground: #0f172a;
  --sidebar-accent: rgba(255,255,255,0.06);
  --sidebar-accent-foreground: #ffffff;
  --sidebar-border: rgba(255,255,255,0.06);
  --sidebar-ring: rgba(255,255,255,0.15);
}
```

Clases utilitarias:
```css
/* Sidebar gradient — SLATE, no morado */
.sidebar-gradient {
  background: linear-gradient(175deg, #0f172a 0%, #1e293b 100%);
}

/* Header gradient del dashboard — NAVY OSCURO */
.premium-header {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e3a5f 100%);
  position: relative;
  overflow: hidden;
}
.premium-header::before {
  content: '';
  position: absolute;
  top: -30%;
  right: -15%;
  width: 50%;
  height: 160%;
  background: radial-gradient(circle, rgba(30, 64, 175, 0.08) 0%, transparent 70%);
  pointer-events: none;
}

/* Glass card SOLO para cards sobre fondo oscuro (KPIs del dashboard) */
.glass-card-dark {
  background: rgba(255, 255, 255, 0.10);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

/* Card normal para contenido sobre fondo claro */
.card-surface {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
}

/* Grain sutil */
.grain-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.015;
  background-image: url("data:image/svg+xml,...");  /* mantener el SVG actual */
  mix-blend-mode: overlay;
}
```

### SIDEBAR (app-sidebar.tsx)

Cambios:
- Fondo: .sidebar-gradient (slate oscuro, NO morado)
- Logo: icono en bg-white/8 rounded-xl border border-white/8 (MÁS sutil que antes)
- "AutoMulti": text-lg font-bold tracking-tight text-white (NO extrabold, que queda excesivo)
- "Flama Studio": text-[9px] text-white/30 tracking-[0.15em] uppercase font-medium
- Botón "Subir vehículo": bg-white text-slate-900 font-semibold py-3 rounded-xl. Hover: shadow sutil. SIN rotate del icono (es gimmick).
- Items nav: text-white/50 hover:text-white/80 hover:bg-white/5 rounded-lg px-3 py-2.5
- Item activo: bg-white/8 text-white font-medium rounded-lg
- Badge leads: bg-blue-600/80 text-white text-[10px] font-medium rounded-md px-1.5
- Badge reservados: bg-amber-500/80 text-white text-[10px] rounded-md px-1.5
- Avatar footer: rounded-xl (NO rounded-2xl tan agresivo), bg-slate-600, SIN dot verde de "online" (es irrelevante para una demo)
- Nombre: text-sm font-medium text-white/90
- Rol: text-[10px] text-white/40 uppercase tracking-wider "Administrador"
- NO separador "PRINCIPAL" visible

### DASHBOARD (dashboard-page.tsx) — Mantener layout con header

El layout del header gradient + overlap de KPIs es bueno, MANTENERLO. Pero ajustar:

HEADER:
- Gradiente: .premium-header (slate/navy, NO morado)
- Texto "Buenos días, Paco": text-3xl font-bold tracking-tight text-white (bajar de 4xl a 3xl, de extrabold a bold)
- Subtítulo: text-white/60 text-base (bajar de text-lg)
- Breadcrumb: text-[10px] font-medium uppercase tracking-wider text-white/40 (bajar de extrabold)
- Botón notificación: bg-white/8 hover:bg-white/12 border border-white/8 rounded-lg (más sutil)

KPIs (sobre el header oscuro → sí usar glassmorphism):
- Clase: glass-card-dark rounded-2xl p-6 (bajar de rounded-3xl y p-8 — menos aire, más compacto)
- Label: text-[10px] font-medium tracking-wider text-white/50 uppercase (NO extrabold)
- Número: text-4xl font-bold tabular-nums text-white (NO text-5xl extrabold — menos agresivo)
- Badge crecimiento: bg-emerald-500/20 text-emerald-300 text-[10px] font-medium rounded-md px-1.5 py-0.5
- Subtexto: text-[11px] text-white/40 font-medium uppercase tracking-wider
- KPI días en stock: número en text-amber-400 si 30-60 días

STATUS DOTS:
- text-[11px] font-medium tracking-wider text-slate-400 uppercase
- Dots: w-2 h-2 rounded-full (más pequeños). Azul: bg-blue-500. Ámbar: bg-amber-500. Verde: bg-emerald-500. SIN shadow-lg en los dots (excesivo).

GRÁFICO "Leads por portal":
- Card: card-surface rounded-2xl p-8 (card blanca sólida, NO glass — está sobre fondo claro)
- Título: text-lg font-semibold tracking-tight (NO extrabold)
- Toggle pills: bg-slate-100 rounded-lg p-1. Activa: bg-white shadow-sm text-slate-900 font-medium. Inactiva: text-slate-500
- Colores de las barras del gráfico: usar solo blue-600 (Coches.net), slate-400 (Wallapop), blue-300 (Milanuncios), slate-600 (AutoScout24), blue-200 (Autocasión). TODOS en la familia blue/slate — NO naranja, teal, verde. El gráfico se ve monocromático pero elegante.

LEADS RECIENTES:
- Card: card-surface rounded-2xl (card blanca, NO glass)
- Título: text-base font-semibold
- Link "Ver todos →": text-[11px] font-medium text-blue-700 (NO extrabold uppercase)
- Avatares: rounded-lg (NO rounded-2xl). Colores: SOLO variaciones de slate y blue — bg-slate-100 text-slate-600, bg-blue-50 text-blue-700, bg-slate-200 text-slate-700. NO usar colores variados (indigo, emerald, pink...).
- Badges estado: rounded-md text-[10px] font-medium:
  - Pendiente: bg-amber-50 text-amber-700 border border-amber-200
  - Contactado: bg-blue-50 text-blue-700 border border-blue-200
  - Vendido: bg-emerald-50 text-emerald-700 border border-emerald-200
  - Descartado: bg-slate-100 text-slate-500 border border-slate-200

ERRORES:
- Card: bg-red-50/60 border border-red-200 rounded-2xl p-8 (SIN glassmorphism, SIN backdrop-blur — simple y claro)
- Título: text-base font-semibold text-red-900 (NO extrabold text-xl)
- Botón "Solucionar": bg-slate-900 text-white text-xs font-medium rounded-lg px-4 py-2 (mantener esto, queda bien)

### VEHÍCULOS, LEADS, REPORTES, CONFIG, UPLOAD — Estilo consistente

REGLA GENERAL para TODAS estas páginas:
- Cards: card-surface rounded-2xl (blancas sólidas con borde slate-200)
- NO usar glassmorphism fuera del header del dashboard
- Títulos: font-semibold tracking-tight (NO extrabold)
- Labels: text-[10px] font-medium tracking-wider text-slate-400 uppercase
- Badges: rounded-md con colores SOLO del sistema (blue, emerald, amber, red, slate)
- Botones primarios: bg-blue-800 hover:bg-blue-900 text-white rounded-lg
- Botones secundarios: bg-white border border-slate-200 text-slate-700 rounded-lg
- Avatares: rounded-lg (cuadrados redondeados sutiles)
- Border radius general: rounded-2xl para cards grandes, rounded-lg para cards pequeñas y modales, rounded-md para badges y buttons

COLORES EN GRÁFICOS (Recharts):
- Coches.net: #1e40af (blue-800)
- Wallapop: #475569 (slate-600)
- Milanuncios: #64748b (slate-500)
- AutoScout24: #94a3b8 (slate-400)
- Autocasión: #cbd5e1 (slate-300)
→ Gráficos monocromáticos en familia blue/slate. Serio, profesional, legible.

O ALTERNATIVAMENTE si queda demasiado monótono:
- Coches.net: #1e40af (blue-800 — el principal)
- Wallapop: #059669 (emerald-600 — el único color diferente)
- Milanuncios: #64748b (slate-500)
- AutoScout24: #94a3b8 (slate-400)
- Autocasión: #cbd5e1 (slate-300)
Máximo 2 colores cromáticos + 3 grises.

---

## ARREGLOS ADICIONALES

1. ENCODING: Buscar y reemplazar TODOS los escapes Unicode (\u00xx, \u20AC) por caracteres UTF-8 directos. Ejecutar:
```bash
find src/ -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/\\u00ed/í/g; s/\\u00f3/ó/g; s/\\u00e9/é/g; s/\\u00e1/á/g; s/\\u00fa/ú/g; s/\\u00f1/ñ/g; s/\\u20AC/€/g'
```

2. BOTÓN SIGUIENTE del wizard de subida: Debe ser SIEMPRE visible. El footer debe usar position fixed con bottom-0 (o bottom-16 en mobile para no solaparse con el nav). Mostrar "Siguiente" en TODOS los pasos excepto el último.

3. En TODOS los strings que escribas, usar UTF-8 directo. NUNCA \uXXXX.

---

## VERIFICACIÓN

1. npx tsc -b --noEmit → 0 errores
2. npx vite build → build exitoso
3. Screenshots Playwright (1400x1000):
   - Dashboard completo (header navy/slate + glass KPIs + gráfico monocromático + leads + errores)
   - Vehículos (tabla limpia con cards blancas)
   - Modal de vehículo
   - Wizard paso 2 con botones de navegación visibles
   - Wizard paso 4 con matrícula
   - Leads
   - Reportes
   - Configuración
