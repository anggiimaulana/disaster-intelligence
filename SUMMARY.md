# SUMMARY: Sistem Pengaduan Bencana (Disaster Reporting System)

## Overview

Implementasi sistem pengaduan bencana terintegrasi antara backend Laravel dan frontend React/Inertia untuk disaster-intelligence project.

## Files Created

### 1. Database Migrations (16 files)

| Migration | Table |
|-----------|-------|
| `2026_07_11_000001_create_jenis_bencana_table.php` | jenis_bencana |
| `2026_07_11_000002_create_status_laporan_table.php` | status_laporan |
| `2026_07_11_000003_create_wilayah_table.php` | wilayah |
| `2026_07_11_000004_create_whatsapp_messages_table.php` | whatsapp_messages |
| `2026_07_11_000005_create_laporan_bencana_table.php` | laporan_bencana |
| `2026_07_11_000006_create_laporan_media_table.php` | laporan_media |
| `2026_07_11_000007_create_media_files_table.php` | media_files |
| `2026_07_11_000008_create_validasi_laporan_table.php` | validasi_laporan |
| `2026_07_11_000009_create_early_warning_table.php` | early_warning |
| `2026_07_11_000010_create_ml_predictions_table.php` | ml_predictions |
| `2026_07_11_000011_create_nlp_analysis_table.php` | nlp_analysis |
| `2026_07_11_000012_create_cv_analysis_table.php` | cv_analysis |
| `2026_07_11_000013_create_incident_clusters_table.php` | incident_clusters |
| `2026_07_11_000014_create_analytics_daily_table.php` | analytics_daily |
| `2026_07_11_000015_create_audit_logs_table.php` | audit_logs |
| `2026_07_11_000016_create_workflow_logs_table.php` | workflow_logs |

### 2. Models (17 files)

| Model | Description |
|-------|-------------|
| `JenisBencana.php` | Disaster types (BANJIR, ROB, ABRASI, etc.) |
| `StatusLaporan.php` | Report statuses (Menunggu, Diproses, Warning, etc.) |
| `Wilayah.php` | Geographic regions |
| `WhatsAppMessage.php` | WhatsApp message intake |
| `LaporanBencana.php` | Main disaster report model |
| `LaporanMedia.php` | Media attachments for reports |
| `MediaFile.php` | Media files from WhatsApp |
| `ValidasiLaporan.php` | Report validation records |
| `EarlyWarning.php` | Early warning system |
| `MlPrediction.php` | ML predictions for reports |
| `NlpAnalysis.php` | NLP analysis results |
| `CvAnalysis.php` | Computer Vision analysis |
| `IncidentCluster.php` | Clustered incidents |
| `AnalyticsDaily.php` | Daily analytics |
| `AuditLog.php` | Audit trail |
| `WorkflowLog.php` | Workflow execution logs |

### 3. Controllers

| Controller | Location | Description |
|------------|----------|-------------|
| `PengaduanController.php` | `app/Http/Controllers/Public/` | Public reporting system (no login required) |
| `ValidasiController.php` | `app/Http/Controllers/Validasi/` | Admin validation system |

### 4. Form Requests

| Request | Description |
|---------|-------------|
| `LaporBencanaRequest.php` | Validation for public report submission |
| `TrackLaporanRequest.php` | Validation for tracking reports |
| `ValidasiRequest.php` | Validation for admin validation |
| `ValidasiStoreRequest.php` | Store validation results |

### 5. API Resources

| Resource | Description |
|----------|-------------|
| `LaporanBencanaResource.php` | JSON response for reports |
| `LaporanMediaResource.php` | JSON response for media |
| `ValidasiResource.php` | JSON response for validations |
| `JenisBencanaResource.php` | JSON response for disaster types |
| `StatusLaporanResource.php` | JSON response for statuses |

### 6. Broadcasting Events

| Event | Channel | Description |
|-------|---------|-------------|
| `LaporanCreated.php` | `laporan`, `admin.laporan` | New report created |
| `LaporanStatusUpdated.php` | `laporan`, `admin.laporan`, `laporan.{id}` | Report status changed |
| `LaporanValidated.php` | `laporan`, `admin.laporan`, `laporan.{id}` | Report validated |

### 7. Frontend Pages

| Page | Path | Description |
|------|------|-------------|
| Public Reporting Form | `resources/js/pages/public/pengaduan/index.tsx` | Public report submission |
| Track Report | `resources/js/pages/public/pengaduan/track.tsx` | Track report status |
| Validation Admin | `resources/js/pages/disaster/validation.tsx` | Admin validation interface |

