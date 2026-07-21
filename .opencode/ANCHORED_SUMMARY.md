# Disaster Intelligence — Session Summary

## Objective
- Make the CMS regencies page (`/cms/regencies`) show kecamatan/desa master data for each kabupaten, matching public pages (`/pengaduan`, `/lapor`) which already display them.

## Important Details
- External API endpoints (`api-wilayah-indonesia-two.vercel.app`, `api-wilayah-indonesia-v1.vercel.app`) are both dead (404) and cannot be used
- Data source is the local `wilayah` table — public pages work because that table is populated on the server
- The regencies page previously only showed a flat list of kabupaten (from `supported_regencies` table) with toggle buttons; it was never built to show kecamatan/desa
- The user wants this page to serve as the master data view for kecamatan/desa in CMS settings
- Backend already has `PengaturanController@getKecamatanDesa()` and `getMasterDataWilayah()` endpoints but no frontend UI consumes them
- `config/services.php` fallback URL still points to dead API; `.env` has `WILAYAH_API_URL=https://api-wilayah-indonesia-two.vercel.app/api`

## Work State
### Completed
- Modified `RegencyController@index` to query `Wilayah` model, strip "KABUPATEN/KOTA" prefixes to match `supported_regencies`, group data by kabupaten → kecamatan → desa, and pass it as `wilayahData` prop
- Rewrote `regencies.tsx` with expandable rows: click kabupaten row → shows kecamatan list; click kecamatan → shows desa list with lat/lng; added stats summary cards
- Fixed nested `<tbody>` issue in regencies.tsx
- `npm run build` — passed
- `vendor/bin/pint` — passed

### Active
- (none)

### Blocked
- (none)

## Next Move
1. Deploy updated code to server (git push + deploy)
2. Consider adding sidebar link to `settings/master-data/kecamatan-desa` route if needed

## Relevant Files
- `app/Http/Controllers/Admin/RegencyController.php`: Modified `index()` to pass grouped wilayah data
- `resources/js/pages/disaster/regencies.tsx`: Full rewrite with expandable kecamatan/desa rows and stats summary
- `app/Models/Wilayah.php`: Data source model; fields: `kabupaten`, `kecamatan`, `desa`, `latitude`, `longitude`
- `app/Http/Controllers/Pengaturan/PengaturanController.php`: Has `getKecamatanDesa()` and `getMasterDataWilayah()` endpoints (not yet used by frontend)
