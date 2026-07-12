<?php

namespace App\Events;

use App\Models\LaporanBencana;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LaporanCreated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public LaporanBencana $laporan
    ) {}

    public function broadcastOn(): array
    {
        return [
            new Channel('laporan'),
            new PrivateChannel('admin.laporan'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'laporan.created';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->laporan->id,
            'kode_laporan' => $this->laporan->kode_laporan,
            'jenis_bencana' => $this->laporan->jenisBencana?->nama_bencana,
            'judul' => $this->laporan->judul,
            'alamat' => $this->laporan->alamat,
            'kecamatan' => $this->laporan->kecamatan,
            'latitude' => (float) $this->laporan->latitude,
            'longitude' => (float) $this->laporan->longitude,
            'tingkat_keparahan' => $this->laporan->tingkat_keparahan,
            'status' => [
                'id' => $this->laporan->status?->id,
                'nama' => $this->laporan->status?->nama_status,
                'warna' => $this->laporan->status?->warna,
            ],
            'created_at' => $this->laporan->created_at->toIso8601String(),
        ];
    }
}
