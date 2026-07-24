<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use App\Models\EarlyWarning;
use App\Models\JenisBencana;
use App\Models\LaporanBencana;
use App\Models\Setting;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $reportsToday = LaporanBencana::whereDate('created_at', today())->count();
        $activeWarnings = EarlyWarning::where('status', 'aktif')->count();
        $highRiskZones = LaporanBencana::whereIn('tingkat_keparahan', ['Tinggi', 'Darurat'])->distinct('kecamatan')->count('kecamatan');
        $citizenParticipation = LaporanBencana::count(); // Count total reports as participation

        $stats = [
            'reportsToday' => $reportsToday,
            'activeWarnings' => $activeWarnings,
            'highRiskZones' => $highRiskZones,
            'citizenParticipation' => $citizenParticipation,
            'isSimulation' => false,
        ];

        // Get recent valid and pending reports (status 1-5, excluding ditolak/6)
        $reports = LaporanBencana::with(['jenisBencana:id,kode,nama_bencana,warna', 'status:id,nama_status', 'wilayah:id,latitude,longitude'])
            ->whereIn('status_id', [1, 2, 3, 4, 5])
            ->latest()
            ->take(20)
            ->get()
            ->map(function ($l) {
                $lat = (float) ($l->latitude ?? $l->wilayah?->latitude ?? 0);
                $lng = (float) ($l->longitude ?? $l->wilayah?->longitude ?? 0);

                return [
                    'id' => (string) $l->id,
                    'lat' => $lat,
                    'lng' => $lng,
                    'type' => $l->jenisBencana?->kode ?? 'LAINNYA',
                    'title' => $l->judul,
                    'location' => $l->alamat,
                    'status' => $l->status_id === 1 ? 'pending_report' : 'valid_report',
                    'timestamp' => $l->created_at->format('Y-m-d H:i:s'),
                ];
            })
            ->filter(fn ($m) => $m['lat'] !== 0.0 && $m['lng'] !== 0.0);

        // Get active early warnings — mapped to PublicAlert interface
        $riskMap = ['Siaga' => 'SEDANG', 'Waspada' => 'WASPADA', 'Awas' => 'TINGGI'];
        $statusMap = ['aktif' => 'AKTIF', 'selesai' => 'SELESAI'];

        $alerts = EarlyWarning::with(['jenisBencana:id,kode,nama_bencana', 'laporan:id,latitude,longitude,judul,alamat'])
            ->where('status', 'aktif')
            ->get()
            ->map(function ($a) use ($riskMap, $statusMap) {
                $riskLevel = $riskMap[$a->level_warning] ?? 'RENDAH';
                $status = $statusMap[$a->status] ?? 'AKTIF';
                $location = $a->laporan?->alamat ?? $a->wilayah ?? '';

                // Split location into district/village if comma-separated
                $parts = array_map('trim', explode(',', $location));
                $district = $parts[0] ?? $location;
                $village = $parts[1] ?? null;

                return [
                    'id' => 'alert_'.$a->id,
                    'title' => $a->pesan ?? 'Peringatan Dini',
                    'disasterType' => $a->jenisBencana?->kode ?? 'LAINNYA',
                    'riskLevel' => $riskLevel,
                    'status' => $status,
                    'district' => $district,
                    'village' => $village,
                    'latitude' => (float) ($a->laporan?->latitude ?? 0),
                    'longitude' => (float) ($a->laporan?->longitude ?? 0),
                    'summary' => $a->pesan ?? 'Peringatan dini aktif',
                    'issuedAt' => $a->created_at->toISOString(),
                    'updatedAt' => $a->updated_at->toISOString(),
                    'isSimulation' => false,
                    'recommendedAction' => null,
                    // Legacy fields for map rendering
                    'lat' => (float) ($a->laporan?->latitude ?? 0),
                    'lng' => (float) ($a->laporan?->longitude ?? 0),
                    'type' => $a->jenisBencana?->kode ?? 'LAINNYA',
                    'location' => $location,
                    'timestamp' => $a->created_at->format('Y-m-d H:i:s'),
                ];
            });

        $activeAlerts = $alerts->values()->toArray();
        $markers = $reports->concat($alerts->filter(fn ($m) => $m['lat'] !== 0.0 && $m['lng'] !== 0.0))->values()->toArray();

        // Get settings for map
        $settings = Setting::whereIn('key', ['map_default_zoom', 'map_layer_risiko', 'map_cluster_marker'])->pluck('value', 'key');
        $mapSettings = [
            'zoom' => (int) ($settings['map_default_zoom'] ?? 11),
            'layer_risiko' => (bool) ($settings['map_layer_risiko'] ?? true),
            'cluster_marker' => (bool) ($settings['map_cluster_marker'] ?? true),
        ];

        $disasterTypes = JenisBencana::select('kode', 'nama_bencana', 'warna', 'icon')->get()->map(function ($type) {
            return [
                'type' => $type->kode,
                'label' => $type->nama_bencana,
                'color' => $type->warna ?? '#1E88FF',
            ];
        });

        // Get latest published berita for homepage
        $articles = Berita::where('status', 'published')
            ->latest('published_at')
            ->take(6)
            ->get()
            ->map(function ($b) {
                $excerpt = strip_tags($b->content);
                $excerpt = substr($excerpt, 0, 150).(strlen($excerpt) > 150 ? '...' : '');

                return [
                    'id' => (string) $b->id,
                    'slug' => $b->slug,
                    'category' => 'news',
                    'title' => $b->title,
                    'excerpt' => $excerpt,
                    'imageUrl' => $b->thumbnail ? Storage::url($b->thumbnail) : 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=600&q=80',
                    'publishedAt' => $b->published_at?->toISOString() ?? $b->created_at->toISOString(),
                    'content' => $b->content,
                ];
            });

        return Inertia::render('public/home/index', [
            'title' => 'Beranda',
            'isSimulation' => false,
            'stats' => $stats,
            'alerts' => $activeAlerts,
            'markers' => $markers,
            'mapSettings' => $mapSettings,
            'disasterTypes' => $disasterTypes,
            'articles' => $articles,
        ]);
    }
}
