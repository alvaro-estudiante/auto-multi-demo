# AUTO-MULTI DEMO — CLAUDE.md

## Proyecto
- **App:** AutoMulti — Demo visual de panel de multipublicación de vehículos para concesionarios
- **Tipo:** Prototipo NO funcional (solo frontend con datos fake)
- **Objetivo:** Enseñar a Paco Núñez (cliente piloto) y luego a Coches.net en una reunión
- **Developer:** Álvaro Fernández (Flama Studio)
- **Vault:** C:/Users/Alvaro/workspace/obsidian/Flama-Vault/ (leer INDEX.md para flujos de trabajo)

## Stack
- Vite + React 19 + TypeScript
- Tailwind CSS 4
- shadcn/ui (estilo new-york, tema claro)
- Recharts para gráficos
- Lucide React para iconos
- NO hay backend, NO hay APIs, NO hay Supabase — todo es datos fake hardcodeados

## Qué es esta app
Un panel de gestión para concesionarios de coches de ocasión que permite:
1. Subir UN vehículo → se publica en todos los portales (Coches.net, Wallapop, Milanuncios, AutoScout24, Autocasión)
2. Marcar como vendido → se retira de todos
3. Ver analítica de gasto vs retorno por portal
4. Recibir leads en una bandeja tipo CRM básico
5. Entrada por voz + foto de ficha técnica → IA rellena datos

## Módulos / Pantallas (6 en total)
1. **Dashboard** — KPIs (vehículos activos, leads, visitas, conversión), gráfico de leads por mes, leads recientes, bloque de errores de publicación
2. **Vehículos** — Tabla tipo Coches.net PRO con estado por portal (✅/🔴/⏳), leads, visitas. Click → detalle con links a anuncios + botón "Mejorar con IA"
3. **Subir vehículo** — Flujo de 6 pasos: tipo → portales → voz o manual → datos → fotos → confirmar
4. **Leads/CRM** — Bandeja de leads con filtros por estado (pendiente/contactado/vendido/descartado), portal de origen, vehículo
5. **Reportes** — Leads por portal (bar chart), gasto mensual (pie chart), tabla de rentabilidad con coste/lead, coste/venta, conversión
6. **Configuración** — Pestañas: portales conectados, usuarios (admin/operador), datos concesionario, suscripción

## Datos fake del concesionario demo
- **Concesionario:** Paco Núñez Motor (Málaga)
- **Admin:** Paco Núñez
- **Operadores:** Miguel Ángel, Sandra López
- **Stock:** 8 vehículos de ejemplo (BMW, Audi, Mercedes, VW, Seat, Toyota, Peugeot, Ford)
- **Portales:** Coches.net (890€/mes), Wallapop (120€), Milanuncios (85€), AutoScout24 (340€), Autocasión (incluido)

## Reglas de diseño
LEER SIEMPRE antes de crear cualquier componente:
- C:/Users/Alvaro/workspace/obsidian/Flama-Vault/04-Reglas-Proyecto/reglas-anti-dribbble.md
- C:/Users/Alvaro/workspace/obsidian/Flama-Vault/04-Reglas-Proyecto/reglas-generales-flama.md
- C:/Users/Alvaro/workspace/obsidian/Flama-Vault/25-React-Components-Premium/dashboard-layouts.md

### Estética
- Estilo: SaaS moderno, claro y profesional pero con PERSONALIDAD (no genérico)
- NO usar la estética típica de dashboards IA (todo gris, todo Inter, todo rounded-xl)
- Tipografía con carácter (NO Inter, NO Roboto — buscar algo con personalidad)
- Micro-animaciones en hover, transiciones suaves entre páginas
- Responsive: DEBE funcionar perfectamente en móvil (375px) y tablet (768px)
- Sidebar colapsable en mobile → bottom nav o hamburger
- Cards con variedad visual (no todas iguales)
- Al menos 1 efecto premium sutil (hover, reveal, transición)

### Colores sugeridos (ajustables)
- Fondo principal: #FAFAF9 (warm white)
- Fondo cards: #FFFFFF
- Texto principal: #1A1A1A
- Texto secundario: #6B7280
- Acento principal: #2563EB (azul profesional)
- Acento éxito: #059669
- Acento error: #DC2626
- Acento warning: #D97706
- Bordes: #E5E7EB

## NO hacer
- NO usar Inter, Roboto, Arial, system fonts
- NO border-radius uniforme en todo (rounded-xl en todo = genérico)
- NO shadow-md/lg/xl genéricos de Tailwind
- NO diseño que parezca un template de admin gratuito
- NO olvidar responsive mobile
- NO console.log en el código final

## Vault de referencia
Para componentes React premium: C:/Users/Alvaro/workspace/obsidian/Flama-Vault/25-React-Components-Premium/
Para paletas y tipografías: C:/Users/Alvaro/workspace/obsidian/Flama-Vault/20-Tipografia-Color-Estilo/
Para efectos premium sutiles: C:/Users/Alvaro/workspace/obsidian/Flama-Vault/17-Efectos-Premium/
Para el detalle de módulos: C:/Users/Alvaro/workspace/obsidian/Flama-Vault/Proyectos/multiplicador-vehiculos/07-modulos-panel.md
