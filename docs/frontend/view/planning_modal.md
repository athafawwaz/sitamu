# Perencanaan Implementasi: Modal Konfirmasi Logout

Sebagai Senior Front End Engineer, saya telah menganalisis flow sistem yang berjalan saat ini. Saat ini fungsi logout dieksekusi secara langsung ketika user menekan tombol "Logout" di `Sidebar` atau `MobileHeader` tanpa ada validasi lanjutan. Praktik ini rawan terhadap *accidental clicks* (ketidaksengajaan).

Oleh karena itu, kita akan menambahkan sebuah **Modal Konfirmasi Logout**.

## User Review Required

- Desain modal konfirmasi akan menggunakan komponen `Dialog` bawaan yang sudah tersedia (`@/components/ui/dialog`). Apakah ada pesan peringatan khusus yang ingin ditampilkan di dalam modal? (Misal: "Apakah Anda yakin ingin keluar dari sesi ini?"). Jika tidak ada instruksi khusus, saya akan menggunakan pesan standar yang *user-friendly*.

## Proposed Changes

### Komponen Baru

#### [NEW] [LogoutConfirmModal.tsx](file:///c:/Users/user/Documents/Atha%20Fawwaz/SosTamu/src/components/LogoutConfirmModal.tsx)
Membuat komponen React terpisah untuk menjaga agar kode di `App.tsx` tetap rapi. Komponen ini akan menerima props:
- `isOpen` (boolean): Menentukan apakah modal sedang tampil.
- `onClose` (function): Fungsi untuk menutup modal (klik Batal).
- `onConfirm` (function): Fungsi eksekusi logout yang sesungguhnya.

### Modifikasi Flow di App.tsx

#### [MODIFY] [App.tsx](file:///c:/Users/user/Documents/Atha%20Fawwaz/SosTamu/src/App.tsx)
- Menambahkan state baru `const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)`.
- Mengubah fungsi `onLogout` prop yang dilempar ke `Sidebar` dan `MobileHeader` agar **tidak langsung memanggil** `handleLogout()`, melainkan memanggil `setIsLogoutModalOpen(true)`.
- Menambahkan komponen `<LogoutConfirmModal />` di root render `App.tsx`.
- Membuat fungsi `confirmLogout` yang akan berisi logika pemanggilan `handleLogout()` dan toast info.

## Verification Plan

### Manual Verification
1. Login menggunakan kredensial apa saja (misal via Quick Login).
2. Klik tombol **Logout** pada menu Sidebar (jika di Desktop) atau di dalam Hamburger Menu (jika di Mobile).
3. Pastikan user **tidak langsung keluar** dari sistem.
4. Pastikan modal konfirmasi muncul dengan pilihan "Batal" dan "Keluar".
5. Klik **Batal**, pastikan modal tertutup dan user tetap login di halaman sebelumnya.
6. Klik **Logout** kembali, lalu klik **Keluar** pada modal konfirmasi.
7. Pastikan modal tertutup, muncul notifikasi toast berhasil logout, dan user dialihkan ke halaman Login.
