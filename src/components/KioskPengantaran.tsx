import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import type { Pengajuan } from "@/store/types"
import { CheckCircle2, Truck, Package, ShieldCheck } from "lucide-react"

interface KioskPengantaranProps {
  onSubmit: (pengajuan: Pengajuan) => void
  onBackToLogin: () => void
}

const PLACEHOLDER_PENANGGUNG_JAWAB = {
  id: 0,
  nama: 'Belum Ditentukan',
  no_badge: '-',
  unit_kerja: '-',
}

export function KioskPengantaran({ onSubmit, onBackToLogin }: KioskPengantaranProps) {
  const [alamatTujuan, setAlamatTujuan] = useState("")
  const [keperluan, setKeperluan] = useState("")
  const [nama, setNama] = useState("")
  const [instansi, setInstansi] = useState("")
  const [noHp, setNoHp] = useState("")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showConsentModal, setShowConsentModal] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!nama.trim()) errs.nama = "Nama pengantar wajib diisi"
    if (!instansi.trim()) errs.instansi = "Instansi / Asal wajib diisi"
    if (!noHp.trim()) errs.noHp = "No. HP wajib diisi"
    if (!alamatTujuan.trim()) errs.alamatTujuan = "Alamat tujuan wajib diisi"
    if (!keperluan.trim()) errs.keperluan = "Keterangan / Keperluan wajib diisi"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const now = new Date().toISOString()
    const newPengajuan: Pengajuan = {
      id: crypto.randomUUID(),
      tanggal_waktu: now,
      jenis_tujuan: 'Perumahan',
      alamat_tujuan: alamatTujuan,
      keperluan: keperluan,
      status: 'outstanding',
      penanggung_jawab: PLACEHOLDER_PENANGGUNG_JAWAB,
      is_pengantaran: true,
      tamu: {
        id: crypto.randomUUID(),
        nama: nama,
        alamat: instansi,
        no_hp: noHp,
        status: 'outstanding',
      },
      created_at: now,
    }

    onSubmit(newPengajuan)
    setShowSuccessModal(true)
  }

  const handleReset = () => {
    setNama("")
    setInstansi("")
    setNoHp("")
    setAlamatTujuan("")
    setKeperluan("")
    setErrors({})
    setShowSuccessModal(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b bg-white dark:bg-zinc-900 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <img
            src="/Pusri Logo Horizontal Dark - LARGE.svg"
            alt="Pusri"
            className="h-10 object-contain"
          />
        </div>
        {/* <Button
          variant="ghost"
          size="sm"
          className="gap-1.5"
          onClick={onBackToLogin}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Kembali</span>
        </Button> */}
      </header>

      {/* Body */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          
          <div className="mb-8 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Form Pengantaran / Tamu Kunjungan</h2>
              <p className="text-muted-foreground text-sm">Gojek / Paket / Kurir / dll</p>
            </div>
          </div>

          <Card className="shadow-md border-border/50">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Registrasi Pengantaran Mandiri
              </CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-8 pt-6">
                
                {/* Section A: Data Pengantar */}
                <section className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">A. Data Pengantar</h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2 lg:col-span-1">
                      <Label htmlFor="k-nama">Nama Pengantar <span className="text-destructive">*</span></Label>
                      <Input
                        id="k-nama"
                        placeholder="Nama lengkap kurir"
                        value={nama}
                        onChange={e => setNama(e.target.value)}
                        className={errors.nama ? "border-destructive" : ""}
                      />
                      {errors.nama && <p className="text-[10px] text-destructive font-medium">{errors.nama}</p>}
                    </div>
                    <div className="space-y-2 lg:col-span-1">
                      <Label htmlFor="k-instansi">Instansi / Asal <span className="text-destructive">*</span></Label>
                      <Input
                        id="k-instansi"
                        placeholder="Contoh: Gojek, Grab, J&T"
                        value={instansi}
                        onChange={e => setInstansi(e.target.value)}
                        className={errors.instansi ? "border-destructive" : ""}
                      />
                      {errors.instansi && <p className="text-[10px] text-destructive font-medium">{errors.instansi}</p>}
                    </div>
                    <div className="space-y-2 lg:col-span-1">
                      <Label htmlFor="k-nohp">No. HP <span className="text-destructive">*</span></Label>
                      <Input
                        id="k-nohp"
                        type="tel"
                        inputMode="numeric"
                        placeholder="08xxxxxxxxxx"
                        value={noHp}
                        onChange={e => setNoHp(e.target.value.replace(/[^0-9]/g, ''))}
                        className={errors.noHp ? "border-destructive" : ""}
                      />
                      {errors.noHp && <p className="text-[10px] text-destructive font-medium">{errors.noHp}</p>}
                    </div>
                  </div>
                </section>

                {/* Section B: Tujuan */}
                <section className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">B. Tujuan Pengantaran</h3>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="k-alamat">Alamat Tujuan (Perumahan) <span className="text-destructive">*</span></Label>
                      <Input
                        id="k-alamat"
                        placeholder="Contoh: Jl. Mawar No. 10"
                        value={alamatTujuan}
                        onChange={e => setAlamatTujuan(e.target.value)}
                        className={errors.alamatTujuan ? "border-destructive" : ""}
                      />
                      {errors.alamatTujuan && <p className="text-[10px] text-destructive font-medium">{errors.alamatTujuan}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="k-keperluan">Keterangan / Keperluan <span className="text-destructive">*</span></Label>
                      <Textarea
                        id="k-keperluan"
                        placeholder="Contoh: Mengantar makanan / paket"
                        value={keperluan}
                        onChange={e => setKeperluan(e.target.value)}
                        className={errors.keperluan ? "border-destructive" : "min-h-[100px]"}
                      />
                      {errors.keperluan && <p className="text-[10px] text-destructive font-medium">{errors.keperluan}</p>}
                    </div>
                  </div>
                </section>

                {/* <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl flex gap-3 items-start">
                  <div className="p-1 rounded-full bg-amber-500/10 text-amber-600 mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-amber-700 dark:text-amber-400">Informasi Penting</p>
                    <p className="text-xs text-amber-600/80 dark:text-amber-400/70 leading-relaxed"></p>
                  </div>
                </div> */}

              </CardContent>
              <CardFooter className="flex flex-col-reverse sm:flex-row justify-between border-t p-5 sm:p-6 bg-muted/20 gap-3">
                <Button type="button" variant="ghost" className="w-full sm:w-auto" onClick={onBackToLogin}>Batal</Button>
                <Button type="submit" className="w-full sm:w-auto px-10 h-11 font-bold">
                  Daftar
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <Card className="max-w-md w-full shadow-2xl border-primary/20 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-primary h-2 w-full" />
            <CardContent className="p-6 sm:p-8 text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-3 sm:p-4 rounded-full bg-green-500/10 text-green-600 border border-green-500/20">
                  <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
                </div>
              </div>
              <div className="space-y-2 px-2">
                <h3 className="text-xl sm:text-2xl font-bold">Pendaftaran Berhasil!</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Data pengantaran Anda telah tercatat dalam sistem.<br />
                  <strong className="text-foreground">Silakan beri tahu petugas sekuriti</strong> di pos jaga untuk langkah selanjutnya.
                </p>
              </div>
              <Button
                className="w-full h-11 sm:h-12 font-bold text-base"
                onClick={handleReset}
              >
                Selesai
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Data Protection Consent Modal */}
      {showConsentModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/90 backdrop-blur-md p-4 animate-in fade-in duration-500">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-primary/20 animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
            <div className="bg-primary h-1.5 w-full sticky top-0 z-10" />
            <CardHeader className="text-center pt-6 sm:pt-8 px-4">
              <div className="flex justify-center mb-4">
                <div className="p-2.5 sm:p-3 rounded-2xl bg-primary/10 text-primary">
                  <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
              </div>
              <CardTitle className="text-xl sm:text-2xl font-bold leading-tight uppercase">B. Pernyataan dan Persetujuan Tamu</CardTitle>
            </CardHeader>
            <CardContent className="px-5 sm:px-8 pb-4 space-y-4 text-sm text-foreground/80 leading-relaxed">
              <div className="text-xs sm:text-sm space-y-4">
                <p className="font-medium">Dengan ini saya menyatakan bahwa:</p>
                <ol className="space-y-4 list-decimal pl-5">
                  <li>
                    Saya secara sadar dan sukarela menitipkan dokumen identitas pribadi kepada pihak pengelola/penerima tamu sebagai salah satu persyaratan akses masuk kawasan.
                  </li>
                  <li>
                    Dokumen identitas yang dititipkan hanya digunakan untuk:
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Verifikasi identitas pengunjung;</li>
                      <li>Keamanan dan pengendalian akses kawasan;</li>
                      <li>Pencatatan administrasi kunjungan.</li>
                    </ul>
                  </li>
                  <li>
                    Pihak pengelola/penerima tamu berkomitmen menjaga kerahasiaan dan keamanan data pribadi sesuai ketentuan yang berlaku.
                  </li>
                  <li>
                    Saya memahami bahwa:
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Dokumen identitas tidak akan digunakan untuk kepentingan lain di luar proses keamanan dan administrasi kunjungan;</li>
                      <li>Dokumen identitas tidak akan diperbanyak, disebarluaskan, atau dipindahtangankan tanpa persetujuan saya, kecuali diwajibkan oleh peraturan perundang-undangan atau permintaan resmi aparat berwenang.</li>
                    </ul>
                  </li>
                  <li>
                    Saya melepaskan pihak pengelola kawasan, perusahaan, serta tuan rumah/PIC dari tuntutan hukum atas dugaan penyalahgunaan data pribadi sepanjang:
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Pengelolaan data dilakukan sesuai prosedur keamanan yang wajar;</li>
                      <li>Tidak terdapat unsur kesengajaan, kelalaian berat, atau tindakan melawan hukum dari pihak pengelola.</li>
                    </ul>
                  </li>
                  <li>
                    Apabila terjadi kehilangan, kerusakan, atau penyalahgunaan akibat kelalaian atau tindakan pihak lain di luar kendali wajar pengelola, maka penyelesaian akan dilakukan sesuai ketentuan hukum yang berlaku.
                  </li>
                  <li>
                    Saya telah membaca, memahami, dan menyetujui seluruh isi formulir ini tanpa paksaan dari pihak mana pun.
                  </li>
                </ol>
              </div>
            </CardContent>
            <CardFooter className="p-5 sm:p-8 pt-4 sm:pt-6 flex flex-col gap-3">
              <Button 
                className="w-full h-12 font-bold text-base shadow-lg shadow-primary/20"
                onClick={() => setShowConsentModal(false)}
              >
                Saya Mengerti & Setuju
              </Button>
              <Button 
                variant="ghost" 
                className="w-full text-xs text-muted-foreground"
                onClick={onBackToLogin}
              >
                Batal & Kembali
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
