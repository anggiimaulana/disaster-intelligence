<?php

namespace App\Events;

use App\Models\LaporanBencana;
use App\Models\ValidasiLaporan;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LaporanValidated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public LaporanBencana $laporan,
        public ValidasiLaporan $validasi
    ) {}

    public function broadcastOn(): array
    {
        return [
            new Channel('laporan'),
            new PrivateChannel('admin.laporan'),
            new PrivateChannel('laporan.'.$this->laporan->id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'laporan.validated';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->laporan->id,
            'kode_laporan' => $this->laporan->kode_laporan,
            'validasi' => [
                'id' => $this->validasi->id,
                'hasil' => $this->validasi->hasil_validasi,
                'catatan' => $this->validasi->catatan,
            ],
            'validasi_admin' => $this->laporan->validasi_admin,
            'updated_at' => $this->laporan->updated_at->toIso8601String(),
        ];
    }
}
