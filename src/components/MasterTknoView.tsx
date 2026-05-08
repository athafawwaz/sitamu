import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Users, Search, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import type { TknoEntry } from "@/store/types"
import { masterUnitKerja } from "@/store/data"

// Simulasi SSO fetch — di production diganti dengan real API call
function mockSsoFetch(badge: string): Promise<Omit<TknoEntry, 'id'> | null> {
  const ssoDatabase: Record<string, Omit<TknoEntry, 'id'>> = {
    '3210003': { no_badge: '3210003', nama: 'Ferry Susanto',    unit_kerja: 'Departemen Maintenance',  jabatan: 'Teknisi' },
    '3210004': { no_badge: '3210004', nama: 'Nurul Hidayah',   unit_kerja: 'Departemen K3',           jabatan: 'Staff K3' },
    '4110003': { no_badge: '4110003', nama: 'Wahyu Pratama',   unit_kerja: 'Departemen Logistik',     jabatan: 'Driver' },
    '4110004': { no_badge: '4110004', nama: 'Lina Marlina',    unit_kerja: 'Departemen Catering',     jabatan: 'Staff' },
    '5080002': { no_badge: '5080002', nama: 'Tono Wibowo',     unit_kerja: 'Departemen Engineering',  jabatan: 'Drafter' },
    '7090001': { no_badge: '7090001', nama: 'Hendra Gunawan',  unit_kerja: 'Departemen Konstruksi',   jabatan: 'Mandor' },
    '8010001': { no_badge: '8010001', nama: 'Agung Santoso',   unit_kerja: 'Departemen Sipil',        jabatan: 'Surveyor' },
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      const result = ssoDatabase[badge] ?? null
      resolve(result)
    }, 800)
  })
}

interface MasterTknoViewProps {
  data: TknoEntry[]
  onAdd: (entry: TknoEntry) => void
  onRemove: (id: string) => void
}

