<?php

namespace Database\Seeders;

use App\Models\Berita;
use App\Models\EarlyWarning;
use App\Models\Faq;
use App\Models\JenisBencana;
use App\Models\Kesiapsiagaan;
use App\Models\LaporanBencana;
use App\Models\Setting;
use App\Models\StatusLaporan;
use App\Models\Wilayah;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DummyDataSeeder extends Seeder
{
    private array $kecamatanIndramayu = [
        'Anjatan', 'Arahan', 'Balongan', 'Bangodua', 'Bongas',
        'Cantigi', 'Cikedung', 'Gabuswetan', 'Gantar', 'Haurgeulis',
        'Indramayu', 'Jatibarang', 'Juntinyuat', 'Kandanghaur',
        'Karangampel', 'Kedokan Bunder', 'Kertasemaya', 'Krangkeng',
        'Kroya', 'Lelea', 'Lohbener', 'Losarang', 'Pasekan',
        'Patrol', 'Sindang', 'Sliyeg', 'Sukagumiwang', 'Sukra',
        'Terisi', 'Tukdana', 'Widasari',
    ];

    private array $desaIndramayu = [
        'Karanganyar', 'Karangsong', 'Pabeanudik', 'Lemahabang',
        'Singajaya', 'Ciwaringin', 'Tegalurung', 'Lombang',
        'Cangkring', 'Pekandangan', 'Tegalsembadra', 'Dukuh',
        'Bojongsari', 'Mekarsari', 'Bulusan', 'Sindangkerta',
        'Benda', 'Panyigsagan', 'Tamansari', 'Kedungdawa',
    ];

    public function run(): void
    {
        $faker = Faker::create('id_ID');

        $jenisBencana = JenisBencana::all();
        if ($jenisBencana->isEmpty()) {
            $this->command->warn('Jenis Bencana is empty. Run DatabaseSeeder first.');

            return;
        }

        $statusLaporan = StatusLaporan::all();
        $wilayahIds = Wilayah::pluck('id');

        // ─── LAPORAN BENCANA ─────────────────────────────────
        $this->command->info('Menyemai 25 data Laporan Bencana...');

        $laporanData = [
            [
                'judul' => 'Banjir di Desa Karanganyar Akibat Curah Hujan Tinggi',
                'deskripsi' => 'Curah hujan tinggi sejak pukul 02.00 WIB menyebabkan Sungai Cimanuk meluap. Ketinggian air mencapai 50-80 cm di pemukiman warga. Sekitar 200 KK terdampak.',
                'alamat' => 'Jl. Raya Karanganyar, Blok Cimanuk',
                'kecamatan' => 'Indramayu',
                'desa' => 'Karanganyar',
                'latitude' => -6.3254,
                'longitude' => 108.3152,
                'jenis' => 'BANJIR',
                'tingkat' => 'Tinggi',
                'status' => 'Warning',
            ],
            [
                'judul' => 'Angin Puting Beliung Rusak 15 Rumah di Jatibarang',
                'deskripsi' => 'Angin puting beliung melanda pemukiman warga di Kecamatan Jatibarang pada pukul 15.30 WIB. Sebanyak 15 rumah mengalami kerusakan atap, 3 diantaranya rusak berat. Tidak ada korban jiwa.',
                'alamat' => 'Dusun Krajan, RT 03/RW 02',
                'kecamatan' => 'Jatibarang',
                'desa' => 'Singajaya',
                'latitude' => -6.4382,
                'longitude' => 108.2687,
                'jenis' => 'CUACA',
                'tingkat' => 'Tinggi',
                'status' => 'Darurat',
            ],
            [
                'judul' => 'Kebakaran Lahan di Kecamatan Kroya',
                'deskripsi' => 'Kebakaran lahan terjadi di area persawahan Kecamatan Kroya. Api diduga berasal dari pembakaran jerami oleh petani yang kemudian merambat ke lahan kering. Luas area terbakar sekitar 2 hektar.',
                'alamat' => 'Desa Kroya, Blok Sawah',
                'kecamatan' => 'Kroya',
                'desa' => 'Tegalurung',
                'latitude' => -6.3871,
                'longitude' => 108.0759,
                'jenis' => 'KEBAKARAN',
                'tingkat' => 'Sedang',
                'status' => 'Diproses',
            ],
            [
                'judul' => 'Abrasi Pantai Ancam Pemukiman di Karangsong',
                'deskripsi' => 'Abrasi terus menggerus garis pantai di Desa Karangsong. Dalam sebulan terakhir, garis pantai mundur hingga 3 meter. Warga khawatir pemukiman mereka akan tergerus.',
                'alamat' => 'Pantai Karangsong, RT 01/RW 03',
                'kecamatan' => 'Indramayu',
                'desa' => 'Karangsong',
                'latitude' => -6.3084,
                'longitude' => 108.3074,
                'jenis' => 'ABRASI',
                'tingkat' => 'Sedang',
                'status' => 'Menunggu',
            ],
            [
                'judul' => 'Longsor di Area Perbukitan Gabuswetan',
                'deskripsi' => 'Tanah longsor terjadi setelah hujan deras mengguyur wilayah Gabuswetan selama 3 jam berturut-turut. Material longsor menutup akses jalan desa sepanjang 15 meter.',
                'alamat' => 'Jl. Raya Gabuswetan - Sliyeg, KM 7',
                'kecamatan' => 'Gabuswetan',
                'desa' => 'Ciwaringin',
                'latitude' => -6.4125,
                'longitude' => 108.0428,
                'jenis' => 'LONGSOR',
                'tingkat' => 'Rendah',
                'status' => 'Selesai',
            ],
            [
                'judul' => 'Banjir Rob Rendam Kawasan Pesisir Haurgeulis',
                'deskripsi' => 'Air laut pasang setinggi 1 meter menggenangi pemukiman warga di pesisir Kecamatan Haurgeulis. Ratusan warga mengungsi ke tempat yang lebih aman.',
                'alamat' => 'Blok Pesisir, Desa Lombang',
                'kecamatan' => 'Haurgeulis',
                'desa' => 'Lombang',
                'latitude' => -6.3482,
                'longitude' => 107.9841,
                'jenis' => 'ROB',
                'tingkat' => 'Darurat',
                'status' => 'Diproses',
            ],
            [
                'judul' => 'Pohon Tumbang Timpa Jaringan Listrik di Karangampel',
                'deskripsi' => 'Pohon trembesi tumbang akibat angin kencang dan menimpa jaringan listrik PLN. Akibatnya, 3 desa di Kecamatan Karangampel mengalami pemadaman listrik total.',
                'alamat' => 'Jl. Raya Karangampel, Depan Kantor Kecamatan',
                'kecamatan' => 'Karangampel',
                'desa' => 'Pabeanudik',
                'latitude' => -6.3189,
                'longitude' => 108.3401,
                'jenis' => 'CUACA',
                'tingkat' => 'Sedang',
                'status' => 'Diproses',
            ],
            [
                'judul' => 'Banjir di Desa Tulungagung Akibat Tanggul Jebol',
                'deskripsi' => 'Tanggul sungai di Desa Cangkring jebol sepanjang 10 meter akibat tekanan air yang tinggi. Banjir merendam 150 rumah warga dengan ketinggian air mencapai 1 meter.',
                'alamat' => 'Dusun Cangkring Wetan',
                'kecamatan' => 'Cantigi',
                'desa' => 'Cangkring',
                'latitude' => -6.3556,
                'longitude' => 108.0905,
                'jenis' => 'BANJIR',
                'tingkat' => 'Tinggi',
                'status' => 'Darurat',
            ],
            [
                'judul' => 'Kebakaran Pemukiman di Losarang',
                'deskripsi' => 'Kebakaran melanda pemukiman padat penduduk di Desa Benda, Kecamatan Losarang. Api dengan cepat merambat karena bangunan terbuat dari kayu. 10 rumah ludes terbakar.',
                'alamat' => 'Dusun Benda, RT 05/RW 01',
                'kecamatan' => 'Losarang',
                'desa' => 'Benda',
                'latitude' => -6.3819,
                'longitude' => 108.1562,
                'jenis' => 'KEBAKARAN',
                'tingkat' => 'Darurat',
                'status' => 'Menunggu',
            ],
            [
                'judul' => 'Banjir Musiman di Lohbener',
                'deskripsi' => 'Banjir musiman kembali merendam pemukiman di Kecamatan Lohbener. Air mulai naik sejak semalam dan saat ini mencapai ketinggian 40 cm di jalan utama desa.',
                'alamat' => 'Blok Lohbener, RT 02/RW 04',
                'kecamatan' => 'Lohbener',
                'desa' => 'Bojongsari',
                'latitude' => -6.4216,
                'longitude' => 108.2013,
                'jenis' => 'BANJIR',
                'tingkat' => 'Rendah',
                'status' => 'Selesai',
            ],
        ];

        // Tambah 15 data random lagi dengan real kecamatan/desa
        for ($i = 0; $i < 15; $i++) {
            $kec = $faker->randomElement($this->kecamatanIndramayu);
            $desa = $faker->randomElement($this->desaIndramayu);
            $date = $faker->dateTimeBetween('-14 days', 'now');

            LaporanBencana::create([
                'kode_laporan' => LaporanBencana::generateKode(),
                'jenis_bencana_id' => $jenisBencana->random()->id,
                'status_id' => $statusLaporan->random()->id,
                'judul' => 'Laporan '.$faker->randomElement(['Banjir', 'Angin Kencang', 'Pohon Tumbang', 'Kebakaran', 'Longsor']).' di '.$kec,
                'deskripsi' => $faker->randomElement([
                    'Warga melaporkan kejadian bencana yang terjadi di wilayah mereka pagi tadi.',
                    'Tim BPBD telah diturunkan ke lokasi untuk melakukan penanganan lebih lanjut.',
                    'Kejadian terjadi akibat cuaca ekstrem yang melanda wilayah Indramayu.',
                    'Laporan dari warga tentang kondisi darurat yang membutuhkan penanganan segera.',
                ]),
                'alamat' => 'Dusun '.$desa.', RT '.str_pad((string) $faker->numberBetween(1, 15), 2, '0', STR_PAD_LEFT).'/RW '.str_pad((string) $faker->numberBetween(1, 8), 2, '0', STR_PAD_LEFT),
                'kecamatan' => $kec,
                'desa' => $desa,
                'latitude' => $faker->randomFloat(8, -6.55, -6.25),
                'longitude' => $faker->randomFloat(8, 107.90, 108.45),
                'nama_pelapor' => $faker->name(),
                'no_hp_pelapor' => '08'.$faker->numerify('##########'),
                'sumber_data' => $faker->randomElement(['website', 'whatsapp', 'mobile_app']),
                'tingkat_keparahan' => $faker->randomElement(['Rendah', 'Rendah', 'Sedang', 'Sedang', 'Tinggi', 'Darurat']),
                'waktu_kejadian' => $date,
                'validasi_admin' => $faker->boolean(70),
                'created_at' => $date,
                'updated_at' => $date,
            ]);
        }

        // Simpan data spesifik ke array untuk digunakan nanti
        foreach ($laporanData as $data) {
            $jenis = $jenisBencana->firstWhere('kode', $data['jenis']);
            $status = $statusLaporan->firstWhere('nama_status', $data['status']);
            $date = $faker->dateTimeBetween('-7 days', 'now');

            LaporanBencana::create([
                'kode_laporan' => LaporanBencana::generateKode(),
                'jenis_bencana_id' => $jenis?->id ?? $jenisBencana->random()->id,
                'status_id' => $status?->id ?? $statusLaporan->random()->id,
                'judul' => $data['judul'],
                'deskripsi' => $data['deskripsi'],
                'alamat' => $data['alamat'],
                'kecamatan' => $data['kecamatan'],
                'desa' => $data['desa'],
                'latitude' => $data['latitude'],
                'longitude' => $data['longitude'],
                'nama_pelapor' => $faker->name(),
                'no_hp_pelapor' => '08'.$faker->numerify('##########'),
                'sumber_data' => $faker->randomElement(['website', 'whatsapp']),
                'tingkat_keparahan' => $data['tingkat'],
                'waktu_kejadian' => $date,
                'validasi_admin' => $data['tingkat'] !== 'Menunggu',
                'created_at' => $date,
                'updated_at' => $date,
            ]);
        }

        // ─── PERINGATAN DINI ────────────────────────────────
        $this->command->info('Menyemai 10 data Peringatan Dini...');
        $laporanIds = LaporanBencana::pluck('id');

        $peringatanData = [
            ['level' => 'Awas', 'pesan' => 'Hujan lebat disertai angin kencang diperkirakan meluas di wilayah Kabupaten Indramayu bagian utara. Warga pesisir diminta waspada banjir rob.'],
            ['level' => 'Siaga', 'pesan' => 'Volume air Sungai Cimanuk meningkat signifikan. Warga di bantaran sungai agar bersiap melakukan evakuasi mandiri jika ketinggian air melebihi 150 cm.'],
            ['level' => 'Waspada', 'pesan' => 'Tinggi gelombang laut mencapai 2.5-3 meter di perairan utara Indramayu. Nelayan tradisional diminta tidak melaut hingga kondisi normal.'],
            ['level' => 'Awas', 'pesan' => 'Badan Meteorologi mengeluarkan peringatan dini cuaca ekstrem level merah untuk Kecamatan Jatibarang, Kroya, dan Losarang.'],
            ['level' => 'Siaga', 'pesan' => 'Potensi angin puting beliung masih tinggi di wilayah Indramayu bagian selatan. Warga diminta menghindari berteduh di bawah pohon besar.'],
            ['level' => 'Waspada', 'pesan' => 'Kualitas udara memburuk akibat kebakaran lahan. Warga dengan gangguan pernapasan agar menggunakan masker saat beraktivitas di luar rumah.'],
            ['level' => 'Siaga', 'pesan' => 'Debit air di Bendung Rentang meningkat. Waspada potensi banjir kiriman dari hulu Sungai Cimanuk.'],
            ['level' => 'Awas', 'pesan' => 'Banjir rob diprediksi mencapai puncaknya pada pukul 18.00-20.00 WIB. Warga pesisir di Kecamatan Haurgeulis dan Patrol agar segera mengungsi.'],
            ['level' => 'Waspada', 'pesan' => 'Aktivitas gunung berapi di Jawa Barat bagian selatan terpantau normal. Belum ada dampak langsung ke wilayah Indramayu.'],
            ['level' => 'Siaga', 'pesan' => 'Musim penghujan diprediksi berlangsung hingga Maret. Warga diimbau membersihkan saluran air dan menyiapkan pompa mandiri.'],
        ];

        foreach ($peringatanData as $i => $data) {
            $date = $faker->dateTimeBetween('-7 days', 'now');
            EarlyWarning::create([
                'laporan_id' => $laporanIds->isNotEmpty() ? $laporanIds->random() : null,
                'jenis_bencana_id' => $jenisBencana->random()->id,
                'level_warning' => $data['level'],
                'status' => $i < 6 ? 'aktif' : 'selesai',
                'wilayah' => 'KABUPATEN INDRAMAYU',
                'pesan' => $data['pesan'],
                'created_at' => $date,
                'updated_at' => $date,
            ]);
        }

        // ─── BERITA ─────────────────────────────────────────
        $this->command->info('Menyemai 12 data Berita...');
        $beritaData = [
            ['title' => 'BPBD Indramayu Siagakan Personel di 6 Kecamatan Rawan Banjir', 'status' => 'published'],
            ['title' => 'Curah Hujan Diprediksi Meningkat, BPBD Imbau Warga Waspada', 'status' => 'published'],
            ['title' => 'Bantuan Logistik Terdistribusi ke 1.200 KK Terdampak Banjir', 'status' => 'published'],
            ['title' => 'Ratusan Relawan Ikuti Simulasi Penanggulangan Bencana', 'status' => 'published'],
            ['title' => 'Posko Kesehatan Darurat Dibuka di Kecamatan Jatibarang', 'status' => 'published'],
            ['title' => 'Pemkab Indramayu Tetapkan Status Tanggap Darurat Banjir', 'status' => 'published'],
            ['title' => 'Pentingnya Mengenali Tanda-Tanda Tsunami Bagi Warga Pesisir', 'status' => 'published'],
            ['title' => 'Hasil Verifikasi: 15 Titik Rawan Bencana di Indramayu', 'status' => 'published'],
            ['title' => 'Peringatan Dini Cuaca Ekstrem dari BMKG untuk Jawa Barat', 'status' => 'published'],
            ['title' => 'Warga Diimbau Tidak Membuang Sampah ke Sungai Saat Musim Hujan', 'status' => 'published'],
            ['title' => 'Pelatihan Kesiapsiagaan Bencana untuk Pelajar SMA', 'status' => 'draft'],
            ['title' => 'Rencana Pembangunan Tanggul Sungai Cimanuk Tahap II', 'status' => 'draft'],
        ];
        $kontenBerita = '<p>Pemerintah Kabupaten Indramayu bersama BPBD terus melakukan upaya maksimal dalam merespons kejadian bencana di wilayahnya. Tim lapangan telah dikerahkan sejak pagi hari untuk melakukan evakuasi dan pendataan kerusakan. Masyarakat diminta untuk tetap tenang dan selalu mengikuti arahan dari petugas resmi.</p><p>Posko kesehatan darurat telah didirikan di beberapa titik untuk melayani warga yang membutuhkan pertolongan medis. Logistik berupa makanan siap saji, air bersih, dan selimut sedang dalam proses pendistribusian ke lokasi-lokasi terdampak.</p><p>Bagi warga yang membutuhkan bantuan atau ingin melaporkan kondisi darurat, silakan menghubungi Call Center BPBD Indramayu di 112 atau melalui fitur Lapor Bencana di website ini.</p>';

        foreach ($beritaData as $i => $data) {
            $date = $faker->dateTimeBetween('-30 days', 'now');
            Berita::create([
                'title' => $data['title'],
                'slug' => Str::slug($data['title']),
                'content' => $kontenBerita,
                'status' => $data['status'],
                'published_at' => $data['status'] === 'published' ? $date : null,
                'created_at' => $date,
                'updated_at' => $date,
            ]);
        }

        // ─── KESIAPSIAGAAN ─────────────────────────────────
        $this->command->info('Menyemai 10 data Kesiapsiagaan...');
        $kesiapsiagaanData = [
            ['title' => 'Panduan Siaga Bencana Banjir untuk Keluarga', 'status' => 'published'],
            ['title' => 'Langkah-Langkah Evakuasi Saat Terjadi Gempa Bumi', 'status' => 'published'],
            ['title' => 'Cara Aman Menghadapi Angin Puting Beliung', 'status' => 'published'],
            ['title' => 'Mempersiapkan Tas Siaga Bencana untuk 3 Hari', 'status' => 'published'],
            ['title' => 'Pertolongan Pertama pada Korban Bencana Alam', 'status' => 'published'],
            ['title' => 'Mengenali Jalur Evakuasi dan Titik Kumpul', 'status' => 'published'],
            ['title' => 'Pencegahan Kebakaran di Pemukiman Padat Penduduk', 'status' => 'published'],
            ['title' => 'Panduan Sanitasi Darurat Saat Bencana Banjir', 'status' => 'published'],
            ['title' => 'Cara Mendapatkan Informasi Cuaca Terkini dari BMKG', 'status' => 'published'],
            ['title' => 'Tips Menjaga Kesehatan Mental Pasca Bencana', 'status' => 'draft'],
        ];
        $kontenSiaga = '<p>Kesiapsiagaan adalah kunci keselamatan kita saat menghadapi bencana. Selalu pastikan Anda dan keluarga telah memahami langkah-langkah darurat yang harus diambil ketika bencana melanda. Jangan panik, tetap ikuti prosedur keamanan yang berlaku.</p><ul><li>Simpan dokumen penting (KTP, KK, akta kelahiran, sertifikat tanah) di tempat yang kedap air dan mudah dijangkau.</li><li>Siapkan perbekalan darurat untuk minimal 3 hari ke depan (makanan instan, air minum, obat-obatan pribadi, senter, radio).</li><li>Hafalkan minimal 2 rute evakuasi menuju tempat yang lebih aman dari rumah Anda.</li><li>Catat nomor telepon darurat: 112 (Call Center), BPBD, PMI, dan Pemadam Kebakaran.</li></ul>';

        foreach ($kesiapsiagaanData as $i => $data) {
            $date = $faker->dateTimeBetween('-60 days', 'now');
            Kesiapsiagaan::create([
                'title' => $data['title'],
                'slug' => Str::slug($data['title']),
                'content' => $kontenSiaga,
                'status' => $data['status'] === 'published' ? 'published' : 'draft',
                'published_at' => $data['status'] === 'published' ? $date : null,
                'created_at' => $date,
                'updated_at' => $date,
            ]);
        }

        // ─── FAQ ────────────────────────────────────────────
        $this->command->info('Menyemai 10 data FAQ...');
        $faqData = [
            ['question' => 'Bagaimana cara melaporkan kejadian bencana?', 'answer' => 'Anda dapat melaporkan kejadian bencana melalui website ini dengan menekan tombol "Lapor Bencana" di halaman utama dan mengisi formulir yang tersedia. Alternatif lain, Anda juga bisa melaporkan melalui WhatsApp resmi BPBD Indramayu.'],
            ['question' => 'Apakah laporan saya akan langsung ditangani?', 'answer' => 'Laporan Anda akan masuk ke sistem dan diverifikasi oleh admin BPBD. Setelah terverifikasi benar, tim lapangan akan langsung diturunkan ke lokasi kejadian. Rata-rata waktu respons adalah 15-30 menit untuk laporan darurat.'],
            ['question' => 'Bagaimana cara memantau status laporan saya?', 'answer' => 'Anda dapat memantau status laporan melalui halaman "Lacak Laporan" dengan memasukkan nomor tiket laporan yang diberikan saat pengajuan. Status laporan meliputi: Menunggu, Diproses, Selesai, atau Ditolak.'],
            ['question' => 'Nomor darurat apa yang bisa dihubungi?', 'answer' => 'Call Center 112 dapat dihubungi dalam kondisi darurat kapan saja. Anda juga dapat menghubungi Kantor BPBD Indramayu di (0234) 123456 atau melalui WhatsApp di 081234567890.'],
            ['question' => 'Apakah perlu menyertakan foto saat melapor?', 'answer' => 'Sangat disarankan. Foto atau video kejadian akan membantu tim BPBD menilai tingkat keparahan bencana dan menentukan jenis bantuan yang tepat. Pastikan foto jelas dan menunjukkan kondisi lokasi kejadian.'],
            ['question' => 'Bagaimana cara menjadi relawan bencana?', 'answer' => 'Informasi pendaftaran relawan biasanya diumumkan saat terjadi bencana besar. Pantau terus halaman Berita dan media sosial resmi BPBD Indramayu untuk informasi rekrutmen relawan terbaru.'],
            ['question' => 'Apa itu Tas Siaga Bencana?', 'answer' => 'Tas Siaga Bencana (TSB) adalah tas ransel yang berisi perlengkapan darurat dasar yang siap dibawa saat evakuasi. Isinya meliputi: makanan instan, air minum, senter + baterai cadangan, kotak P3K, peluit, masker, dokumen penting dalam plastik kedap air, pakaian ganti, dan obat-obatan pribadi.'],
            ['question' => 'Apakah layanan ini berbayar?', 'answer' => 'Tidak. Seluruh layanan pelaporan dan penanganan bencana oleh BPBD Indramayu 100% gratis dan tidak dipungut biaya apapun. Waspadai oknum yang meminta imbalan atas layanan ini.'],
            ['question' => 'Bagaimana cara melihat peringatan dini?', 'answer' => 'Peringatan dini dapat dilihat di halaman Informasi > Peringatan Dini website ini. Informasi diperbarui secara real-time berdasarkan data resmi dari BMKG, PVMBG, dan instansi terkait lainnya.'],
            ['question' => 'Siapa pengelola website Disaster Intelligence ini?', 'answer' => 'Website Disaster Intelligence dikelola oleh BPBD Kabupaten Indramayu sebagai bagian dari sistem tanggap darurat terpadu. Tujuannya memberikan kemudahan akses informasi dan pelaporan bencana bagi masyarakat.'],
        ];

        foreach ($faqData as $i => $data) {
            Faq::create([
                'question' => $data['question'],
                'answer' => $data['answer'],
                'sort_order' => $i + 1,
                'is_active' => true,
            ]);
        }

        // ─── SETTINGS DEFAULT ──────────────────────────────
        $this->command->info('Menyemai data Pengaturan...');
        $settings = [
            'app_name' => 'Disaster Intelligence',
            'app_description' => 'Sistem Informasi dan Pelaporan Bencana BPBD Kabupaten Indramayu',
            'whatsapp_number' => '081234567890',
            'whatsapp_api_url' => '',
            'whatsapp_api_key' => '',
            'call_center' => '112',
            'email_pengaduan' => 'bpbd@indramayukab.go.id',
            'alamat_kantor' => 'Jl. Letnan Jenderal Supratman No. 1, Indramayu',
            'latitude_kantor' => '-6.3251',
            'longitude_kantor' => '108.3152',
            'map_center_lat' => '-6.40',
            'map_center_lng' => '108.20',
            'waktu_tanggap_darurat' => '30',
            'kabupaten_default' => 'Indramayu',
            'provinsi' => 'Jawa Barat',
        ];

        foreach ($settings as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value],
            );
        }

        $this->command->info('✅ Selesai! Semua data dummy berhasil disemai.');
    }
}
