import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutConfirmModal({ isOpen, onClose, onConfirm }: LogoutConfirmModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <LogOut className="w-6 h-6 text-destructive" />
          </div>
          <DialogTitle className="text-center text-xl">Konfirmasi Keluar</DialogTitle>
          <DialogDescription className="text-center pt-2">
            Apakah Anda yakin ingin keluar dari sistem? Sesi Anda akan diakhiri.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex sm:justify-center gap-2 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Batal
          </Button>
          <Button variant="destructive" onClick={onConfirm} className="flex-1">
            Keluar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
