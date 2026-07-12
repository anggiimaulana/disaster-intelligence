<?php

namespace App\Events;

use App\Models\LaporanBencana;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LaporanStatusUpdated implements ShouldBroadcastNow
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
            new PrivateChannel('laporan.'.$this->laporan->id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'laporan.status.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->laporan->id,
            'kode_laporan' => $this->laporan->kode_laporan,
            'old_status' => $this->laporan->getOriginal('status_id'),
            'new_status' => [
                'id' => $this->laporan->status?->id,
                'nama' => $this->laporan->status?->nama_status,
                'warna' => $this->laporan->status?->warna,
            ],
            'updated_at' => $this->laporan->updated_at->toIso8601String(),
        ];
    }
}
