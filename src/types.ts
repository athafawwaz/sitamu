export type Role = 'Pegawai' | 'Sekuriti';

export interface Pegawai {
  id: number;
  nama: string;
  no_badge: string;
  unit_kerja: string;
}

export type StatusTamu = 'outstanding' | 'checkin' | 'checkout';

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

export interface Pengajuan {
  id: string;
  tanggal_waktu: string; // YYYY-MM-DDTHH:mm
  alamat_tujuan: string;
  keperluan: string;
  status: StatusTamu;
  penanggung_jawab: Pegawai;
  tamu: Tamu;
  created_at: string;
}
