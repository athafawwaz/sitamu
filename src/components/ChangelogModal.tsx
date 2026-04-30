import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CHANGELOG } from "@/store/changelog"
import { History, Sparkles } from "lucide-react"

interface ChangelogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangelogModal({ isOpen, onClose }: ChangelogModalProps) {
  const getBadgeVariant = (type: 'major' | 'minor' | 'patch') => {
    switch (type) {
      case 'major': return 'destructive'
      case 'minor': return 'default'
      case 'patch': return 'secondary'
      default: return 'outline'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col p-0 border border-border/50 bg-card/60 backdrop-blur-2xl shadow-2xl">
        {/* Decorative Background Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[60px] pointer-events-none z-0" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[60px] pointer-events-none z-0" />
        
        <DialogHeader className="p-6 pb-4 relative z-10 border-b border-border/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary border border-primary/20">
              <History className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold tracking-tight">Riwayat Pembaruan</DialogTitle>
              <DialogDescription className="text-muted-foreground text-xs mt-0.5">
                SI TAMU — Evolusi & Peningkatan Sistem
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 relative z-10 custom-scrollbar">
          {CHANGELOG.map((entry, index) => (
            <div key={entry.version} className="relative pl-8 border-l-2 border-border/50 pb-2 last:pb-0">
              {/* Dot indicator */}
              <div className={`absolute left-[-9px] top-1.5 w-4 h-4 rounded-full border-4 border-background ${index === 0 ? 'bg-primary shadow-[0_0_12px_rgba(var(--primary),0.8)] animate-pulse' : 'bg-muted'}`} />
              
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg tracking-tight">v{entry.version}</span>
                    <Badge variant={getBadgeVariant(entry.type)} className="text-[10px] h-4.5 uppercase font-black tracking-widest px-2 scale-90 origin-left">
                      {entry.type}
                    </Badge>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-semibold tabular-nums">
                    {new Date(entry.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                
                <div className="text-sm text-foreground/90 leading-relaxed bg-muted/30 backdrop-blur-sm p-4 rounded-xl border border-border/50 shadow-inner group hover:bg-muted/50 transition-colors">
                  {index === 0 && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Update Terbaru</span>
                    </div>
                  )}
                  {entry.description}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-border/30 bg-muted/20 backdrop-blur-md text-center relative z-10">
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">
            PT. Pupuk Sriwidjaja Palembang
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

