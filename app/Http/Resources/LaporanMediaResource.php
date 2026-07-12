<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LaporanMediaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'media_type' => $this->media_type,
            'file_url' => $this->file_url,
            'ai_result' => $this->ai_result,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