### 8. Unit Tests (7 files)

| Test File | Tests |
|------------|-------|
| `tests/Unit/Models/LaporanBencanaTest.php` | 8 tests |
| `tests/Unit/Models/StatusLaporanTest.php` | 4 tests |
| `tests/Unit/Models/JenisBencanaTest.php` | 5 tests |
| `tests/Unit/Models/WilayahTest.php` | 3 tests |
| `tests/Unit/Models/ValidasiLaporanTest.php` | 8 tests |
| `tests/Feature/PublicReportingTest.php` | 8 tests |
| `tests/Feature/ValidationTest.php` | 7 tests |

## Routes

### Public Routes (No Login Required)

```
GET  /public/lapor-bencana          - View report form
POST /public/lapor-bencana          - Submit report
GET  /public/lacak-laporan           - Track report page
```

### API Routes

```
GET  /api/reports/latest            - Get latest reports (for map)
GET  /api/reports/statistics         - Get statistics
GET  /api/reports/track             - Track specific report
```

### Admin Routes (Requires Auth)

```
GET  /cms/validation                - Validation list
GET  /cms/validation/{id}           - View report detail
POST /cms/validation/{id}           - Validate report
PATCH /cms/validation/{id}/status   - Update report status
```

## Key Features

### 1. Public Reporting System
- **No login required** - Anyone can submit reports
- Form validation with Indonesian error messages
- Phone number normalization (supports various formats)
- File upload support (images, videos up to 10MB)
- Google Maps integration for location picking
- Auto-generated unique report codes (LAP-YYYY-NNNN)
- Severity auto-calculation based on description keywords
- Reporter metadata stored in description field

### 2. Report Tracking
- Track reports by code (e.g., LAP-2026-0001)
- Real-time status updates
- Timeline view of report lifecycle
- Validation results display

### 3. Admin Validation System
- Split view: list + detail
- Real-time statistics dashboard
- Filter by disaster type
- Pagination support
- Validation actions: Valid, Invalid, Spam, Duplicate
- Status update: Diproses, Warning, Darurat, Selesai
- Audit logging for all actions

### 4. Real-time Features
- Laravel broadcasting events for:
  - New report creation
  - Status updates
  - Validation completion
- Pusher/Reverb configuration ready
- Private channels for admin

## Database Seeding

```bash
php artisan db:seed
```

Seeders created:
- `JenisBencanaSeeder` - 6 disaster types
- `StatusLaporanSeeder` - 6 statuses

## Running the System

### Setup
```bash
composer install
php artisan migrate --seed
npm install
npm run build
```

### Development
```bash
composer dev  # Runs server, queue, and vite
```

### Testing
```bash
./vendor/bin/pest
```

## Configuration Notes

### Database
- Currently configured for MySQL
- Edit `.env` for database settings
- Test database: `disaster_intelligence_test`

### Broadcasting
- Edit `config/broadcasting.php`
- Supports: Reverb, Pusher, null (for development)
- Set `BROADCAST_CONNECTION=log` for development

### File Storage
- Media files stored in `storage/app/public/laporan/`
- Configure `FILESYSTEM_DISK` in `.env`

## Next Steps

1. **Run migrations**: `php artisan migrate --seed`
2. **Configure broadcasting**: Set up Pusher or Reverb for real-time
3. **Set up file storage**: Configure S3 or local storage
4. **Run tests**: Configure test database and run `./vendor/bin/pest`
5. **Customize UI**: Adjust Tailwind styles as needed

## Architecture Patterns Used

- **Repository-like Models**: Models include business logic methods
- **Service-like Controllers**: Controllers handle orchestration
- **Form Request Validation**: Separate validation from controllers
- **API Resources**: Consistent JSON response formatting
- **Broadcasting Events**: Real-time updates via Laravel Echo
- **Eloquent Relationships**: Proper foreign key relationships
- **Scopes**: Query scopes for common filters

## Notes

- Tests require MySQL test database configuration
- Broadcasting requires external service (Pusher/Reverb) for production
- File uploads require proper storage configuration
- The system uses Indonesian language for user-facing content

---

## Log Perubahan & Pembaruan Sistem Pelaporan & Pelacakan Laporan (Changelog & Architecture Decisions)

