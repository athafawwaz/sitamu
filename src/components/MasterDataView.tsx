import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Plus, Building } from "lucide-react"

interface MasterDataViewProps {
  title: string;
  data: string[];
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
}

export function MasterDataView({ title, data, onAdd, onRemove }: MasterDataViewProps) {
  const [newValue, setNewValue] = useState("")

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newValue.trim()) return
    if (data.includes(newValue.trim())) {
      alert("Data sudah ada!")
      return
    }
    onAdd(newValue.trim())
    setNewValue("")
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="bg-muted/50 border-b flex flex-row items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-full text-primary">
          <Building className="w-6 h-6" />
        </div>
        <div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Kelola master data untuk pilihan dropdown {title}</p>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <form onSubmit={handleAdd} className="flex gap-2 items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="new-data">Tambah Data Baru</Label>
            <Input 
              id="new-data"
              placeholder="Masukkan nama lokasi..." 
              value={newValue} 
              onChange={e => setNewValue(e.target.value)} 
            />
          </div>
          <Button type="submit" className="shrink-0">
            <Plus className="w-4 h-4 mr-2" /> Tambah
          </Button>
        </form>

        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground uppercase">Daftar {title}</h4>
          {data.length === 0 ? (
            <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground text-sm">
              Belum ada data.
            </div>
          ) : (
            <ul className="space-y-2">
              {data.map((item, index) => (
                <li key={index} className="flex items-center justify-between p-3 border rounded-md bg-card hover:bg-muted/30 transition-colors">
                  <span className="font-medium">{item}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onRemove(item)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
