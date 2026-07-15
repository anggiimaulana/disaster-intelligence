<?php

namespace Database\Seeders;

use App\Models\Wilayah;
use Illuminate\Database\Seeder;

class JawaBaratWilayahSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            'KABUPATEN BOGOR' => ['Babakan Madang', 'Bojonggede', 'Caringin', 'Ciampea', 'Ciawi', 'Cibungbulang', 'Cijeruk', 'Cileungsi', 'Ciomas', 'Cisarua', 'Dramaga', 'Gunung Putri', 'Gunung Sindur', 'Jasinga', 'Kemang', 'Klapanendal', 'Leuwiliang', 'Leuwisadeng', 'Megamendung', 'Parung', 'Pamijahan', 'Ranca Bungur', 'Rumpin', 'Sentul', 'Sukaraja', 'Tamansari', 'Tanah Sereal'],
            'KABUPATEN SUKABUMI' => ['Bantargadung', 'Bojong Genteng', 'Caringin', 'Ciambar', 'Cibadak', 'Cibeureum', 'Ciberang', 'Cicantayan', 'Cicurug', 'Cidahu', 'Cidolog', 'Cigembrong', 'Cikakak', 'Cikembar', 'Cikidang', 'Cikunir', 'Cilogolog', 'Cireunghas', 'Cisoa', 'Citeko', 'Gegerbitung', 'Gunungguruh', 'Jampang Kulon', 'Jampang Tengah', 'Kebonpedes', 'Lembursitu', 'Nagrak', 'Palabuhanratu', 'Parakansalak', 'Parungkuda', 'Purbawarman', 'Sakaraja', 'Simpenan', 'Sukalarang', 'Sukabumi', 'Sukaraja', 'Surade', 'Tegalbuleud', 'Waluran', 'Warungkiara'],
            'KABUPATEN CIANJUR' => ['Agrabinta', 'Bojongpicung', 'Campaka', 'Campaka Mulya', 'Cianjur', 'Cibeber', 'Cibinong', 'Cibongas', 'Cidaun', 'Cijati', 'Cikadu', 'Cikalongkulon', 'Cikancana', 'Cilaku', 'Cipanas', 'Ciranjang', 'Cugenang', 'Gekbrong', 'Haurwangi', 'Karangtengah', 'Mande', 'Naringgulan', 'Pacet', 'Pagelaran', 'Pasirkuda', 'Pulomanjaya', 'Sukanagara', 'Sukaresmi', 'Tanggeung', 'Warungkondang'],
            'KABUPATEN BANDUNG' => ['Arjasari', 'Baleendah', 'Banjaran', 'Batujajar', 'Cangkuang', 'Cicalengka', 'Cikancung', 'Cimanggung', 'Cimeunyan', 'Ciparay', 'Ciwidey', 'Dayeuhkolot', 'Ibun', 'Kertasari', 'Kutawaringa', 'Majalaya', 'Margaasih', 'Margahayu', 'Nagreg', 'Pacet', 'Paseh', 'Rancabali', 'Soreang'],
            'KABUPATEN GARUT' => ['Banyuresmi', 'Bayongbong', 'Banjarwangi', 'Bungbulang', 'Caringin', 'Cibalong', 'Cibatu', 'Cibiuk', 'Cihurip', 'Cikajang', 'Cikelet', 'Cilawu', 'Cisewu', 'Cisompet', 'Cisurupan', 'Garut Kota', 'Kadungora', 'Karangpawitan', 'Kersamanah', 'Leles', 'Leuwigoong', 'Malangbong', 'Mekarmukti', 'Pakenjeng', 'Pameungpeuk', 'Pamulihan', 'Pasirwangi', 'Peundeuy', 'Selaawi', 'Singajaya', 'Singkup', 'Suci', 'Talaga', 'Tarogong Kaler', 'Tarogong Kidul', 'Wanaraja'],
            'KABUPATEN TASIKMALAYA' => ['Anggrawati', 'Bantarkalong', 'Bojonggambir', 'Bojong Asih', 'Cigalontang', 'Cihideung', 'Cikalong', 'Cikatomas', 'Cikunir', 'Culamega', 'Gunungtanjung', 'Jamanis', 'Karangnunggal', 'Kawalu', 'Kadipaten', 'Leuwisari', 'Mangkubumi', 'Pagerageung', 'Pancatengah', 'Pajajaran', 'Sariwangi', 'Singaparna', 'Sukahening', 'Sukaresik', 'Sukaraja', 'Sukatani', 'Sukawening', 'Tanjungjaya', 'Taraju', 'Warkodon'],
            'KABUPATEN CIAMIS' => ['Banjaranyar', 'Banjarsari', 'Baregbeg', 'Ciamis', 'Ciberem', 'Cidolog', 'Cihaurbeuti', 'Cijeungjing', 'Cikoneng', 'Cipaku', 'Cisaga', 'Jatinagara', 'Kalipucang', 'Karangnunggal', 'Kawali', 'Lakbok', 'Lumbung', 'Mangunreja', 'Maruyung', 'Panawangan', 'Panjalu', 'Panumbangan', 'Purwadadi', 'Sadananya', 'Sindangkasih', 'Tambaksari'],
            'KABUPATEN KUNINGAN' => ['Arjawinangun', 'Beber', 'Cibingbin', 'Cibeureum', 'Cigandamekar', 'Cigugur', 'Cilebak', 'Cilimus', 'Cimahi', 'Ciniru', 'Cipicung', 'Ciwaru', 'Darma', 'Dominggara', 'Japara', 'Jurit', 'Kalimanggis', 'Karangkancana', 'Kramatmulya', 'Lebakwangi', 'Luragung', 'Mandirancan', 'Nusaherang', 'Pancalang', 'Pasawahan', 'Selajambe', 'Sindangagung', 'Tanjungkerta', 'Tanjungwaru'],
            'KABUPATEN MAJALENGKA' => ['Argapura', 'Banjaran', 'Bantarujeg', 'Cigasong', 'Cikijing', 'Cingambul', 'Dagopa', 'Kadipaten', 'Kertajati', 'Lemahsugih', 'Leuwimunding', 'Ligung', 'Majalengka', 'Malausma', 'Palasah', 'Pamenang', 'Panyingkiran', 'Raja', 'Sindang', 'Sindangwangi', 'Sukahaji', 'Talaga'],
            'KABUPATEN SUMEDANG' => ['Cimanggung', 'Cisitu', 'Conggeang', 'Darmaraja', 'Greged', 'Jatigede', 'Jatinangor', 'Jatinunggal', 'Pamulihan', 'Paseh', 'Rancakalong', 'Situraja', 'Sukasari', 'Sumedang Selatan', 'Sumedang Utara', 'Tanjungmedar', 'Tanjungkerta', 'Tomo', 'Ujungjaya', 'Wado'],
            'KABUPATEN INDRAMAYU' => ['Anjatan', 'Arahan', 'Balongan', 'Bangodua', 'Bongas', 'Cikedung', 'Gabuswetan', 'Gantar', 'Haurgeulis', 'Indramayu', 'Jatibarang', 'Juntinyuat', 'Kandanghaur', 'Karangampel', 'Kertasemaya', 'Krangkeng', 'Kroya', 'Lelea', 'Lohbener', 'Losarang', 'Pasekan', 'Patrol', 'Sindang', 'Sliyeg', 'Sukagumiwang', 'Terisi', 'Trisi', 'Tukdana', 'Widasari'],
            'KABUPATEN SUBANG' => ['Blanakan', 'Ciasem', 'Ciater', 'Cibogo', 'Cijambe', 'Cipunagara', 'Cisalak', 'Compreng', 'Dawuan', 'Jalan Cagak', 'Kalijati', 'Kasomalang', 'Legonkulon', 'Pabuaran', 'Pagaden', 'Pagaden Barat', 'Pamanukan', 'Patokbeusi', 'Pusakanagara', 'Rancaiyuh', 'Sagalaherang', 'Subang', 'Sukasari', 'Tambakdahan'],
            'KABUPATEN PURWAKARTA' => ['Bojong', 'Bungursari', 'Cibatu', 'Darangdan', 'Jatiluhur', 'Kiarapedes', 'Manowaya', 'Pasawahan', 'Plered', 'Pondok Salam', 'Purwakarta', 'Sukasari', 'Sukatani', 'Wanayasa'],
            'KABUPATEN KARAWANG' => ['Batujaya', 'Ciampel', 'Cibuaya', 'Cikampek', 'Cilebar', 'Jatisari', 'Karawang', 'Klari', 'Kotabaru', 'Kutawaluya', 'Lemahabang', 'Majalaya', 'Pangkalan', 'Pedes', 'Purwasari', 'Rawamerta', 'Rengasdengklok', 'Talagasari', 'Tirtamulya', 'Tirtajaya', 'Telukjambe Barat', 'Telukjambe Timur'],
            'KABUPATEN BEKASI' => ['Babelan', 'Muara Gembong', 'Tarumajaya', 'Talaga', 'Cikarang Utara', 'Cikarang Selatan', 'Cikarang Barat', 'Cikarang Timur', 'Cikarang Pusat', 'Serang Baru', 'Cibitung', 'Karang Bahagia', 'Tambun Selatan', 'Tambun Utara', 'Setu', 'Kedung Waringin', 'Pebayuran', 'Sukakarya', 'Sukatani', 'Sukawangi', 'Tambelang'],
            'KABUPATEN BANDUNG BARAT' => ['Batujajar', 'Cipeundeuy', 'Cikalongwetan', 'Cimanggung', 'Cimareme', 'Gununghalu', 'Jayamekar', 'Padalarang', 'Rongga', 'Sindangkerta'],
            'KABUPATEN PANGANDARAN' => ['Cijulang', 'Cimerak', 'Cipakujur', 'Kalipucang', 'Langkaplancar', 'Mangunjaya', 'Padaherang', 'Pancawaru', 'Parigi', 'Pangandaran', 'Sidamulih'],
            'KOTA BOGOR' => ['Bogor Barat', 'Bogor Selatan', 'Bogor Tengah', 'Bogor Timur', 'Bogor Utara', 'Tanah Sereal'],
            'KOTA SUKABUMI' => ['Baros', 'Cibeureum', 'Cikole', 'Citamiang', 'Gunungpuyuh', 'Lembursitu', 'Warudoyong'],
            'KOTA BANDUNG' => ['Andir', 'Antapani', 'Arcamanik', 'Astanaanyar', 'Babakanciparay', 'Bandung Kidul', 'Bandung Kulon', 'Bandung Wetan', 'Batununggal', 'Bojongloa Kaler', 'Bojongloa Kidul', 'Buahbatu', 'Cibeunying Kaler', 'Cibeunying Kidul', 'Cicendo', 'Cidadap', 'Cinambo', 'Cibiru', 'Coblong', 'Gedebage', 'Kiaracondong', 'Lengkong', 'Mandalajati', 'Panyileukan', 'Rancasari', 'Regol', 'Sukasari', 'Sumur Bandung', 'Ujungberung'],
            'KOTA CIREBON' => ['Harjamukti', 'Kejaksan', 'Kedawung', 'Keras', 'Lemahwungkuk', 'Pekalipen', 'Sumber'],
            'KOTA BEKASI' => ['Bantargebang', 'Bekasi Barat', 'Bekasi Selatan', 'Bekasi Timur', 'Bekasi Utara', 'Jatiasih', 'Jatisampurna', 'Medan Satria', 'Mustikajaya', 'Mustikasari', 'Pondok Gede', 'Pondok Melati', 'Rawalumbu'],
            'KOTA DEPOK' => ['Beji', 'Bojong Sari', 'Cimanggis', 'Cinere', 'Cipayung', 'Limo', 'Pancoran Mas', 'Sawangan', 'Sukmajaya', 'Tapos'],
            'KOTA CIMAHI' => ['Cimahi Selatan', 'Cimahi Tengah', 'Cimahi Utara'],
            'KOTA TASIKMALAYA' => ['Bungursari', 'Cibeureum', 'Indihiang', 'Cipedes', 'Kawalu', 'Mangkubumi', 'Purbaratu', 'Tamansari', 'Tawang'],
            'KOTA BANJAR' => ['Banjar', 'Pataruman', 'Purwaharja', 'Langensari', 'Purwajaya'],
        ];

        $count = 0;
        foreach ($data as $kabupaten => $kecamatanList) {
            // Store normalized name (without KABUPATEN/KOTA prefix)
            $cleanName = preg_replace('/^(Kabupaten|Kota)\s+/i', '', $regency['name']);
            $cleanName = ucwords(strtolower(trim($cleanName)));

            foreach ($districts as $district) {
                $districtName = $district['name'];

                // Create kecamatan record
                Wilayah::firstOrCreate(
                    ['kecamatan' => $districtName, 'kabupaten' => $cleanName],
                    [
                        'provinsi' => 'Jawa Barat',
                        'desa' => null,
                        'latitude' => -6.9 + (mt_rand(-50, 50) / 100),
                        'longitude' => 107.6 + (mt_rand(-50, 50) / 100),
                    ]
                );
                $count++;
            }
        }

        $this->command->info("Seeded {$count} kecamatan across ".count($data).' kabupaten/kota.');
    }
}
