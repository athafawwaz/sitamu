## AI Role

You are an expert Backend Developer specializing in Go (Golang) and Enterprise Architecture. Your task is to generate a complete, production-ready backend application based on a provided `schema.dbml` file.

## Tech Stack Requirements

- **Language**: Go 1.24+
- **Framework**: [Fiber v2](https://github.com/gofiber/fiber)
- **ORM**: [GORM](https://gorm.io/)
- **Database**: SQL Server
- **Validation**: [Validator v10](https://github.com/go-playground/validator)
- **API Documentation**: [Swaggo](https://github.com/swaggo/swag) (Swagger)
- **Architecture**: Layered Architecture (Controller -> Service -> Repository -> Model)

## Project Structure

Follow this specific directory structure:

```text
.
├── api
│   ├── config          # Database & Environment configuration (using godotenv)
│   ├── connection      # DB Connection logic, Migrations, and Seeders
│   └── v1
│       ├── controllers # Request handlers & Swagger annotations
│       ├── dto         # Data Transfer Objects (Request/Response structs)
│       ├── models      # GORM database models mapping to DBML
│       ├── repository  # Database queries (GORM logic)
│       └── service     # Business logic & orchestration
├── docs                # Generated Swagger documentation
├── helpers             # Reusable helper functions
├── middleware          # Fiber app creation, Logging, Recovery, CORS
├── routes              # Route definitions (grouped by version)
├── utils               # Utility functions (Logger, JWT, etc.)
├── .env                # Environment variables (Host, Port, DB_*, MODE)
├── go.mod              # Dependencies
└── main.go             # Entry point with flag handling (-migrate, -seed)
```

## Functional Requirements

1. **Timezone**: Set default timezone to `Asia/Jakarta`.
2. **Flag Handling**: Implement `-migrate` (bool) and `-seed` (string) flags in `main.go`.
3. **Auto-Migration**: In production mode (`MODE=prod`), run migrations automatically if flags are not provided.
4. **GORM Configuration**:
   - Use `DisableForeignKeyConstraintWhenMigrating: true` during initialization.
   - Use `Soft Deletes` for models where applicable.
5. **Swagger**: Include full Swagger documentation for all generated endpoints.
6. **Middleware**:
   - Centralize Fiber app creation in `middleware/middleware.go`.
   - Include standard middleware: Logger, Recovery, and CORS.

## Implementation Steps

1. **Analyze Schema**: Parse the provided `schema.dbml`.
2. **Generate Models**: Create GORM models in `api/v1/models`. Use `json` tags and proper GORM tags for relationships.
3. **Generate DTOs**: Create request/response structs in `api/v1/dto`. Use `validate` tags.
4. **Generate Repositories**: Implement Interface-based repositories for CRUD operations.
5. **Generate Services**: Implement Interface-based services containing business logic.
6. **Generate Controllers**: Implement Fiber handlers with Swagger comments.
7. **Setup Routes**: Define endpoints in `routes/v1/routes.go`.
8. **Configuration**: Implement a robust config loader in `api/config`.

## Coding Standards

- Use **Dependency Injection** (Inject Repositories into Services, Services into Controllers).
- Consistent **JSON Response** format (e.g., `{"status": "success", "data": ...}`).
- Return clear **HTTP Status Codes** (200, 201, 400, 401, 404, 500).
- Keep `main.go` clean by delegating initialization to packages.

---

## schema.dbml

```dbml
// ============================================================
// Vistara — Sistem Manajemen Kedatangan Tamu
// PT Pupuk Sriwidjaja Palembang
// ============================================================
//
// ARSITEKTUR DATA:
// - TKO  (badge awalan 6) = Karyawan Organik → data dari SSO API, TIDAK disimpan lokal.
//   Login via SSO, role & profil di-resolve dari response API.
// - TKNO (badge non-6)    = Karyawan Non-Organik → punya akses SSO, tapi HARUS
//   di-assign dulu di master_tkno oleh Sekuriti agar bisa menggunakan sistem.
// - Unit Kerja             → data dari SSO API, TIDAK disimpan lokal.
//
// Karena TKO tidak di-record, field referensi ke karyawan (penanggung_jawab,
// approver) disimpan secara denormalisasi (no_badge + nama + unit_kerja)
// agar data tetap utuh meski tidak ada tabel pegawai lokal.
// ============================================================

// ----- ENUMS -----

Enum role {
  Pegawai
  Sekuriti
  VP
  SVP_Operasi
}

Enum status_tamu {
  pending_vp    [note: 'Menunggu approval VP']
  pending_svp   [note: 'Menunggu approval SVP Operasi (khusus tujuan Pabrik)']
  outstanding   [note: 'Approved — belum check-in']
  checkin       [note: 'Sudah check-in, tamu di dalam area']
  checkout      [note: 'Sudah check-out, kunjungan selesai']
}

Enum jenis_tujuan {
  Perumahan
  Perkantoran
  Pabrik
}

// ----- MASTER DATA: LOKASI PERKANTORAN -----

Table master_perkantoran {
  id          int       [pk, increment]
  nama        nvarchar  [not null, unique, note: 'Contoh: Gedung Utama, Gedung HRD']
  created_at  datetime  [not null, default: `GETDATE()`]
  updated_at  datetime  [not null, default: `GETDATE()`]
  deleted_at  datetime  [note: 'Soft delete']
}

// ----- MASTER DATA: LOKASI PABRIK -----

Table master_pabrik {
  id          int       [pk, increment]
  nama        nvarchar  [not null, unique, note: 'Contoh: Pabrik 1A, Pabrik 2B']
  created_at  datetime  [not null, default: `GETDATE()`]
  updated_at  datetime  [not null, default: `GETDATE()`]
  deleted_at  datetime  [note: 'Soft delete']
}

// ----- MASTER DATA: TKNO -----
// TKNO harus di-register oleh Sekuriti agar bisa login ke sistem.
// Data awal (nama) bisa di-fetch dari SSO API lalu Sekuriti assign unit_kerja.
// Badge non-awalan-6 yang TIDAK terdaftar di sini akan ditolak saat login.

Table master_tkno {
  id          int       [pk, increment]
  no_badge    nvarchar  [not null, unique, note: 'Badge TKNO (non-awalan 6)']
  nama        nvarchar  [not null, note: 'Nama lengkap dari SSO atau input manual']
  unit_kerja  nvarchar  [not null, note: 'Unit kerja yang di-assign oleh Sekuriti']
  jabatan     nvarchar  [note: 'Jabatan karyawan']
  created_at  datetime  [not null, default: `GETDATE()`]
  updated_at  datetime  [not null, default: `GETDATE()`]
  deleted_at  datetime  [note: 'Soft delete']

  indexes {
    no_badge [unique]
  }

  Note: '''
  Login flow untuk TKNO:
  1. User masukkan badge + password
  2. Backend autentikasi ke SSO API
  3. Cek apakah no_badge terdaftar di master_tkno
  4. Jika tidak terdaftar → tolak (unauthorized)
  5. Jika terdaftar → login sebagai Pegawai
  '''
}

// ----- TAMU (Visitor) -----
// Setiap record = 1 orang tamu dalam 1 pengajuan

Table tamu {
  id                  uniqueidentifier  [pk, default: `NEWID()`]
  pengajuan_id        uniqueidentifier  [not null, note: 'FK ke pengajuan']
  nama                nvarchar          [not null, note: 'Nama lengkap tamu / kurir']
  alamat              nvarchar          [not null, note: 'Alamat atau instansi asal (Gojek, J&T, dll)']
  no_hp               nvarchar          [not null]
  no_badge_pinjaman   nvarchar          [note: 'Badge pinjaman diberikan saat check-in']
  status              status_tamu       [not null, default: 'outstanding']
  waktu_checkin       datetime          [note: 'Timestamp check-in oleh Sekuriti']
  waktu_checkout      datetime          [note: 'Timestamp check-out oleh Sekuriti']
  created_at          datetime          [not null, default: `GETDATE()`]
  updated_at          datetime          [not null, default: `GETDATE()`]
  deleted_at          datetime          [note: 'Soft delete']

  indexes {
    pengajuan_id
    status
    no_badge_pinjaman
  }
}

// ----- PENGAJUAN (Submission / Visit Request) -----
// 1 pengajuan = 1 tamu (1-to-1) — frontend creates N pengajuan for N tamu
// Penanggung jawab di-denormalisasi karena bisa TKO (dari API, tidak ada tabel lokal)

Table pengajuan {
  id                      uniqueidentifier  [pk, default: `NEWID()`]
  tanggal_waktu           datetime          [not null, note: 'Waktu rencana kunjungan']
  jenis_tujuan            jenis_tujuan      [not null]
  alamat_tujuan           nvarchar          [not null, note: 'Nama gedung/pabrik atau alamat perumahan']
  keperluan               nvarchar          [not null, note: 'Deskripsi keperluan kunjungan']
  status                  status_tamu       [not null, default: 'outstanding']
  pj_no_badge             nvarchar          [not null, note: 'No badge penanggung jawab (TKO atau TKNO)']
  pj_nama                 nvarchar          [not null, note: 'Nama penanggung jawab (snapshot saat pengajuan dibuat)']
  pj_unit_kerja           nvarchar          [not null, note: 'Unit kerja PJ (snapshot saat pengajuan dibuat)']
  is_pengantaran          bit               [not null, default: false, note: 'true = Gojek/Kurir/Paket entry']
  is_kiosk_entry          bit               [not null, default: false, note: 'true = entri mandiri via kiosk, PJ diisi saat check-in']
  created_at              datetime          [not null, default: `GETDATE()`]
  updated_at              datetime          [not null, default: `GETDATE()`]
  deleted_at              datetime          [note: 'Soft delete']

  indexes {
    status
    pj_no_badge
    jenis_tujuan
    is_pengantaran
    tanggal_waktu
    created_at
  }

  Note: '''
  Approval flow logic:
  - Perumahan     → langsung outstanding (Sekuriti bisa langsung check-in)
  - Perkantoran   → pending_vp → (VP approve) → outstanding
  - Pabrik        → pending_vp → (VP approve) → pending_svp → (SVP approve) → outstanding

  Jika pengaju sendiri adalah VP / SVP, auto-approve sesuai level.

  Denormalisasi PJ:
  - pj_no_badge, pj_nama, pj_unit_kerja adalah snapshot dari data karyawan
    (bisa TKO dari SSO API atau TKNO dari master_tkno) saat pengajuan dibuat.
  - Untuk kiosk entry, field PJ awalnya kosong/placeholder dan diisi oleh
    Sekuriti yang melakukan check-in.
  '''
}

Ref: tamu.pengajuan_id > pengajuan.id [delete: cascade]

// ----- APPROVAL HISTORY -----
// Log setiap approval action oleh VP atau SVP
// Approver selalu TKO (dari SSO API) → denormalisasi, bukan FK

Table approval_history {
  id                  int               [pk, increment]
  pengajuan_id        uniqueidentifier  [not null, note: 'FK ke pengajuan']
  approver_no_badge   nvarchar          [not null, note: 'Badge approver (TKO dari SSO)']
  approver_nama       nvarchar          [not null, note: 'Nama approver (snapshot untuk audit trail)']
  role_at_approval    role              [not null, note: 'Role saat approval: VP atau SVP_Operasi']
  waktu_approval      datetime          [not null, default: `GETDATE()`]
  created_at          datetime          [not null, default: `GETDATE()`]

  indexes {
    pengajuan_id
    approver_no_badge
  }
}

Ref: approval_history.pengajuan_id > pengajuan.id [delete: cascade]

// ============================================================
// RELATIONSHIP SUMMARY
// ============================================================
// master_perkantoran  — standalone master (CRUD by Sekuriti)
// master_pabrik       — standalone master (CRUD by Sekuriti)
// master_tkno         — standalone master (CRUD by Sekuriti, SSO-assisted)
// pengajuan        1 --- 1  tamu               (1 pengajuan = 1 tamu record)
// pengajuan        1 --- N  approval_history
//
// DATA DARI EXTERNAL API (tidak ada tabel lokal):
// - TKO (pegawai organik)  → SSO API  → dipakai untuk login, profil, dan approval
// - Unit Kerja              → SSO API  → dipakai untuk dropdown & display
// ============================================================
```
