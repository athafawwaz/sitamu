import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Users, Clock, CheckCircle, Sparkles, CalendarDays, Building2 } from "lucide-react"
import type { Pegawai, Pengajuan, Role } from "@/types"

interface DashboardProps {
  role: Role;
  pegawai?: Pegawai;
  pengajuanList: Pengajuan[];
  onNavigateToForm: () => void;
  onNavigateToTable: (tab?: 'outstanding' | 'checkin' | 'checkout' | 'pending') => void;
  onNavigateToApproval?: () => void;
}

export function Dashboard({ role, pegawai, pengajuanList, onNavigateToForm, onNavigateToTable, onNavigateToApproval }: DashboardProps) {
  const hour = new Date().getHours()
  let greeting = 'Selamat Malam'
  if (hour < 11) greeting = 'Selamat Pagi'
  else if (hour < 15) greeting = 'Selamat Siang'
  else if (hour < 18) greeting = 'Selamat Sore'

  const currentDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  const isSekuriti = role === 'Sekuriti'
  const userName = !isSekuriti ? pegawai?.nama : 'Petugas Keamanan'
  const unitKerja = !isSekuriti ? (pegawai?.unit_kerja || 'DEPARTEMEN') : 'DEPARTEMEN KEAMANAN'

  const WelcomeBanner = () => (
    <Card className="bg-card/60 backdrop-blur-xl border border-border/50 shadow-2xl relative overflow-hidden mb-6">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none z-0" />
      
      <CardContent className="p-8 md:p-10 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-6 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5" />
          SI TAMU — PT. Pupuk Sriwidjaja Palembang
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
          {greeting}, {userName}
        </h2>
        <p className="text-muted-foreground max-w-2xl text-base md:text-lg mb-8 leading-relaxed">
          Sistem Manajemen Kedatangan Tamu terpadu untuk mengelola jadwal kunjungan, registrasi tamu, dan administrasi keamanan perusahaan.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-muted-foreground mb-8">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-primary" />
            {currentDate}
          </div>
          <div className="flex items-center gap-2 uppercase tracking-wider text-xs font-semibold">
            <Building2 className="w-4 h-4 text-primary" />
            {unitKerja}
          </div>
        </div>

        {!isSekuriti && (
          <div className="flex flex-wrap gap-4">
            <Button size="lg" onClick={onNavigateToForm} className="shadow-lg shadow-primary/20">
              <Plus className="w-5 h-5 mr-2" /> Buat Pengajuan Baru
            </Button>
            <Button size="lg" variant="outline" onClick={() => onNavigateToTable()}>
              Lihat Riwayat
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )

  if (!isSekuriti) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <WelcomeBanner />
        
        {(role === 'VP' || role === 'SVP_Operasi') && (
          <div>
            <h2 className="text-xl font-bold mb-4">Tugas Anda</h2>
            <Card className="bg-card/60 backdrop-blur-xl border border-orange-500/50 shadow-md cursor-pointer hover:bg-orange-500/10 transition-all" onClick={onNavigateToApproval}>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-orange-500">Butuh Approval</h3>
                  <p className="text-sm text-muted-foreground mt-1">Cek submenu Pengajuan &gt; Butuh Approve untuk menyetujui pengajuan tamu.</p>
                </div>
                <div className="p-3 bg-orange-500/20 rounded-full text-orange-500">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    )
  }

  // Sekuriti Dashboard
  const countOutstanding = pengajuanList.filter(p => p.status === 'outstanding').length
  const countCheckin = pengajuanList.filter(p => p.status === 'checkin').length
  const countCheckout = pengajuanList.filter(p => p.status === 'checkout').length

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <WelcomeBanner />

      <div>
        <h2 className="text-2xl font-bold">Ringkasan Hari Ini</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card/60 backdrop-blur-xl border border-border/50 shadow-xl cursor-pointer hover:bg-muted/50 transition-all hover:scale-[1.02]" onClick={() => onNavigateToTable('outstanding')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <Clock className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{countOutstanding}</div>
            <p className="text-xs text-muted-foreground mt-1">Tamu belum check-in</p>
          </CardContent>
        </Card>

        <Card className="bg-card/60 backdrop-blur-xl border border-border/50 shadow-xl cursor-pointer hover:bg-muted/50 transition-all hover:scale-[1.02]" onClick={() => onNavigateToTable('checkin')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Check-In</CardTitle>
            <Users className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{countCheckin}</div>
            <p className="text-xs text-muted-foreground mt-1">Tamu sedang berkunjung</p>
          </CardContent>
        </Card>

        <Card className="bg-card/60 backdrop-blur-xl border border-border/50 shadow-xl cursor-pointer hover:bg-muted/50 transition-all hover:scale-[1.02]" onClick={() => onNavigateToTable('checkout')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Check-Out</CardTitle>
            <CheckCircle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">{countCheckout}</div>
            <p className="text-xs text-muted-foreground mt-1">Tamu sudah keluar</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
