# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Laravel 13+ disaster management system for Indramayu, Indonesia. It features a React frontend built with Inertia.js, providing a near-SPA experience with server-side rendering.

**Stack**: Laravel 13, React 19, Inertia.js, Tailwind CSS v4, TypeScript, MySQL/PostgreSQL

## Development Commands

```bash
# Initial setup
composer install
php artisan key:generate
php artisan migrate --seed
npm install
npm run build

# Development (runs server, queue worker, and Vite dev server concurrently)
composer dev

# Build assets
npm run build

# Frontend linting & formatting
npm run lint      # Auto-fix ESLint issues
npm run format   # Auto-fix Prettier issues
npm run types:check

# PHP linting & testing
composer lint           # Run Pint
composer lint:check     # Check without fixing
composer test           # Full CI check (lint + types + tests)
./vendor/bin/pest       # Run tests directly
./vendor/bin/pest --filter="test name"  # Run specific test
```

## Architecture

### Backend (Laravel)

- **Routes**: `routes/web.php` for public and CMS routes, `routes/settings.php` for user settings
- **Controllers**: Organized by feature domain under `app/Http/Controllers/`:
  - `Dashboard/` - CMS dashboard
  - `Kejadian/` - Incident management (Data Kejadian)
  - `Validasi/` - Report validation (admin)
  - `Peringatan/` - Early warnings (Peringatan Dini)
  - `Analisis/` - AI analysis
  - `Pengaturan/` - System settings
  - `Public/` - Public-facing pages (including PengaduanController for disaster reporting)
  - `Settings/` - User profile/security settings
- **Models**: 17 models total including:
  - `LaporanBencana` - Main disaster report model
  - `JenisBencana` - Disaster types (BANJIR, ROB, ABRASI, LONGSOR, CUACA, KEBAKARAN)
  - `StatusLaporan` - Report statuses (Menunggu, Diproses, Warning, Darurat, Selesai, Ditolak)
  - `Wilayah` - Geographic regions
  - `ValidasiLaporan` - Report validation records
  - `LaporanMedia` - Media attachments
  - And more for ML/NLP/CV analysis, early warnings, etc.
- **Auth**: Laravel Fortify with email verification, 2FA, and passkey support

### Frontend (React/Inertia)

- **Pages**: `resources/js/pages/` - Route-based components matching controller names
  - `disaster/` - CMS pages (dashboard, incidents, validation, analysis, alerts)
  - `public/` - Public pages (home, disaster map, pengaduan/report, information)
  - `public/pengaduan/` - Disaster reporting system (no login required)
  - `auth/` - Authentication pages
  - `settings/` - User settings pages
- **Layouts**: `resources/js/layouts/` - App layout wrappers
  - `admin/` - CMS admin layout with sidebar
  - `public/` - Public site layout
  - `auth/` - Authentication layouts
- **Components**: `resources/js/components/` - Reusable UI components
  - `ui/` - Radix UI primitive wrappers (button, dialog, dropdown, etc.)
  - `disaster/` - Disaster-specific components
- **Hooks**: `resources/js/hooks/` - Custom React hooks

### Route Structure

- `/` - Public home page
- `/public/*` - Public pages (disaster map, report submission, information)
- `/public/lapor-bencana` - Public disaster reporting (NO LOGIN REQUIRED)
- `/public/lacak-laporan` - Track report status
- `/cms/*` - Authenticated CMS routes (dashboard, incidents, validation, alerts)
- `/cms/validation/*` - Admin validation system
- `/cms/settings/*` - User settings (profile, security, appearance)
- `/api/reports/*` - API endpoints for public reporting

## Disaster Reporting System

### Public Reporting (No Login Required)

```php
// Routes
GET  /public/lapor-bencana     - View report form
POST /public/lapor-bencana     - Submit report
GET  /public/lacak-laporan    - Track report by code
GET  /api/reports/latest       - Get latest reports (for map)
GET  /api/reports/statistics   - Get statistics
```

### Admin Validation

```php
// Routes
GET  /cms/validation                    - List pending reports
POST /cms/validation/{id}             - Validate report (valid/invalid/spam/duplikat)
PATCH /cms/validation/{id}/status       - Update report status
```

### Report Lifecycle

1. **Public Submit** → Status: "Menunggu"
2. **Admin Validate** → Status: "Diproses" or "Ditolak"
3. **Status Update** → "Warning", "Darurat", or "Selesai"

### Real-time Features

Broadcasting events fire on:
- `LaporanCreated` - New report submitted
- `LaporanStatusUpdated` - Report status changed
- `LaporanValidated` - Report validated by admin

## Testing

Tests use **Pest** (PHPUnit wrapper). Test files:
- `tests/Unit/Models/` - Model unit tests
- `tests/Feature/` - Feature/integration tests

```php
// Run all tests
./vendor/bin/pest

// Run specific test file
./vendor/bin/pest tests/Feature/PublicReportingTest.php

// Run with filter
./vendor/bin/pest --filter="test_can_submit_report"
```

**Note**: Tests require MySQL test database. Update `phpunit.xml` DB settings if needed.

## Code Style

- **PHP**: Laravel Pint with `laravel` preset (`pint.json`)
- **TypeScript/React**: ESLint + Prettier with Tailwind plugin
- TypeScript strict mode enabled in Inertia config
- Import order: builtin → external → internal → parent → sibling

## Database Configuration

- **Driver**: MySQL (configured in `.env`)
- **Migrations**: 16 new migrations for disaster intelligence system
- **Seeders**: `JenisBencanaSeeder`, `StatusLaporanSeeder`
- Run: `php artisan migrate --seed`

## Broadcasting

- Configure in `config/broadcasting.php`
- Supports: Reverb, Pusher
- Set `BROADCAST_CONNECTION=log` for development
