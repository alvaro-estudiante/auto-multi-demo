import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppSidebar } from './app-sidebar'
import { MobileNav } from './mobile-nav'
import { Separator } from '@/components/ui/separator'
import { Bell, Car } from 'lucide-react'
import type { Section } from '@/App'

interface DashboardLayoutProps {
  children: React.ReactNode
  activeSection: Section
  sectionTitle: string
  onNavigate: (section: Section) => void
}

export function DashboardLayout({
  children,
  activeSection,
  sectionTitle,
  onNavigate,
}: DashboardLayoutProps) {
  const isDashboard = activeSection === 'dashboard'

  return (
    <TooltipProvider delay={0}>
      <SidebarProvider>
        <AppSidebar activeSection={activeSection} onNavigate={onNavigate} />
        <SidebarInset>
          {/* Header — hidden on dashboard (it has its own) */}
          {!isDashboard && (
            <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 backdrop-blur-md px-4 md:px-6">
              <div className="hidden md:flex items-center gap-3">
                <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground transition-colors" />
                <Separator orientation="vertical" className="h-5" />
                <h1 className="font-heading text-[15px] font-semibold tracking-tight">
                  {sectionTitle}
                </h1>
              </div>
              <div className="flex md:hidden items-center gap-3">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: 'linear-gradient(135deg, #0f172a, #1e40af)' }}
                >
                  <Car className="h-4 w-4 text-white" />
                </div>
                <span className="font-heading text-sm font-semibold tracking-tight">
                  {sectionTitle}
                </span>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <button className="relative flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                  <Bell className="h-[18px] w-[18px]" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
                </button>
              </div>
            </header>
          )}

          <main className="flex-1 overflow-auto">
            {isDashboard ? (
              /* Dashboard renders full-bleed (no padding container) */
              <div className="pb-24 md:pb-6">{children}</div>
            ) : (
              /* Other pages get standard padding */
              <div className="mx-auto max-w-[1100px] p-4 md:p-6 pb-24 md:pb-6">
                {children}
              </div>
            )}
          </main>
        </SidebarInset>

        <MobileNav activeSection={activeSection} onNavigate={onNavigate} />
      </SidebarProvider>
    </TooltipProvider>
  )
}
