import { Button } from "@/components/ui/button"
import { LayoutDashboard, FileText, CheckSquare, Database, Building, Factory, LogOut, Info, ChevronLeft, ChevronRight } from "lucide-react"
import type { Pegawai, Role, ViewType } from "@/store/types"
import { useState } from "react"
import { APP_VERSION } from "@/store/changelog"
import { ChangelogModal } from "./ChangelogModal"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface SidebarProps {
  user: { role: Role, pegawai?: Pegawai };
  currentView: string;
  setCurrentView: (view: ViewType) => void;
  onLogout: () => void;
}

export function Sidebar({ user, currentView, setCurrentView, onLogout }: SidebarProps) {
  const [isChangelogOpen, setIsChangelogOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside className={cn(
      "bg-card/60 backdrop-blur-2xl border-r border-border/50 hidden md:flex flex-col z-20 relative transition-all duration-300 ease-in-out",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className={cn(
        "h-16 flex items-center border-b transition-all duration-300",
        isCollapsed ? "px-4 justify-center" : "px-6 justify-start"
      )}>
        <div className="flex items-center overflow-hidden">
          <LayoutDashboard className="w-6 h-6 shrink-0 text-primary" />
          {!isCollapsed && (
            <h1 className="text-lg font-bold tracking-tight text-primary ml-2 truncate">Guest Management</h1>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute -right-4 top-4 h-8 w-8 bg-background border border-border shadow-md rounded-full z-30 hover:bg-primary/10 hover:text-primary transition-all duration-300"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>
      
      <div className="p-4 flex-1 space-y-2 overflow-y-auto overflow-x-hidden">
        {!isCollapsed && (
          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Menu
          </div>
        )}
        <Button 
          variant={currentView === 'dashboard' ? 'secondary' : 'ghost'} 
          className={cn(
            "w-full transition-all duration-200",
            isCollapsed ? "justify-center px-0" : "justify-start"
          )}
          onClick={() => setCurrentView('dashboard')}
          title={isCollapsed ? "Dashboard" : ""}
        >
          <LayoutDashboard className={cn("w-4 h-4", !isCollapsed && "mr-2")} /> 
          {!isCollapsed && "Dashboard"}
        </Button>
        
        {!isCollapsed && (
          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4">
            Pengajuan
          </div>
        )}
        <Button 
          variant={currentView === 'table' || currentView === 'form' ? 'secondary' : 'ghost'} 
          className={cn(
            "w-full transition-all duration-200",
            isCollapsed ? "justify-center px-0" : "justify-start",
            !isCollapsed && "pl-8"
          )}
          onClick={() => setCurrentView('table')}
          title={isCollapsed ? "Riwayat Pengajuan" : ""}
        >
          <FileText className={cn("w-4 h-4", !isCollapsed && "mr-2")} /> 
          {!isCollapsed && "Riwayat Pengajuan"}
        </Button>
        
        {(user.role === 'VP' || user.role === 'SVP_Operasi') && (
          <Button 
            variant={currentView === 'approval' ? 'secondary' : 'ghost'} 
            className={cn(
              "w-full transition-all duration-200",
              isCollapsed ? "justify-center px-0" : "justify-start",
              !isCollapsed && "pl-8"
            )}
            onClick={() => setCurrentView('approval')}
            title={isCollapsed ? "Butuh Approve" : ""}
          >
            <CheckSquare className={cn("w-4 h-4", !isCollapsed && "mr-2")} /> 
            {!isCollapsed && "Butuh Approve"}
          </Button>
        )}

        {user.role === 'Sekuriti' && (
          <>
            {!isCollapsed ? (
              <div className="px-3 py-2 mt-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <div className="flex items-center gap-2"><Database className="w-4 h-4" /> Master Data</div>
              </div>
            ) : (
              <div className="h-px bg-border/50 my-4 mx-2" />
            )}
            <Button 
              variant={currentView === 'master_perkantoran' ? 'secondary' : 'ghost'} 
              className={cn(
                "w-full transition-all duration-200",
                isCollapsed ? "justify-center px-0" : "justify-start",
                !isCollapsed && "pl-8"
              )}
              onClick={() => setCurrentView('master_perkantoran')}
              title={isCollapsed ? "Perkantoran" : ""}
            >
              <Building className={cn("w-4 h-4", !isCollapsed && "mr-2")} /> 
              {!isCollapsed && "Perkantoran"}
            </Button>
            <Button 
              variant={currentView === 'master_pabrik' ? 'secondary' : 'ghost'} 
              className={cn(
                "w-full transition-all duration-200",
                isCollapsed ? "justify-center px-0" : "justify-start",
                !isCollapsed && "pl-8"
              )}
              onClick={() => setCurrentView('master_pabrik')}
              title={isCollapsed ? "Pabrik" : ""}
            >
              <Factory className={cn("w-4 h-4", !isCollapsed && "mr-2")} /> 
              {!isCollapsed && "Pabrik"}
            </Button>
          </>
        )}
      </div>

      <div className={cn("p-4 border-t transition-all", isCollapsed && "px-2")}>
        <div className={cn("mb-4", isCollapsed ? "flex justify-center" : "px-2")}>
          {!isCollapsed ? (
            <>
              <p className="font-semibold text-sm truncate">{user.role !== 'Sekuriti' ? user.pegawai?.nama : 'Petugas Sekuriti'}</p>
              <p className="text-xs text-muted-foreground">{user.role === 'SVP_Operasi' ? 'SVP Operasi' : user.role}</p>
            </>
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
              {user.role !== 'Sekuriti' ? user.pegawai?.nama.charAt(0) : 'S'}
            </div>
          )}
        </div>
        <Button 
          variant="ghost" 
          className={cn(
            "w-full text-destructive hover:text-destructive hover:bg-destructive/10 transition-all",
            isCollapsed ? "justify-center px-0" : "justify-start"
          )}
          onClick={onLogout}
          title={isCollapsed ? "Logout" : ""}
        >
          <LogOut className={cn("w-4 h-4", !isCollapsed && "mr-2")} /> 
          {!isCollapsed && "Logout"}
        </Button>

        <div className={cn(
          "mt-4 pt-4 border-t border-border/50 flex transition-all duration-300",
          isCollapsed ? "flex-col items-center gap-2" : "items-center justify-between px-2"
        )}>
          <div className={cn("flex flex-col", isCollapsed && "items-center")}>
            {!isCollapsed && (
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Versi Aplikasi</span>
            )}
            <div 
              className="flex items-center gap-1.5 cursor-pointer group"
              onClick={() => setIsChangelogOpen(true)}
              title={isCollapsed ? `Version ${APP_VERSION}` : ""}
            >
              <Badge variant="secondary" className="text-[10px] px-1.5 h-4 font-mono group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                v{APP_VERSION}
              </Badge>
              {!isCollapsed && (
                <Info className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
              )}
            </div>
          </div>
        </div>
      </div>
      <ChangelogModal isOpen={isChangelogOpen} onClose={() => setIsChangelogOpen(false)} />
    </aside>
  )
}
