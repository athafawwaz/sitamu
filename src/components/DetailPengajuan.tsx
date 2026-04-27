import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import type { Pengajuan, Role, StatusTamu } from "@/types"
import { CheckCircle, Clock, XCircle, Printer } from "lucide-react"
import { printFormulir } from "@/lib/print"

interface DetailPengajuanProps {
  pengajuan: Pengajuan | null;
  role: Role;
  isOpen: boolean;
  onClose: () => void;
  onCheckIn: (pengajuanId: string, tamuId: string, noBadge: string) => void;
  onCheckOut: (pengajuanId: string, tamuId: string) => void;
}

export function DetailPengajuan({ pengajuan, role, isOpen, onClose, onCheckIn, onCheckOut }: DetailPengajuanProps) {
  const [badgeInputs, setBadgeInputs] = useState<Record<string, string>>({})

  // Reset inputs when pengajuan changes
  useEffect(() => {
    if (pengajuan) {
      const initial: Record<string, string> = {}
      if (pengajuan.tamu.status === 'outstanding') {
        initial[pengajuan.tamu.id] = ""
      }
      setBadgeInputs(initial)
    }
  }, [pengajuan])

  if (!pengajuan) return null;

  const handleBadgeChange = (id: string, val: string) => {
    setBadgeInputs(prev => ({ ...prev, [id]: val }))
  }

  const handleCheckInClick = (tamuId: string) => {
    const badge = badgeInputs[tamuId]
    if (!badge || badge.trim() === "") {
      alert("Masukkan No. Badge Peminjaman terlebih dahulu!")
      return
    }
    onCheckIn(pengajuan.id, tamuId, badge)
  }

  const getStatusBadge = (status: StatusTamu) => {
    switch (status) {
      case 'outstanding': return <Badge variant="destructive">Outstanding</Badge>
      case 'checkin': return <Badge variant="default" className="bg-green-600">Check-In</Badge>
      case 'checkout': return <Badge variant="secondary">Check-Out</Badge>
    }
  }

  const formatDate = (isoString: string) => {
    if (!isoString) return "-";
    const date = new Date(isoString)
    return date.toLocaleString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Pengajuan Tamu</DialogTitle>
          <DialogDescription>
            Rencana Kunjungan: {formatDate(pengajuan.tanggal_waktu)}
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 my-4">
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase">Data Penanggung Jawab</h4>
            <div className="bg-muted/30 p-3 rounded-md text-sm border">
              <p><span className="font-medium">Nama:</span> {pengajuan.penanggung_jawab.nama}</p>
              <p><span className="font-medium">Unit Kerja:</span> {pengajuan.penanggung_jawab.unit_kerja}</p>
              <p><span className="font-medium">No. Badge:</span> {pengajuan.penanggung_jawab.no_badge}</p>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase">Tujuan Kunjungan</h4>
            <div className="bg-muted/30 p-3 rounded-md text-sm border">
              <p><span className="font-medium">Alamat:</span> {pengajuan.alamat_tujuan}</p>
              <p><span className="font-medium">Keperluan:</span> {pengajuan.keperluan}</p>
              <p><span className="font-medium">Status Keseluruhan:</span> <span className="ml-2">{getStatusBadge(pengajuan.status)}</span></p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase">Data Tamu</h4>
          
          <div className="space-y-3">
              <div className="border p-4 rounded-lg bg-card shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-lg">{pengajuan.tamu.nama}</p>
                    {getStatusBadge(pengajuan.tamu.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">HP: {pengajuan.tamu.no_hp} | Alamat: {pengajuan.tamu.alamat}</p>
                  
                  {pengajuan.tamu.status !== 'outstanding' && (
                    <div className="text-xs text-muted-foreground mt-2 flex gap-4">
                      {pengajuan.tamu.waktu_checkin && <span><Clock className="inline w-3 h-3 mr-1"/>In: {formatDate(pengajuan.tamu.waktu_checkin)}</span>}
                      {pengajuan.tamu.waktu_checkout && <span><Clock className="inline w-3 h-3 mr-1"/>Out: {formatDate(pengajuan.tamu.waktu_checkout)}</span>}
                      {pengajuan.tamu.no_badge_pinjaman && <span>Badge: <strong>{pengajuan.tamu.no_badge_pinjaman}</strong></span>}
                    </div>
                  )}
                </div>

                {role === 'Sekuriti' && pengajuan.tamu.status === 'outstanding' && (
                  <div className="flex items-end gap-2 w-full md:w-auto mt-2 md:mt-0 bg-muted/20 p-2 rounded-md border">
                    <div className="space-y-1">
                      <Label className="text-xs">No. Badge Peminjaman</Label>
                      <Input 
                        size={1}
                        className="w-40 h-8 text-sm" 
                        placeholder="Contoh: 123456"
                        value={badgeInputs[pengajuan.tamu.id] || ""}
                        onChange={(e) => handleBadgeChange(pengajuan.tamu.id, e.target.value)}
                      />
                    </div>
                    <Button size="sm" className="h-8" onClick={() => handleCheckInClick(pengajuan.tamu.id)}>
                      <CheckCircle className="w-4 h-4 mr-1"/> Check-In
                    </Button>
                  </div>
                )}

                {role === 'Sekuriti' && pengajuan.tamu.status === 'checkin' && (
                  <div className="flex items-center gap-4 mt-2 md:mt-0">
                    <div className="text-sm">
                      Badge: <strong>{pengajuan.tamu.no_badge_pinjaman}</strong>
                    </div>
                    <Button size="sm" variant="secondary" onClick={() => onCheckOut(pengajuan.id, pengajuan.tamu.id)}>
                      <XCircle className="w-4 h-4 mr-1"/> Check-Out
                    </Button>
                  </div>
                )}

              </div>
          </div>
        </div>

        <DialogFooter className="mt-6 flex justify-between items-center sm:justify-between w-full">
          <Button variant="default" onClick={() => printFormulir(pengajuan)}>
            <Printer className="w-4 h-4 mr-2" /> Cetak Formulir
          </Button>
          <Button variant="outline" onClick={onClose}>Tutup</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
