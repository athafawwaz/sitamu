export type Role = 'Pegawai' | 'Sekuriti' | 'VP' | 'SVP_Operasi';

export interface TknoEntry {
  id: string;
  no_badge: string;
  nama: string;
  unit_kerja: string;
  jabatan: string;
}

export interface Pegawai {
  id: number;
  nama: string;
  no_badge: string;
  unit_kerja: string;
  jabatan?: string;
}

export type StatusTamu = 'pending_vp' | 'pending_svp' | 'outstanding' | 'checkin' | 'checkout';

export type ViewType = 'dashboard' | 'form' | 'form_pengantaran' | 'table' | 'master_perkantoran' | 'master_pabrik' | 'approval' | 'master_tkno';

export interface Tamu {
  id: string;
  nama: string;
  alamat: string;
  no_hp: string;
  no_badge_pinjaman?: string;
  status: StatusTamu;
  waktu_checkin?: string;
  waktu_checkout?: string;
}

export interface ApprovalHistory {
  role: Role;
  nama_approver: string;
  waktu_approval: string;
}

export interface Pengajuan {
  id: string;
  tanggal_waktu: string; // YYYY-MM-DDTHH:mm
  jenis_tujuan: 'Perumahan' | 'Perkantoran' | 'Pabrik';
  alamat_tujuan: string;
  keperluan: string;
  status: StatusTamu;
  penanggung_jawab: Pegawai;
  tamu: Tamu;
  is_pengantaran?: boolean;
  created_at: string;
  approval_history?: ApprovalHistory[];
}
