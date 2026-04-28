import { Button } from "@/components/ui/button"
import { LayoutDashboard, Menu, LogOut } from "lucide-react"

import type { ViewType } from "@/types"

interface MobileHeaderProps {
  currentView: string;
  setCurrentView: (view: ViewType) => void;
  onLogout: () => void;
}

export function MobileHeader({ currentView, setCurrentView, onLogout }: MobileHeaderProps) {
  return (
    <header className="md:hidden bg-card/60 backdrop-blur-2xl border-b border-border/50 text-foreground h-16 flex items-center justify-between px-4 shrink-0 shadow-sm z-20">
      <div className="flex items-center gap-2 font-bold">
        <LayoutDashboard className="w-5 h-5" /> PGM
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80" onClick={() => setCurrentView(currentView === 'dashboard' ? 'table' : 'dashboard')}>
           <Menu className="w-5 h-5" />
        </Button>
        <Button variant="secondary" size="icon" onClick={onLogout}>
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </header>
  )
}
