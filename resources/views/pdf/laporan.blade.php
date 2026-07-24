<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan {{ $laporan->kode_laporan }}</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 11px;
            line-height: 1.5;
            color: #1e293b;
            margin: 0;
            padding: 15px;
        }
        .header {
            text-align: center;
            border-bottom: 3px double #003366;
            padding-bottom: 12px;
            margin-bottom: 20px;
        }
        .header h1 {
            color: #003366;
            font-size: 18px;
            font-weight: bold;
            margin: 0 0 4px;
            letter-spacing: 0.5px;
        }
        .header h2 {
            color: #475569;
            font-size: 12px;
            margin: 0 0 6px;
            font-weight: normal;
        }
        .header .doc-code {
            display: inline-block;
            background-color: #f1f5f9;
            border: 1px solid #cbd5e1;
            padding: 3px 10px;
            border-radius: 4px;
            font-weight: bold;
            color: #0f172a;
            font-size: 11px;
            margin-top: 4px;
        }
        .section {
            margin-bottom: 18px;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            overflow: hidden;
        }
        .section-title {
            font-size: 12px;
            font-weight: bold;
            color: #ffffff;
            background-color: #003366;
            padding: 6px 12px;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }
        .section-body {
            padding: 10px 12px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        table td {
            padding: 5px 8px;
            vertical-align: top;
        }
        table td.label {
            font-weight: bold;
            width: 140px;
            color: #475569;
            background-color: #f8fafc;
            border-right: 1px solid #e2e8f0;
        }
        table tr {
            border-bottom: 1px solid #f1f5f9;
        }
        table tr:last-child {
            border-bottom: none;
        }
        .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
        }
        .badge-warning { background: #fef3c7; color: #92400e; }
        .badge-success { background: #dcfce7; color: #166534; }
        .badge-danger { background: #fee2e2; color: #991b1b; }
        .badge-info { background: #dbeafe; color: #1e40af; }
        
        .footer {
            margin-top: 30px;
            width: 100%;
        }
        .signature-table {
            width: 100%;
            margin-top: 20px;
            border: none;
        }
        .signature-table td {
            border: none;
            background: transparent;
            text-align: center;
        }
        .meta-footer {
            text-align: center;
            font-size: 9px;
            color: #64748b;
            border-top: 1px solid #cbd5e1;
            padding-top: 8px;
            margin-top: 25px;
        }
    </style>
</head>
<body>
    @php
        $reporterName = $laporan->nama_pelapor;
        $reporterPhone = $laporan->no_hp_pelapor;
        $cleanDeskripsi = $laporan->deskripsi ?? 'Tidak ada deskripsi';

        if (preg_match('/\[Pelapor:\s*(\{.*?\})\]/s', $laporan->deskripsi ?? '', $matches)) {
            $json = json_decode($matches[1], true);
            if (!$reporterName && isset($json['nama'])) {
                $reporterName = $json['nama'];
            }
            if (!$reporterPhone && isset($json['no_hp'])) {
                $reporterPhone = $json['no_hp'];
            }
            $cleanDeskripsi = trim(str_replace($matches[0], '', $laporan->deskripsi));
        }
    @endphp

    <div class="header">
        <h1>BADAN PENANGGULANGAN BENGKANA DAERAH (BPBD)</h1>
        <h2>Sistem Informasi Penanggulangan Bencana - {{ $laporan->wilayah?->provinsi ?? 'Jawa Barat' }}</h2>
        <div class="doc-code">KODE LAPORAN: {{ $laporan->kode_laporan }}</div>
    </div>

    <div class="section">
        <div class="section-title">I. Informasi Pelapor</div>
        <div class="section-body">
            <table>
                <tr>
                    <td class="label">Nama Pelapor</td>
                    <td>{{ $reporterName ?: '-' }}</td>
                </tr>
                <tr>
                    <td class="label">Nomor Kontak / WA</td>
                    <td>{{ $reporterPhone ?: '-' }}</td>
                </tr>
                <tr>
                    <td class="label">Waktu Laporan</td>
                    <td>{{ $laporan->created_at ? $laporan->created_at->format('d/m/Y H:i') . ' WIB' : '-' }}</td>
                </tr>
                <tr>
                    <td class="label">Sumber Kanal</td>
                    <td>{{ strtoupper($laporan->sumber_data ?? 'WEBSITE') }}</td>
                </tr>
            </table>
        </div>
    </div>

    <div class="section">
        <div class="section-title">II. Informasi Kejadian Bencana</div>
        <div class="section-body">
            <table>
                <tr>
                    <td class="label">Jenis Bencana</td>
                    <td><strong>{{ $laporan->jenisBencana?->nama_bencana ?? '-' }}</strong></td>
                </tr>
                <tr>
                    <td class="label">Status Verifikasi</td>
                    <td>
                        <span class="badge badge-info">{{ $laporan->status?->nama_status ?? 'Menunggu Validasi' }}</span>
                    </td>
                </tr>
                <tr>
                    <td class="label">Tingkat Keparahan</td>
                    <td>
                        @php
                            $sevClass = match($laporan->tingkat_keparahan) {
                                'Tinggi', 'Darurat' => 'badge-danger',
                                'Sedang' => 'badge-warning',
                                default => 'badge-success',
                            };
                        @endphp
                        <span class="badge {{ $sevClass }}">{{ $laporan->tingkat_keparahan ?? 'Rendah' }}</span>
                    </td>
                </tr>
                <tr>
                    <td class="label">Lokasi / Alamat</td>
                    <td>{{ $laporan->alamat ?? '-' }}</td>
                </tr>
                <tr>
                    <td class="label">Kecamatan</td>
                    <td>{{ $laporan->kecamatan ?? ($laporan->wilayah?->kecamatan ?? '-') }}</td>
                </tr>
                <tr>
                    <td class="label">Desa / Kelurahan</td>
                    <td>{{ $laporan->desa ?? ($laporan->wilayah?->desa ?? '-') }}</td>
                </tr>
                <tr>
                    <td class="label">Titik Koordinat GPS</td>
                    <td>{{ $laporan->latitude && $laporan->longitude ? $laporan->latitude . ', ' . $laporan->longitude : 'Tidak tersedia' }}</td>
                </tr>
            </table>
        </div>
    </div>

    <div class="section">
        <div class="section-title">III. Detail Deskripsi Lapangan</div>
        <div class="section-body">
            <p style="text-align: justify; margin: 0; white-space: pre-line;">{{ $cleanDeskripsi }}</p>
        </div>
    </div>

    <div class="footer">
        <table class="signature-table">
            <tr>
                <td style="width: 50%;"></td>
                <td style="width: 50%;">
                    Dicetak Pada: {{ now()->format('d F Y, H:i') }} WIB<br>
                    <strong>Petugas Posko BPBD</strong>
                    <br><br><br><br>
                    ( Sistem Informasi Bencana )
                </td>
            </tr>
        </table>

        <div class="meta-footer">
            Dokumen ini dicetak secara otomatis dari Platform Disaster Intelligence BPBD.<br>
            Dokumen ini sah digunakan sebagai arsip laporan penanganan bencana.
        </div>
    </div>
</body>
</html>
