import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Pengajuan, StatusTamu } from "@/types"
import { Eye } from "lucide-react"

interface TablePengajuanProps {
  data: Pengajuan[];
  onDetailClick: (id: string) => void;
}

export function TablePengajuan({ data, onDetailClick }: TablePengajuanProps) {
  const [filters, setFilters] = useState({
    kunjungan: '',
    penanggungJawab: '',
    tujuan: '',
    namaTamu: '',
    status: ''
  })
  
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

  return (
    <div className="border border-border/50 rounded-xl overflow-x-auto bg-card/60 backdrop-blur-xl shadow-2xl">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
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
                <TableRow key={item.id}>
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
                    <div className="font-medium">{item.tamu.nama}</div>
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
  )
}