export function MasterTknoView({ data, onAdd, onRemove }: MasterTknoViewProps) {
  const [badgeInput, setBadgeInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [ssoResult, setSsoResult] = useState<Omit<TknoEntry, 'id'> | null>(null)
  const [fetchState, setFetchState] = useState<'idle' | 'loading' | 'found' | 'notfound'>('idle')
  const [manualForm, setManualForm] = useState({ nama: '', unit_kerja: '' })
  const [useManual, setUseManual] = useState(false)

  const isTko = badgeInput.startsWith('6')

  const handleFetchSSO = async () => {
    if (!badgeInput.trim()) return
    if (isTko) return // TKO tidak boleh masuk master TKNO
    if (data.some(d => d.no_badge === badgeInput.trim())) return // sudah ada

    setFetchState('loading')
    setSsoResult(null)
    setUseManual(false)

    const result = await mockSsoFetch(badgeInput.trim())
    if (result) {
      setSsoResult(result)
      setFetchState('found')
    } else {
      setFetchState('notfound')
      setManualForm({ nama: '', unit_kerja: '' })
      setUseManual(true)
    }
  }

  const handleAdd = () => {
    let entryData: Omit<TknoEntry, 'id'>
    if (useManual) {
      if (!manualForm.nama.trim() || !manualForm.unit_kerja.trim()) return
      entryData = { no_badge: badgeInput.trim(), jabatan: '', ...manualForm }
    } else {
      if (!ssoResult) return
      entryData = ssoResult
    }

    const newEntry: TknoEntry = {
      id: `tkno-${Date.now()}`,
      ...entryData
    }
    onAdd(newEntry)
    resetForm()
  }

  const resetForm = () => {
    setBadgeInput('')
    setSsoResult(null)
    setFetchState('idle')
    setManualForm({ nama: '', unit_kerja: '' })
    setUseManual(false)
  }

  const alreadyExists = data.some(d => d.no_badge === badgeInput.trim())

  const filteredData = data.filter(t =>
    t.no_badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.unit_kerja.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Card */}
      <Card className="shadow-md">
        <CardHeader className="bg-muted/50 border-b flex flex-row items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-full text-primary">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-xl">Master Data TKNO</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Kelola daftar TKNO yang berwenang sebagai PIC Tamu di pabrik
            </p>
          </div>
          <div className="ml-auto">
            <Badge variant="secondary" className="text-xs">
              {data.length} terdaftar
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Fetch SSO Form */}
          <div className="space-y-4">
            <Label className="text-sm font-semibold">Tambah TKNO</Label>

            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  id="badge-tkno"
                  placeholder="Masukkan No. Badge TKNO..."
                  value={badgeInput}
                  onChange={e => {
                    setBadgeInput(e.target.value)
                    setFetchState('idle')
                    setSsoResult(null)
                    setUseManual(false)
                  }}
                  className="font-mono"
                  onKeyDown={e => { if (e.key === 'Enter') handleFetchSSO() }}
                />
              </div>
              <Button
                onClick={handleFetchSSO}
                disabled={!badgeInput.trim() || fetchState === 'loading' || isTko || alreadyExists}
                variant="outline"
                className="shrink-0"
              >
                {fetchState === 'loading'
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Search className="w-4 h-4" />}
                <span className="ml-2">Cari</span>
              </Button>
            </div>

            {/* Validations */}
            {isTko && badgeInput && (
              <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-md border border-amber-200 dark:border-amber-800">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p>Badge berawalan <strong>6</strong> adalah TKO — tidak perlu ditambahkan ke master TKNO.</p>
              </div>
            )}
            {alreadyExists && badgeInput && !isTko && (
              <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md border border-blue-200 dark:border-blue-800">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <p>Badge <strong>{badgeInput}</strong> sudah terdaftar di master data.</p>
              </div>
            )}

            {/* SSO Result */}
            {fetchState === 'found' && ssoResult && (
              <div className="p-4 rounded-xl border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20 space-y-3">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm font-semibold">Data ditemukan dari SSO</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Nama</p>
                    <p className="font-semibold">{ssoResult.nama}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Unit Kerja</p>
                    <p className="font-semibold">{ssoResult.unit_kerja}</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button size="sm" onClick={handleAdd} className="gap-1.5">
                    <Plus className="w-4 h-4" /> Tambahkan
                  </Button>
                  <Button size="sm" variant="ghost" onClick={resetForm}>Batal</Button>
                </div>
              </div>
            )}

            {/* SSO Not Found → Manual Input */}
            {fetchState === 'notfound' && useManual && (
              <div className="p-4 rounded-xl border-2 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 space-y-4">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-semibold">
                    Badge <span className="font-mono">{badgeInput}</span> tidak ditemukan di SSO — isi manual
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Nama Lengkap *</Label>
                    <Input
                      placeholder="Nama..."
                      value={manualForm.nama}
                      onChange={e => setManualForm(p => ({ ...p, nama: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Unit Kerja *</Label>
                    <select
                      value={manualForm.unit_kerja}
                      onChange={e => setManualForm(p => ({ ...p, unit_kerja: e.target.value }))}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">-- Pilih Unit Kerja --</option>
                      {masterUnitKerja.map(uk => (
                        <option key={uk} value={uk}>{uk}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    onClick={handleAdd}
                    disabled={!manualForm.nama.trim() || !manualForm.unit_kerja.trim()}
                    className="gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Tambahkan
                  </Button>
                  <Button size="sm" variant="ghost" onClick={resetForm}>Batal</Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table Card */}
      <Card className="shadow-md">
        <CardHeader className="border-b px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="font-semibold text-base">Daftar TKNO Terdaftar</h3>
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Cari badge, nama..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredData.length === 0 ? (
            <div className="text-center p-12 text-muted-foreground text-sm">
              {data.length === 0 ? 'Belum ada data TKNO terdaftar.' : 'Tidak ada hasil pencarian.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left px-6 py-3 font-semibold text-muted-foreground uppercase text-xs tracking-wider">No. Badge</th>
                    <th className="text-left px-6 py-3 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Nama</th>
                    <th className="text-left px-6 py-3 font-semibold text-muted-foreground uppercase text-xs tracking-wider hidden sm:table-cell">Unit Kerja</th>
                    <th className="px-4 py-3 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredData.map((entry) => (
                    <tr key={entry.id} className="hover:bg-muted/20 transition-colors group">
                      <td className="px-6 py-3.5">
                        <span className="font-mono font-bold text-primary text-sm">{entry.no_badge}</span>
                      </td>
                      <td className="px-6 py-3.5 font-medium">{entry.nama}</td>
                      <td className="px-6 py-3.5 text-muted-foreground hidden sm:table-cell">{entry.unit_kerja}</td>
                      <td className="px-4 py-3.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
                          onClick={() => onRemove(entry.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
