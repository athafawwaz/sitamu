import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { dummyPegawai } from "@/data"
import type { Pegawai, Pengajuan, Role, Tamu } from "@/types"
import { Plus, Trash2, Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface FormPengajuanProps {
  role: Role;
  currentUser?: Pegawai;
  onSubmit: (pengajuanList: Pengajuan[]) => void;
  onCancel: () => void;
}

export function FormPengajuan({ role, currentUser, onSubmit, onCancel }: FormPengajuanProps) {
  const [alamatTujuan, setAlamatTujuan] = useState("")
  const [keperluan, setKeperluan] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [waktuKunjungan, setWaktuKunjungan] = useState("")
  
  const [selectedPegawaiId, setSelectedPegawaiId] = useState<string>(currentUser ? currentUser.id.toString() : "")
  
  const [daftarTamu, setDaftarTamu] = useState<Omit<Tamu, 'id' | 'status'>[]>([
    { nama: "", alamat: "", no_hp: "" }
  ])

  const penanggungJawab = role === 'Pegawai' 
    ? currentUser 
    : dummyPegawai.find(p => p.id.toString() === selectedPegawaiId)

  const handleAddTamu = () => {
    setDaftarTamu([...daftarTamu, { nama: "", alamat: "", no_hp: "" }])
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!penanggungJawab) return alert("Pilih penanggung jawab")
    if (!alamatTujuan || !keperluan || !date || !waktuKunjungan) return alert("Lengkapi data kunjungan")
    
    const isValidTamu = daftarTamu.every(t => t.nama && t.alamat && t.no_hp)
    if (!isValidTamu) return alert("Lengkapi data tamu")

    // Format date to YYYY-MM-DD
    const tanggalKunjungan = format(date, "yyyy-MM-dd")

    const newPengajuanList: Pengajuan[] = daftarTamu.map(tamuData => ({
      id: crypto.randomUUID(),
      tanggal_waktu: `${tanggalKunjungan}T${waktuKunjungan}`,
      alamat_tujuan: alamatTujuan,
      keperluan: keperluan,
      status: 'outstanding',
      penanggung_jawab: penanggungJawab,
      tamu: {
        id: crypto.randomUUID(),
        ...tamuData,
        status: 'outstanding'
      },
      created_at: new Date().toISOString()
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
                <Label htmlFor="alamat">Alamat Tujuan</Label>
                <Input id="alamat" placeholder="Contoh: Gedung Utama Lt. 2" value={alamatTujuan} onChange={e => setAlamatTujuan(e.target.value)} required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="keperluan">Keperluan</Label>
                <Textarea id="keperluan" placeholder="Deskripsi keperluan kunjungan" value={keperluan} onChange={e => setKeperluan(e.target.value)} required />
              </div>
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
            
            <div className="space-y-4">
              {daftarTamu.map((tamu, index) => (
                <div key={index} className="grid gap-4 md:grid-cols-12 bg-muted/10 p-4 rounded-md border relative group">
                  <div className="space-y-2 md:col-span-3">
                    <Label>Nama Tamu</Label>
                    <Input value={tamu.nama} onChange={e => handleTamuChange(index, 'nama', e.target.value)} required />
                  </div>
                  <div className="space-y-2 md:col-span-5">
                    <Label>Alamat</Label>
                    <Input value={tamu.alamat} onChange={e => handleTamuChange(index, 'alamat', e.target.value)} required />
                  </div>
                  <div className="space-y-2 md:col-span-3">
                    <Label>No. HP</Label>
                    <Input 
                      type="tel" 
                      inputMode="numeric"
                      value={tamu.no_hp} 
                      onChange={e => handleTamuChange(index, 'no_hp', e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="md:col-span-1 flex items-end justify-center pb-1">
                    {daftarTamu.length > 1 && (
                      <Button type="button" variant="destructive" size="icon" onClick={() => handleRemoveTamu(index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

        </CardContent>
        <CardFooter className="flex justify-between border-t p-6 bg-muted/20">
          <Button type="button" variant="ghost" onClick={onCancel}>Batal</Button>
          <Button type="submit" className="px-8">Ajukan Kunjungan</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
