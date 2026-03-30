import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { DashboardPage } from '@/components/pages/dashboard-page'
import { VehiclesPage } from '@/components/pages/vehicles-page'
import { UploadPage } from '@/components/pages/upload-page'
import { LeadsPage } from '@/components/pages/leads-page'
import { ReportsPage } from '@/components/pages/reports-page'
import { ConfigPage } from '@/components/pages/config-page'

export type Section = 'dashboard' | 'vehiculos' | 'subir' | 'leads' | 'reportes' | 'config'

const sectionTitles: Record<Section, string> = {
  dashboard: 'Dashboard',
  vehiculos: 'Vehículos',
  subir: 'Subir vehículo',
  leads: 'Leads / CRM',
  reportes: 'Reportes',
  config: 'Configuración',
}

function App() {
  const [activeSection, setActiveSection] = useState<Section>('dashboard')

  const renderPage = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardPage onNavigate={setActiveSection} />
      case 'vehiculos':
        return <VehiclesPage onNavigate={setActiveSection} />
      case 'subir':
        return <UploadPage onNavigate={setActiveSection} />
      case 'leads':
        return <LeadsPage />
      case 'reportes':
        return <ReportsPage />
      case 'config':
        return <ConfigPage />
    }
  }

  return (
    <DashboardLayout
      activeSection={activeSection}
      sectionTitle={sectionTitles[activeSection]}
      onNavigate={setActiveSection}
    >
      {renderPage()}
    </DashboardLayout>
  )
}

export default App
