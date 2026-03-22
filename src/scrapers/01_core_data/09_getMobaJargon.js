const fs = require('fs');
const path = require('path');

/**
 * 📖 FASE 09: ENSIKLOPEDIA KAMUS MOBA (STATIC MASTER SEEDER V3.1)
 * Lokasi: src/scrapers/01_core_data/09_getMobaJargon.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur Utama: Kamus MOBA komplit dengan sentuhan bahasa Gamers Lokal (ID).
 * Update V3.1: Clean Edition (Menghapus kosakata kasar/toxic demi citra komunitas yang positif).
 */

// ============================================================================
// 🧠 DATABASE JARGON MOBA (HONOR OF KINGS - ID EDITION)
// ============================================================================
const JARGON_DB = [
    // --- KELOMPOK A ---
    { term: "ADC (Attack Damage Carry)", category: "Peran (Role)", definition: "Anggota tim yang damagenya besar di pertandingan, biasanya bertugas menjadi eksekutor utama di Late Game.", example: "Lindungi ADC kita saat teamfight!" },
    { term: "AFK (Away from Keyboard)", category: "Kondisi Game", definition: "Player yang meninggalkan pertandingan, hal ini ada yang disengaja dan tidak di sengaja. Bahkan jika yang terjadi adalah kesalahan teknis di luar kendali player tersebut pun (misal: terjadi gangguan jaringan), maka player tersebut tetap disebut AFK.", example: "Aduh, Mage kita AFK gara-gara sinyal." },
    { term: "AI (Artificial Intelligence)", category: "Sistem", definition: "Kecerdasan Buatan, lebih dikenal sebagai komputer. Misal, mode Human VS AI = mode manusia VS komputer. Dan saat lu AFK, biasanya hero lu diambil alih oleh komputer.", example: "Hero dia digerakin AI karena AFK." },
    { term: "Assist", category: "Statistik", definition: "Saat temen kamu dapet kill, dan kamu berpartisipasi dalam kill tersebut, maka kamu akan dapet point assist.", example: "Gak apa-apa ga dapet kill, yang penting banyak assist." },

    // --- KELOMPOK B ---
    { term: "Bot / Bot Lane", category: "Map/Peta", definition: "Bottom Lane, atau Jalur Bawah di peta.", example: "Bantu push Bot lane, towernya udah sekarat." },
    { term: "Buta Map", category: "Kesalahan Taktik", definition: "Istilah untuk orang yang jarang ngecek mini-map di game. Sibuk war/kill/jungling, sementara tower ga kejaga dengan baik.", example: "Jangan buta map, musuh udah kumpul di mid!" },

    // --- KELOMPOK C ---
    { term: "Carry", category: "Peran (Role)", definition: "Hero yang bertugas 'menggendong' tim menuju kemenangan. Carry biasanya adalah role ADC atau Jungler.", example: "Biar Marksman yang jadi carry di late game." },
    { term: "CD (Cooldown)", category: "Mekanik Game", definition: "Waktu yang diperlukan agar skill/efek/fasilitas tertentu bisa digunakan kembali. Sering juga untuk memberitahu teman jika skill belum siap.", example: "Mundur dulu, Ultimate gue masih CD 10 detik." },
    { term: "CDR (Cooldown Reduction)", category: "Atribut", definition: "Penurunan waktu Cooldown pada skill, biasanya didapat dari Item atau Arcana.", example: "Beli item CDR biar bisa spam skill." },
    { term: "Clutch", category: "Kondisi Game", definition: "Momen krusial di mana satu pemain berhasil membalikkan keadaan atau memenangkan teamfight sendirian melawan banyak musuh.", example: "Gila, clutch banget Lu Bu tadi bisa def base sendirian 1v4!" },
    { term: "CN (Change Name / Nick)", category: "Istilah Umum", definition: "Istilah untuk mengganti nama akun di dalam game.", example: "Beli kartu ganti nama buat CN ke nama squad." },
    { term: "CC (Crowd Control)", category: "Efek Status", definition: "Efek skill yang membatasi pergerakan musuh, seperti Stun, Slow, Silence, Airborne, Freeze, atau Taunt.", example: "Kita butuh hero yang punya banyak CC buat nge-lock Lu Bu." },

    // --- KELOMPOK D ---
    { term: "Diff (Difference)", category: "Komunikasi", definition: "Biasanya digunakan untuk memuji rekan satu tim yang bermain sangat jago. Namun 'Diff' juga sangat sering digunakan untuk menyoroti pemain jika gameplaynya terlalu jauh berbeda/beban.", example: "Jungler diff nih! (Maksudnya: Jungler kita jago, Jungler musuh cupu, atau sebaliknya)." },
    { term: "DPS (Damage Per Second)", category: "Atribut", definition: "Damage rata-rata yang dihasilkan tiap detiknya secara berkelanjutan. Sangat penting bagi Marksman.", example: "Marksman itu butuh item attack speed buat ningkatin DPS." },

    // --- KELOMPOK E ---
    { term: "Early Game", category: "Fase Game", definition: "Awal-awal pertandingan dimulai, saat level masih pada kecil dan gears (item) belum pada jadi.", example: "Pei sangat kuat di early game, ayo serang hutannya!" },
    { term: "EZPZ / EZ (Easy)", category: "Komunikasi / Taunting", definition: "Dibaca 'Izi Pizi'. Sering digunakan ketika menang terlalu mudah. Tapi kata ini juga rutin di-spam meskipun menang susah payah, tujuannya biasanya untuk psywar kompetitif.", example: "EZ game, tutor dong bang!" },

    // --- KELOMPOK F ---
    { term: "FB (First Blood)", category: "Kondisi Game", definition: "Istilah untuk kill pertama yang diraih oleh suatu tim dalam sebuah pertandingan. Memberikan bonus gold tambahan.", example: "Nice First Blood! Langsung invasi buff musuh." },
    { term: "Feed / Feeder", category: "Kondisi Game", definition: "Ketika kamu atau ada pemain yang banyak mati sehingga memberikan skor/gold gratis bagi musuh, maka orang itu disebut sebagai feeder.", example: "Clash lane kita feeding terus ke musuh, susah menang ini." },
    { term: "Fountain", category: "Map/Peta", definition: "Tempat buat ngisi Darah (HP) dan Mana ketika sudah mau habis. Biasanya didatangi via skill Teleport (Recall).", example: "Darah sekarat, balik ke fountain dulu." },

    // --- KELOMPOK G ---
    { term: "Gears / Item", category: "Mekanik Game", definition: "Peralatan yang disiapkan untuk hero seperti senjata, armor, sepatu, dan item magic. Tiap set gears maksimal terdiri atas 6 slot.", example: "Jangan lupa upgrade gears sesuai rekomendasi bot." },
    { term: "GG / GGWP (Good Game Well Played)", category: "Etika", definition: "Kebalikan dari EZPZ. Diucapkan ketika permainan berakhir dan memuji rekan satu tim atau musuh karena permainan/mekanik yang sangat seru dan imbang.", example: "GGWP semuanya, comeback yang luar biasa!" },
    { term: "GLHF (Good Luck Have Fun)", category: "Etika", definition: "Singkatan yang berarti menyuruh teman serta lawan menikmati game dengan sportif di awal permainan.", example: "GLHF guys, ayo main santai tapi fokus." },

    // --- KELOMPOK H ---
    { term: "Harass", category: "Taktik Mikro", definition: "Mancing lawan buat nyerang kamu, atau memberikan gangguan secara konstan biasanya dengan attack berjarak.", example: "Harass musuh di lane biar mereka gak nyaman farming." },

    // --- KELOMPOK I ---
    { term: "IGN (In Game Name)", category: "Istilah Umum", definition: "Nama atau Nick yang Anda gunakan di dalam game (nama character).", example: "Add IGN gue dong buat mabar nanti malam." },
    { term: "Imba (Imbalance)", category: "Istilah Umum", definition: "Digunakan ketika kagum, respect, atau frustrasi terhadap seorang pemain/hero karena terlalu kuat dan sulit dikalahkan.", example: "Hero baru ini imba banget, damagenya nggak masuk akal." },

    // --- KELOMPOK J ---
    { term: "Jungling", category: "Taktik Makro", definition: "Kill monster di area jungle (hutan) buat leveling dan cari gold tanpa masuk ke lane utama.", example: "Biar Assassin kita yang fokus jungling." },

    // --- KELOMPOK K ---
    { term: "KDA (Kill, Death, Assist)", category: "Statistik", definition: "Rasio perbandingan performa. Rumusnya: (KILL + ASSIST) / (DEATH+1). KDA tinggi biasanya menjamin posisi MVP.", example: "KDA lu 15 match ini, pantas dapat MVP." },
    { term: "Kill", category: "Statistik", definition: "Mencetak 1 skor dengan melakukan last hit pada musuh. Walau temenmu kasih 90% damage, kalau 10% last hit elu yang lakuin, kill itu milikmu.", example: "Nice kill! Lanjut push tower." },
    { term: "KS (Kill Steal)", category: "Kondisi Game", definition: "Saat elu capek-capek gebukin musuh dan tetiba temenlu dateng buat last hit. Di game MOBA ini sangat wajar demi memastikan musuh tumbang.", example: "Yaelah, kena KS lagi sama Roamer, haha." },

    // --- KELOMPOK L ---
    { term: "Lag", category: "Kondisi Game", definition: "Digunakan ketika koneksi internet atau ping sedang tinggi, sehingga tampilan game akan tersendat atau delay.", example: "Sumpah lag banget, ping tembus 200ms." },
    { term: "Late Game", category: "Fase Game", definition: "Fase ketika level hero sudah pada tinggi dan slot item sudah full (jadi semua).", example: "Tahan aja sampai late game, Marksman kita udah full item." },
    { term: "LFT (Looking For Team)", category: "Istilah Komunitas", definition: "Biasanya digunakan di luar in-game (Discord/Grup FB). Ini menjadi kode ketika seorang gamers ingin mencari tim/squad baru.", example: "LFT Roamer tier Grandmaster, on tiap malam." },
    { term: "LifeSteal", category: "Atribut", definition: "Efek untuk menghisap darah target dan menjadikannya darah kita. Ada di beberapa gears seperti Bloodweeper atau bawaan skill hero.", example: "Beli item LifeSteal biar gak usah bolak-balik ke fountain." },
    { term: "LOL (Lot of Laughs)", category: "Komunikasi", definition: "Tertawa kencang. Biasanya digunakan untuk merespons hal lucu, atau terkadang sebagai bentuk sarkasme.", example: "LOL, musuhnya flicker ke tembok." },

    // --- KELOMPOK M ---
    { term: "MB (My Bad)", category: "Komunikasi / Etika", definition: "Alias 'Salahku'. Digunakan ketika suatu pemain merasa melakukan kesalahan yang akhirnya membuat tim mereka rugi.", example: "MB guys, gue tadi overextend jadi keciduk." },
    { term: "Mid / Mid Lane", category: "Map/Peta", definition: "Middle Lane atau Jalur tengah, tempat bertemunya para Mage.", example: "Mid lane kosong tuh, tolong di-cover." },
    { term: "MVP (Most Valuable Player)", category: "Statistik", definition: "Pemain paling berpengaruh dan berkontribusi besar di tim (berdasarkan kalkulasi algoritma).", example: "Mantap, menang dan dapet MVP!" },

    // --- KELOMPOK N ---
    { term: "NC (Nice)", category: "Komunikasi", definition: "Sesuai artinya, digunakan ketika rekan satu tim melakukan hal yang positif. Tapi bisa juga digunakan untuk sarkas ketika teman blunder.", example: "NC! Dapet Lord plus wipeout." },
    { term: "Nerf", category: "Pembaruan Game", definition: "Penurunan skill/efek/kemampuan hero atau item oleh developer agar permainan kembali seimbang.", example: "Waduh, hero andalanku kena nerf di patch baru." },
    { term: "Noob", category: "Istilah Umum", definition: "Player pemula atau pemain yang sedang belajar.", example: "Santai aja, namanya juga masih noob belajar hero." },
    { term: "NT (Nice Try)", category: "Etika", definition: "Bahasa yang sering muncul saat tim kompetitif gagal mengeksekusi rencana. Sangat sering digunakan di rank untuk memberi semangat ke teammate ketika usaha mereka gagal.", example: "NT guys, gapapa kita coba def base dulu." },
    { term: "Nyampah", category: "Kondisi Game", definition: "Istilah bahasa gaul dari KS (Kill Steal), yaitu tinggal ngekill saat darah musuh sudah tipis yang dipukul temanmu.", example: "Wah, nyampah aja nih kerjaannya!" },

    // --- KELOMPOK O ---
    { term: "OP (Overpower)", category: "Istilah Umum", definition: "Mirip dengan Imba, OP berarti pemain musuh/teman atau hero yang digunakan begitu kuat sehingga ditakuti.", example: "Wajib ban hero itu, lagi OP banget." },
    { term: "Open War / Engage", category: "Taktik Makro", definition: "Pengguna yang pertama kali berinisiasi untuk ngebuka peperangan tim (teamfight). Biasanya dilakukan oleh Roamer/Tank.", example: "Tunggu Tank kita open war, baru kalian masuk." },

    // --- KELOMPOK P ---
    { term: "Penetration (Pierce)", category: "Atribut", definition: "Physical/Magic Penetration: Item/efek untuk mempermudah masuknya serangan dengan menembus armor/pertahanan lawan (Tank).", example: "Tank musuh keras banget, wajib beli item Penetration." },
    { term: "Poke", category: "Taktik Mikro", definition: "Serangan kecil jarak jauh ke musuh yang bertujuan untuk mencicil darahnya perlahan-lahan.", example: "Poke terus pakai skill 1 biar dia mundur dari tower." },

    // --- KELOMPOK R ---
    { term: "Roam / Roaming", category: "Taktik Makro", definition: "Istilah untuk berpindah-pindah lane membantu tim. Bertujuan ngebantu tim ngekill penjaga tower lawan atau buka vision.", example: "Roamer kita roaming-nya bagus, map jadi terang." },
    { term: "Role", category: "Peran (Role)", definition: "Peranan Hero. Misal: Support, Fighter, Marksman, Assassin, Mage.", example: "Pilih role yang belum diisi sama tim kita." },
    { term: "Rotate (Rotasi)", category: "Taktik Makro", definition: "Sebagai shoutcall bagi para pemain untuk berpindah dari jalurnya saat ini untuk membantu rekan satu timnya di lane lain.", example: "Mage tolong rotasi ke bawah bentar, bot kita di-gank." },

    // --- KELOMPOK S ---
    { term: "Solo Mid", category: "Taktik Makro", definition: "Bermain di Jalur tengah sendirian agar mendapat EXP dan Gold penuh.", example: "Biar aku yang solo mid pakai Mage." },
    { term: "Spell (Battle Spell)", category: "Mekanik Game", definition: "Kemampuan ekstra yang dipilih sebelum battle. Berguna buat nambah damage, kecepatan, nge-stun, non-aktifkan tower, dll.", example: "Spell Flashku masih cooldown, jangan war dulu." },
    { term: "Stun", category: "Efek Status", definition: "Efek yang membuat target tidak bisa melakukan apapun (bergerak/menyerang). Dapat dihilangkan dengan Spell Purify.", example: "Kena stun terus-terusan nih, nyebelin." },

    // --- KELOMPOK T ---
    { term: "TB (Tebe / Tahan Badan)", category: "Taktik Mikro", definition: "Menyuruh Tank/Roamer untuk berada di depan menahan damage musuh, sehingga damage dealer (Core/Marksman) tidak cepat mati.", example: "Bang TB-in gue bang, gue mau hit tower." },
    { term: "Teleport / Recall", category: "Mekanik Game", definition: "Menu untuk balik ke fountain secara cepat. Jadi lu ga perlu capek-capek jalan kaki kalo lokasi lu jauh.", example: "Recall dulu bentar, mau beli item." },
    { term: "Top / Clash Lane", category: "Map/Peta", definition: "Top lane atau Jalur atas di dalam peta, tempat pertarungan para Fighter.", example: "Top lane kena push, tolong di-defend." },

    // --- KELOMPOK U ---
    { term: "Ult (Ultimate)", category: "Mekanik Game", definition: "Mengacu pada skill ultimate (pamungkas) yang dimiliki suatu hero, entah itu untuk mengabarkan skill-nya sedang available atau cooldown.", example: "Tunggu bentar, Ult gue masih CD 5 detik." },

    // --- KELOMPOK W ---
    { term: "W8 (Wait)", category: "Komunikasi", definition: "Digunakan di tengah-tengah game jika pemain terburu-buru untuk menyuruh 'menunggu'. Huruf W + 8 (eight) dibaca Wait.", example: "W8 w8, gue belum nyampe!" },
    { term: "WTB / WTS", category: "Istilah Komunitas", definition: "Want to Buy (Ingin Beli) / Want to Sell (Ingin Jual). Biasanya digunakan di forum komunitas gaming untuk transaksi in-game item atau akun.", example: "WTS akun HoK spek sultan, 50 skin." },

    // ============================================================================
    // 🧠 EKSTRA: TAKTIK MAKRO & MIKRO KHUSUS MOBA (Lanjutan)
    // ============================================================================
    { term: "Macro (Makro)", category: "Pengetahuan Game", definition: "Penguasaan strategi gambaran besar (Big Picture). Termasuk rotasi, kepekaan membaca mini-map (Map Awareness), penguasaan objektif, dan manajemen minion.", example: "Mekanik dia biasa aja, tapi makro-nya dewa." },
    { term: "Micro (Mikro)", category: "Pengetahuan Game", definition: "Kemampuan teknis dan mekanik individu pemain (Mekanik). Termasuk kecepatan tangan (fast hand), akurasi skill, juking, dan positioning tempur.", example: "Mikro Jing-nya gila, combonya mulus banget." },
    { term: "Gank / Ganking", category: "Taktik Makro", definition: "Penyerangan kejutan dari lane lain (biasanya oleh Jungler) secara berkelompok (outnumber) ke musuh yang lengah atau terlalu maju.", example: "Tolong gank Clash Lane, musuhnya overextend." },
    { term: "Kite / Kiting", category: "Taktik Mikro", definition: "Teknik memukul mundur. Menyerang musuh sambil bergerak mundur menjaga jarak, membuat musuh menerima damage tanpa bisa membalas.", example: "Marksman yang jago kiting bakal susah dibunuh Fighter." },
    { term: "Zoning", category: "Taktik Makro", definition: "Menjaga area tertentu dengan memberikan ancaman (presence) agar musuh tidak berani mendekat. Sering dilakukan saat teman sedang ambil Tyrant/Overlord.", example: "Tank maju ke depan buat zoning musuh, sisanya fokus hit Tyrant!" },
    { term: "Peel / Peeling", category: "Taktik Mikro", definition: "Tindakan melindungi hero inti (Carry/Mage) dari Assassin/Fighter musuh yang mencoba mendekat saat teamfight.", example: "Roamer, tolong peel Marksman kita ya pas war." },
    { term: "Snowball / Snowballing", category: "Kondisi Game", definition: "Fenomena di mana tim yang menang sedikit (First Blood/Tower awal) terus menggulirkan keuntungan itu menjadi keunggulan telak seperti bola salju.", example: "Wah musuh udah snowball nih, gold beda jauh." },
    { term: "Freeze Lane", category: "Taktik Makro", definition: "Menahan agar kumpulan minion bertarung di dekat tower kita sendiri. Membuat musuh terpaksa maju jika ingin mendapat EXP, membuatnya rawan di-gank.", example: "Aku freeze lane dulu di atas biar musuh gak berani maju." },
    { term: "Split Push", category: "Taktik Makro", definition: "Strategi mendorong lane sendirian di ujung peta untuk menghancurkan tower, di saat tim musuh teralihkan di area lain.", example: "Kalian tahan di base, aku coba split push." },
    { term: "Facecheck", category: "Kesalahan Mikro", definition: "Mengecek semak (bush) dengan cara berjalan fisik masuk ke dalamnya, bukan menggunakan skill. Sangat berbahaya!", example: "Jangan facecheck rumput itu, pakai skill 1 dulu buat ngecek." },
    { term: "Juke / Juking", category: "Taktik Mikro", definition: "Gerakan berkelit atau tipuan step yang lincah untuk mengecoh arah serangan (skillshot) musuh.", example: "Juking-nya mantap, skill musuh meleset semua." },
    { term: "Wipeout / Ace", category: "Kondisi Game", definition: "Kondisi sangat menguntungkan di mana 5 anggota tim musuh mati bersamaan di peta.", example: "Wipeout! Langsung terjang base musuh sekarang!" }
];

