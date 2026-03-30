export type PortalStatus = 'ok' | 'error' | 'pending'
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

export interface Vehicle {
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
  status: VehicleStatus
  matricula: string
  vin: string
  potencia: number
  potenciaKw: number
  cilindrada: number
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
  version: string
  extras: string[]
  documentos: VehicleDocument[]
  historialPrecios: PriceChange[]
}

export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  portal: string
  vehicleId: string
  vehicleLabel: string
  date: string
  status: 'pendiente' | 'contactado' | 'vendido' | 'descartado'
  message: string
}

export interface PortalStats {
  name: string
  slug: string
  leadsMonth: number
  cost: number
  sales: number
  color: string
  plan: string
}

export interface MonthlyLeads {
  month: string
  cochesNet: number
  wallapop: number
  milanuncios: number
  autoScout24: number
  autocasion: number
}

export interface TeamMember {
  id: string
  name: string
  email: string
  role: 'admin' | 'operador'
  avatar: string
}

export const vehicles: Vehicle[] = [
  {
    id: 'v1',
    brand: 'BMW',
    model: 'Serie 3 320d',
    year: 2021,
    price: 28900,
    km: 45000,
    fuel: 'Diésel',
    color: 'Negro Sapphire',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=260&fit=crop',
    description: 'BMW Serie 3 320d en perfecto estado. Paquete M Sport, navegación profesional, asientos calefactados. Único propietario, mantenimiento oficial BMW.',
    portalStatus: { cochesNet: 'ok', wallapop: 'ok', milanuncios: 'ok', autoScout24: 'ok', autocasion: 'ok' },
    leads: 12,
    views: 847,
    createdAt: '2026-02-15',
    status: 'publicado',
    matricula: '4521 KMN',
    vin: 'WBAPK5C55BA952631',
    potencia: 190,
    potenciaKw: 140,
    cilindrada: 1995,
    cambio: 'Automático',
    puertas: 4,
    plazas: 5,
    etiquetaAmbiental: 'C',
    traccion: 'Trasera',
    garantia: '12 meses',
    precioCompra: 23500,
    precioAnterior: 30900,
    precioMercado: 29200,
    propietariosAnteriores: 1,
    fechaItv: '2027-02-15',
    colorInterior: 'Negro Dakota',
    version: 'M Sport',
    extras: ['Navegación GPS', 'Sensores aparcamiento', 'Cámara trasera', 'Climatizador bizona', 'Apple CarPlay', 'Android Auto', 'Faros LED', 'Llantas aleación 18"', 'Asientos calefactados', 'Tapicería cuero', 'Control crucero adaptativo', 'Start/Stop', 'Volante multifunción'],
    documentos: [
      { id: 'd1', name: 'ITV vigente', type: 'itv', date: '2025-02-15' },
      { id: 'd2', name: 'Contrato de compra', type: 'contrato', date: '2026-02-10' },
      { id: 'd3', name: 'Informe CARFAX', type: 'informe', date: '2026-02-12' },
    ],
    historialPrecios: [
      { date: '2026-02-15', oldPrice: 30900, newPrice: 29900, reason: 'Ajuste de mercado' },
      { date: '2026-03-10', oldPrice: 29900, newPrice: 28900, reason: 'Reducción por rotación' },
    ],
  },
  {
    id: 'v2',
    brand: 'Audi',
    model: 'A4 Avant 2.0 TDI',
    year: 2020,
    price: 24500,
    km: 62000,
    fuel: 'Diésel',
    color: 'Gris Monsón',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=260&fit=crop',
    description: 'Audi A4 Avant con paquete S-Line exterior, techo solar panorámico, cámara de aparcamiento 360°. Historial completo en Audi.',
    portalStatus: { cochesNet: 'ok', wallapop: 'error', milanuncios: 'ok', autoScout24: 'ok', autocasion: 'pending' },
    leads: 8,
    views: 623,
    createdAt: '2026-02-20',
    status: 'publicado',
    matricula: '7834 HLS',
    vin: 'WAUZZZ8K5BA012345',
    potencia: 150,
    potenciaKw: 110,
    cilindrada: 1968,
    cambio: 'Automático',
    puertas: 5,
    plazas: 5,
    etiquetaAmbiental: 'C',
    traccion: 'Delantera',
    garantia: '6 meses',
    precioCompra: 19800,
    precioAnterior: undefined,
    precioMercado: 25100,
    propietariosAnteriores: 2,
    fechaItv: '2026-11-20',
    colorInterior: 'Negro Alcantara',
    version: 'S-Line',
    extras: ['Navegación GPS', 'Techo panorámico', 'Cámara trasera 360°', 'Climatizador bizona', 'Apple CarPlay', 'Faros LED Matrix', 'Llantas aleación 19"', 'Asientos eléctricos', 'Control crucero adaptativo', 'Arranque sin llave', 'Head-up display'],
    documentos: [
      { id: 'd4', name: 'ITV vigente', type: 'itv', date: '2025-11-20' },
      { id: 'd5', name: 'Contrato de compra', type: 'contrato', date: '2026-02-18' },
    ],
    historialPrecios: [],
  },
  {
    id: 'v3',
    brand: 'Mercedes-Benz',
    model: 'Clase C 200',
    year: 2022,
    price: 34900,
    km: 28000,
    fuel: 'Gasolina',
    color: 'Blanco Polar',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=260&fit=crop',
    description: 'Mercedes Clase C 200 AMG Line. MBUX con pantalla táctil 11.9", conducción semi-autónoma, faros Digital Light. Como nuevo.',
    portalStatus: { cochesNet: 'ok', wallapop: 'ok', milanuncios: 'error', autoScout24: 'ok', autocasion: 'ok' },
    leads: 15,
    views: 1102,
    createdAt: '2026-01-10',
    status: 'reservado',
    matricula: '1298 JTR',
    vin: 'WDD2050091A123456',
    potencia: 204,
    potenciaKw: 150,
    cilindrada: 1496,
    cambio: 'Automático',
    puertas: 4,
    plazas: 5,
    etiquetaAmbiental: 'C',
    traccion: 'Trasera',
    garantia: '24 meses',
    precioCompra: 28500,
    precioAnterior: 36900,
    precioMercado: 34500,
    propietariosAnteriores: 1,
    fechaItv: '2028-01-10',
    colorInterior: 'Beige Silk',
    version: 'AMG Line',
    extras: ['Navegación GPS', 'MBUX 11.9"', 'Conducción semi-autónoma', 'Digital Light', 'Climatizador automático', 'Apple CarPlay', 'Android Auto', 'Cámara trasera', 'Sensores aparcamiento', 'Asientos calefactados', 'Tapicería cuero Artico', 'Llantas AMG 18"', 'Volante multifunción', 'Bluetooth'],
    documentos: [
      { id: 'd6', name: 'ITV vigente', type: 'itv', date: '2026-01-10' },
      { id: 'd7', name: 'Contrato de compra', type: 'contrato', date: '2026-01-05' },
      { id: 'd8', name: 'Informe CARFAX', type: 'informe', date: '2026-01-06' },
      { id: 'd9', name: 'Garantía Mercedes-Benz', type: 'garantia', date: '2026-01-05' },
    ],
    historialPrecios: [
      { date: '2026-01-15', oldPrice: 36900, newPrice: 34900, reason: 'Ajuste competitivo' },
    ],
  },
  {
    id: 'v4',
    brand: 'Volkswagen',
    model: 'Golf 8 GTI',
    year: 2023,
    price: 38500,
    km: 12000,
    fuel: 'Gasolina',
    color: 'Rojo Tornado',
    image: 'https://images.unsplash.com/photo-1631295387526-18854e87be3c?w=400&h=260&fit=crop',
    description: 'Golf GTI 245cv con apenas 12.000km. Paquete Performance, diferencial electrónico XDS, cuadro digital. Impecable.',
    portalStatus: { cochesNet: 'ok', wallapop: 'ok', milanuncios: 'ok', autoScout24: 'ok', autocasion: 'ok' },
    leads: 22,
    views: 1540,
    createdAt: '2026-03-01',
    status: 'publicado',
    matricula: '9012 MPK',
    vin: 'WVWZZZ1KZPM012345',
    potencia: 245,
    potenciaKw: 180,
    cilindrada: 1984,
    cambio: 'Automático',
    puertas: 5,
    plazas: 5,
    etiquetaAmbiental: 'C',
    traccion: 'Delantera',
    garantia: '12 meses',
    precioCompra: 32000,
    precioAnterior: undefined,
    precioMercado: 37800,
    propietariosAnteriores: 1,
    fechaItv: '2027-03-01',
    colorInterior: 'Negro/Rojo Clark',
    version: 'Performance',
    extras: ['Navegación Discover Pro', 'Diferencial XDS', 'Cuadro Digital Cockpit Pro', 'Climatizador bizona', 'Apple CarPlay', 'Android Auto', 'Faros LED IQ.Light', 'Llantas aleación 19"', 'Asientos deportivos', 'Control crucero adaptativo', 'Start/Stop', 'USB-C', 'Bluetooth', 'ESP deportivo'],
    documentos: [
      { id: 'd10', name: 'ITV vigente', type: 'itv', date: '2027-03-01' },
      { id: 'd11', name: 'Contrato de compra', type: 'contrato', date: '2026-02-25' },
      { id: 'd12', name: 'Garantía Volkswagen', type: 'garantia', date: '2026-02-25' },
    ],
    historialPrecios: [],
  },
  {
    id: 'v5',
    brand: 'SEAT',
    model: 'León FR 1.5 TSI',
    year: 2022,
    price: 21900,
    km: 35000,
    fuel: 'Gasolina',
    color: 'Azul Misterio',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=260&fit=crop',
    description: 'SEAT León FR con motor 1.5 TSI 150cv. Virtual Cockpit, navegación, cámara trasera, sensores de aparcamiento. Revisado.',
    portalStatus: { cochesNet: 'ok', wallapop: 'ok', milanuncios: 'ok', autoScout24: 'pending', autocasion: 'ok' },
    leads: 6,
    views: 412,
    createdAt: '2026-03-05',
    status: 'publicado',
    matricula: '5643 LFN',
    vin: 'VSSZZZKL7NR012345',
    potencia: 150,
    potenciaKw: 110,
    cilindrada: 1498,
    cambio: 'Manual',
    puertas: 5,
    plazas: 5,
    etiquetaAmbiental: 'C',
    traccion: 'Delantera',
    garantia: '6 meses',
    precioCompra: 17200,
    precioAnterior: 22900,
    precioMercado: 21500,
    propietariosAnteriores: 1,
    fechaItv: '2026-09-05',
    colorInterior: 'Negro Dinamica',
    version: 'FR',
    extras: ['Virtual Cockpit', 'Navegación GPS', 'Cámara trasera', 'Sensores aparcamiento', 'Climatizador automático', 'Bluetooth', 'USB', 'Llantas aleación 17"', 'Control crucero', 'ABS', 'ESP', 'Airbags laterales'],
    documentos: [
      { id: 'd13', name: 'ITV vigente', type: 'itv', date: '2025-09-05' },
      { id: 'd14', name: 'Contrato de compra', type: 'contrato', date: '2026-03-02' },
    ],
    historialPrecios: [
      { date: '2026-03-20', oldPrice: 22900, newPrice: 21900, reason: 'Reducción por rotación' },
    ],
  },
  {
    id: 'v6',
    brand: 'Toyota',
    model: 'Corolla Hybrid 180H',
    year: 2023,
    price: 26900,
    km: 18000,
    fuel: 'Híbrido',
    color: 'Gris Platino',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=260&fit=crop',
    description: 'Toyota Corolla Hybrid 180H con sistema Safety Sense 3.0, head-up display, JBL premium audio. Garantía oficial hasta 2028.',
    portalStatus: { cochesNet: 'ok', wallapop: 'ok', milanuncios: 'ok', autoScout24: 'ok', autocasion: 'ok' },
    leads: 9,
    views: 567,
    createdAt: '2026-02-28',
    status: 'publicado',
    matricula: '3187 KRT',
    vin: 'SB1K23BE30E012345',
    potencia: 140,
    potenciaKw: 103,
    cilindrada: 1798,
    cambio: 'Automático',
    puertas: 5,
    plazas: 5,
    etiquetaAmbiental: 'ECO',
    traccion: 'Delantera',
    garantia: '24 meses',
    precioCompra: 22000,
    precioAnterior: undefined,
    precioMercado: 27200,
    propietariosAnteriores: 1,
    fechaItv: '2027-02-28',
    colorInterior: 'Negro Tela',
    version: 'Style Plus',
    extras: ['Safety Sense 3.0', 'Head-up display', 'JBL Premium Audio', 'Navegación GPS', 'Apple CarPlay', 'Android Auto', 'Climatizador bizona', 'Sensores aparcamiento', 'Cámara trasera', 'Control crucero adaptativo', 'Start/Stop', 'Bluetooth', 'Llantas aleación 17"', 'Faros LED'],
    documentos: [
      { id: 'd15', name: 'ITV vigente', type: 'itv', date: '2027-02-28' },
      { id: 'd16', name: 'Contrato de compra', type: 'contrato', date: '2026-02-20' },
      { id: 'd17', name: 'Garantía Toyota', type: 'garantia', date: '2026-02-20' },
    ],
    historialPrecios: [],
  },
  {
    id: 'v7',
    brand: 'Peugeot',
    model: '3008 GT Pack',
    year: 2021,
    price: 29900,
    km: 52000,
    fuel: 'Diésel',
    color: 'Verde Amazonas',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&h=260&fit=crop',
    description: 'Peugeot 3008 GT Pack con i-Cockpit amplificado, Night Vision, grip control. Interior en Alcantara. Muy equipado.',
    portalStatus: { cochesNet: 'error', wallapop: 'ok', milanuncios: 'ok', autoScout24: 'ok', autocasion: 'ok' },
    leads: 5,
    views: 389,
    createdAt: '2026-03-10',
    status: 'publicado',
    matricula: '8456 HSM',
    vin: 'VF3MCYHZRML012345',
    potencia: 180,
    potenciaKw: 132,
    cilindrada: 1499,
    cambio: 'Automático',
    puertas: 5,
    plazas: 5,
    etiquetaAmbiental: 'C',
    traccion: 'Delantera',
    garantia: '6 meses',
    precioCompra: 24500,
    precioAnterior: 31900,
    precioMercado: 30500,
    propietariosAnteriores: 1,
    fechaItv: '2027-03-10',
    colorInterior: 'Negro Alcantara',
    version: 'GT Pack',
    extras: ['i-Cockpit amplificado', 'Night Vision', 'Grip Control', 'Climatizador bizona', 'Navegación GPS 3D', 'Apple CarPlay', 'Cámara trasera 360°', 'Sensores aparcamiento', 'Techo panorámico', 'Asientos eléctricos', 'Faros LED', 'Llantas aleación 19"', 'Arranque sin llave', 'Start/Stop'],
    documentos: [
      { id: 'd18', name: 'ITV vigente', type: 'itv', date: '2025-03-10' },
      { id: 'd19', name: 'Contrato de compra', type: 'contrato', date: '2026-03-08' },
    ],
    historialPrecios: [
      { date: '2026-03-15', oldPrice: 31900, newPrice: 29900, reason: 'Ajuste de mercado' },
    ],
  },
  {
    id: 'v8',
    brand: 'Ford',
    model: 'Focus ST-Line 1.0 EcoBoost',
    year: 2022,
    price: 19900,
    km: 41000,
    fuel: 'Gasolina',
    color: 'Azul Desert Island',
    image: 'https://images.unsplash.com/photo-1551830820-330a71b99659?w=400&h=260&fit=crop',
    description: 'Ford Focus ST-Line con motor EcoBoost 125cv. SYNC 3, llantas 18", suspensión deportiva. Excelente relación calidad-precio.',
    portalStatus: { cochesNet: 'ok', wallapop: 'pending', milanuncios: 'ok', autoScout24: 'error', autocasion: 'ok' },
    leads: 4,
    views: 298,
    createdAt: '2026-03-15',
    status: 'vendido',
    matricula: '2765 JWR',
    vin: 'WF0XXXGCDXNY12345',
    potencia: 125,
    potenciaKw: 92,
    cilindrada: 999,
    cambio: 'Manual',
    puertas: 5,
    plazas: 5,
    etiquetaAmbiental: 'C',
    traccion: 'Delantera',
    garantia: '3 meses',
    precioCompra: 15200,
    precioAnterior: 20900,
    precioMercado: 19500,
    propietariosAnteriores: 2,
    fechaItv: '2026-12-15',
    colorInterior: 'Negro Tela',
    version: 'ST-Line',
    extras: ['SYNC 3', 'Navegación GPS', 'Llantas aleación 18"', 'Suspensión deportiva', 'Climatizador automático', 'Bluetooth', 'USB', 'Sensores aparcamiento traseros', 'Control crucero', 'ABS', 'ESP', 'Faros LED'],
    documentos: [
      { id: 'd20', name: 'ITV vigente', type: 'itv', date: '2025-12-15' },
      { id: 'd21', name: 'Contrato de compra', type: 'contrato', date: '2026-03-12' },
      { id: 'd22', name: 'Contrato de venta', type: 'contrato', date: '2026-03-25' },
    ],
    historialPrecios: [
      { date: '2026-03-18', oldPrice: 20900, newPrice: 19900, reason: 'Negociación con comprador' },
    ],
  },
]

