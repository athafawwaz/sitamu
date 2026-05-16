# Dokumentasi Tampilan Mobile (Mobile View) - SITAMU

Dokumen ini menjelaskan strategi dan arsitektur responsif yang diterapkan pada aplikasi SITAMU untuk memastikan pengalaman pengguna (User Experience) yang optimal saat diakses melalui perangkat seluler (Handphone/Smartphone).

## 1. Arsitektur Layout Utama
- **Mobile Header**: Pada tampilan desktop, navigasi menggunakan `Sidebar` di sebelah kiri. Namun, pada tampilan mobile (layar `< 768px`), Sidebar disembunyikan dan digantikan oleh `MobileHeader` di bagian atas. Header ini berisi tombol navigasi utama dan tombol Logout yang ringkas.
- **Main Container**: Kontainer utama menggunakan `flex-1 overflow-y-auto` dengan padding responsif (`p-4` di mobile, `md:p-8` di desktop) agar konten tidak menyentuh tepi layar HP.

## 2. Dashboard (Halaman Utama)
- **Welcome Banner**: Teks disesuaikan ukurannya (`text-3xl md:text-4xl`). Tombol aksi (Buat Pengajuan Baru, Lihat Riwayat) menggunakan `flex-wrap` sehingga akan turun ke baris baru (stacking) secara otomatis pada layar sempit.
- **Ringkasan Kartu (Security)**: Kartu status (Outstanding, Check-In, Check-Out) berubah dari format grid sejajar (`md:grid-cols-3`) menjadi tumpukan vertikal (`gap-4`) yang mudah di-scroll ke bawah pada layar HP.

## 3. Form Pengajuan
- **Sistem Grid**: Formulir menggunakan `grid gap-4 md:grid-cols-2`. Pada HP, seluruh input (Nama, Tujuan, Tanggal, dll) akan otomatis ditumpuk secara vertikal menjadi satu kolom penuh (`col-span-1`).
- **Data Tamu**: Khusus untuk input tamu majemuk, setiap blok tamu dibungkus dalam kontainer berbingkai. Elemen input didalamnya juga menggunakan tumpukan vertikal pada layar kecil, lalu melebar (`md:col-span-3`, `md:col-span-5`) pada layar tablet/desktop.

## 4. Tabel Pengajuan (Riwayat & Approval)
- **Tabs Navigasi**: Tab filter status (Outstanding, Check-In, dll) diubah menggunakan flex container yang dapat di-scroll secara horizontal (swipe) pada HP, untuk mencegah teks bertumpuk jika menggunakan sistem Grid tetap.
- **Horizontal Scroll (Overflow-X)**: Tabel data memiliki banyak kolom (No, Kunjungan, PJ, dll). Tabel dibungkus dalam kontainer `overflow-x-auto`. Pada HP, pengguna dapat melakukan *swipe* ke kiri/kanan untuk melihat data yang panjang tanpa merusak layout utama aplikasi.

## 5. Modal / Dialog Detail Pengajuan
- **Lebar Dinamis**: Modal dialog menggunakan `w-[95vw] max-w-3xl` agar menyisakan sedikit ruang (margin) di sisi kiri-kanan layar HP.
- **Stacking Konten**: Informasi Penanggung Jawab dan Tujuan Kunjungan yang tadinya sejajar (`md:grid-cols-2`) akan otomatis tersusun atas-bawah.
- **Tombol Aksi**: Tombol *Check-In*, *Check-Out*, dan *Cetak Formulir* diubah menggunakan layout `flex-col sm:flex-row gap-2` agar pada layar HP tombol-tombol tersebut berjejer ke bawah dan mudah ditekan menggunakan jempol (Touch Target).

---
*Dokumen ini merupakan bagian dari standar pedoman pengembangan frontend SITAMU.*
