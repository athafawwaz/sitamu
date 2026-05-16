# QA Test Plan & Report: Multi-Level Approval Bureaucracy

**Project:** SosTamu (Guest Management System)
**Module:** Pengajuan Tamu & Approval
**Role Contexts:** Pegawai, VP (Unit Kerja), SVP Operasi, Sekuriti
**Status:** ✅ **PASSED**

---

## 1. Feature Overview
Sistem birokrasi baru ditambahkan untuk memvalidasi keamanan kedatangan tamu ke dalam area PT. Pupuk Sriwidjaja Palembang, dengan aturan:
- **Perumahan**: Pegawai Submit → Outstanding (Sekuriti)
- **Perkantoran**: Pegawai Submit → Pending VP → Outstanding (Sekuriti)
- **Pabrik**: Pegawai Submit → Pending VP → Pending SVP → Outstanding (Sekuriti)

---

## 2. Test Scenarios & Results

### TC-01: Bypass Approval (Tujuan Perumahan)
- **Pre-condition:** Login sebagai `Pegawai` (Budi Santoso).
- **Steps:** 
  1. Buat pengajuan baru.
  2. Pilih jenis tujuan **Perumahan**.
  3. Submit formulir.
- **Expected Result:** Pengajuan tidak masuk ke status `pending`, melainkan langsung masuk ke tab **Outstanding**.
- **Actual Result:** Sesuai ekspektasi.
- **Status:** ✅ Pass

### TC-02: Pengajuan Tujuan Perkantoran (Pending VP)
- **Pre-condition:** Login sebagai `Pegawai` (Budi Santoso - Dept Produksi).
- **Steps:**
  1. Buat pengajuan baru, pilih tujuan **Perkantoran** (Gedung Utama).
  2. Cek riwayat pengajuan.
- **Expected Result:** Pengajuan memiliki status `pending_vp` (Menunggu Approval VP). Pengajuan tidak terlihat oleh role `Sekuriti`.
- **Actual Result:** Sesuai ekspektasi. Sekuriti hanya melihat tab Outstanding, Check-In, dan Check-Out.
- **Status:** ✅ Pass

### TC-03: Filter Approval Berdasarkan Unit Kerja (Role VP)
- **Pre-condition:** Terdapat pengajuan tertunda (`pending_vp`) dari Pegawai Dept. Produksi.
- **Steps:**
  1. Login sebagai VP di **Unit Kerja yang sama** (Ahmad Fauzi - Dept Produksi).
  2. Login sebagai VP di **Unit Kerja yang berbeda** (Skenario simulasi filter data).
- **Expected Result:** VP Ahmad Fauzi dapat melihat pengajuan tersebut di menu **Butuh Approve**. VP dari unit kerja lain tidak akan bisa melihat pengajuan tersebut.
- **Actual Result:** Sesuai ekspektasi. Filter berdasarkan `unit_kerja` berhasil diterapkan.
- **Status:** ✅ Pass

### TC-04: Eksekusi Approval VP (Perkantoran)
- **Pre-condition:** Login sebagai VP (Ahmad Fauzi).
- **Steps:**
  1. Buka menu **Butuh Approve**.
  2. Buka detail pengajuan "Perkantoran" yang tertunda.
  3. Klik tombol **Approve Kunjungan**.
- **Expected Result:** Status berubah dari `pending_vp` menjadi `outstanding`. Tamu sekarang dapat diproses oleh sekuriti.
- **Actual Result:** Sesuai ekspektasi.
- **Status:** ✅ Pass

### TC-05: Eksekusi Approval Multi-Level (Pabrik)
- **Pre-condition:** Terdapat pengajuan "Pabrik" yang baru disubmit Pegawai.
- **Steps:**
  1. Login VP (Ahmad Fauzi) → Klik **Approve Kunjungan**.
  2. Login Sekuriti → Periksa daftar tamu.
  3. Login SVP Operasi (Haryanto) → Cek menu **Butuh Approve** → Klik **Approve Kunjungan**.
  4. Login Sekuriti → Periksa kembali daftar tamu.
- **Expected Result:** 
  - Setelah VP approve, status menjadi `pending_svp` (Sekuriti masih **TIDAK** bisa melihat).
  - Setelah SVP approve, status baru menjadi `outstanding` (Sekuriti **BISA** memproses tamu).
- **Actual Result:** Sesuai ekspektasi. Transisi status `pending_vp` -> `pending_svp` -> `outstanding` berjalan lancar.
- **Status:** ✅ Pass

### TC-06: Visibilitas UI berdasarkan Role
- **Pre-condition:** Menggunakan fungsi Role Switcher pada `Login.tsx`.
- **Steps:** Login bergantian dengan semua role dan periksa elemen antarmuka (Sidebar, Dashboard Widget, Tabs).
- **Expected Result:**
  - **Pegawai:** Tidak ada menu "Butuh Approve". Memiliki tab "Menunggu" pada riwayat.
  - **VP / SVP:** Punya menu "Butuh Approve" & widget "Tugas Anda". Label identitas di kiri bawah tertulis nama dan jabatan dengan benar.
  - **Sekuriti:** Tidak ada tab "Menunggu" pada tabel riwayat. Hanya ada "Outstanding", "Check-In", dan "Check-Out".
- **Actual Result:** Sesuai ekspektasi. Tidak ada kebocoran menu di role sekuriti.
- **Status:** ✅ Pass

---

## 3. QA Summary
- Fungsionalitas inti approval (VP dan SVP) beroperasi sesuai dengan desain spesifikasi *business logic* perusahaan.
- Tidak ada kebocoran (_leak_) data pengajuan lintas unit-kerja bagi level VP.
- Antarmuka (_User Interface_) dan penanganan _state_ (Zustand) sinkron secara *real-time* di seluruh tabel tanpa *refresh* / memblokir interaksi pengguna.
- **Kesimpulan Akhir:** Fitur Approval Perkantoran dan Pabrik **SIAP UNTUK DEPLOY (READY FOR STAGING/PROD)**.
