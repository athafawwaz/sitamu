import type { Pegawai, Pengajuan } from './types';

export const dummyPegawai: Pegawai[] = [
  { id: 1, nama: "Budi Santoso", no_badge: "PSR-001", unit_kerja: "Departemen Produksi", jabatan: 'Staff' },
  { id: 2, nama: "Siti Rahayu", no_badge: "PSR-002", unit_kerja: "Departemen HR", jabatan: 'Staff' },
  { id: 3, nama: "Ahmad Fauzi", no_badge: "PSR-003", unit_kerja: "Departemen Produksi", jabatan: 'VP' },
  { id: 4, nama: "Dewi Lestari", no_badge: "PSR-004", unit_kerja: "Departemen IT", jabatan: 'Staff' },
  { id: 5, nama: "Rizky Pratama", no_badge: "PSR-005", unit_kerja: "Departemen Keamanan", jabatan: 'Sekuriti' },
  { id: 6, nama: "Haryanto", no_badge: "PSR-006", unit_kerja: "Direktorat Operasi", jabatan: 'SVP_Operasi' }
];

export const masterPerkantoran = [
  "Gedung Utama",
  "Gedung HRD",
  "Gedung Keuangan",
  "Gedung IT",
  "Gedung R&D"
];

export const masterPabrik = [
  "Pabrik 1A",
  "Pabrik 1B",
  "Pabrik 2A",
  "Pabrik 2B",
  "Pabrik 3"
];

export const initialPengajuan: Pengajuan[] = [
  {
    id: "P-1001",
    tamu: {
      id: "T-1001",
      nama: "Agus Setiawan",
      alamat: "Jl. Merdeka No 12, Palembang",
      no_hp: "08123456789",
      status: "outstanding"
    },
    keperluan: "Meeting vendor IT",
    jenis_tujuan: "Perkantoran",
    alamat_tujuan: "Gedung Utama Lt. 2",
    tanggal_waktu: new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toISOString(),
    penanggung_jawab: dummyPegawai[3],
    status: "outstanding",
    created_at: new Date().toISOString()
  },
  {
    id: "P-1002",
    tamu: {
      id: "T-1002",
      nama: "Linda Kusuma",
      alamat: "Jl. Sudirman 45, Jakarta",
      no_hp: "08198765432",
      status: "checkin",
      waktu_checkin: new Date(new Date().getTime() - 1 * 60 * 60 * 1000).toISOString(),
      no_badge_pinjaman: "VIS-001"
    },
    keperluan: "Audit Lapangan",
    jenis_tujuan: "Pabrik",
    alamat_tujuan: "Pabrik 2B",
    tanggal_waktu: new Date(new Date().getTime() - 1 * 60 * 60 * 1000).toISOString(),
    penanggung_jawab: dummyPegawai[0],
    status: "checkin",
    created_at: new Date(new Date().getTime() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "P-1003",
    tamu: {
      id: "T-1003",
      nama: "Hendra Wijaya",
      alamat: "Komp. Pusri Sako",
      no_hp: "081122334455",
      status: "checkout",
      waktu_checkin: new Date(new Date().getTime() - 4 * 60 * 60 * 1000).toISOString(),
      waktu_checkout: new Date(new Date().getTime() - 2 * 60 * 60 * 1000).toISOString(),
      no_badge_pinjaman: "VIS-002"
    },
    keperluan: "Perbaikan Mesin Fotocopy",
    jenis_tujuan: "Perkantoran",
    alamat_tujuan: "Departemen HR",
    tanggal_waktu: new Date(new Date().getTime() - 4 * 60 * 60 * 1000).toISOString(),
    penanggung_jawab: dummyPegawai[1],
    status: "checkout",
    created_at: new Date(new Date().getTime() - 5 * 60 * 60 * 1000).toISOString()
  }
];
