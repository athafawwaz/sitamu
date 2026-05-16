# Master Data TKNO

Dokumentasi fitur Master Data TKNO pada aplikasi **SI TAMU** — Sistem Informasi Tamu PT Pupuk Sriwidjaja Palembang.

---

## Latar Belakang

Karyawan di lingkungan pabrik dibagi menjadi 2 tipe berdasarkan awalan nomor badge:

| Tipe | Awalan Badge | Contoh | Keterangan |
|------|-------------|--------|------------|
| **TKO** | `6` | `6121509` | Karyawan Organik / Tenaga Kerja Organik |
| **TKNO** | Selain `6` | `3210001`, `4110002`, `5080001` | Tenaga Kerja Non-Organik (kontraktor, outsourcing, mitra) |

Karena PIC Tamu di pabrik banyak berasal dari TKNO, diperlukan mekanisme kontrol akses berbasis master data untuk memastikan hanya TKNO yang terdaftar yang dapat login ke sistem.

---

## Alur Login Berdasarkan Tipe Badge

```
Input Badge
    │
    ├─ Awalan '6' (TKO)
    │       └─ Cek daftar akun TKO sistem (Pegawai, VP, SVP, Sekuriti)
    │               ├─ Ditemukan → Login berhasil
    │               └─ Tidak ditemukan → Error "Badge TKO tidak ditemukan"
    │
    └─ Awalan bukan '6' (TKNO)
            └─ Cek Master Data TKNO
                    ├─ Ditemukan → Login sebagai role 'Pegawai' (PIC Tamu)
                    └─ Tidak ditemukan → Halaman Unauthorized
```

---

## Fitur Login Terkait

### Indikator Tipe Badge
Saat badge diketik di form login, sistem langsung menampilkan label tipe:
- **TKO** (biru) — badge berawalan `6`
- **TKNO** (ungu) — badge bukan awalan `6`

### SSO Preview (TKNO)
Ketika badge TKNO yang diketik **ditemukan di master data**, sistem menampilkan info card otomatis:
- Nama lengkap
- Unit kerja
- Jabatan

Ini mensimulasikan behavior SSO (Single Sign-On) — data muncul otomatis tanpa perlu input manual.

### Warning Badge Tidak Terdaftar
Jika badge TKNO diketik dan **tidak ditemukan** di master data (setelah minimal 5 karakter), sistem menampilkan peringatan kecil bahwa login akan ditolak.

### Halaman Unauthorized
Ketika TKNO mencoba login dengan badge yang tidak ada di master data:
- Ditampilkan halaman **Unauthorized** yang informatif
- Menampilkan badge yang dicoba beserta alasan penolakan
- Tombol kembali ke halaman login

---

## Master Data TKNO

### Akses
Hanya dapat diakses oleh **Sekuriti** melalui menu sidebar:  
`Master Data → Master TKNO`

### Fitur CRUD

#### Tambah TKNO (via SSO Fetch)
1. Masukkan nomor badge TKNO di field input
2. Klik tombol **Cari SSO** — sistem akan melakukan fetch ke SSO
3. Jika **ditemukan** → data auto-fill (nama, unit kerja, jabatan) muncul sebagai card preview
4. Klik **Tambahkan** untuk konfirmasi

#### Tambah TKNO (Manual — SSO tidak ditemukan)
Jika badge tidak ditemukan di SSO, form manual muncul otomatis:
- Nama Lengkap
- Unit Kerja  
- Jabatan

#### Hapus TKNO
- Hover pada baris → tombol hapus (ikon tong sampah) muncul
- Klik untuk menghapus entri dari master data

#### Cari / Filter
- Search bar di bagian atas tabel
- Filter berdasarkan: No. Badge, Nama, Unit Kerja

### Validasi
| Kondisi | Behavior |
|---------|----------|
| Badge berawalan `6` (TKO) | Warning: TKO tidak perlu didaftarkan di master TKNO |
| Badge sudah terdaftar | Info: badge sudah ada di master data |
| Cari SSO badge kosong | Tombol disabled |
| Tambah manual dengan field kosong | Tombol disabled |

---

## Struktur Data

### `TknoEntry` (interface)
```typescript
interface TknoEntry {
  id: string;        // ID unik (format: 'tkno-{timestamp}')
  no_badge: string;  // Nomor badge TKNO
  nama: string;      // Nama lengkap
  unit_kerja: string; // Departemen / unit kerja
  jabatan: string;   // Jabatan / posisi
}
```

### Penyimpanan
Data disimpan di **localStorage** dengan key `masterTkno` dan di-persist otomatis setiap ada perubahan.

---

## File Terkait

| File | Keterangan |
|------|-----------|
| `src/store/types.ts` | Interface `TknoEntry`, tambahan `'master_tkno'` pada `ViewType` |
| `src/store/data.ts` | `initialMasterTkno` — seed data TKNO awal, update badge format `6XXXXXX` |
| `src/store/useAppStore.ts` | State `masterTkno`, fungsi `addTkno`, `removeTkno`, localStorage persistence |
| `src/components/Login.tsx` | Logic TKO/TKNO split, SSO preview, badge format numerik |
| `src/components/UnauthorizedView.tsx` | Halaman unauthorized untuk TKNO tidak terdaftar |
| `src/components/MasterTknoView.tsx` | Halaman CRUD master data TKNO dengan SSO simulation |
| `src/components/Sidebar.tsx` | Menu "Master TKNO" di section Master Data |
| `src/App.tsx` | Integrasi semua komponen baru, state `unauthorizedBadge` |

---

## Quick Login Dev

Format badge TKO yang digunakan di Quick Login panel:

| Badge | Role | Nama |
|-------|------|------|
| `6121501` | Pegawai | Budi Santoso |
| `6121503` | VP | Ahmad Fauzi |
| `6121505` | Sekuriti | Rizky Pratama |
| `6121506` | SVP Operasi | Haryanto |

**Test TKNO login:** Gunakan badge `3210001` s/d `5080001` dengan password `12345678`.

---

## SSO Integration Notes

> Saat ini SSO diimplementasikan sebagai **mock function** dengan delay 800ms untuk simulasi network call.  
> Pada integrasi production, ganti fungsi `mockSsoFetch` di `MasterTknoView.tsx` dengan actual API call ke endpoint SSO internal.

```typescript
// Contoh signature yang perlu diganti:
async function mockSsoFetch(badge: string): Promise<Omit<TknoEntry, 'id'> | null>

// Ganti dengan:
async function fetchFromSSO(badge: string): Promise<Omit<TknoEntry, 'id'> | null> {
  const response = await fetch(`/api/sso/employee/${badge}`)
  if (!response.ok) return null
  return response.json()
}
```
