import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, FileSpreadsheet, FileText, Download } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { Pengajuan, StatusTamu } from "../store/types"
import { exportToExcel, exportToCSV } from "@/lib/ExportUtils"

interface ExportRecapModalProps {
  isOpen: boolean
  onClose: () => void
  data: Pengajuan[]
  title: string
}

export function ExportRecapModal({ isOpen, onClose, data, title }: ExportRecapModalProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [statusFilter, setStatusFilter] = useState<StatusTamu | 'all'>('all')
  const [exportFormat, setExportFormat] = useState<'xlsx' | 'csv'>('xlsx')

  const handleExport = () => {
    // Apply filters
    let filteredData = [...data]

    if (startDate) {
      filteredData = filteredData.filter(p => new Date(p.tanggal_waktu) >= startDate)
    }
    if (endDate) {
      const adjustedEndDate = new Date(endDate)
      adjustedEndDate.setHours(23, 59, 59, 999)
      filteredData = filteredData.filter(p => new Date(p.tanggal_waktu) <= adjustedEndDate)
    }
    if (statusFilter !== 'all') {
      filteredData = filteredData.filter(p => p.status === statusFilter)
    }

    const filename = title.replace(/\s+/g, '_')
    
    if (exportFormat === 'xlsx') {
      exportToExcel(filteredData, filename)
    } else {
      exportToCSV(filteredData, filename)
    }
    
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            Rekapan Data {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Date Range */}
          <div className="grid gap-2">
            <Label>Rentang Waktu (Opsional)</Label>
            <div className="grid grid-cols-2 gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal text-xs px-2 h-9",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {startDate ? format(startDate, "dd/MM/yyyy") : "Mulai"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal text-xs px-2 h-9",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {endDate ? format(endDate, "dd/MM/yyyy") : "Selesai"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Status Filter */}
          <div className="grid gap-2">
            <Label htmlFor="status-filter">Filter Status</Label>
            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as any)}>
              <SelectTrigger id="status-filter" className="h-9">
                <SelectValue placeholder="Pilih Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="pending_vp">Menunggu VP</SelectItem>
                <SelectItem value="pending_svp">Menunggu SVP</SelectItem>
                <SelectItem value="outstanding">Outstanding</SelectItem>
                <SelectItem value="checkin">Check-In</SelectItem>
                <SelectItem value="checkout">Check-Out</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Format Selection */}
          <div className="grid gap-2">
            <Label>Format Export</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setExportFormat('xlsx')}
                className={cn(
                  "flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all",
                  exportFormat === 'xlsx' 
                    ? "border-primary bg-primary/5 text-primary" 
                    : "border-muted hover:border-muted-foreground/30 text-muted-foreground"
                )}
              >
                <FileSpreadsheet className="w-5 h-5" />
                <span className="text-xs font-bold">EXCEL (.xlsx)</span>
              </button>
              <button
                type="button"
                onClick={() => setExportFormat('csv')}
                className={cn(
                  "flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all",
                  exportFormat === 'csv' 
                    ? "border-primary bg-primary/5 text-primary" 
                    : "border-muted hover:border-muted-foreground/30 text-muted-foreground"
                )}
              >
                <FileText className="w-5 h-5" />
                <span className="text-xs font-bold">CSV (.csv)</span>
              </button>
            </div>
          </div>

          <div className="text-[10px] text-muted-foreground bg-muted/50 p-2 rounded border italic">
            * Menampilkan {data.length} data awal yang akan difilter.
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} className="h-10">Batal</Button>
          <Button onClick={handleExport} className="h-10 gap-2 px-6">
            <Download className="w-4 h-4" />
            Download Rekapan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
