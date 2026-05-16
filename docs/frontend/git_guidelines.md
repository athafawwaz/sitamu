# Panduan Commit & Push SITAMU

Gunakan dokumen ini sebagai acuan standar pesan commit dan penomoran versi (Versioning).

## Format Pesan Commit
Pesan commit harus mengikuti template berikut:
`[Update Major.Minor.Patch] - Deskripsi singkat perubahan`

## Aturan Penomoran Versi (SemVer)
Struktur versi: `Angka1.Angka2.Angka3`

### 1. MAJOR (Angka Pertama)
Naikkan jika ada perubahan besar yang tidak kompatibel dengan versi sebelumnya (Breaking Changes).
- *Contoh: Rombak total database, ganti framework, atau hapus fitur inti.*

### 2. MINOR (Angka Kedua)
Naikkan jika menambah fitur baru atau fungsionalitas baru yang tidak merusak fitur lama.
- *Contoh: Tambah fitur print, ganti nama aplikasi, tambah modul baru.*
- **Catatan**: Jika Minor naik, Patch direset ke `0`.

### 3. PATCH (Angka Ketiga)
Naikkan untuk perbaikan bug, refactor kode, atau perubahan CSS/UI kecil.
- *Contoh: Perbaikan typo, merapikan struktur folder, fix error build.*

---

## Alur Kerja Git (Step-by-Step)

1.  **Cek Status**:
    ```bash
    git status
    ```
2.  **Staging (Tambah File)**:
    ```bash
    git add .
    ```
3.  **Commit (Gunakan Template)**:
    ```bash
    git commit -m "[Update X.Y.Z] - Penjelasan singkat"
    ```
4.  **Push**:
    ```bash
    git push origin main
    ```

---

## Kewajiban Update Changelog (PENTING)

Sebelum melakukan push ke GitHub, AI atau Developer **WAJIB** memperbarui file `src/store/changelog.ts` agar versi di UI sinkron dengan riwayat commit.

### Langkah Update Changelog:
1.  Buka `src/store/changelog.ts`.
2.  Update konstanta `APP_VERSION` ke versi terbaru (sesuai aturan SemVer).
3.  Tambahkan entry baru di bagian paling atas array `CHANGELOG`:
    ```ts
    {
      version: "X.Y.Z",
      date: "YYYY-MM-DD",
      type: "major | minor | patch",
      description: "Deskripsi perubahan yang sama dengan pesan commit"
    },
    ```
4.  Lanjutkan dengan proses `git add`, `git commit`, dan `git push`.


## Contoh Skenario
- Versi sekarang: `1.5.0`
- Ada bug fix di tombol login -> Commit: `[Update 1.5.1] - Fix login button alignment`
- Tambah fitur Export Excel -> Commit: `[Update 1.6.0] - Add Export to Excel feature`
- Ganti UI secara total (Breaking) -> Commit: `[Update 2.0.0] - Revamp UI Design`
