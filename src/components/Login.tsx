import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { dummyPegawai } from "@/data"
import type { Pegawai, Role } from "@/types"

interface LoginProps {
  onLogin: (role: Role, pegawai?: Pegawai) => void;
}

export function Login({ onLogin }: LoginProps) {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-primary">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">PUSRI Guest Management</CardTitle>
          <CardDescription>Sistem Pengajuan Kedatangan Tamu</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 mt-4">
          <Button 
            className="w-full h-12 text-lg font-medium" 
            onClick={() => onLogin('Pegawai', dummyPegawai[0])}
          >
            Login sebagai Pegawai
          </Button>
          <Button 
            variant="outline" 
            className="w-full h-12 text-lg font-medium"
            onClick={() => onLogin('Sekuriti')}
          >
            Login sebagai Sekuriti
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-4">
            *Untuk mockup ini, login Pegawai akan menggunakan akun dummy Budi Santoso.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
