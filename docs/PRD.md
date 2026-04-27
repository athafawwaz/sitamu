# PRD — Sistem Pengajuan Kedatangan Tamu PT Pusri Palembang

**Versi:** 1.0  
**Tanggal:** 27 April 2026  
**Status:** Draft  
**Dibuat oleh:** Tim Produk

---

## 1. Latar Belakang

PT Pusri Palembang saat ini menggunakan formulir fisik (Formulir Kedatangan Tamu) yang harus diisi secara manual, kemudian dikirimkan melalui WhatsApp ke Departemen Keamanan. Proses ini memiliki beberapa kelemahan:

- Rentan kehilangan dokumen atau data tidak lengkap
- Tidak ada visibilitas real-time status tamu
- Proses check-in dan check-out tidak terdokumentasi secara terstruktur
- Sulit untuk audit dan pelaporan historis

Sistem ini bertujuan mendigitalisasi seluruh alur pengajuan, check-in, dan check-out tamu secara terpusat berbasis web.

---

## 2. Tujuan Produk

- Menyederhanakan proses pengajuan tamu oleh karyawan
- Memberikan visibilitas real-time kepada Departemen Keamanan terkait status tamu
- Mengotomasi pengisian data karyawan penanggung jawab
- Menyediakan sistem badge peminjaman yang terdokumentasi
- Menciptakan rekam jejak digital seluruh aktivitas kunjungan tamu

---

## 3. Pengguna (User Roles)

| Role         | Deskripsi                               | Akses                                                        |
| ------------ | --------------------------------------- | ------------------------------------------------------------ |
| **Pegawai**  | Karyawan PT Pusri yang mengajukan tamu  | Mengisi form pengajuan tamu; melihat status tamu miliknya    |
| **Sekuriti** | Petugas Departemen Keamanan di poskodal | Melihat semua pengajuan; melakukan check-in & check-out tamu |

---

## 4. Alur Pengguna (User Flow)

### 4.1 Alur Pegawai

```
Login sebagai Pegawai
        ↓
Data pegawai auto-terisi (Nama, Unit Kerja, No. Badge)
        ↓
Isi Alamat Tujuan & Keperluan
        ↓
Tambah Data Tamu (Nama, Alamat, No. HP) — bisa multiple
        ↓
Isi Tanggal & Waktu Kunjungan
        ↓
Confirm → Status: OUTSTANDING
        ↓
Menunggu proses check-in oleh Sekuriti
```

### 4.2 Alur Sekuriti

```
Login sebagai Sekuriti
        ↓
Pilih nama pegawai dari dropdown (auto-fill: Nama, Unit Kerja, No. Badge)
        ↓
[Atau] Melihat daftar pengajuan Outstanding
        ↓
Klik Detail pada pengajuan
        ↓
Isi No. Badge Peminjaman untuk setiap tamu
        ↓
Confirm Check-In → Status: CHECK-IN
        ↓
Tamu berkunjung...
        ↓
Klik Check-Out → Status: CHECK-OUT
```

---

## 5. Fitur & Spesifikasi Fungsional

### 5.1 Autentikasi & Login

- Halaman login dengan pilihan role: **Pegawai** atau **Sekuriti**
- Untuk Pegawai: login menggunakan No. Badge / username karyawan
- Untuk Sekuriti: login menggunakan kredensial sekuriti
- Setelah login, session menyimpan data role dan identitas pengguna

### 5.2 Form Pengajuan Tamu

#### Bagian A — Data Kunjungan

| Field             | Tipe        | Wajib | Keterangan                              |
| ----------------- | ----------- | ----- | --------------------------------------- |
| Alamat Tujuan     | Text input  | Ya    | Tujuan kunjungan di dalam komplek Pusri |
| Keperluan         | Textarea    | Ya    | Deskripsi keperluan kunjungan           |
| Tanggal Kunjungan | Date picker | Ya    | Tanggal rencana kunjungan               |
| Waktu Kunjungan   | Time picker | Ya    | Perkiraan waktu kunjungan               |

#### Bagian B — Data Tamu (Dynamic List)

- Tombol **"+ Tambah Tamu"** untuk menambah baris data tamu baru
- Setiap baris tamu memiliki field:

| Field     | Tipe        | Wajib |
| --------- | ----------- | ----- |
| Nama Tamu | Text input  | Ya    |
| Alamat    | Textarea    | Ya    |
| No. HP    | Phone input | Ya    |

- Bisa menambah tamu sebanyak-banyaknya
- Setiap baris memiliki tombol hapus (kecuali baris pertama)

#### Bagian C — Data Penanggung Jawab

**Mode Pegawai:** Data terisi otomatis dari session login, read-only:

| Field         | Sumber Data     |
| ------------- | --------------- |
| Nama Karyawan | Dari data login |
| No. Badge     | Dari data login |
| Unit Kerja    | Dari data login |

**Mode Sekuriti:** Dropdown pilih pegawai, setelah dipilih auto-fill:

| Field         | Perilaku                                   |
| ------------- | ------------------------------------------ |
| Nama Karyawan | Dropdown searchable dari API dummy pegawai |
| No. Badge     | Auto-fill setelah pilih nama               |
| Unit Kerja    | Auto-fill setelah pilih nama               |

#### Aksi Form

- Tombol **"Ajukan"** / **"Confirm"** — submit form, data masuk ke tabel dengan status **OUTSTANDING**
- Validasi: semua field wajib harus terisi sebelum submit

### 5.3 Tabel Monitoring Tamu

Tabel utama menampilkan semua pengajuan tamu dengan kolom:

| Kolom           | Deskripsi                                             |
| --------------- | ----------------------------------------------------- |
| No.             | Nomor urut                                            |
| Tanggal/Waktu   | Rencana kunjungan                                     |
| Nama Karyawan   | Penanggung jawab                                      |
| Unit Kerja      | Unit kerja penanggung jawab                           |
| Alamat Tujuan   | Tujuan kunjungan                                      |
| Keperluan       | Keperluan kunjungan                                   |
| Jumlah Tamu     | Total tamu yang diajukan                              |
| Status          | Badge status (Outstanding / Check-In / Check-Out)     |
| Waktu Check-In  | Timestamp otomatis saat check-in (kosong jika belum)  |
| Waktu Check-Out | Timestamp otomatis saat check-out (kosong jika belum) |
| Aksi            | Tombol Detail                                         |

### 5.4 Halaman Detail Pengajuan

Menampilkan ringkasan data pengajuan dan daftar semua tamu. Setiap tamu ditampilkan dalam card/baris dengan:

- Nama Tamu
- Alamat
- No. HP
- Status individual tamu
- Field **No. Badge Peminjaman** (diisi oleh Sekuriti saat check-in)
- Tombol **Check-In** per tamu (visible saat status Outstanding)
- Tombol **Check-Out** per tamu (visible saat status Check-In)

#### Logika Status Check-In

1. Sekuriti membuka halaman Detail dari pengajuan Outstanding
2. Muncul field kosong "No. Badge Peminjaman" untuk setiap tamu
3. Sekuriti mengisi No. Badge Peminjaman untuk masing-masing tamu
4. Klik tombol **"Proses Check-In"** → sistem otomatis merekam `waktu_checkin` (timestamp saat tombol diklik) untuk setiap tamu yang diproses
5. Tamu berpindah ke status **CHECK-IN**; `waktu_checkin` ditampilkan di halaman detail dan tabel
6. Pengajuan berpindah ke tab/menu **Check-In**

#### Logika Status Check-Out

1. Dari halaman detail status Check-In
2. Tombol **"Check-Out"** tersedia per tamu
3. Klik Check-Out → sistem otomatis merekam `waktu_checkout` (timestamp saat tombol diklik) untuk tamu tersebut
4. Tamu berpindah ke status **CHECK-OUT**; `waktu_checkout` ditampilkan di halaman detail dan tabel
5. Jika semua tamu sudah Check-Out → pengajuan berpindah ke menu **Check-Out**

### 5.5 Navigasi Menu / Tab

Tiga menu utama berdasarkan status:

| Menu            | Konten                                   |
| --------------- | ---------------------------------------- |
| **Outstanding** | Pengajuan yang belum di-check-in         |
| **Check-In**    | Tamu yang sedang berada di dalam komplek |
| **Check-Out**   | Tamu yang sudah meninggalkan komplek     |

---

## 6. Data Model (Dummy / Sementara)

### Pegawai (dummy API)

```json
[
  {
    "id": 1,
    "nama": "Budi Santoso",
    "no_badge": "PSR-001",
    "unit_kerja": "Departemen Produksi"
  },
  {
    "id": 2,
    "nama": "Siti Rahayu",
    "no_badge": "PSR-002",
    "unit_kerja": "Departemen HR"
  },
  {
    "id": 3,
    "nama": "Ahmad Fauzi",
    "no_badge": "PSR-003",
    "unit_kerja": "Departemen Keuangan"
  },
  {
    "id": 4,
    "nama": "Dewi Lestari",
    "no_badge": "PSR-004",
    "unit_kerja": "Departemen IT"
  },
  {
    "id": 5,
    "nama": "Rizky Pratama",
    "no_badge": "PSR-005",
    "unit_kerja": "Departemen Keamanan"
  }
]
```

### Pengajuan Tamu

```json
{
  "id": "uuid",
  "tanggal_waktu": "2026-04-28T09:00",
  "alamat_tujuan": "Rumah Dinas Blok A No. 5",
  "keperluan": "Kunjungan keluarga",
  "status": "outstanding | checkin | checkout",
  "penanggung_jawab": {
    "nama": "Budi Santoso",
    "no_badge": "PSR-001",
    "unit_kerja": "Departemen Produksi"
  },
  "daftar_tamu": [
    {
      "id": "uuid",
      "nama": "Slamet Riyadi",
      "alamat": "Jl. Merdeka No. 10, Palembang",
      "no_hp": "08123456789",
      "no_badge_pinjaman": "",
      "status": "outstanding | checkin | checkout",
      "waktu_checkin": "2026-04-28T09:15:00",
      "waktu_checkout": "2026-04-28T14:30:00"
    }
  ],
  "created_at": "2026-04-27T08:00"
}
```

