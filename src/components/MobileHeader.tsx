import { Button } from "@/components/ui/button"
import { LayoutDashboard, FileText, CheckSquare, LogOut, Building, Factory, Shield } from "lucide-react"
import type { Pegawai, Role, ViewType } from "@/store/types"
import { APP_VERSION } from "@/store/changelog"
import { cn } from "@/lib/utils"

interface MobileHeaderProps {
  currentView: string;
  setCurrentView: (view: ViewType) => void;
  onLogout: () => void;
  user: { role: Role; pegawai?: Pegawai };
}

export function MobileHeader({ currentView, setCurrentView, onLogout, user }: MobileHeaderProps) {
  const navItems: { view: ViewType; label: string; icon: React.ReactNode; roles?: Role[] }[] = [
    { view: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { view: 'table',     label: 'Riwayat',   icon: <FileText className="w-5 h-5" /> },
    ...(user.role === 'VP' || user.role === 'SVP_Operasi'
      ? [{ view: 'approval' as ViewType, label: 'Approval', icon: <CheckSquare className="w-5 h-5" /> }]
      : []),
    ...(user.role === 'Sekuriti'
      ? [
          { view: 'master_perkantoran' as ViewType, label: 'Kantoran', icon: <Building className="w-5 h-5" /> },
          { view: 'master_pabrik'      as ViewType, label: 'Pabrik',   icon: <Factory className="w-5 h-5" /> },
        ]
      : []),
  ]

  return (
    <>
      {/* Top Header Bar */}
      <header className="md:hidden bg-card/60 backdrop-blur-2xl border-b border-border/50 h-14 flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex items-center gap-2 font-bold">
          <Shield className="w-5 h-5 text-primary" />
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold">SI TAMU</span>
            <span className="text-[9px] text-primary font-mono font-normal">v{APP_VERSION}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="truncate max-w-[120px]">
            {user.role !== 'Sekuriti' ? user.pegawai?.nama : 'Petugas Sekuriti'}
          </span>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={onLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-card/80 backdrop-blur-2xl border-t border-border/50 flex items-center justify-around h-16 px-2 safe-area-inset-bottom">
        {navItems.map(item => (
          <button
            key={item.view}
            onClick={() => setCurrentView(item.view)}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-[10px] font-medium transition-colors rounded-md",
              currentView === item.view || (item.view === 'table' && currentView === 'form')
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  )
}