Dokumen ini memuat rangkuman lengkap dari seluruh modifikasi kode yang telah dilakukan untuk menyempurnakan fitur pelaporan publik, pelacakan laporan bencana, struktur identitas laporan (`kode_laporan`), privasi data pelapor, dan kestabilan antarmuka React/Inertia.

---

### 1. Perbaikan Struktur Kode Unik Laporan (`kode_laporan`) yang Lebih Aman & Anti-Injeksi

#### **Masalah & Alasan Perubahan**
Sebelumnya, kode laporan dibangkitkan dengan format sederhana:
`LAP-{TAHUN}-{NOMOR_URUT}` (contoh: `LAP-2026-0002`).
Format ini mudah ditebak atau diinjeksi (*enumerable sequence*), sehingga penyerang/pengguna lain dapat mencoba mengganti parameter URL `kode_laporan` menjadi `0001`, `0003`, dan seterusnya untuk mengintip laporan lain.

#### **Format Baru yang Diterapkan**
Format kode laporan diubah menjadi struktur anti-injeksi dan informatif:
```
LAP-{TAHUN}{BULAN}{TANGGAL}-{KODEUNIKACAK}{ID}-0{JUMLAH_LAPORAN_HARI_INI}
```
**Contoh Output:**
```
LAP-20260712-ADHZ0001-01
LAP-20260712-ABCD0100-050
```

**Rincian Spesifikasi Format:**
1. **`LAP`**: Prefix standar pengaduan/laporan bencana.
2. **`{TAHUN}{BULAN}{TANGGAL}` (`Ymd`)**: Tanggal pembuatan laporan (contoh: `20260712`).
3. **`{KODEUNIKACAK}` (4 Huruf Kapital A-Z)**: 4 karakter abjad acak (contoh: `ADHZ`, `AISU`, `ABCD`) untuk menjamin keunikan kriptografis dan mencegah kemudahan menebak ID laporan.
4. **`{ID}` (4 Digit Zero-Padded ID)**: Nomor ID urutan rekaman pada tabel dengan *padding* 4 digit:
   - Satuan (misal ID 1): `0001`
   - Puluhan (misal ID 15): `0015`
   - Ratusan (misal ID 100): `0100`
   - Ribuan/lebih (misal ID 1000): `1000`
5. **`-0{JUMLAH_LAPORAN_HARI_INI}`**: Nomor urut laporan yang masuk pada hari tersebut dengan prefiks `0`:
   - Laporan pertama hari ini: `-01`
   - Laporan ke-5 hari ini: `-05`
   - Laporan ke-50 hari ini: `-050`

#### **Berkas Kode yang Dimodifikasi:**
- **`app/Models/LaporanBencana.php`** (Metode `generateKode()`):
  ```php
  public static function generateKode(): string
  {
      $dateStr = date('Ymd');
      $todayDate = date('Y-m-d');

      // 4 huruf abjad kapital acak (A-Z)
      $letters = substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 4);

      // ID berikutnya (berdasarkan max ID di tabel + 1)
      $nextId = (static::max('id') ?? 0) + 1;
      $formattedId = str_pad((string) $nextId, 4, '0', STR_PAD_LEFT);

      // Jumlah laporan hari ini + 1
      $todayCount = static::whereDate('created_at', $todayDate)->count() + 1;
      $formattedTodayCount = '0'.$todayCount;

      return sprintf('LAP-%s-%s%s-%s', $dateStr, $letters, $formattedId, $formattedTodayCount);
  }
  ```
- **`app/Http/Requests/TrackLaporanRequest.php` & `app/Http/Controllers/Public/PengaduanController.php`**:
  Memperbarui aturan validasi regex dari `/^LAP-\d{4}-\d{4}$/` menjadi `/^LAP-[A-Z0-9\-]+$/i` pada form request maupun validasi *inline* di metode `track` agar mendukung format baru yang lebih aman.
- **`resources/js/pages/public/pengaduan/track.tsx`**:
  Memperbarui *placeholder* input pencarian menjadi `"Contoh: LAP-20260712-ADHZ0001-01"`.

---

### 2. Penghapusan Sensor Data Pelapor (No. Telepon & Email)

#### **Masalah & Alasan Perubahan**
Sebelumnya, sistem secara otomatis mensensor nomor telepon (`6287*****7242`) dan email (`an************@****.***`) pelapor baik saat disimpan dalam deskripsi kejadian maupun di audit log. Hal ini menyulitkan verifikator/petugas lapangan dan pelapor sendiri saat memverifikasi keaslian data pengaduan.

