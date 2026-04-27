import { useState, useEffect, useMemo } from 'react'
import type { Pegawai, Pengajuan, Role, StatusTamu } from '@/types'
import { initialPengajuan } from '@/data'

export function useAppStore() {
  const [user, setUser] = useState<{ role: Role, pegawai?: Pegawai } | null>(null)
  const [pengajuanList, setPengajuanList] = useState<Pengajuan[]>(initialPengajuan)
  const [activeTab, setActiveTab] = useState<StatusTamu>('outstanding')
  const [currentView, setCurrentView] = useState<'dashboard' | 'form' | 'table'>('dashboard')
  const [selectedPengajuanId, setSelectedPengajuanId] = useState<string | null>(null)

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
  }, [])

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('pengajuanData', JSON.stringify(pengajuanList))
  }, [pengajuanList])

  const handleLogin = (role: Role, pegawai?: Pegawai) => {
    setUser({ role, pegawai })
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentView('dashboard')
  }

  const handleAddPengajuan = (pengajuanList: Pengajuan[]) => {
    setPengajuanList(prev => [...pengajuanList, ...prev])
    setCurrentView('table')
  }

  const handleCheckIn = (pengajuanId: string, tamuId: string, noBadge: string) => {
    setPengajuanList(prev => prev.map(p => {
      if (p.id !== pengajuanId) return p;
      if (p.tamu.id !== tamuId) return p;
      
      const newStatus = 'checkin' as StatusTamu;
      return {
        ...p,
        status: newStatus,
        tamu: {
          ...p.tamu,
          no_badge_pinjaman: noBadge,
          status: newStatus,
          waktu_checkin: new Date().toISOString()
        }
      }
    }))
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

  const rawPengajuanList = pengajuanList;
  const filteredPengajuan = useMemo(() => {
    let filtered = pengajuanList;
    if (user?.role === 'Pegawai' && user.pegawai) {
      filtered = filtered.filter(p => p.penanggung_jawab.id === user.pegawai!.id)
    }
    return filtered.filter(p => p.status === activeTab)
  }, [pengajuanList, activeTab, user])

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
    setActiveTab,
    setCurrentView,
    setSelectedPengajuanId,
    handleLogin,
    handleLogout,
    handleAddPengajuan,
    handleCheckIn,
    handleCheckOut
  }
}
