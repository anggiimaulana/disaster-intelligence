<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Kejadian - {{ $generatedAt }}</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 9px;
            line-height: 1.4;
            color: #1f2937;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #dc2626;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        .header h1 {
            color: #dc2626;
            font-size: 16px;
            margin: 0 0 4px;
        }
        .header p {
            font-size: 9px;
            color: #6b7280;
            margin: 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
        }
        th {
            background: #dc2626;
            color: #ffffff;
            text-align: left;
            padding: 6px 4px;
            font-size: 8px;
            text-transform: uppercase;
            word-wrap: break-word;
        }
        td {
            padding: 5px 4px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 8px;
            word-wrap: break-word;
            vertical-align: top;
        }
        tr:nth-child(even) td {
            background: #f9fafb;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Laporan Kejadian Bencana</h1>
        <p>Disaster Intelligence &mdash; {{ $generatedAt }}</p>
    </div>

    <table>
        <thead>
            <tr>
                @foreach($headers as $h)
                    <th>{{ $h }}</th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @foreach($rows as $row)
                <tr>
                    @foreach($row as $cell)
                        <td>{{ $cell }}</td>
                    @endforeach
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