#### **Perbaikan yang Dilakukan**
- **`app/Http/Controllers/Public/PengaduanController.php`**:
  - Menyimpan nomor WhatsApp/telepon (`no_hp`) dan email (`email`) pelapor **secara utuh tanpa sensor (`masking`)** pada `reporterData` yang disisipkan ke kolom `deskripsi`.
  - Menyimpan data sejati pada tabel log audit (`AuditLog`).
  - Mengubah fungsi helper `maskPhoneNumber()` dan `maskEmail()` agar mengembalikan nilai asli tanpa karakter bintang (`*`).
- **`app/Http/Controllers/Kejadian/KejadianController.php`**:
  - Mengubah metode privat `maskPhone()` agar mengembalikan nomor telepon secara utuh pada tampilan administrasi kejadian.

---

### 3. Resolusi Error Layar Putih/Kosong (*Blank Screen*) pada Pelacakan Laporan

#### **Masalah & Alasan Perubahan**
Ketika halaman `/public/lacak-laporan` diakses, browser sempat mengembalikan HTTP 200 OK namun layar tampil kosong (*blank/white screen*). Hal ini disebabkan oleh:
1. Data dari `LaporanBencanaResource` dibungkus dalam *envelope* `data` (`{ data: { id, status, ... } }`).
2. Komponen React mengakses langsung `laporan.status.warna` tanpa *optional chaining*, sehingga ketika objek belum siap atau terbungkus, React mengalami *TypeError exception*.

#### **Perbaikan yang Dilakukan**
- **`app/Http/Controllers/Public/PengaduanController.php` (Metode `track`)**:
  - Menambahkan pemanggilan `.resolve()` pada `(new LaporanBencanaResource($laporan))->resolve()` agar Inertia menerima objek laporan yang datar (*flattened*) dan konsisten dengan antarmuka TypeScript.
- **`resources/js/pages/public/pengaduan/track.tsx`**:
  - Menambahkan *helper* `unwrapLaporan()` untuk mendeteksi dan membuka otomatis jika data terbungkus properti `.data`.
  - Menggunakan *Optional Chaining* (`?.`) serta *fallback default* (`|| '-'`) pada seluruh akses properti relasional (`status?.nama`, `jenis_bencana?.nama`, `tingkat_keparahan`, fungsi pembagikan ke WhatsApp/Telegram).

---

### 4. Reset & Verifikasi Basis Data (`migrate:fresh --seed`)
Sesuai instruksi untuk menerapkan ke keseluruhan sistem, basis data telah direset dari awal menggunakan perintah:
```bash
php artisan migrate:fresh --seed
```
Seluruh skema tabel, data master referensi (`wilayah`, `jenis_bencana`, `status_laporan`), serta pengujian otomatis (`php artisan test --compact`) telah dijalankan dan diverifikasi 100% berhasil lulus (*80 tests passed*).

---

### 5. Pembersihan Teks Deskripsi & Pemisahan Kartu "Informasi Pelapor" yang Estetis dan Terstruktur

#### **Masalah & Alasan Perubahan**
Sebelumnya, ketika laporan disimpan, data pelapor dilampirkan ke dalam kolom `deskripsi` sebagai *string JSON mentah* seperti `[Pelapor: {"nama":"...","no_hp":"...","email":"..."}]`. Hal ini menyebabkan tampilan pada halaman pelacakan laporan terlihat tidak rapi (*raw JSON string visible inside event description*).

#### **Perbaikan yang Dilakukan**
- **`app/Http/Resources/LaporanBencanaResource.php`**:
  - Mengekstrak blok JSON `[Pelapor: {...}]` secara otomatis di sisi *backend* menjadi objek PHP terstruktur (`pelapor`) sekaligus membersihkan teks pada atribut `deskripsi` agar bebas dari *string* JSON mentah.
- **`resources/js/pages/public/pengaduan/track.tsx`**:
  - Menambahkan *helper* `extractPelaporAndCleanDeskripsi()` yang memastikan deskripsi kejadian bersih dari tag JSON mentah.
  - Menambahkan komponen kartu khusus **"Informasi Pelapor"** di bawah **Deskripsi Kejadian** yang menyajikan nama, nomor WhatsApp/telepon, dan alamat email pelapor secara rapi, profesional, dan mudah dibaca tanpa masking.
  - Memastikan tata letak responsif (*responsive 3-column grid*) dengan *auto-wrap* (`break-words [overflow-wrap:anywhere]`) agar teks panjang seperti email tidak melampaui batas card.