async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 09] Memulai Eksekusi: Ensiklopedia Kamus MOBA");
    console.log("🛠️  Metode: Static Master Seeder (Regional ID Edition V3.1 - Clean)");
    console.log("==================================================");

    const processedFolder = path.join(__dirname, '../../../data/processed/id');
    const outPath = path.join(processedFolder, 'moba_jargon.json');

    if (!fs.existsSync(processedFolder)) fs.mkdirSync(processedFolder, { recursive: true });

    try {
        console.log(`📦 [INFO] Menyusun ${JARGON_DB.length} istilah Master Jargon MOBA...`);
        
        // Membungkus dalam objek metadata yang terstruktur
        const outputData = {
            total_terms: JARGON_DB.length,
            metadata: "Honor of Kings - Indonesian Gamers Dictionary (Family Friendly Edition)",
            last_updated: new Date().toISOString(),
            entries: JARGON_DB
        };

        fs.writeFileSync(outPath, JSON.stringify(outputData, null, 2));

        console.log(`✅ [BINGO] ${JARGON_DB.length} Istilah MOBA berhasil dikemas.`);

        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Fase 09 Selesai! PILAR 1 (CORE DATA) KOMPLIT! 💯`);
        console.log(`💾 File tersimpan di: data/processed/id/moba_jargon.json`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
    }
}

module.exports = { execute };