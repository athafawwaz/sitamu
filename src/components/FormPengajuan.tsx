import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { dummyPegawai } from "@/store/data"
import type { Pegawai, Pengajuan, Role, Tamu, StatusTamu } from "@/store/types"
import { Plus, Trash2, Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface FormPengajuanProps {
  role: Role;
  currentUser?: Pegawai;
  masterPerkantoran: string[];
  masterPabrik: string[];
  onSubmit: (pengajuanList: Pengajuan[]) => void;
  onCancel: () => void;
}

export function FormPengajuan({ role, currentUser, masterPerkantoran, masterPabrik, onSubmit, onCancel }: FormPengajuanProps) {
  const [alamatTujuan, setAlamatTujuan] = useState("")
  const [keperluan, setKeperluan] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [waktuKunjungan, setWaktuKunjungan] = useState("")
  const [jenisTujuan, setJenisTujuan] = useState<"Perumahan" | "Perkantoran" | "Pabrik">("Perumahan")
  
  const [selectedPegawaiId, setSelectedPegawaiId] = useState<string>(currentUser ? currentUser.id.toString() : "")
  
  const [daftarTamu, setDaftarTamu] = useState<(Omit<Tamu, 'id' | 'status'> & { no_badge_pinjaman?: string })[]>([
    { nama: "", alamat: "", no_hp: "", no_badge_pinjaman: "" }
  ])

  const penanggungJawab = role === 'Pegawai' 
    ? currentUser 
    : dummyPegawai.find(p => p.id.toString() === selectedPegawaiId)

  const handleAddTamu = () => {
    setDaftarTamu([...daftarTamu, { nama: "", alamat: "", no_hp: "", no_badge_pinjaman: "" }])
  }

  const handleRemoveTamu = (index: number) => {
    if (daftarTamu.length > 1) {
      setDaftarTamu(daftarTamu.filter((_, i) => i !== index))
    }
  }

  const handleTamuChange = (index: number, field: keyof typeof daftarTamu[0], value: string) => {
    const newDaftarTamu = [...daftarTamu]
    if (field === 'no_hp') {
      value = value.replace(/[^0-9]/g, '')
    }
    newDaftarTamu[index][field] = value
    setDaftarTamu(newDaftarTamu)
  }

  const isSeкuritiPerumahan = role === 'Sekuriti' && jenisTujuan === 'Perumahan'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!penanggungJawab) return alert("Pilih penanggung jawab")
    if (!alamatTujuan || !keperluan) return alert("Lengkapi data kunjungan")
    if (!isSeкuritiPerumahan && (!date || !waktuKunjungan)) return alert("Lengkapi tanggal dan waktu kunjungan")
    
    const isValidTamu = daftarTamu.every(t => t.nama && t.alamat && t.no_hp)
    if (!isValidTamu) return alert("Lengkapi data tamu")

    const currentTime = new Date().toISOString();
    // For Sekuriti+Perumahan: tanggal_waktu = exact moment of check-in click
    const tanggalWaktu = isSeкuritiPerumahan
      ? currentTime
      : `${format(date!, 'yyyy-MM-dd')}T${waktuKunjungan}`

    let initialStatus: StatusTamu = 'outstanding';
    const initialApprovalHistory: { role: Role, nama_approver: string, waktu_approval: string }[] = [];

    if (jenisTujuan === 'Perkantoran') {
      if (role === 'VP' || role === 'SVP_Operasi') {
        initialStatus = 'outstanding';
        initialApprovalHistory.push({ role, nama_approver: currentUser!.nama, waktu_approval: currentTime });
      } else {
        initialStatus = 'pending_vp';
      }
    } else if (jenisTujuan === 'Pabrik') {
      if (role === 'SVP_Operasi') {
        initialStatus = 'outstanding';
        initialApprovalHistory.push({ role: 'VP', nama_approver: currentUser!.nama, waktu_approval: currentTime });
        initialApprovalHistory.push({ role: 'SVP_Operasi', nama_approver: currentUser!.nama, waktu_approval: currentTime });
      } else if (role === 'VP') {
        initialStatus = 'pending_svp';
        initialApprovalHistory.push({ role, nama_approver: currentUser!.nama, waktu_approval: currentTime });
      } else {
        initialStatus = 'pending_vp';
      }
    } else if (jenisTujuan === 'Perumahan') {
      if (role === 'Sekuriti') {
        const isBadgeComplete = daftarTamu.every(t => t.no_badge_pinjaman && t.no_badge_pinjaman.trim() !== "");
        if (!isBadgeComplete) return alert("Lengkapi nomor badge pinjaman untuk semua tamu");
        initialStatus = 'checkin';
      } else {
        initialStatus = 'outstanding';
      }
    }

    const newPengajuanList: Pengajuan[] = daftarTamu.map(tamuData => ({
      id: crypto.randomUUID(),
      tanggal_waktu: tanggalWaktu,
      jenis_tujuan: jenisTujuan,
      alamat_tujuan: alamatTujuan,
      keperluan: keperluan,
      status: initialStatus,
      penanggung_jawab: penanggungJawab,
      tamu: {
        id: crypto.randomUUID(),
        ...tamuData,
        status: initialStatus,
        waktu_checkin: initialStatus === 'checkin' ? currentTime : undefined
      },
      created_at: new Date().toISOString(),
      approval_history: initialApprovalHistory.length > 0 ? initialApprovalHistory : undefined
    }))

    onSubmit(newPengajuanList)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-md">
      <CardHeader className="bg-muted/50 border-b">
        <CardTitle className="text-xl">Form Pengajuan Tamu</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-8 pt-6">
          
          {/* Data Penanggung Jawab */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">A. Data Penanggung Jawab</h3>
            {role === 'Sekuriti' ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Pilih Karyawan</Label>
                  <Select value={selectedPegawaiId} onValueChange={setSelectedPegawaiId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Karyawan..." />
                    </SelectTrigger>
                    <SelectContent>
                      {dummyPegawai.map(p => (
                        <SelectItem key={p.id} value={p.id.toString()}>
                          {p.nama} - {p.no_badge}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : null}

            {penanggungJawab && (
              <div className="grid gap-4 md:grid-cols-3 bg-muted/20 p-4 rounded-md border">
                <div>
                  <Label className="text-muted-foreground text-xs">Nama Karyawan</Label>
                  <p className="font-medium">{penanggungJawab.nama}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">No. Badge</Label>
                  <p className="font-medium">{penanggungJawab.no_badge}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Unit Kerja</Label>
                  <p className="font-medium">{penanggungJawab.unit_kerja}</p>
                </div>
              </div>
            )}
          </section>

          {/* Data Kunjungan */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">B. Data Kunjungan</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label>Jenis Tujuan</Label>
                <div className="flex gap-6 mt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="jenisTujuan" 
                      value="Perumahan" 
                      checked={jenisTujuan === 'Perumahan'} 
                      onChange={() => { setJenisTujuan('Perumahan'); setAlamatTujuan(''); }} 
                      className="accent-primary w-4 h-4"
                    />
                    <span className="text-sm">Perumahan</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="jenisTujuan" 
                      value="Perkantoran" 
                      checked={jenisTujuan === 'Perkantoran'} 
                      onChange={() => { setJenisTujuan('Perkantoran'); setAlamatTujuan(''); }} 
                      className="accent-primary w-4 h-4"
                    />
                    <span className="text-sm">Perkantoran</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="jenisTujuan" 
                      value="Pabrik" 
                      checked={jenisTujuan === 'Pabrik'} 
                      onChange={() => { setJenisTujuan('Pabrik'); setAlamatTujuan(''); }} 
                      className="accent-primary w-4 h-4"
                    />
                    <span className="text-sm">Pabrik</span>
                  </label>
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="alamat">Alamat Tujuan</Label>
                {jenisTujuan === 'Perumahan' ? (
                  <Input id="alamat" placeholder="Contoh: Jl. Mawar No. 10" value={alamatTujuan} onChange={e => setAlamatTujuan(e.target.value)} required />
                ) : (
                  <Select value={alamatTujuan} onValueChange={setAlamatTujuan} required>
                    <SelectTrigger id="alamat">
                      <SelectValue placeholder={`Pilih ${jenisTujuan}...`} />
                    </SelectTrigger>
                    <SelectContent>
                      {(jenisTujuan === 'Perkantoran' ? masterPerkantoran : masterPabrik).map(tempat => (
                        <SelectItem key={tempat} value={tempat}>
                          {tempat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="keperluan">Keperluan</Label>
                <Textarea id="keperluan" placeholder="Deskripsi keperluan kunjungan" value={keperluan} onChange={e => setKeperluan(e.target.value)} required />
              </div>
              {!isSeкuritiPerumahan && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="tanggal">Tanggal Kunjungan</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP", { locale: localeId }) : <span>Pilih tanggal</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          locale={localeId}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="waktu">Waktu Kunjungan</Label>
                    <Select value={waktuKunjungan} onValueChange={setWaktuKunjungan} required>
                      <SelectTrigger id="waktu">
                        <SelectValue placeholder="Pilih jam..." />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 16 }, (_, i) => {
                          const hour = (i + 7).toString().padStart(2, '0')
                          const time = `${hour}:00`
                          return (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Data Tamu */}
          <section className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-lg font-semibold">C. Data Tamu</h3>
              <Button type="button" variant="outline" size="sm" onClick={handleAddTamu}>
                <Plus className="w-4 h-4 mr-2" /> Tambah Tamu
              </Button>
            </div>
            
            <div className="space-y-3">
              {daftarTamu.map((tamu, index) => (
                <div key={index} className="relative bg-muted/10 border rounded-lg p-4 pt-5">
                  {/* Guest number label + delete button */}
                  <div className="absolute top-3 left-4 text-xs font-semibold text-muted-foreground">
                    Tamu #{index + 1}
                  </div>
                  {daftarTamu.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTamu(index)}
                      className="absolute top-2 right-2 p-1.5 rounded-md text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  {/* Row 1: Nama, Alamat, No HP */}
                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-3 mt-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Nama Tamu</Label>
                      <Input
                        value={tamu.nama}
                        onChange={e => handleTamuChange(index, 'nama', e.target.value)}
                        placeholder="Nama lengkap"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Alamat / Instansi</Label>
                      <Input
                        value={tamu.alamat}
                        onChange={e => handleTamuChange(index, 'alamat', e.target.value)}
                        placeholder="Alamat atau instansi"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">No. HP</Label>
                      <Input
                        type="tel"
                        inputMode="numeric"
                        value={tamu.no_hp}
                        onChange={e => handleTamuChange(index, 'no_hp', e.target.value)}
                        placeholder="08xxxxxxxxxx"
                        required
                      />
                    </div>
                  </div>

                  {/* Row 2: Badge (only for Sekuriti+Perumahan), same width as one column above */}
                  {isSeкuritiPerumahan && (
                    <div className="mt-3 sm:max-w-[33%] space-y-1.5">
                      <Label className="text-xs">No. Badge Pinjaman</Label>
                      <Input
                        value={tamu.no_badge_pinjaman || ''}
                        onChange={e => handleTamuChange(index, 'no_badge_pinjaman', e.target.value)}
                        placeholder="Contoh: B-001"
                        required
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

        </CardContent>
        <CardFooter className="flex justify-between border-t p-6 bg-muted/20">
          <Button type="button" variant="ghost" onClick={onCancel}>Batal</Button>
          <Button type="submit" className="px-8">
            {role === 'Sekuriti' && jenisTujuan === 'Perumahan' ? 'Check-in' : 'Ajukan Kunjungan'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
