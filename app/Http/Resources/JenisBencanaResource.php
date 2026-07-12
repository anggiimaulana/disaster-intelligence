<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JenisBencanaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'kode' => $this->kode,
            'nama_bencana' => $this->nama_bencana,
            'icon' => $this->icon,
            'warna' => $this->warna,
        ];
    }
}
