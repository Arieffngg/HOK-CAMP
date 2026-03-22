const fs = require('fs');
const path = require('path');

/**
 * 🎟️ FASE 35: INFO ATURAN ANTREAN ELITE & PEAK TOURNAMENT
 * Lokasi: src/scrapers/04_strategic_iq/35_getEliteMatchmaking.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur Utama: Menyuntikkan database statis tentang aturan Draft Pick (Lane Pre-selection)
 * dan sistem Turnamen Puncak (Peak Tournament) untuk pemain tier tinggi.
 */

// ============================================================================
// 🧠 DATABASE ATURAN ELITE MATCHMAKING (HONOR OF KINGS)
// ============================================================================
const ELITE_DB = {
    metadata: {
        title: "Honor of Kings - Elite Matchmaking & Peak Tournament Rules",
        description: "Panduan aturan antrean Ranked level tinggi (Draft Pick) dan mode kompetitif khusus."
    },

    ranked_draft_mode: {
        unlocked_at: "Tier Diamond V (atau jika bermain party dengan teman tier Diamond)",
        mechanics: [
            {
                rule: "Lane Pre-selection (Preferensi Jalur)",
                detail: "Sebelum memulai pencarian match, pemain disarankan memilih 2 preferensi Lane utama (Misal: Mid Lane / Clash Lane). Sistem akan berusaha mencocokkan Anda dengan pemain yang preferensi role-nya berbeda untuk menghindari perebutan."
            },
            {
                rule: "Sistem Banned (Pemblokiran Hero)",
                detail: "Pemain dapat melakukan Ban terhadap hero tertentu agar tidak bisa dipakai oleh kedua tim. Total ban biasanya 3 hingga 4 hero per tim (tergantung pembaruan patch)."
            },
            {
                rule: "Syarat Minimal Hero (Hero Pool)",
                detail: "Pemain WAJIB memiliki minimal 12 hingga 16 hero yang sudah terbuka (termasuk hero gratisan) untuk bisa bermain di mode Draft. Hal ini untuk mencegah skenario di mana semua hero pemain habis di-Ban atau di-Pick orang lain."
            }
        ],
        bot_advice: "Di mode Draft, fleksibilitas adalah kunci. Jangan cuma bisa main satu role! Minimal kuasai 1 Mage, 1 Marksman, dan 1 Roamer agar tidak jadi beban tim."
    },

    peak_tournament: {
        name: "Turnamen Puncak (Peak Tournament)",
        unlocked_at: "Telah mencapai Tier Master/Grandmaster di Season saat ini.",
        mechanics: [
            {
                rule: "100% Solo Player",
                detail: "Mode ini HANYA bisa dimainkan secara Solo. Anda tidak bisa mengundang teman untuk Party."
            },
            {
                rule: "Identitas Disembunyikan (Anonymous)",
                detail: "Untuk mencegah praktik kecurangan (Win-trading), nama semua pemain akan disembunyikan dan diganti menjadi 'Pemain 1', 'Pemain 2', dst. Nama asli baru akan terbuka setelah match selesai."
            },
            {
                rule: "Jadwal Terbatas",
                detail: "Peak Tournament tidak buka 24 jam. Biasanya hanya dibuka pada slot waktu kompetitif (Contoh: Jam 18:00 WIB hingga 24:00 WIB)."
            },
            {
                rule: "Peak Points & Hero Power Ekstra",
                detail: "Kemenangan di mode ini tidak memberikan Bintang Ranked, melainkan memberikan 'Peak Points'. Semakin tinggi Peak Points Anda, batas maksimal 'Hero Power' Anda akan dinaikkan secara drastis! Ini adalah jalur utama untuk mendapatkan gelar Nasional (Supreme)."
            }
        ]
    },

    dodge_system: {
        name: "Sistem Dodge (Batal Match Otomatis)",
        condition: "Jika dalam satu tim terdapat 4 atau 5 pemain yang memilih preferensi role yang sama secara paksa (misalnya 4 orang berebut hero Mage), sistem akan memicu fitur 'Dodge'.",
        effect: "Pertandingan akan otomatis dibatalkan tanpa mengurangi Bintang, dan semua pemain akan dikembalikan ke lobi utama."
    }
};

async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 35] Memulai Eksekusi: Info Aturan Antrean Elite");
    console.log("🛠️  Metode: Static Elite Rules Injector");
    console.log("==================================================");

    const processedFolder = path.join(__dirname, '../../../data/processed/id');
    const outPath = path.join(processedFolder, 'elite_matchmaking.json');

    // Buat folder jika belum ada
    if (!fs.existsSync(processedFolder)) fs.mkdirSync(processedFolder, { recursive: true });

    try {
        console.log(`📦 [INFO] Menyuntikkan Aturan Kompetitif: Draft Pick, Pre-selection, & Peak Tournament...`);
        
        fs.writeFileSync(outPath, JSON.stringify(ELITE_DB, null, 2));

        console.log(`✅ [BINGO] Data Aturan Antrean Elite berhasil dikonfigurasi.`);

        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Fase 35 Selesai! Bot kini paham standar pro player! 🎟️`);
        console.log(`💾 File tersimpan di: data/processed/id/elite_matchmaking.json`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
    }
}

module.exports = { execute };