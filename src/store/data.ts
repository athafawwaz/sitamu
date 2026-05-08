import type { Pegawai, Pengajuan, TknoEntry } from './types';

export const dummyPegawai: Pegawai[] = [
  { id: 1, nama: "Budi Santoso",  no_badge: "6121501", unit_kerja: "Departemen Produksi",    jabatan: 'Staff' },
  { id: 2, nama: "Siti Rahayu",   no_badge: "6121502", unit_kerja: "Departemen HR",          jabatan: 'Staff' },
  { id: 3, nama: "Ahmad Fauzi",   no_badge: "6121503", unit_kerja: "Departemen Produksi",    jabatan: 'VP' },
  { id: 4, nama: "Dewi Lestari",  no_badge: "6121504", unit_kerja: "Departemen IT",           jabatan: 'Staff' },
  { id: 5, nama: "Rizky Pratama", no_badge: "6121505", unit_kerja: "Departemen Keamanan",    jabatan: 'Sekuriti' },
  { id: 6, nama: "Haryanto",      no_badge: "6121506", unit_kerja: "Direktorat Operasi",     jabatan: 'SVP_Operasi' }
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

export const initialMasterTkno: TknoEntry[] = [
  { id: 'tkno-1', no_badge: '2411249', nama: 'Atha Fawwaz Firjatullah',       unit_kerja: 'Departemen Produksi',  jabatan: 'Staff' },
  { id: 'tkno-2', no_badge: '3210002', nama: 'Rudi Hartono',      unit_kerja: 'Departemen Utilitas',     jabatan: 'Staff' },
  { id: 'tkno-3', no_badge: '4110001', nama: 'Sari Permata',      unit_kerja: 'Departemen Logistik',     jabatan: 'Staff' },
  { id: 'tkno-4', no_badge: '4110002', nama: 'Dian Kusuma',       unit_kerja: 'Departemen Warehouse',    jabatan: 'Staff' },
  { id: 'tkno-5', no_badge: '5080001', nama: 'Bambang Setiawan',  unit_kerja: 'Departemen Engineering',  jabatan: 'Staff' },
];

export const masterUnitKerja: string[] = [
  'Departemen Produksi',
  'Departemen Utilitas',
  'Departemen Pemeliharaan',
  'Departemen Maintenance',
  'Departemen Engineering',
  'Departemen Konstruksi',
  'Departemen K3',
  'Departemen Keamanan',
  'Departemen Logistik',
  'Departemen Warehouse',
  'Departemen Pengadaan',
  'Departemen HR',
  'Departemen Keuangan',
  'Departemen Akuntansi',
  'Departemen IT',
  'Departemen Hukum',
  'Departemen Komunikasi',
  'Departemen R&D',
  'Departemen Pemasaran',
  'Departemen Catering',
  'Departemen Sipil',
  'Direktorat Operasi',
  'Direktorat Keuangan',
  'Direktorat SDM & Umum',
  'Direktorat Teknik & Pengembangan',
];