export const leads: Lead[] = [
  {
    id: 'l1',
    name: 'Carlos Martínez',
    email: 'carlos.martinez@gmail.com',
    phone: '+34 612 345 678',
    portal: 'Coches.net',
    vehicleId: 'v4',
    vehicleLabel: 'VW Golf GTI 2023',
    date: '2026-03-28',
    status: 'pendiente',
    message: 'Buenos días, me interesa el Golf GTI. ¿Está disponible para verlo este sábado? ¿Aceptan financiación?',
  },
  {
    id: 'l2',
    name: 'María García López',
    email: 'mgarcia@outlook.es',
    phone: '+34 654 321 098',
    portal: 'AutoScout24',
    vehicleId: 'v3',
    vehicleLabel: 'Mercedes C 200 2022',
    date: '2026-03-28',
    status: 'pendiente',
    message: 'Hola, ¿el precio es negociable? Busco algo para uso familiar y este modelo me encaja.',
  },
  {
    id: 'l3',
    name: 'Antonio Ruiz',
    email: 'antonio.ruiz@empresa.com',
    phone: '+34 678 901 234',
    portal: 'Wallapop',
    vehicleId: 'v1',
    vehicleLabel: 'BMW Serie 3 320d 2021',
    date: '2026-03-27',
    status: 'contactado',
    message: 'Me interesa mucho el BMW. ¿Tiene el libro de revisiones? ¿Aceptáis coche a cuenta?',
  },
  {
    id: 'l4',
    name: 'Laura Fernández',
    email: 'laura.fdez@yahoo.com',
    phone: '+34 623 456 789',
    portal: 'Coches.net',
    vehicleId: 'v6',
    vehicleLabel: 'Toyota Corolla Hybrid 2023',
    date: '2026-03-26',
    status: 'contactado',
    message: 'Busco un híbrido fiable. ¿Qué consumo real tiene? ¿Se puede probar?',
  },
  {
    id: 'l5',
    name: 'Pedro Sánchez Ramos',
    email: 'pedro.sr@gmail.com',
    phone: '+34 690 123 456',
    portal: 'Milanuncios',
    vehicleId: 'v5',
    vehicleLabel: 'SEAT León FR 2022',
    date: '2026-03-25',
    status: 'vendido',
    message: 'Perfecto, quedamos el viernes para cerrar la compra. Llevaré transferencia.',
  },
  {
    id: 'l6',
    name: 'Elena Moreno',
    email: 'elena.moreno@hotmail.com',
    phone: '+34 645 678 901',
    portal: 'Autocasión',
    vehicleId: 'v2',
    vehicleLabel: 'Audi A4 Avant 2020',
    date: '2026-03-24',
    status: 'descartado',
    message: 'Al final me he decidido por otro modelo. Gracias por la atención.',
  },
  {
    id: 'l7',
    name: 'Javier López',
    email: 'javi.lopez@proton.me',
    phone: '+34 667 890 123',
    portal: 'Coches.net',
    vehicleId: 'v4',
    vehicleLabel: 'VW Golf GTI 2023',
    date: '2026-03-23',
    status: 'pendiente',
    message: 'Hola, ¿el GTI tiene el pack Performance? ¿Precio final con IVA incluido?',
  },
  {
    id: 'l8',
    name: 'Ana Belén Torres',
    email: 'anabelen.t@gmail.com',
    phone: '+34 634 567 890',
    portal: 'AutoScout24',
    vehicleId: 'v7',
    vehicleLabel: 'Peugeot 3008 GT 2021',
    date: '2026-03-22',
    status: 'contactado',
    message: '¿Podríais enviarme más fotos del interior? Me interesa especialmente el Night Vision.',
  },
]

