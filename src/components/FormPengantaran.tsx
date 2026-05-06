import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import type { Pegawai, Pengajuan, Role, Tamu, StatusTamu } from "@/store/types"

interface FormPengantaranProps {
  role: Role;
  currentUser?: Pegawai;
  onSubmit: (pengajuanList: Pengajuan[]) => void;
  onCancel: () => void;
}

export function FormPengantaran({ currentUser, onSubmit, onCancel }: FormPengantaranProps) {
  const [alamatTujuan, setAlamatTujuan] = useState("")
  const [keperluan, setKeperluan] = useState("")
  
  const [tamuData, setTamuData] = useState<Omit<Tamu, 'id' | 'status'> & { no_badge_pinjaman?: string }>({
    nama: "", alamat: "", no_hp: "", no_badge_pinjaman: ""
  })

  // Penanggung jawab otomatis sekuriti yang sedang login
  const penanggungJawab = currentUser

  const handleTamuChange = (field: keyof typeof tamuData, value: string) => {
    if (field === 'no_hp') {
      value = value.replace(/[^0-9]/g, '')
    }
    setTamuData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!penanggungJawab) return alert("Data penanggung jawab tidak ditemukan")
    if (!alamatTujuan || !keperluan) return alert("Lengkapi data kunjungan")
    
    const isValidTamu = tamuData.nama && tamuData.alamat && tamuData.no_hp
    if (!isValidTamu) return alert("Lengkapi data tamu pengantar")

    const isBadgeComplete = tamuData.no_badge_pinjaman && tamuData.no_badge_pinjaman.trim() !== "";
    if (!isBadgeComplete) return alert("Lengkapi nomor badge pinjaman untuk pengantar");

    const currentTime = new Date().toISOString();
    const tanggalWaktu = currentTime;

    const initialStatus: StatusTamu = 'checkin';

    const newPengajuanList: Pengajuan[] = [{
      id: crypto.randomUUID(),
      tanggal_waktu: tanggalWaktu,
      jenis_tujuan: 'Perumahan',
      alamat_tujuan: alamatTujuan,
      keperluan: keperluan,
      status: initialStatus,
      penanggung_jawab: penanggungJawab,
      is_pengantaran: true,
      tamu: {
        id: crypto.randomUUID(),
        ...tamuData,
        status: initialStatus,
        waktu_checkin: currentTime
      },
      created_at: new Date().toISOString()
    }]

    onSubmit(newPengajuanList)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-md">
      <CardHeader className="bg-muted/50 border-b">
        <CardTitle className="text-xl">Form Pengantaran (Gojek / Paket / dll)</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-8 pt-6">
          
          {/* Data Penanggung Jawab */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">A. Data Penanggung Jawab</h3>
            {penanggungJawab ? (
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
            ) : (
              <p className="text-sm text-destructive">Data karyawan tidak ditemukan.</p>
            )}
          </section>

          {/* Data Kunjungan */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">B. Data Tujuan</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label>Jenis Tujuan</Label>
                <div className="flex mt-1">
                  <span className="text-sm font-medium px-3 py-1 bg-primary/10 text-primary rounded-full">Perumahan</span>
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="alamat">Alamat Tujuan (Perumahan)</Label>
                <Input id="alamat" placeholder="Contoh: Jl. Mawar No. 10" value={alamatTujuan} onChange={e => setAlamatTujuan(e.target.value)} required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="keperluan">Keterangan / Keperluan</Label>
                <Textarea id="keperluan" placeholder="Contoh: Mengantar paket Shopee / GoFood" value={keperluan} onChange={e => setKeperluan(e.target.value)} required />
              </div>
            </div>
          </section>

          {/* Data Tamu */}
          <section className="space-y-4">
            <div className="border-b pb-2">
              <h3 className="text-lg font-semibold">C. Data Pengantar</h3>
            </div>
            
            <div className="relative bg-muted/10 border rounded-lg p-4 pt-5">
              {/* Row 1: Nama, Alamat, No HP */}
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Nama Pengantar</Label>
                  <Input
                    value={tamuData.nama}
                    onChange={e => handleTamuChange('nama', e.target.value)}
                    placeholder="Nama lengkap kurir/driver"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Instansi / Asal</Label>
                  <Input
                    value={tamuData.alamat}
                    onChange={e => handleTamuChange('alamat', e.target.value)}
                    placeholder="Contoh: J&T, Gojek, Grab"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">No. HP</Label>
                  <Input
                    type="tel"
                    inputMode="numeric"
                    value={tamuData.no_hp}
                    onChange={e => handleTamuChange('no_hp', e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Badge */}
              <div className="mt-3 sm:max-w-[33%] space-y-1.5">
                <Label className="text-xs">No. Badge Pinjaman</Label>
                <Input
                  value={tamuData.no_badge_pinjaman || ''}
                  onChange={e => handleTamuChange('no_badge_pinjaman', e.target.value)}
                  placeholder="Contoh: B-001"
                  required
                />
              </div>
            </div>
          </section>

        </CardContent>
        <CardFooter className="flex justify-between border-t p-6 bg-muted/20">
          <Button type="button" variant="ghost" onClick={onCancel}>Batal</Button>
          <Button type="submit" className="px-8">
            Check-in
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
