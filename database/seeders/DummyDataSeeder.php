<?php

namespace Database\Seeders;

use App\Models\Berita;
use App\Models\EarlyWarning;
use App\Models\Faq;
use App\Models\JenisBencana;
use App\Models\Kesiapsiagaan;
use App\Models\LaporanBencana;
use App\Models\StatusLaporan;
use App\Models\Wilayah;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DummyDataSeeder extends Seeder
{
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

        $this->command->info('Menyemai data dummy untuk Laporan Bencana...');
        $deskripsiBencana = [
            'Telah terjadi banjir setinggi lutut orang dewasa di jalan utama.',
            'Angin puting beliung merusak beberapa atap rumah warga.',
            'Pohon tumbang menghalangi jalan raya, lalu lintas lumpuh total.',
            'Terjadi kebakaran di daerah pemukiman padat penduduk.',
            'Tanah longsor menutupi sebagian akses jalan desa.',
        ];

        for ($i = 0; $i < 10; $i++) {
            $date = $faker->dateTimeBetween('-7 days', 'now');
            LaporanBencana::create([
                'kode_laporan' => 'REP-'.Str::upper(Str::random(8)),
                'jenis_bencana_id' => $jenisBencana->random()->id,
                'status_id' => $statusLaporan->random()->id,
                'wilayah_id' => $wilayahIds->isNotEmpty() ? $wilayahIds->random() : null,
                'judul' => 'Laporan Kejadian '.$faker->randomElement(['Banjir', 'Angin Kencang', 'Pohon Tumbang', 'Kebakaran', 'Tanah Longsor']),
                'deskripsi' => $faker->randomElement($deskripsiBencana),
                'alamat' => $faker->streetAddress(),
                'kecamatan' => 'Kecamatan '.$faker->word(),
                'desa' => 'Desa '.$faker->word(),
                'latitude' => $faker->randomFloat(8, -7.5, -6.5),
                'longitude' => $faker->randomFloat(8, 107.0, 109.0),
                'nama_pelapor' => $faker->name(),
                'no_hp_pelapor' => '08'.$faker->randomNumber(8, true),
                'sumber_data' => $faker->randomElement(['website', 'whatsapp']),
                'tingkat_keparahan' => $faker->randomElement(['Rendah', 'Sedang', 'Tinggi', 'Darurat']),
                'waktu_kejadian' => $date,
                'validasi_admin' => $faker->boolean(70),
                'created_at' => $date,
                'updated_at' => $date,
            ]);
        }

        $this->command->info('Menyemai data dummy untuk Peringatan Dini...');
        $laporanIds = LaporanBencana::pluck('id');
        $pesanPeringatan = [
            'Waspada potensi hujan lebat disertai petir dan angin kencang.',
            'Tinggi gelombang laut diprediksi mencapai 2-3 meter, nelayan diimbau berhati-hati.',
            'Volume air sungai meningkat, waspada potensi banjir rob di pesisir.',
            'Kualitas udara menurun akibat asap kebakaran lahan, gunakan masker.',
            'Peringatan cuaca ekstrem untuk wilayah bagian utara dalam 24 jam ke depan.',
        ];

        for ($i = 0; $i < 10; $i++) {
            $date = $faker->dateTimeBetween('-1 month', 'now');
            EarlyWarning::create([
                'laporan_id' => $laporanIds->count() > 0 ? $laporanIds->random() : null,
                'jenis_bencana_id' => $jenisBencana->random()->id,
                'level_warning' => $faker->randomElement(['Siaga', 'Waspada', 'Awas']),
                'status' => $faker->randomElement(['aktif', 'selesai']),
                'wilayah' => 'KABUPATEN '.$faker->randomElement(['INDRAMAYU', 'BEKASI', 'CIREBON']),
                'pesan' => $faker->randomElement($pesanPeringatan),
                'created_at' => $date,
                'updated_at' => $date,
            ]);
        }

        $this->command->info('Menyemai data dummy untuk Berita...');
        $judulBerita = [
            'Pemkab Siagakan Posko Bencana 24 Jam',
            'BMKG Prediksi Cuaca Ekstrem Berlanjut Hingga Akhir Bulan',
            'Bantuan Logistik Mulai Didistribusikan ke Desa Terdampak',
            'Tanggul Sungai yang Jebol Mulai Diperbaiki Tadi Pagi',
            'Relawan Evakuasi Ratusan Warga dari Genangan Air',
            'Pentingnya Mengenali Tanda-tanda Bahaya Bencana Alam',
            'Data Terbaru: Kerugian Akibat Angin Puting Beliung',
            'Warga Diimbau untuk Tidak Membuang Sampah ke Sungai',
            'Rapat Koordinasi Penanggulangan Bencana Digelar Hari Ini',
            'Jalur Transportasi Terputus Sementara Akibat Longsor',
        ];
        $kontenBerita = '<p>Pemerintah daerah bersama BPBD terus melakukan upaya maksimal dalam merespons kejadian ini. Tim lapangan telah dikerahkan sejak pagi hari untuk melakukan evakuasi dan pendataan kerusakan. Masyarakat diminta untuk tetap tenang dan selalu mengikuti arahan dari petugas resmi.</p><p>Selain itu, posko kesehatan darurat juga telah didirikan untuk melayani warga yang mengalami gangguan kesehatan atau membutuhkan obat-obatan. Logistik berupa makanan siap saji dan air bersih sedang dalam perjalanan menuju lokasi terdampak.</p>';

        for ($i = 0; $i < 10; $i++) {
            $title = $judulBerita[$i] ?? 'Berita Terbaru Penanggulangan Bencana';
            $date = $faker->dateTimeBetween('-30 days', 'now');
            Berita::create([
                'title' => $title,
                'slug' => Str::slug($title).'-'.Str::random(5),
                'content' => $kontenBerita,
                'status' => $faker->randomElement(['published', 'published', 'published', 'draft']),
                'published_at' => $date,
                'created_at' => $date,
                'updated_at' => $date,
            ]);
        }

        $this->command->info('Menyemai data dummy untuk Kesiapsiagaan...');
        $judulSiaga = [
            'Panduan Siaga Bencana Banjir',
            'Apa yang Harus Dilakukan Saat Terjadi Gempa Bumi?',
            'Langkah Aman Menghadapi Angin Puting Beliung',
            'Mempersiapkan Tas Siaga Bencana (TSB)',
            'Evakuasi Mandiri: Tips dan Trik',
            'Pertolongan Pertama pada Luka Ringan di Lokasi Bencana',
            'Mencegah Kebakaran di Area Padat Penduduk',
            'Mengenali Jalur Evakuasi dan Titik Kumpul Terdekat',
            'Siaga Bencana Longsor di Area Perbukitan',
            'Menjaga Kebersihan Air dan Sanitasi Darurat',
        ];
        $kontenSiaga = '<p>Kesiapsiagaan adalah kunci keselamatan kita. Selalu pastikan Anda dan keluarga telah memahami langkah-langkah darurat yang harus diambil ketika bencana melanda. Jangan panik, tetap ikuti prosedur keamanan yang berlaku.</p><ul><li>Simpan dokumen penting di tempat yang kedap air dan mudah dijangkau.</li><li>Siapkan perbekalan darurat untuk minimal 3 hari ke depan (makanan, minuman, obat).</li><li>Hafalkan rute evakuasi menuju tempat yang lebih aman.</li></ul>';

        for ($i = 0; $i < 10; $i++) {
            $title = $judulSiaga[$i] ?? 'Panduan Kesiapsiagaan Bencana';
            $date = $faker->dateTimeBetween('-60 days', 'now');
            Kesiapsiagaan::create([
                'title' => $title,
                'slug' => Str::slug($title).'-'.Str::random(5),
                'content' => $kontenSiaga,
                'status' => 'published',
                'published_at' => $date,
                'created_at' => $date,
                'updated_at' => $date,
            ]);
        }

        $this->command->info('Menyemai data dummy untuk FAQ...');
        $faqs = [
            ['Bagaimana cara melaporkan kejadian bencana?', 'Anda dapat menekan tombol "Lapor Bencana" di halaman utama website ini dan mengisi formulir yang tersedia. Anda juga bisa melaporkan melalui WhatsApp resmi kami.'],
            ['Apakah laporan yang saya buat akan langsung ditangani?', 'Laporan Anda akan masuk ke sistem dan segera diverifikasi oleh admin. Setelah terverifikasi benar, tim lapangan akan langsung diturunkan.'],
            ['Bisakah saya memantau status laporan saya?', 'Tentu saja. Anda bisa mengecek status laporan (Menunggu Validasi, Proses, Selesai) melalui nomor tiket yang diberikan saat melapor.'],
            ['Nomor telepon darurat mana yang bisa saya hubungi?', 'Anda dapat menghubungi Call Center 112 atau nomor darurat BPBD setempat yang tertera di halaman kontak website ini.'],
            ['Apakah saya perlu memberikan foto kejadian saat melapor?', 'Sangat disarankan. Foto kejadian akan membantu tim kami mengukur tingkat keparahan dan jenis bantuan yang harus dipersiapkan.'],
            ['Bagaimana cara menjadi relawan bencana?', 'Informasi pendaftaran relawan biasanya dibuka saat tanggap darurat besar. Silakan pantau halaman Berita untuk pengumuman rekrutmen relawan.'],
            ['Apa itu Tas Siaga Bencana?', 'Tas Siaga Bencana adalah tas berisi perlengkapan darurat dasar (makanan, minuman, senter, kotak P3K, dokumen penting) yang siap dibawa kapan saja saat harus evakuasi.'],
            ['Apakah layanan ini gratis?', 'Ya, seluruh layanan pelaporan dan penanganan bencana ini 100% gratis tanpa dipungut biaya apapun dari masyarakat.'],
            ['Di mana saya bisa melihat peringatan dini cuaca?', 'Anda dapat melihatnya di halaman Peringatan Dini, yang terus diperbarui berdasarkan data resmi dari instansi terkait.'],
            ['Siapa pengelola website ini?', 'Website Disaster Intelligence ini dikelola secara resmi oleh badan penanggulangan bencana daerah setempat.'],
        ];

        for ($i = 0; $i < 10; $i++) {
            $qna = $faqs[$i] ?? ['Pertanyaan Umum?', 'Jawaban akan segera diperbarui.'];
            Faq::create([
                'question' => $qna[0],
                'answer' => $qna[1],
                'sort_order' => $i,
                'is_active' => true,
            ]);
        }

        $this->command->info('Selesai menyemai 10 data dummy masing-masing dengan teks Bahasa Indonesia!');
    }
}