export const portalStats: PortalStats[] = [
  { name: 'Coches.net', slug: 'cochesNet', leadsMonth: 34, cost: 890, sales: 4, color: '#6366f1', plan: 'Pack Premium' },
  { name: 'Wallapop', slug: 'wallapop', leadsMonth: 18, cost: 120, sales: 2, color: '#10b981', plan: 'PRO Motor' },
  { name: 'Milanuncios', slug: 'milanuncios', leadsMonth: 12, cost: 85, sales: 1, color: '#f97316', plan: 'Advance-ON Profesional' },
  { name: 'AutoScout24', slug: 'autoScout24', leadsMonth: 21, cost: 340, sales: 3, color: '#f59e0b', plan: 'Sumauto Estándar' },
  { name: 'Autocasión', slug: 'autocasion', leadsMonth: 8, cost: 0, sales: 1, color: '#8b5cf6', plan: 'Incluido con AutoScout24' },
]

export const monthlyLeads: MonthlyLeads[] = [
  { month: 'Oct', cochesNet: 28, wallapop: 12, milanuncios: 8, autoScout24: 15, autocasion: 5 },
  { month: 'Nov', cochesNet: 32, wallapop: 15, milanuncios: 10, autoScout24: 18, autocasion: 6 },
  { month: 'Dic', cochesNet: 22, wallapop: 10, milanuncios: 7, autoScout24: 12, autocasion: 4 },
  { month: 'Ene', cochesNet: 30, wallapop: 14, milanuncios: 9, autoScout24: 16, autocasion: 7 },
  { month: 'Feb', cochesNet: 36, wallapop: 16, milanuncios: 11, autoScout24: 20, autocasion: 8 },
  { month: 'Mar', cochesNet: 34, wallapop: 18, milanuncios: 12, autoScout24: 21, autocasion: 8 },
]

