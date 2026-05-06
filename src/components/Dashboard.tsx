import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Users, Clock, CheckCircle, Sparkles, CalendarDays, Building2, Package, ArrowRight, User } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import type { Pegawai, Pengajuan, Role } from "@/store/types"
import { Badge } from "./ui/badge"
import { cn } from "@/lib/utils"

interface DashboardProps {
  role: Role;
  pegawai?: Pegawai;
  pengajuanList: Pengajuan[];
  onNavigateToForm: () => void;
  onNavigateToTable: (tab?: 'outstanding' | 'checkin' | 'checkout' | 'pending') => void;
  onNavigateToApproval?: () => void;
  onNavigateToPengantaran?: () => void;
}

export function Dashboard({ role, pegawai, pengajuanList, onNavigateToForm, onNavigateToTable, onNavigateToApproval, onNavigateToPengantaran }: DashboardProps) {
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

  // Sekuriti Dashboard Stats
  const outstanding = pengajuanList.filter(p => p.status === 'outstanding')
  const checkin = pengajuanList.filter(p => p.status === 'checkin')
  const checkout = pengajuanList.filter(p => p.status === 'checkout')

  const stats = {
    outstanding: {
      total: outstanding.length,
      tamu: outstanding.filter(p => !p.is_pengantaran).length,
      pengantaran: outstanding.filter(p => p.is_pengantaran).length
    },
    checkin: {
      total: checkin.length,
      tamu: checkin.filter(p => !p.is_pengantaran).length,
      pengantaran: checkin.filter(p => p.is_pengantaran).length
    },
    checkout: {
      total: checkout.length,
      tamu: checkout.filter(p => !p.is_pengantaran).length,
      pengantaran: checkout.filter(p => p.is_pengantaran).length
    }
  }

  // Activity Feed (Last 5 activities)
  const recentActivities = [...pengajuanList]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <WelcomeBanner />

      {/* Quick Actions for Sekuriti */}
      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" /> Akses Cepat
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card 
            className="group hover:border-primary/50 transition-all cursor-pointer bg-card/40 backdrop-blur-md overflow-hidden relative"
            onClick={onNavigateToPengantaran}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Package className="w-12 h-12" />
            </div>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Input Pengantaran</h3>
                <p className="text-sm text-muted-foreground">Catat Gojek, Paket, atau kiriman lainnya.</p>
              </div>
              <ArrowRight className="ml-auto w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </CardContent>
          </Card>

          <Card 
            className="group hover:border-primary/50 transition-all cursor-pointer bg-card/40 backdrop-blur-md overflow-hidden relative"
            onClick={() => onNavigateToTable('outstanding')}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Users className="w-12 h-12" />
            </div>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Kelola Check-In</h3>
                <p className="text-sm text-muted-foreground">Lihat daftar tamu yang akan datang.</p>
              </div>
              <ArrowRight className="ml-auto w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Main Stats */}
      <section>
        <h2 className="text-xl font-bold mb-4">Ringkasan Hari Ini</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-card/60 backdrop-blur-xl border border-border/50 shadow-xl cursor-pointer hover:bg-muted/50 transition-all hover:scale-[1.02]" onClick={() => onNavigateToTable('outstanding')}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Outstanding</CardTitle>
              <Clock className="w-4 h-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive mb-3">{stats.outstanding.total}</div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-slate-50/50 border-slate-200 text-slate-600 flex items-center gap-1 font-normal text-[10px]">
                  <User className="w-3 h-3" /> {stats.outstanding.tamu} Tamu
                </Badge>
                <Badge variant="outline" className="bg-blue-50/50 border-blue-200 text-blue-600 flex items-center gap-1 font-normal text-[10px]">
                  <Package className="w-3 h-3" /> {stats.outstanding.pengantaran} Paket
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-xl border border-border/50 shadow-xl cursor-pointer hover:bg-muted/50 transition-all hover:scale-[1.02]" onClick={() => onNavigateToTable('checkin')}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Sedang Berkunjung</CardTitle>
              <Users className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-3">{stats.checkin.total}</div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-green-50/50 border-green-200 text-green-600 flex items-center gap-1 font-normal text-[10px]">
                  <User className="w-3 h-3" /> {stats.checkin.tamu} Tamu
                </Badge>
                <Badge variant="outline" className="bg-blue-50/50 border-blue-200 text-blue-600 flex items-center gap-1 font-normal text-[10px]">
                  <Package className="w-3 h-3" /> {stats.checkin.pengantaran} Paket
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-xl border border-border/50 shadow-xl cursor-pointer hover:bg-muted/50 transition-all hover:scale-[1.02]" onClick={() => onNavigateToTable('checkout')}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Sudah Keluar</CardTitle>
              <CheckCircle className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-muted-foreground mb-3">{stats.checkout.total}</div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-slate-50/50 border-slate-200 text-slate-600 flex items-center gap-1 font-normal text-[10px]">
                  <User className="w-3 h-3" /> {stats.checkout.tamu} Tamu
                </Badge>
                <Badge variant="outline" className="bg-blue-50/50 border-blue-200 text-blue-600 flex items-center gap-1 font-normal text-[10px]">
                  <Package className="w-3 h-3" /> {stats.checkout.pengantaran} Paket
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recent Activity Feed */}
      <section>
        <h2 className="text-xl font-bold mb-4">Aktivitas Terakhir</h2>
        <Card className="bg-card/60 backdrop-blur-xl border border-border/50 shadow-xl overflow-hidden">
          <CardContent className="p-0">
            {recentActivities.length > 0 ? (
              <div className="divide-y divide-border/50">
                {recentActivities.map((activity, idx) => (
                  <div key={activity.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors animate-in slide-in-from-left duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                        activity.is_pengantaran ? "bg-blue-500/10 text-blue-600" : "bg-primary/10 text-primary"
                      )}>
                        {activity.is_pengantaran ? <Package className="w-5 h-5" /> : <User className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{activity.tamu.nama}</span>
                          <Badge variant="outline" className="text-[9px] px-1 h-4 font-normal">
                            {activity.is_pengantaran ? 'Pengantaran' : 'Tamu'}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {activity.status === 'checkin' ? 'Baru saja Check-In' : 
                           activity.status === 'checkout' ? 'Telah Check-Out' : 
                           'Terdaftar (Outstanding)'} — Ke: {activity.alamat_tujuan}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-medium text-muted-foreground">
                        {format(new Date(activity.created_at), 'HH:mm', { locale: id })}
                      </div>
                      <div className="text-[9px] text-muted-foreground/60">
                        {format(new Date(activity.created_at), 'dd MMM', { locale: id })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center text-muted-foreground text-sm italic">
                Belum ada aktivitas hari ini.
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
