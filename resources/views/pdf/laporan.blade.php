<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan {{ $laporan->kode_laporan }}</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
            line-height: 1.6;
            color: #333;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #dc2626;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        .header h1 {
            color: #dc2626;
            font-size: 18px;
            margin: 0 0 5px;
        }
        .header p {
            font-size: 11px;
            color: #666;
            margin: 0;
        }
        .section {
            margin-bottom: 15px;
        }
        .section-title {
            font-size: 14px;
            font-weight: bold;
            color: #dc2626;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            margin-bottom: 10px;
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
            color: #555;
        }
        .badge {
            display: inline-block;
            padding: 2px 10px;
            border-radius: 3px;
            font-size: 11px;
            font-weight: bold;
        }
        .badge-warning { background: #fef3c7; color: #92400e; }
        .badge-success { background: #dcfce7; color: #166534; }
        .badge-danger { background: #fee2e2; color: #991b1b; }
        .badge-info { background: #dbeafe; color: #1e40af; }
        .footer {
            text-align: center;
            font-size: 10px;
            color: #999;
            border-top: 1px solid #ddd;
            padding-top: 10px;
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>LAPORAN BENCANA</h1>
        <p>BPBD {{ $laporan->wilayah?->provinsi ?? 'Jawa Barat' }}</p>
        <p>Kode Laporan: {{ $laporan->kode_laporan }}</p>
    </div>

    <div class="section">
        <div class="section-title">Informasi Pelapor</div>
        <table>
            <tr>
                <td class="label">Nama Pelapor</td>
                <td>: {{ $laporan->nama_pelapor ?? '-' }}</td>
            </tr>
            <tr>
                <td class="label">No. HP</td>
                <td>: {{ $laporan->no_hp_pelapor ?? '-' }}</td>
            </tr>
            <tr>
                <td class="label">Tanggal Lapor</td>
                <td>: {{ $laporan->created_at->format('d/m/Y H:i') }}</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Informasi Kejadian</div>
        <table>
            <tr>
                <td class="label">Jenis Bencana</td>
                <td>: {{ $laporan->jenisBencana?->nama_bencana ?? '-' }}</td>
            </tr>
            <tr>
                <td class="label">Status</td>
                <td>: <span class="badge badge-warning">{{ $laporan->status?->nama_status ?? 'Menunggu' }}</span></td>
            </tr>
            <tr>
                <td class="label">Tingkat Keparahan</td>
                <td>: {{ $laporan->tingkat_keparahan ?? '-' }}</td>
            </tr>
            <tr>
                <td class="label">Lokasi</td>
                <td>: {{ $laporan->alamat ?? ($laporan->wilayah?->full_address ?? '-') }}</td>
            </tr>
            <tr>
                <td class="label">Kecamatan</td>
                <td>: {{ $laporan->kecamatan ?? ($laporan->wilayah?->kecamatan ?? '-') }}</td>
            </tr>
            <tr>
                <td class="label">Desa/Kelurahan</td>
                <td>: {{ $laporan->desa ?? ($laporan->wilayah?->desa ?? '-') }}</td>
            </tr>
            <tr>
                <td class="label">Titik Koordinat</td>
                <td>: {{ $laporan->latitude && $laporan->longitude ? $laporan->latitude.', '.$laporan->longitude : '-' }}</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Detail Laporan</div>
        <p style="text-align: justify;">{{ $laporan->deskripsi ?? 'Tidak ada deskripsi' }}</p>
    </div>

    <div class="footer">
        Dokumen ini dicetak pada {{ now()->format('d/m/Y H:i') }} melalui Sistem Informasi Bencana BPBD<br>
        Dokumen ini sah tanpa tanda tangan
    </div>
</body>
</html>