export const teamMembers: TeamMember[] = [
  { id: 't1', name: 'Paco Núñez', email: 'paco@paconunezmotors.es', role: 'admin', avatar: 'PN' },
  { id: 't2', name: 'Miguel Ángel Romero', email: 'miguel@paconunezmotors.es', role: 'operador', avatar: 'MA' },
  { id: 't3', name: 'Sandra López', email: 'sandra@paconunezmotors.es', role: 'operador', avatar: 'SL' },
]

export const portalNames: Record<string, string> = {
  cochesNet: 'Coches.net',
  wallapop: 'Wallapop',
  milanuncios: 'Milanuncios',
  autoScout24: 'AutoScout24',
  autocasion: 'Autocasión',
}

// ─── Helper functions ────────────────────────────────────

export function getVehicleErrors() {
  return vehicles.filter(v =>
    Object.values(v.portalStatus).some(s => s === 'error')
  ).map(v => ({
    vehicle: v,
    portals: Object.entries(v.portalStatus)
      .filter(([, status]) => status === 'error')
      .map(([portal]) => portalNames[portal] || portal),
  }))
}

export function getPendingLeadsCount() {
  return leads.filter(l => l.status === 'pendiente').length
}

export function getTotalLeadsThisMonth() {
  return portalStats.reduce((acc, p) => acc + p.leadsMonth, 0)
}

