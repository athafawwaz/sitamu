import { Button } from "@/components/ui/button"
import { LayoutDashboard, FileText, CheckSquare, Database, Building, Factory, LogOut, Info } from "lucide-react"
import type { Pegawai, Role, ViewType } from "@/store/types"
import { useState } from "react"
import { APP_VERSION } from "@/store/changelog"
import { ChangelogModal } from "./ChangelogModal"
import { Badge } from "@/components/ui/badge"

interface SidebarProps {
  user: { role: Role, pegawai?: Pegawai };
  currentView: string;
  setCurrentView: (view: ViewType) => void;
  onLogout: () => void;
}

export function Sidebar({ user, currentView, setCurrentView, onLogout }: SidebarProps) {
  const [isChangelogOpen, setIsChangelogOpen] = useState(false)

  return (
    <aside className="w-64 bg-card/60 backdrop-blur-2xl border-r border-border/50 hidden md:flex flex-col z-10 relative">
      <div className="h-16 flex items-center px-6 border-b">
        <LayoutDashboard className="w-6 h-6 mr-2 text-primary" />
        <h1 className="text-lg font-bold tracking-tight text-primary">Guest Management</h1>
      </div>
      
      <div className="p-4 flex-1 space-y-2">
        <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Menu
        </div>
        <Button 
          variant={currentView === 'dashboard' ? 'secondary' : 'ghost'} 
          className="w-full justify-start"
          onClick={() => setCurrentView('dashboard')}
        >
          <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
        </Button>
        
        <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4">
          Pengajuan
        </div>
        <Button 
          variant={currentView === 'table' || currentView === 'form' ? 'secondary' : 'ghost'} 
          className="w-full justify-start pl-8"
          onClick={() => setCurrentView('table')}
        >
          <FileText className="w-4 h-4 mr-2" /> Riwayat Pengajuan
        </Button>
        
        {(user.role === 'VP' || user.role === 'SVP_Operasi') && (
          <Button 
            variant={currentView === 'approval' ? 'secondary' : 'ghost'} 
            className="w-full justify-start pl-8"
            onClick={() => setCurrentView('approval')}
          >
            <CheckSquare className="w-4 h-4 mr-2" /> Butuh Approve
          </Button>
        )}

        {user.role === 'Sekuriti' && (
          <>
            <div className="px-3 py-2 mt-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <div className="flex items-center gap-2"><Database className="w-4 h-4" /> Master Data</div>
            </div>
            <Button 
              variant={currentView === 'master_perkantoran' ? 'secondary' : 'ghost'} 
              className="w-full justify-start pl-8"
              onClick={() => setCurrentView('master_perkantoran')}
            >
              <Building className="w-4 h-4 mr-2" /> Perkantoran
            </Button>
            <Button 
              variant={currentView === 'master_pabrik' ? 'secondary' : 'ghost'} 
              className="w-full justify-start pl-8"
              onClick={() => setCurrentView('master_pabrik')}
            >
              <Factory className="w-4 h-4 mr-2" /> Pabrik
            </Button>
          </>
        )}
      </div>

      <div className="p-4 border-t">
        <div className="mb-4 px-2">
          <p className="font-semibold text-sm truncate">{user.role !== 'Sekuriti' ? user.pegawai?.nama : 'Petugas Sekuriti'}</p>
          <p className="text-xs text-muted-foreground">{user.role === 'SVP_Operasi' ? 'SVP Operasi' : user.role}</p>
        </div>
        <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={onLogout}>
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>

        <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between px-2">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Versi Aplikasi</span>
            <div 
              className="flex items-center gap-1.5 cursor-pointer group"
              onClick={() => setIsChangelogOpen(true)}
            >
              <Badge variant="secondary" className="text-[10px] px-1.5 h-4 font-mono group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                v{APP_VERSION}
              </Badge>
              <Info className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </div>
        </div>
      </div>
      <ChangelogModal isOpen={isChangelogOpen} onClose={() => setIsChangelogOpen(false)} />
    </aside>
  )
}
