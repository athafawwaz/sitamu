import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Pengajuan, StatusTamu } from "@/store/types"
import { Eye, Package, User, CheckSquare } from "lucide-react"

interface TablePengajuanProps {
  data: Pengajuan[];
  onDetailClick: (id: string) => void;
  enableBulkAction?: boolean;
  onBulkApprove?: (ids: string[]) => void;
}

export function TablePengajuan({ data, onDetailClick, enableBulkAction, onBulkApprove }: TablePengajuanProps) {
  const [filters, setFilters] = useState({
    kunjungan: '',
    penanggungJawab: '',
    tujuan: '',
    namaTamu: '',
    status: ''
  })
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  
  const getStatusBadge = (status: StatusTamu) => {
    switch (status) {
      case 'pending_vp': return <Badge variant="outline" className="text-orange-500 border-orange-500">Menunggu Approval VP</Badge>
      case 'pending_svp': return <Badge variant="outline" className="text-orange-500 border-orange-500">Menunggu Approval SVP</Badge>
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

  if (data.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md bg-muted/20 text-muted-foreground">
        Tidak ada data pengajuan.
      </div>
    )
  }

  const filteredData = data.filter(item => {
    const searchKunjungan = filters.kunjungan.toLowerCase()
    const searchPj = filters.penanggungJawab.toLowerCase()
    const searchTujuan = filters.tujuan.toLowerCase()
    const searchTamu = filters.namaTamu.toLowerCase()
    const searchStatus = filters.status.toLowerCase()

    const matchKunjungan = formatDate(item.tanggal_waktu).toLowerCase().includes(searchKunjungan)
    const matchPj = (item.penanggung_jawab.nama + " " + item.penanggung_jawab.unit_kerja).toLowerCase().includes(searchPj)
    const matchTujuan = (item.alamat_tujuan + " " + item.keperluan).toLowerCase().includes(searchTujuan)
    const matchTamu = item.tamu.nama.toLowerCase().includes(searchTamu)
    const matchStatus = item.status.toLowerCase().includes(searchStatus)

    return matchKunjungan && matchPj && matchTujuan && matchTamu && matchStatus
  })

  const isAllSelected = filteredData.length > 0 && selectedIds.length === filteredData.length;
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredData.map(item => item.id));
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  }

  const handleBulkApprove = () => {
    if (onBulkApprove && selectedIds.length > 0) {
      onBulkApprove(selectedIds);
      setSelectedIds([]); // Reset selection
    }
  }

  return (
    <div className="space-y-4">
      {enableBulkAction && selectedIds.length > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-primary" />
            <span className="font-semibold text-primary">{selectedIds.length} pengajuan terpilih</span>
          </div>
          <Button onClick={handleBulkApprove} className="shadow-md shadow-primary/20">
            Approve {selectedIds.length} Terpilih
          </Button>
        </div>
      )}
      
      <div className="border border-border/50 rounded-xl overflow-x-auto bg-card/60 backdrop-blur-xl shadow-2xl">
        <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            {enableBulkAction && (
              <TableHead className="w-[40px] text-center">
                <input 
                  type="checkbox" 
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 cursor-pointer accent-primary"
                />
              </TableHead>
            )}
            <TableHead className="w-[50px]">No</TableHead>
            <TableHead>Kunjungan</TableHead>
            <TableHead>Penanggung Jawab</TableHead>
            <TableHead>Tujuan & Keperluan</TableHead>
            <TableHead>Nama Tamu</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Waktu Check-In</TableHead>
            <TableHead className="text-center">Waktu Check-Out</TableHead>
            <TableHead className="text-center">Aksi</TableHead>
          </TableRow>
          <TableRow className="bg-muted/30">
            {enableBulkAction && <TableHead></TableHead>}
            <TableHead></TableHead>
            <TableHead className="p-2"><Input placeholder="Filter..." value={filters.kunjungan} onChange={(e) => setFilters({...filters, kunjungan: e.target.value})} className="h-8 text-xs font-normal" /></TableHead>
            <TableHead className="p-2"><Input placeholder="Filter..." value={filters.penanggungJawab} onChange={(e) => setFilters({...filters, penanggungJawab: e.target.value})} className="h-8 text-xs font-normal" /></TableHead>
            <TableHead className="p-2"><Input placeholder="Filter..." value={filters.tujuan} onChange={(e) => setFilters({...filters, tujuan: e.target.value})} className="h-8 text-xs font-normal" /></TableHead>
            <TableHead className="p-2"><Input placeholder="Filter..." value={filters.namaTamu} onChange={(e) => setFilters({...filters, namaTamu: e.target.value})} className="h-8 text-xs font-normal" /></TableHead>
            <TableHead className="p-2"><Input placeholder="Filter..." value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})} className="h-8 text-xs font-normal" /></TableHead>
            <TableHead></TableHead>
            <TableHead></TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => {
              return (
                <TableRow key={item.id} className={selectedIds.includes(item.id) ? "bg-primary/5" : ""}>
                  {enableBulkAction && (
                    <TableCell className="text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(item.id)}
                        onChange={() => toggleSelect(item.id)}
                        className="w-4 h-4 cursor-pointer accent-primary"
                      />
                    </TableCell>
                  )}
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div className="font-medium whitespace-nowrap">
                      {formatDate(item.tanggal_waktu)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{item.penanggung_jawab.nama}</div>
                    <div className="text-xs text-muted-foreground">{item.penanggung_jawab.unit_kerja}</div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate font-medium" title={item.alamat_tujuan}>{item.alamat_tujuan}</div>
                    <div className="text-xs text-muted-foreground max-w-[200px] truncate" title={item.keperluan}>{item.keperluan}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col items-start gap-1">
                      <div className="font-medium">{item.tamu.nama}</div>
                      {item.is_pengantaran ? (
                        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 text-[10px] px-1.5 py-0">
                          <Package className="w-3 h-3 mr-1" /> Pengantaran
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 text-[10px] px-1.5 py-0">
                          <User className="w-3 h-3 mr-1" /> Tamu Umum
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-center text-xs whitespace-nowrap">
                    {item.tamu.waktu_checkin ? formatDate(item.tamu.waktu_checkin) : "-"}
                  </TableCell>
                  <TableCell className="text-center text-xs whitespace-nowrap">
                    {item.tamu.waktu_checkout ? formatDate(item.tamu.waktu_checkout) : "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="sm" onClick={() => onDetailClick(item.id)}>
                      <Eye className="w-4 h-4 mr-1" /> Detail
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                Tidak ada data yang sesuai filter.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  </div>
  )
}
