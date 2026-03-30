import {
  LayoutDashboard,
  Car,
  Plus,
  Users,
  MoreHorizontal,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getReservedCount } from '@/data/mock-data'
import type { Section } from '@/App'

interface MobileNavProps {
  activeSection: Section
  onNavigate: (section: Section) => void
}

const navItems = [
  { title: 'Dashboard', section: 'dashboard' as Section, icon: LayoutDashboard },
  { title: 'Vehículos', section: 'vehiculos' as Section, icon: Car },
  { title: 'Subir', section: 'subir' as Section, icon: Plus, isAction: true },
  { title: 'Leads', section: 'leads' as Section, icon: Users },
  { title: 'Más', section: 'config' as Section, icon: MoreHorizontal },
]

export function MobileNav({ activeSection, onNavigate }: MobileNavProps) {
  const reservedCount = getReservedCount()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-safe"
      style={{ background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)' }}
    >
      <div className="flex items-center justify-around px-2 py-1.5">
        {navItems.map(item => {
          const isActive = activeSection === item.section

          if (item.isAction) {
            return (
              <button
                key={item.section}
                onClick={() => onNavigate(item.section)}
                className="flex flex-col items-center -mt-5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-900 transition-transform active:scale-95"
                  style={{ boxShadow: '0 4px 12px rgba(15,23,42,0.2)' }}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-medium text-white mt-1">
                  {item.title}
                </span>
              </button>
            )
          }

          return (
            <button
              key={item.section}
              onClick={() => onNavigate(item.section)}
              className={cn(
                'flex flex-col items-center gap-0.5 py-2 px-3 transition-colors',
                isActive ? 'text-white' : 'text-white/50'
              )}
            >
              <span className="relative">
                <item.icon className={cn('h-5 w-5', isActive && 'stroke-[2.5]')} />
                {item.section === 'vehiculos' && reservedCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 bg-amber-400 rounded-full" />
                )}
              </span>
              <span className="text-[10px] font-medium">{item.title}</span>
              {isActive && <span className="h-0.5 w-4 rounded-full bg-white mt-0.5" />}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
