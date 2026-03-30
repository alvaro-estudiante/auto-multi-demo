import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarMenuBadge,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  LayoutDashboard,
  Car,
  Plus,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronsUpDown,
} from 'lucide-react'
import { getPendingLeadsCount, getReservedCount } from '@/data/mock-data'
import type { Section } from '@/App'

interface AppSidebarProps {
  activeSection: Section
  onNavigate: (section: Section) => void
}

const mainNav = [
  { title: 'Dashboard', section: 'dashboard' as Section, icon: LayoutDashboard },
  { title: 'Vehículos', section: 'vehiculos' as Section, icon: Car, badgeType: 'amber' as const },
  { title: 'Leads / CRM', section: 'leads' as Section, icon: Users, badgeType: 'blue' as const },
  { title: 'Reportes', section: 'reportes' as Section, icon: BarChart3 },
  { title: 'Configuración', section: 'config' as Section, icon: Settings },
]

export function AppSidebar({ activeSection, onNavigate }: AppSidebarProps) {
  const pendingLeads = getPendingLeadsCount()
  const reservedCount = getReservedCount()

  return (
    <Sidebar collapsible="icon" className="sidebar-gradient border-r-0">
      <SidebarHeader className="p-5">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/8 border border-white/8">
            <Car className="h-5 w-5 text-white/90" />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <span className="font-heading text-lg font-bold tracking-tight text-white">
              AutoMulti
            </span>
            <span className="block text-[9px] text-white/30 tracking-[0.15em] uppercase font-medium">
              Flama Studio
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="px-3">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onNavigate('subir')}
                  tooltip="Subir vehículo"
                  className="bg-white text-slate-900 hover:bg-white hover:text-slate-900 font-semibold py-3 rounded-xl mb-8 transition-all duration-200 hover:shadow-md"
                >
                  <Plus className="h-4 w-4" />
                  <span>Subir vehículo</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="px-3">
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map(item => (
                <SidebarMenuItem key={item.section}>
                  <SidebarMenuButton
                    onClick={() => onNavigate(item.section)}
                    isActive={activeSection === item.section}
                    tooltip={item.title}
                    className="text-white/50 hover:text-white/80 hover:bg-white/5 data-[active=true]:text-white data-[active=true]:bg-white/8 data-[active=true]:font-medium rounded-lg px-3 py-2.5 transition-all duration-150"
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="text-sm">{item.title}</span>
                  </SidebarMenuButton>
                  {item.badgeType === 'blue' && pendingLeads > 0 && (
                    <SidebarMenuBadge className="bg-blue-600/80 text-white border-0 text-[10px] font-medium rounded-md px-1.5">
                      {pendingLeads}
                    </SidebarMenuBadge>
                  )}
                  {item.badgeType === 'amber' && reservedCount > 0 && (
                    <SidebarMenuBadge className="bg-amber-500/80 text-white border-0 text-[10px] font-medium rounded-md px-1.5">
                      {reservedCount}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-white/5">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<SidebarMenuButton size="lg" className="w-full text-white/60 hover:text-white/80 hover:bg-white/5 data-[state=open]:bg-white/8" />}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-600 border border-white/10">
              <span className="text-white text-xs font-semibold">PN</span>
            </div>
            <div className="group-data-[collapsible=icon]:hidden flex-1 text-left">
              <p className="text-sm font-medium leading-none text-white/90">Paco Núñez</p>
              <p className="text-[10px] text-white/40 mt-0.5 uppercase tracking-wider">Administrador</p>
            </div>
            <ChevronsUpDown className="ml-auto h-4 w-4 text-white/25 group-data-[collapsible=icon]:hidden" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem>Mi cuenta</DropdownMenuItem>
            <DropdownMenuItem>Preferencias</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
