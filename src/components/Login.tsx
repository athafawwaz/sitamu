import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Eye, EyeOff, User, Lock, AlertCircle, ChevronDown, ChevronUp } from "lucide-react"
import { dummyPegawai, initialMasterTkno } from "@/store/data"
import type { Pegawai, Role, TknoEntry } from "@/store/types"
import { APP_VERSION } from "@/store/changelog"
import { cn } from "@/lib/utils"

interface LoginProps {
  onLogin: (role: Role, pegawai?: Pegawai) => void;
  onUnauthorized: (badge: string) => void;
  masterTkno?: TknoEntry[];
}

// TKO accounts — badge berawalan 6
const TKO_ACCOUNTS = [
  { badge: '6121501', role: 'Pegawai' as Role,     pegawai: dummyPegawai[0] },
  { badge: '6121503', role: 'VP' as Role,          pegawai: dummyPegawai[2] },
  { badge: '6121505', role: 'Sekuriti' as Role,    pegawai: dummyPegawai[4] },
  { badge: '6121506', role: 'SVP_Operasi' as Role, pegawai: dummyPegawai[5] },
];

const DEFAULT_PASSWORD = '12345678';

export function Login({ onLogin, onUnauthorized, masterTkno = initialMasterTkno }: LoginProps) {
  const [badge, setBadge] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showQuickLogin, setShowQuickLogin] = useState(false)
  const [error, setError] = useState('')

  const isTKO = badge.startsWith('6')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!badge) {
      setError('Badge tidak boleh kosong');
      return;
    }

    if (!password) {
      setError('Password tidak boleh kosong');
      return;
    }

    if (password !== DEFAULT_PASSWORD) {
      setError('Password salah');
      return;
    }

    if (isTKO) {
      // TKO: cek dari daftar akun TKO
      const account = TKO_ACCOUNTS.find(acc => acc.badge === badge.trim());
      if (!account) {
        setError('Badge TKO tidak ditemukan');
        return;
      }
      onLogin(account.role, account.pegawai);
    } else {
      // TKNO: cek dari master data
      const tknoEntry = masterTkno.find(t => t.no_badge === badge.trim());
      if (!tknoEntry) {
        onUnauthorized(badge.trim());
        return;
      }
      // Login sebagai Pegawai dengan data dari master TKNO
      // id di-derive dari no_badge (numerik) agar tidak bentrok dengan TKO id (1-6)
      const pegawai: Pegawai = {
        id: parseInt(tknoEntry.no_badge) || Date.now(),
        nama: tknoEntry.nama,
        no_badge: tknoEntry.no_badge,
        unit_kerja: tknoEntry.unit_kerja,
        jabatan: tknoEntry.jabatan
      };
      onLogin('Pegawai', pegawai);
    }
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden font-sans">
      {/* Left Panel - Branding */}
      <div className="hidden md:flex w-[45%] lg:w-[50%] bg-slate-900 relative flex-col items-center justify-center p-8 overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
           <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/40 blur-3xl"></div>
           <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/30 blur-3xl"></div>
        </div>
        
        <div className="z-10 flex flex-col items-center text-center">
          <div className="bg-white p-4 rounded-2xl shadow-2xl mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center border border-blue-200">
              <Shield className="w-10 h-10 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
            SI TAMU
          </h1>
          <p className="text-lg text-slate-300 font-medium tracking-wide mb-2">
            Sistem Informasi Tamu
          </p>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            PT Pupuk Sriwidjaja Palembang<br/>
            Mengelola data kunjungan tamu dengan efisien dan aman.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col items-center p-6 md:p-12 overflow-y-auto bg-white dark:bg-zinc-950 relative">
        <div className="flex-1 flex flex-col justify-center w-full max-w-[400px] z-10 min-h-fit py-8 md:py-0">
          {/* Mobile Logo */}
          <div className="md:hidden flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">SI TAMU</h1>
          </div>

          <div className="space-y-8">
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-3xl font-bold tracking-tight">Masuk</h2>
              <p className="text-sm text-muted-foreground">
                Masukkan kredensial Anda untuk mengakses sistem
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="badge">No. Badge</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                    <User className="w-4 h-4" />
                  </div>
                  <Input
                    id="badge"
                    type="text"
                    placeholder="Contoh: 6xxxxxx"
                    className="pl-10 bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 font-mono"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                    <Lock className="w-4 h-4" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10 bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full h-11 text-base font-medium shadow-md">
                Masuk
              </Button>
            </form>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink-0 mx-4 text-xs text-muted-foreground uppercase tracking-widest">Atau</span>
              <div className="flex-grow border-t border-border"></div>
            </div>

            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className={cn("w-full h-10 border-dashed text-primary hover:text-primary hover:bg-primary/5 transition-all", showQuickLogin && "bg-primary/5 border-primary/50")}
                onClick={() => setShowQuickLogin(!showQuickLogin)}
              >
                <Shield className="w-4 h-4 mr-2" />
                Quick Login (Dev)
                {showQuickLogin ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
              </Button>

              {showQuickLogin && (
                <div className="p-4 border rounded-xl bg-muted/30 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="text-xs font-semibold text-muted-foreground mb-3 flex items-center justify-between">
                    <span>Pilih Akun Demo</span>
                    <span className="font-mono text-[10px] bg-background px-1.5 py-0.5 rounded border text-foreground">PW: {DEFAULT_PASSWORD}</span>
                  </div>
                  {TKO_ACCOUNTS.map((acc, idx) => (
                    <Button
                      key={idx}
                      variant="secondary"
                      className="w-full justify-start h-auto py-2.5 px-3"
                      onClick={() => onLogin(acc.role, acc.pegawai)}
                    >
                      <div className="flex flex-col items-start gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-primary">{acc.badge}</span>
                          <span className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wider">TKO</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-sm font-semibold truncate max-w-[140px]">{acc.pegawai ? acc.pegawai.nama : 'Petugas Sekuriti'}</span>
                        </div>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{acc.role === 'SVP_Operasi' ? 'SVP Operasi' : acc.role}</span>
                      </div>
                    </Button>
                  ))}
                  <div className="h-px bg-border/50 my-1" />
                  <p className="text-[10px] text-muted-foreground px-1">
                    TKNO: login dengan badge master (cth: <span className="font-mono">3210001</span>) + PW: {DEFAULT_PASSWORD}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-8 pb-2 md:pb-0 text-center w-full px-6 text-xs text-muted-foreground">
          <p>Sistem Informasi Tamu v{APP_VERSION} &mdash; PT Pupuk Sriwidjaja Palembang</p>
        </div>
      </div>
    </div>
  )
}
