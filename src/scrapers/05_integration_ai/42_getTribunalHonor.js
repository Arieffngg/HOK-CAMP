const fs = require('fs');
const path = require('path');

/**
 * ⚖️ FASE 42: PANDUAN TRIBUNAL & REPUTASI (CREDIT SCORE SYSTEM)
 * Lokasi: src/scrapers/05_integration_ai/42_getTribunalHonor.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur Utama: Menyuntikkan database statis tentang aturan Credit Score, 
 * pinalti (AFK/Feeding/Toxic), dan cara memulihkan reputasi akun.
 */

// ============================================================================
// 🧠 DATABASE TRIBUNAL & SKOR KREDIT (HONOR OF KINGS)
// ============================================================================
const TRIBUNAL_DB = {
    metadata: {
        title: "Honor of Kings - Tribunal & Credit Score Guide",
        description: "Panduan resmi mengenai sistem reputasi pemain, sanksi pelanggaran, dan pemulihan skor kredit."
    },

    credit_score_system: {
        max_score: 100,
        starting_score: 100,
        tiers: [
            {
                score_range: "90 - 100",
                status: "Sangat Baik",
                privileges: "Bisa bermain di semua mode (Ranked, Peak Tournament). Mendapat bonus batas perolehan Gold harian."
            },
            {
                score_range: "80 - 89",
                status: "Peringatan",
                privileges: "BISA main Ranked, TAPI dilarang mengikuti Peak Tournament."
            },
            {
                score_range: "60 - 79",
                status: "Buruk",
                privileges: "DILARANG bermain Ranked dan Peak Tournament. Hanya bisa main mode Normal/Quick Match."
            },
            {
                score_range: "0 - 59",
                status: "Sangat Buruk",
                privileges: "DILARANG bermain mode PvP apapun (Ranked maupun Normal). HANYA bisa bermain melawan Bot (AI) untuk memulihkan skor."
            }
        ]
    },

    violations_and_penalties: [
        {
            offense: "AFK (Away From Keyboard) / Keluar Game",
            penalty: "Pengurangan 2 hingga 8 Poin Kredit (tergantung durasi AFK dan mode).",
            detail: "Sistem akan mendeteksi otomatis. Jika AFK lebih dari 3 menit di Ranked, poin akan dipotong drastis dan pemain tidak akan mendapatkan Bintang meskipun timnya menang."
        },
        {
            offense: "Intentional Feeding (Sengaja Mati)",
            penalty: "Pengurangan 3 hingga 6 Poin Kredit.",
            detail: "Mati berulang kali ke tower musuh secara sengaja tanpa memberikan perlawanan/damage."
        },
        {
            offense: "Toxic / Verbal Abuse",
            penalty: "Mute (Bungkam) sistem 24 jam s/d 7 hari + Pengurangan 2 Poin Kredit.",
            detail: "Menggunakan kata-kata kasar di chat. HOK memiliki filter kata kotor yang sangat ketat."
        },
        {
            offense: "Pencurian Peran (Role Stealing) di Draft Pick",
            penalty: "Pengurangan 1 hingga 3 Poin Kredit.",
            detail: "Memaksa memilih hero Jungler saat rekan tim lain sudah mengunci peran tersebut melalui sistem Lane Pre-selection."
        }
    ],

    recovery_guide: {
        daily_limit: "Pemain hanya bisa memulihkan MAKSIMAL 3 hingga 5 Poin Kredit per hari (tergantung level hukuman).",
        methods: [
            "Menyelesaikan 1 pertandingan Normal/Ranked tanpa pelanggaran (+1 Poin).",
            "Menyelesaikan pertandingan Human VS AI tanpa pelanggaran (Jika skor di bawah 80)."
        ],
        bot_advice: "Kena pinalti AFK gara-gara sinyal putus? Jangan langsung maksa push rank lagi! Main mode VS Bot (AI) dulu 2-3 kali buat nge-reset sistem deteksi dan mulihin poin kredit pelan-pelan."
    }
};

async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 42] Memulai Eksekusi: Panduan Tribunal & Reputasi");
    console.log("🛠️  Metode: Static Credit Score Injector");
    console.log("==================================================");

    const processedFolder = path.join(__dirname, '../../../data/processed/id');
    const outPath = path.join(processedFolder, 'tribunal_honor.json');

    // Buat folder jika belum ada
    if (!fs.existsSync(processedFolder)) fs.mkdirSync(processedFolder, { recursive: true });

    try {
        console.log(`📦 [INFO] Menyuntikkan Buku Hukum HOK: Pinalti AFK, Feeding, & Pemulihan Skor...`);
        
        fs.writeFileSync(outPath, JSON.stringify(TRIBUNAL_DB, null, 2));

        console.log(`✅ [BINGO] Data Tribunal & Skor Kredit berhasil disintesis.`);

        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Fase 42 Selesai! Bot resmi menjadi Polisi Discord! ⚖️`);
        console.log(`💾 File tersimpan di: data/processed/id/tribunal_honor.json`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
    }
}

module.exports = { execute };