import { ShieldX, ArrowLeft, BadgeAlert } from "lucide-react"
import { Button } from "@/components/ui/button"

interface UnauthorizedViewProps {
  badge: string
  onBack: () => void
}

export function UnauthorizedView({ badge, onBack }: UnauthorizedViewProps) {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden font-sans">
      {/* Left decorative panel */}
      <div className="hidden md:flex w-[45%] lg:w-[50%] bg-slate-900 relative flex-col items-center justify-center p-8 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-red-500/40 blur-3xl" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-orange-600/30 blur-3xl" />
        </div>
        <div className="z-10 flex flex-col items-center text-center">
          <div className="bg-white p-4 rounded-2xl shadow-2xl mb-8">
            <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center border border-red-200">
              <ShieldX className="w-10 h-10 text-red-500" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
            Akses Ditolak
          </h1>
          <p className="text-lg text-slate-300 font-medium tracking-wide mb-2">
            Unauthorized Access
          </p>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            Badge Anda tidak terdaftar dalam sistem.<br />
            Hubungi petugas sekuriti untuk pendaftaran.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center p-6 md:p-12 overflow-y-auto bg-white dark:bg-zinc-950 relative">
        <div className="flex-1 flex flex-col justify-center w-full max-w-[400px] z-10 min-h-fit py-8 md:py-0">

          {/* Mobile icon */}
          <div className="md:hidden flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
              <ShieldX className="w-7 h-7 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-red-600">Akses Ditolak</h1>
          </div>

          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-red-600 dark:text-red-400">
                Unauthorized
              </h2>
              <p className="text-sm text-muted-foreground">
                Badge TKNO tidak ditemukan dalam master data sistem.
              </p>
            </div>

            {/* Badge Info Card */}
            <div className="p-5 rounded-xl border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                  <BadgeAlert className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Badge Tidak Terdaftar</p>
                  <p className="font-mono text-lg font-bold text-red-600 dark:text-red-400">{badge}</p>
                </div>
              </div>
              <div className="h-px bg-red-200 dark:bg-red-800" />
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Kemungkinan penyebab:</p>
                <ul className="list-disc list-inside space-y-1 pl-1 text-xs">
                  <li>Badge belum didaftarkan oleh petugas sekuriti</li>
                  <li>Nomor badge salah diketik</li>
                  <li>Badge tidak memiliki akses ke sistem ini</li>
                </ul>
              </div>
            </div>

            {/* Info box */}
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-border text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Butuh bantuan?</p>
              <p>Hubungi petugas sekuriti di pos jaga untuk meminta pendaftaran badge TKNO Anda.</p>
            </div>

            {/* Back button */}
            <Button
              onClick={onBack}
              variant="outline"
              className="w-full h-11 text-base"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