export function getTotalMonthlyCost() {
  return portalStats.reduce((acc, p) => acc + p.cost, 0)
}

export function getTotalSalesThisMonth() {
  return portalStats.reduce((acc, p) => acc + p.sales, 0)
}

export function getDaysInStock(createdAt: string): number {
  const now = new Date('2026-03-29')
  return Math.floor((now.getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24))
}

export function getAvgDaysInStock(): number {
  const published = vehicles.filter(v => v.status === 'publicado')
  if (published.length === 0) return 0
  return Math.round(published.reduce((acc, v) => acc + getDaysInStock(v.createdAt), 0) / published.length)
}

export function getVehiclesByStatus() {
  return {
    publicado: vehicles.filter(v => v.status === 'publicado').length,
    reservado: vehicles.filter(v => v.status === 'reservado').length,
    vendido: vehicles.filter(v => v.status === 'vendido').length,
  }
}

export function getAvgMargin(): number {
  const sold = vehicles.filter(v => v.status === 'vendido')
  if (sold.length === 0) return 0
  return Math.round(sold.reduce((acc, v) => acc + (v.price - v.precioCompra), 0) / sold.length)
}

export function getReservedCount(): number {
  return vehicles.filter(v => v.status === 'reservado').length
}

export function getDaysColor(days: number): string {
  if (days < 30) return 'text-emerald-600'
  if (days < 60) return 'text-amber-600'
  return 'text-red-600'
}

export function getDaysBgColor(days: number): string {
  if (days < 30) return 'bg-emerald-50 text-emerald-700'
  if (days < 60) return 'bg-amber-50 text-amber-700'
  return 'bg-red-50 text-red-700'
}

export function getPriceComparison(price: number, marketPrice: number): { label: string; color: string } {
  if (price < marketPrice * 0.95) return { label: 'Buen precio', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
  if (price > marketPrice * 1.05) return { label: 'Por encima del mercado', color: 'bg-red-50 text-red-700 border-red-200' }
  return { label: 'Precio correcto', color: 'bg-slate-100 text-slate-600 border-slate-200' }
}