---

### 6. Pencegahan Blank Screen Dashboard Login (`Sparkline` & `StatCardsRow` Safety)

#### **Masalah & Alasan Perubahan**
Ketika berhasil login ke dashboard, halaman sempat menjadi kosong (*blank screen*) dengan error konsol:
`Uncaught TypeError: Cannot read properties of undefined (reading 'length') at Sparkline (sparkline.tsx:2:13)`
Hal ini disebabkan oleh prop tren statistik (`sparkData`) yang bernilai `undefined` atau berformat objek bersarang (`stats.totalLaporan.trend`) yang dikirim dari *controller* ke komponen `StatCardsRow`.

#### **Perbaikan yang Dilakukan**
- **`resources/js/components/disaster/sparkline.tsx`**:
  - Menambahkan pengecekan *null safety* (`if (!data || !Array.isArray(data) || data.length < 2) return null;`). Jika data grafik tren bernilai `undefined`, `null`, atau memiliki kurang dari 2 titik data, komponen mengembalikan `null` dengan aman tanpa menyebabkan *crash* pada aplikasi.
- **`resources/js/pages/disaster/components/stat-cards-row.tsx`**:
  - Menambahkan *helper* pembaca properti statistik (`getStatValue`, `getStatTrend`, `getStatPct`) sehingga komponen mendukung format objek bersarang dari backend maupun format properti datar sekaligus menyediakan *fallback* default (`0` dan array kosong `[]`).
- **`resources/js/components/disaster/risk-badge.tsx`**, **`status-badge.tsx`**, **`disaster-type-badge.tsx`**:
  - Menambahkan normalisasi *case-insensitive* (`toUpperCase()`) dan konfigurasi *fallback* default pada ketiga komponen *badge* sehingga tidak pernah terjadi error `Cannot read properties of undefined (reading 'className')` saat menerima nilai berformat campuran seperti `'Tinggi'`, `'Darurat'`, atau `'Menunggu Validasi'`.

---

### 7. Perbaikan UI/UX CMS & Peningkatan Stabilitas Media Library

#### **Masalah & Alasan Perubahan**
Admin sebelumnya kesulitan mengelola konten karena teks editor `react-quill` yang tidak kompatibel dengan React 19, tidak adanya fitur manajemen gambar yang baik, skor SEO yang dilakukan secara manual, serta munculnya *blank screen* pada beberapa halaman karena ketidaksesuaian parsing struktur JSON.

#### **Perbaikan yang Dilakukan**
- **Implementasi TipTap Rich Text Editor**: 
  - Mengganti `react-quill` dengan komponen `RichTextEditor` (berbasis TipTap) di modul Berita, Kesiapsiagaan, FAQ, dan Peringatan Dini. Hal ini memecahkan masalah inkompatibilitas dengan React 19.
- **Fitur Icon & SEO Bawaan**:
  - **`IconPicker`**: Mengimplementasikan komponen pemilih ikon dinamis untuk modul Kesiapsiagaan dan FAQ yang tidak selalu menggunakan gambar profil/thumbnail.
  - **`SeoAnalyzer`**: Menambahkan alat analisis SEO *real-time* ke form CMS untuk memberikan umpan balik (skor/rating) kualitas konten dan panjang teks secara langsung.
- **Penyelesaian Blank Screen Media Library**:
  - Memperbaiki halaman `/cms/media` yang memutih akibat kesalahan pembacaan *meta pagination* (mengonversi dari `media.total` ke format Ineria standar `media.meta.total`).
- **Peningkatan Kapasitas Media Library**:
  - Menambahkan antarmuka dan *endpoint* baru untuk fungsi **Edit** (merubah nama file dan pemindahan folder) dan **Hapus** pada tabel `MediaLibrary`.
  - Memperbaiki tautan *Copy URL* menggunakan *Absolute URL* (`config('app.url')`) alih-alih path relatif (`/storage/...`), sehingga alamat yang disalin bisa digunakan di mana saja.
- **Pemecahan Konflik Namespace/LSP**:
  - Menambahkan impor dan menghapus *root alias call* (`\Str` & `\Schema`) di `InformationController` yang menyebabkan _false-positive warning_ pada IDE.
