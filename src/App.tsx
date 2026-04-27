import { Dashboard } from './components/Dashboard'
import { Login } from './components/Login'
import { FormPengajuan } from './components/FormPengajuan'
import { TablePengajuan } from './components/TablePengajuan'
import { DetailPengajuan } from './components/DetailPengajuan'
import type { StatusTamu, Role, Pegawai, Pengajuan } from './types'
import { Button } from './components/ui/button'
import { Tabs, TabsList, TabsTrigger } from './components/ui/tabs'
import { LogOut, Plus, LayoutDashboard, FileText, Menu } from 'lucide-react'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { useAppStore } from './store/useAppStore'

function App() {
  const {
    user,
    activeTab,
    currentView,
    selectedPengajuanId,
    selectedPengajuan,
    filteredPengajuan,
    rawPengajuanList,
    setActiveTab,
    setCurrentView,
    setSelectedPengajuanId,
    handleLogin,
    handleLogout,
    handleAddPengajuan,
    handleCheckIn,
    handleCheckOut
  } = useAppStore()

  const onLogin = (role: Role, pegawai?: Pegawai) => {
    handleLogin(role, pegawai)
    toast.success(`Berhasil login sebagai ${pegawai ? pegawai.nama : 'Sekuriti'}`)
  }

  const onLogout = () => {
    handleLogout()
    toast.info('Berhasil logout dari sistem')
  }

  const onAddPengajuan = (pengajuanList: Pengajuan[]) => {
    handleAddPengajuan(pengajuanList)
    toast.success(`Berhasil mendaftarkan ${pengajuanList.length} tamu`)
  }

  const onCheckIn = (pengajuanId: string, tamuId: string, noBadge: string) => {
    handleCheckIn(pengajuanId, tamuId, noBadge)
    toast.success(`Tamu berhasil check-in dengan badge ${noBadge}`)
  }

  const onCheckOut = (pengajuanId: string, tamuId: string) => {
    handleCheckOut(pengajuanId, tamuId)
    toast.success('Tamu berhasil check-out')
  }

  if (!user) {
    return (
      <>
        <Login onLogin={onLogin} />
        <Toaster theme="dark" richColors position="top-right" />
      </>
    )
  }

  return (
    <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden relative selection:bg-primary/30">
      
      {/* Futuristic Glow Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none z-0" />
      
      {/* Sidebar (Desktop) */}
      <aside className="w-64 bg-card/60 backdrop-blur-2xl border-r border-border/50 hidden md:flex flex-col z-10 relative">
        <div className="h-16 flex items-center px-6 border-b">
          <LayoutDashboard className="w-6 h-6 mr-2 text-primary" />
          <h1 className="text-lg font-bold tracking-tight text-primary">PGM</h1>
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
          <Button 
            variant={currentView === 'table' || currentView === 'form' ? 'secondary' : 'ghost'} 
            className="w-full justify-start"
            onClick={() => setCurrentView('table')}
          >
            <FileText className="w-4 h-4 mr-2" /> Pengajuan Tamu
          </Button>
        </div>

        <div className="p-4 border-t">
          <div className="mb-4 px-2">
            <p className="font-semibold text-sm truncate">{user.role === 'Pegawai' ? user.pegawai?.nama : 'Petugas Sekuriti'}</p>
            <p className="text-xs text-muted-foreground">{user.role}</p>
          </div>
          <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        
        {/* Mobile Header */}
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

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {currentView === 'dashboard' && (
              <Dashboard 
                role={user.role} 
                pegawai={user.pegawai} 
                pengajuanList={rawPengajuanList} 
                onNavigateToForm={() => setCurrentView('form')}
                onNavigateToTable={(tab) => {
                  if (tab) setActiveTab(tab)
                  setCurrentView('table')
                }}
              />
            )}

            {currentView !== 'dashboard' && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-bold">{currentView === 'form' ? 'Buat Pengajuan Baru' : 'Riwayat Pengajuan'}</h2>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {currentView === 'form' 
                      ? 'Isi formulir di bawah ini untuk mendaftarkan tamu Anda.' 
                      : `Pantau status kunjungan tamu ${user.role === 'Pegawai' ? 'Anda' : 'di lingkungan pabrik'}.`
                    }
                  </p>
                </div>
                
                <div className="flex gap-2">
                  {currentView === 'form' && (
                    <Button 
                      variant="outline"
                      onClick={() => setCurrentView('table')}
                    >
                      Batal
                    </Button>
                  )}
                  {currentView === 'table' && (
                    <Button onClick={() => setCurrentView('form')}>
                      <Plus className="w-4 h-4 mr-2" /> Pengajuan Baru
                    </Button>
                  )}
                </div>
              </div>
            )}

            {currentView === 'form' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <FormPengajuan 
                  role={user.role} 
                  currentUser={user.pegawai} 
                  onSubmit={onAddPengajuan} 
                  onCancel={() => setCurrentView('table')} 
                />
              </div>
            )}

            {currentView === 'table' && (
              <div className="space-y-4 animate-in fade-in duration-500">
                <Tabs 
                  value={activeTab} 
                  onValueChange={(val) => setActiveTab(val as StatusTamu)} 
                  className="w-full"
                >
                  <TabsList className="grid w-full max-w-md grid-cols-3">
                    <TabsTrigger value="outstanding">Outstanding</TabsTrigger>
                    <TabsTrigger value="checkin">Check-In</TabsTrigger>
                    <TabsTrigger value="checkout">Check-Out</TabsTrigger>
                  </TabsList>
                </Tabs>

                <TablePengajuan 
                  data={filteredPengajuan} 
                  onDetailClick={setSelectedPengajuanId} 
                />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Dialog Detail */}
      <DetailPengajuan 
        isOpen={!!selectedPengajuanId}
        onClose={() => setSelectedPengajuanId(null)}
        pengajuan={selectedPengajuan}
        role={user.role}
        onCheckIn={onCheckIn}
        onCheckOut={onCheckOut}
      />
      <Toaster theme="dark" richColors position="top-right" />
    </div>
  )
}

export default App