---

## 7. Spesifikasi Non-Fungsional

| Aspek            | Spesifikasi                                         |
| ---------------- | --------------------------------------------------- |
| Platform         | Web (responsive, mobile-friendly)                   |
| Framework        | React.js (SPA)                                      |
| State Management | React useState / Context (sementara, tanpa backend) |
| Data Persistence | localStorage (sementara, MVP)                       |
| API Pegawai      | Dummy JSON lokal / mock API                         |
| Bahasa UI        | Bahasa Indonesia                                    |
| Browser Support  | Chrome, Firefox, Edge (versi terkini)               |

---

## 8. Batasan & Asumsi (MVP)

- **Tidak ada backend nyata** pada fase pertama; data disimpan di localStorage
- **Tidak ada notifikasi WhatsApp otomatis** (fitur future)
- **Tidak ada upload foto KTP** tamu (fitur future)
- **No. Polisi Kendaraan** tidak dimasukkan ke form digital (opsional di form fisik)
- **Satu sesi login** tidak persisten antar tab/browser
- Data dummy pegawai bersumber dari array lokal

---

## 9. Out of Scope (Future Features)

- Integrasi dengan sistem HRIS/SAP PT Pusri untuk data karyawan real
- Notifikasi otomatis via WhatsApp ke Departemen Keamanan
- Upload foto / scan KTP tamu
- Laporan & rekap kunjungan bulanan
- QR Code untuk form tamu
- Approval flow bertingkat
- Notifikasi push/email ke pegawai penanggung jawab
- Dashboard analitik kunjungan

---

## 10. Acceptance Criteria

| ID    | Skenario               | Kriteria Berhasil                                                                                                                                     |
| ----- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| AC-01 | Login sebagai Pegawai  | Data Nama, No. Badge, Unit Kerja terisi otomatis dan read-only                                                                                        |
| AC-02 | Login sebagai Sekuriti | Dropdown nama pegawai tersedia; memilih nama mengisi otomatis No. Badge dan Unit Kerja                                                                |
| AC-03 | Tambah tamu            | Minimal 1 tamu wajib diisi; bisa tambah baris tamu baru; bisa hapus baris tamu                                                                        |
| AC-04 | Submit form            | Semua field wajib tervalidasi; pengajuan muncul di tabel dengan status Outstanding                                                                    |
| AC-05 | Detail pengajuan       | Semua data tamu tampil dengan field No. Badge Peminjaman yang bisa diisi                                                                              |
| AC-06 | Proses Check-In        | Setelah No. Badge Peminjaman diisi dan dikonfirmasi, sistem merekam `waktu_checkin` otomatis (timestamp saat klik); tamu berpindah ke status Check-In |
| AC-07 | Proses Check-Out       | Tamu yang sudah Check-In bisa di-Check-Out; sistem merekam `waktu_checkout` otomatis (timestamp saat klik); berpindah ke menu Check-Out               |
| AC-08 | Filter menu            | Tabel Outstanding hanya tampilkan Outstanding; Check-In hanya Check-In; Check-Out hanya Check-Out                                                     |

---

## 11. Mockup Alur UI (Tekstual)

```
┌─────────────────────────────────────────────┐
│  PUSRI Guest Management System              │
│  [Login sebagai: Pegawai | Sekuriti]        │
└─────────────────────────────────────────────┘

[Setelah Login]

┌─────────────────────────────────────────────┐
│  [Outstanding] [Check-In] [Check-Out]       │
│  ─────────────────────────────────────────  │
│  Tabel daftar pengajuan sesuai tab aktif    │
│  [...] [...] [...] [Detail →]               │
└─────────────────────────────────────────────┘

[Form Pengajuan — kanan atas atau halaman terpisah]

┌─────────────────────────────────────────────┐
│  Data Kunjungan                             │
│  Alamat Tujuan: [________________]          │
│  Keperluan:     [________________]          │
│  Tanggal/Waktu: [____] [____]               │
│                                             │
│  Data Tamu                                  │
│  [Tamu 1] Nama: [__] Alamat: [__] HP: [__] │
│  [Tamu 2] Nama: [__] Alamat: [__] HP: [__] │
│  [+ Tambah Tamu]                            │
│                                             │
│  Penanggung Jawab                           │
│  Nama: [Auto/Dropdown] Badge: [Auto]        │
│  Unit Kerja: [Auto]                         │
│                                             │
│  [Ajukan Kunjungan]                         │
└─────────────────────────────────────────────┘
```
