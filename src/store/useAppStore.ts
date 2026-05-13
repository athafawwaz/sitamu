import { useState, useEffect, useMemo } from 'react'
import type { Pegawai, Pengajuan, Role, StatusTamu, TknoEntry, ViewType } from './types'
import { initialPengajuan, masterPerkantoran as initialMasterPerkantoran, masterPabrik as initialMasterPabrik, initialMasterTkno, masterUnitKerja as initialMasterUnitKerja } from './data'

export function useAppStore() {
  const [user, setUser] = useState<{ role: Role, pegawai?: Pegawai } | null>(null)
  const [pengajuanList, setPengajuanList] = useState<Pengajuan[]>(initialPengajuan)
  const [activeTab, setActiveTab] = useState<StatusTamu>('outstanding')
  const [currentView, setCurrentView] = useState<ViewType>('dashboard')
  const [selectedPengajuanId, setSelectedPengajuanId] = useState<string | null>(null)
  
  const [masterPerkantoran, setMasterPerkantoran] = useState<string[]>(initialMasterPerkantoran)
  const [masterPabrik, setMasterPabrik] = useState<string[]>(initialMasterPabrik)
  const [masterUnitKerja, setMasterUnitKerja] = useState<string[]>(initialMasterUnitKerja)
  const [masterTkno, setMasterTkno] = useState<TknoEntry[]>(initialMasterTkno)

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('pengajuanData')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed && parsed.length > 0) {
          setPengajuanList(parsed)
        }
      } catch (e) {
        console.error(e)
      }
    }

    const savedPerkantoran = localStorage.getItem('masterPerkantoran')
    if (savedPerkantoran) {
      try {
        const parsed = JSON.parse(savedPerkantoran)
        if (parsed && parsed.length > 0) setMasterPerkantoran(parsed)
      } catch(e) {}
    }

    const savedPabrik = localStorage.getItem('masterPabrik')
    if (savedPabrik) {
      try {
        const parsed = JSON.parse(savedPabrik)
        if (parsed && parsed.length > 0) setMasterPabrik(parsed)
      } catch(e) {}
    }

    const savedUnitKerja = localStorage.getItem('masterUnitKerja')
    if (savedUnitKerja) {
      try {
        const parsed = JSON.parse(savedUnitKerja)
        if (parsed && parsed.length > 0) setMasterUnitKerja(parsed)
      } catch(e) {}
    }

    const savedTkno = localStorage.getItem('masterTkno')
    if (savedTkno) {
      try {
        const parsed = JSON.parse(savedTkno)
        if (parsed && parsed.length > 0) setMasterTkno(parsed)
      } catch(e) {}
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('pengajuanData', JSON.stringify(pengajuanList))
  }, [pengajuanList])

  useEffect(() => {
    localStorage.setItem('masterPerkantoran', JSON.stringify(masterPerkantoran))
  }, [masterPerkantoran])

  useEffect(() => {
    localStorage.setItem('masterPabrik', JSON.stringify(masterPabrik))
  }, [masterPabrik])

  useEffect(() => {
    localStorage.setItem('masterUnitKerja', JSON.stringify(masterUnitKerja))
  }, [masterUnitKerja])

  useEffect(() => {
    localStorage.setItem('masterTkno', JSON.stringify(masterTkno))
  }, [masterTkno])

  const handleLogin = (role: Role, pegawai?: Pegawai) => {
    setUser({ role, pegawai })
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentView('dashboard')
  }

  const handleAddPengajuan = (pengajuanList: Pengajuan[]) => {
    setPengajuanList(prev => [...pengajuanList, ...prev])
    const isPengantaran = pengajuanList.some(p => p.is_pengantaran)
    setCurrentView(isPengantaran ? 'table_pengantaran' : 'table')
  }

  const handleCheckIn = (pengajuanId: string, tamuId: string, noBadge: string, sekuriti?: Pegawai) => {
    setPengajuanList(prev => prev.map(p => {
      if (p.id !== pengajuanId) return p;
      if (p.tamu.id !== tamuId) return p;
      
      const newStatus = 'checkin' as StatusTamu;
      // Auto-fill penanggung_jawab with sekuriti data for kiosk entries (placeholder id=0)
      const updatedPenanggungJawab =
        sekuriti && p.penanggung_jawab.id === 0 ? sekuriti : p.penanggung_jawab;
      return {
        ...p,
        status: newStatus,
        penanggung_jawab: updatedPenanggungJawab,
        tamu: {
          ...p.tamu,
          no_badge_pinjaman: noBadge,
          status: newStatus,
          waktu_checkin: new Date().toISOString()
        }
      }
    }))
  }

  const handleAddKioskPengantaran = (pengajuan: Pengajuan) => {
    setPengajuanList(prev => [pengajuan, ...prev])
  }

  const handleCheckOut = (pengajuanId: string, tamuId: string) => {
    setPengajuanList(prev => prev.map(p => {
      if (p.id !== pengajuanId) return p;
      if (p.tamu.id !== tamuId) return p;
      
      const newStatus = 'checkout' as StatusTamu;
      return {
        ...p,
        status: newStatus,
        tamu: {
          ...p.tamu,
          status: newStatus,
          waktu_checkout: new Date().toISOString()
        }
      }
    }))
  }

  const handleApprove = (pengajuanId: string, role: Role, namaApprover: string) => {
    setPengajuanList(prev => prev.map(p => {
      if (p.id !== pengajuanId) return p;
      
      let nextStatus = p.status;
      if (role === 'VP' && p.status === 'pending_vp') {
        nextStatus = p.jenis_tujuan === 'Pabrik' ? 'pending_svp' : 'outstanding';
      } else if (role === 'SVP_Operasi' && p.status === 'pending_svp') {
        nextStatus = 'outstanding';
      }

      const historyItem = {
        role,
        nama_approver: namaApprover,
        waktu_approval: new Date().toISOString()
      };

      return {
        ...p,
        status: nextStatus,
        tamu: {
          ...p.tamu,
          status: nextStatus
        },
        approval_history: [...(p.approval_history || []), historyItem]
      }
    }))
  }

  const handleBulkApprove = (pengajuanIds: string[], role: Role, namaApprover: string) => {
    setPengajuanList(prev => prev.map(p => {
      if (!pengajuanIds.includes(p.id)) return p;
      
      let nextStatus = p.status;
      if (role === 'VP' && p.status === 'pending_vp') {
        nextStatus = p.jenis_tujuan === 'Pabrik' ? 'pending_svp' : 'outstanding';
      } else if (role === 'SVP_Operasi' && p.status === 'pending_svp') {
        nextStatus = 'outstanding';
      }

      const historyItem = {
        role,
        nama_approver: namaApprover,
        waktu_approval: new Date().toISOString()
      };

      return {
        ...p,
        status: nextStatus,
        tamu: {
          ...p.tamu,
          status: nextStatus
        },
        approval_history: [...(p.approval_history || []), historyItem]
      }
    }))
  }

  const addMasterData = (type: 'perkantoran' | 'pabrik' | 'unit_kerja', value: string) => {
    if (type === 'perkantoran') {
      setMasterPerkantoran(prev => [...prev, value])
    } else if (type === 'pabrik') {
      setMasterPabrik(prev => [...prev, value])
    } else {
      setMasterUnitKerja(prev => [...prev, value])
    }
  }

  const removeMasterData = (type: 'perkantoran' | 'pabrik' | 'unit_kerja', value: string) => {
    if (type === 'perkantoran') {
      setMasterPerkantoran(prev => prev.filter(v => v !== value))
    } else if (type === 'pabrik') {
      setMasterPabrik(prev => prev.filter(v => v !== value))
    } else {
      setMasterUnitKerja(prev => prev.filter(v => v !== value))
    }
  }

  const addTkno = (entry: TknoEntry) => {
    setMasterTkno(prev => [...prev, entry])
  }

  const removeTkno = (id: string) => {
    setMasterTkno(prev => prev.filter(t => t.id !== id))
  }

  const rawPengajuanList = pengajuanList;
  const filteredPengajuan = useMemo(() => {
    let filtered = pengajuanList;
    if (user?.role !== 'Sekuriti' && user?.pegawai) {
      filtered = filtered.filter(p => p.penanggung_jawab.id === user.pegawai!.id)
    }

    // Filter by type (Karyawan vs Pengantaran)
    if (currentView === 'table') {
      filtered = filtered.filter(p => !p.is_pengantaran)
    } else if (currentView === 'table_pengantaran') {
      filtered = filtered.filter(p => p.is_pengantaran)
    }
    
    // If activeTab is a custom 'pending' pseudo-tab, match both pending_vp and pending_svp
    if (activeTab as string === 'pending') {
      return filtered.filter(p => p.status === 'pending_vp' || p.status === 'pending_svp')
    }
    
    return filtered.filter(p => p.status === activeTab)
  }, [pengajuanList, activeTab, user, currentView])

  const selectedPengajuan = useMemo(() => {
    return pengajuanList.find(p => p.id === selectedPengajuanId) || null
  }, [pengajuanList, selectedPengajuanId])

  return {
    user,
    activeTab,
    currentView,
    selectedPengajuanId,
    selectedPengajuan,
    filteredPengajuan,
    rawPengajuanList,
    masterPerkantoran,
    masterPabrik,
    masterUnitKerja,
    masterTkno,
    setActiveTab,
    setCurrentView,
    setSelectedPengajuanId,
    handleLogin,
    handleLogout,
    handleAddPengajuan,
    handleAddKioskPengantaran,
    handleCheckIn,
    handleCheckOut,
    handleApprove,
    handleBulkApprove,
    addMasterData,
    removeMasterData,
    addTkno,
    removeTkno
  }
}
