# Perencanaan Implementasi: Dashboard Sekuriti

Sebagai Senior Web Developer, berikut adalah rencana untuk merombak tampilan Dashboard khusus untuk role **Sekuriti** agar lebih informatif, interaktif, dan sesuai dengan operasional lapangan mereka.

## Tujuan Utama
Memisahkan perhitungan (statistik) antara "Tamu Umum" dan "Pengantaran" agar sekuriti bisa dengan cepat melihat jenis kunjungan yang sedang aktif, serta memberikan ringkasan operasional tambahan.

## Ringkasan Perubahan Desain

### 1. Pemisahan Metrik Utama (Statistik Status)
Saat ini ada 3 kartu metrik utama (Outstanding, Check-In, Check-Out). Kita akan memperkaya informasi di dalamnya dengan memisahkan total angka menjadi detail "Tamu Umum" dan "Pengantaran".

**Detail Perubahan pada Kartu (Cards):**
- **Outstanding**: Total Keseluruhan.
  - Sub-detail: Jumlah Tamu Umum, Jumlah Pengantaran (jika ada yang Outstanding).
- **Check-In (Sedang di area)**: Total Keseluruhan.
  - Sub-detail: Jumlah Tamu Umum (👤), Jumlah Pengantaran (📦).
- **Check-Out (Selesai)**: Total Keseluruhan.
  - Sub-detail: Jumlah Tamu Umum, Jumlah Pengantaran.

### 2. Panel Baru: Akses Cepat (Quick Actions)
Untuk mempercepat kerja sekuriti, kita akan menambahkan area "Akses Cepat" di bawah Welcome Banner:
- Tombol besar untuk menuju form **Input Pengantaran**.
- (Opsional/Placeholder) Tombol untuk "Lihat Semua Tamu Hari Ini" yang mengarah ke tabel filter 'outstanding'.

### 3. Panel Baru: Aktivitas Terakhir (Recent Activity)
Menampilkan list/feed maksimal 5 aktivitas terbaru yang terjadi hari ini untuk memberikan visibilitas langsung tanpa harus membuka menu tabel.
- *Contoh*:
  - "📦 Budi (Gojek) baru saja Check-In ke Perumahan"
  - "👤 Agus (Vendor) baru saja Check-Out"

---

## Rencana Teknis (Implementation Plan)

### Modifikasi [Dashboard.tsx](file:///c:/Users/user/Documents/Atha%20Fawwaz/SosTamu/src/components/Dashboard.tsx)

1. **Pengolahan Data (Data Derivation):**
   - Filter `pengajuanList` untuk hanya menampilkan data hari ini (opsional, jika data global sudah mencakup itu).
   - Buat variabel counter yang lebih spesifik:
     ```javascript
     const outstandingTamu = ...
     const outstandingPengantaran = ...
     const checkinTamu = ...
     const checkinPengantaran = ...
     const checkoutTamu = ...
     const checkoutPengantaran = ...
     ```
2. **Pembaruan Kartu Metrik:**
   - Gunakan layout grid untuk menampilkan angka utama di tengah, lalu berikan list kecil/badge di bawahnya yang membedakan ikon 👤 (User) dan 📦 (Package).
3. **Penambahan Komponen Feed "Aktivitas Terakhir":**
   - Ambil 5 data terbaru dari `pengajuanList` yang memiliki `waktu_checkin` atau `waktu_checkout` atau `created_at` paling baru.
   - Render dalam bentuk *List* yang rapi menggunakan komponen `Card`.

---

## User Review Required

Apakah rancangan penambahan "Aktivitas Terakhir" dan "Akses Cepat" di atas sesuai dengan kebutuhan lapangan Sekuriti? Atau apakah Bapak/Ibu ingin kita hanya fokus pada perombakan angka statistik di 3 kartu utama saja (Outstanding, Check-in, Check-out)? 

Tolong berikan konfirmasi, jika setuju saya akan langsung mulai mengeksekusi kode di `Dashboard.tsx`.
