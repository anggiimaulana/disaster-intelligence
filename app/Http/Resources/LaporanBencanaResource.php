<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LaporanBencanaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $cleanDeskripsi = $this->deskripsi;
        $pelaporInfo = null;

        if (preg_match('/\[Pelapor:\s*(\{.*?\})\s*\]/s', (string) $this->deskripsi, $matches)) {
            $decoded = json_decode($matches[1], true);
            if (is_array($decoded)) {
                $pelaporInfo = $decoded;
                $cleanDeskripsi = trim(str_replace($matches[0], '', (string) $this->deskripsi));
            }
        }

        return [
            'id' => $this->id,
            'kode_laporan' => $this->kode_laporan,
            'jenis_bencana' => $this->whenLoaded('jenisBencana', function () {
                return [
                    'id' => $this->jenisBencana->id,
                    'kode' => $this->jenisBencana->kode,
                    'nama' => $this->jenisBencana->nama_bencana,
                    'warna' => $this->jenisBencana->warna,
                ];
            }),
            'status' => $this->whenLoaded('status', function () {
                return [
                    'id' => $this->status->id,
                    'nama' => $this->status->nama_status,
                    'warna' => $this->status->warna,
                ];
            }),
            'judul' => $this->judul,
            'deskripsi' => $cleanDeskripsi,
            'pelapor' => $pelaporInfo,
            'alamat' => $this->alamat,
            'kecamatan' => $this->kecamatan,
            'desa' => $this->desa,
            'latitude' => (float) $this->latitude,
            'longitude' => (float) $this->longitude,
            'tingkat_keparahan' => $this->tingkat_keparahan,
            'severity_color' => $this->severity_color,
            'validasi_ai' => $this->validasi_ai,
            'validasi_admin' => $this->validasi_admin,
            'waktu_kejadian' => $this->waktu_kejadian?->format('Y-m-d H:i:s'),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
            'media' => LaporanMediaResource::collection($this->whenLoaded('media')),
            'validasi' => new ValidasiResource($this->whenLoaded('validasi')),
            'timeline' => $this->when(
                $this->relationLoaded('validasi') || $this->relationLoaded('earlyWarnings'),
                fn () => $this->getTimeline()
            ),
            // Tracking info
            'can_track' => true,
            'tracking_url' => url('/public/lacak-laporan?kode='.$this->kode_laporan),
        ];
    }

    protected function getTimeline(): array
    {
        $timeline = [
            [
                'step' => 'laporan_masuk',
                'label' => 'Laporan Masuk',
                'waktu' => $this->created_at->format('Y-m-d H:i:s'),
                'status' => 'completed',
                'icon' => 'file-text',
            ],
        ];

        if ($this->validasi_ai) {
            $timeline[] = [
                'step' => 'analisis_ai',
                'label' => 'Analisis AI',
                'waktu' => $this->updated_at->format('Y-m-d H:i:s'),
                'status' => 'completed',
                'icon' => 'cpu',
            ];
        }

        if ($this->relationLoaded('validasi') && $this->validasi) {
            $timeline[] = [
                'step' => 'validasi',
                'label' => 'Validasi Admin',
                'waktu' => $this->validasi->created_at?->format('Y-m-d H:i:s'),
                'status' => $this->validasi->isValid() ? 'completed' : 'rejected',
                'catatan' => $this->validasi->catatan,
                'icon' => 'check-circle',
            ];
        }

        // Add current status
        if ($this->status) {
            $timeline[] = [
                'step' => 'status_'.$this->status->nama_status,
                'label' => $this->status->nama_status,
                'waktu' => $this->updated_at->format('Y-m-d H:i:s'),
                'status' => 'current',
                'icon' => 'info',
            ];
        }

        return $timeline;
    }
}
