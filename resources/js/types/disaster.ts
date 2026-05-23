export type DisasterType = 'BANJIR' | 'LONGSOR' | 'KEBAKARAN' | 'ANGIN_KENCANG' | 'LAINNYA';
export type RiskLevel = 'TINGGI' | 'SEDANG' | 'RENDAH' | 'AMAN';
export type ReportStatus = 'BARU' | 'MENUNGGU_VALIDASI' | 'VALID' | 'TIDAK_VALID' | 'DUPLIKAT' | 'HOAKS' | 'PERLU_CEK_LAPANGAN' | 'DIPROSES' | 'SEDANG_DIPROSES';

export interface Kecamatan { id: string; nama: string; kabupaten: string; }
export interface PaginatedResponse<T> { data: T[]; meta: PaginationMeta; links: PaginationLinks; }
export interface PaginationMeta { current_page: number; last_page: number; per_page: number; total: number; from: number; to: number; }
export interface PaginationLinks { prev: string | null; next: string | null; }
export interface MapMarker { id: string; lat: number; lng: number; type: DisasterType; kecamatan: string; count?: number; }
export interface ReportSummary { id: string; laporan_id: string; judul: string; lokasi: string; kecamatan: string; waktu: string; foto_url?: string; risk_level: RiskLevel; status: ReportStatus; }
export interface TrendDataPoint { tanggal: string; count: number; }

export interface DashboardStats {
    totalLaporan: number; totalLaporanTrend: number[];
    belumDiverifikasi: number; belumDiverifikasiPct: number; belumDiverifikasiTrend: number[];
    warningAktif: number; warningAktifTrend: number[];
    laporanValid: number; laporanValidPct: number; laporanValidTrend: number[];
    pengirimLaporan: number; pengirimLaporanTrend: number[];
}

export interface DashboardProps {
    stats: DashboardStats;
    mapMarkers: MapMarker[];
    laporanTerbaru: ReportSummary[];
    trendData: TrendDataPoint[];
    laporanByJenis: { type: DisasterType; label: string; count: number; pct: number; color: string }[];
    risikoKeseluruhan: { score: number; label: string; color: string };
    filters: { kecamatan: Kecamatan[]; jenisOptions: string[] };
}

export interface Report {
    id: string; laporan_id: string; jenis_bencana: DisasterType; lokasi: string; kecamatan: string;
    waktu_laporan: string; pelapor: string; status: ReportStatus; tingkat_risiko: RiskLevel; sumber: 'WHATSAPP' | 'MANUAL';
}

export interface KejadianStats {
    totalLaporan: { value: number; trend: number[]; delta: number };
    belumDiverifikasi: { value: number; pct: number; trend: number[] };
    valid: { value: number; pct: number; trend: number[] };
    warning: { value: number; trend: number[]; label: string };
    duplikatLainnya: { value: number; pct: number; trend: number[] };
}

export interface KejadianIndexProps {
    reports: PaginatedResponse<Report>;
    stats: KejadianStats;
    filters: { tanggal_mulai: string; tanggal_selesai: string; jenis_bencana: string; kecamatan: string; status: string; q: string };
    filterOptions: { kecamatanList: Kecamatan[]; statusList: string[]; jenisList: string[] };
}

export interface Activity { id: string; timestamp: string; type: 'whatsapp' | 'system' | 'ai' | 'manual'; description: string; actor?: string; }

export interface ReportDetail {
    id: string; laporan_id: string; status: ReportStatus; tingkat_risiko: RiskLevel; risk_score: number;
    jenis_bencana: DisasterType; lokasi: string; kecamatan: string; koordinat: { lat: number; lng: number };
    deskripsi: string; pelapor: string; sumber: string; id_pesan: string; diterima_pada: string;
    foto: string[]; foto_count: number;
    ai_ringkasan: { prediksi_jenis: { label: string; confidence: number }; risk_score: number; severity: string; rekomendasi: string } | null;
    zona_rawan: boolean; zona_label: string; link_gmaps: string; activities: Activity[];
    workflow_id: string; eksekusi_n8n: string; node_sumber: string; database_id: string; terakhir_diperbarui: string;
}

export interface LaporanDetailProps { report: ReportDetail; }
