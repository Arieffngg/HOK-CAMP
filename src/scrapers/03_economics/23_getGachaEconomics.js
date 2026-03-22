const fs = require('fs');
const path = require('path');

/**
 * 🎰 FASE 23: EDUKASI MATEMATIKA GACHA (PITY & PROBABILITY)
 * Lokasi: src/scrapers/03_economics/23_getGachaEconomics.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur Utama: Menyuntikkan database statis tentang probabilitas gacha, 
 * sistem Pity, dan estimasi biaya maksimal untuk Honor Crystal & Limited Draw.
 */

// ============================================================================
// 🧠 DATABASE MATEMATIKA GACHA (HONOR OF KINGS)
// ============================================================================
const GACHA_DB = {
    metadata: {
        title: "Honor of Kings - Gacha Economics & Pity System",
        description: "Panduan probabilitas, sistem pity, dan estimasi biaya gacha untuk referensi bot agar pemain tidak kalap."
    },

    gacha_types: [
        {
            id: "point_draw",
            name: "Point Draw (Magic Draw / Honor Crystal)",
            currency_used: "Honor Points / Tokens",
            cost_per_draw: "60 Tokens (1x) / 270 Tokens (5x)",
            pity_system: "Pasti mendapatkan Honor Crystal pada tarikan (draw) ke-361 jika belum dapat sebelumnya.",
            estimated_max_cost: "Sekitar 19.500 Tokens (Tanpa diskon)",
            bot_advice: "Jangan gacha Point Draw kalau budget pas-pasan, kecuali pas lagi event diskon (200 Tokens untuk 5x draw)! Honor Crystal nggak bakal kabur ke mana-mana."
        },
        {
            id: "limited_skin_draw",
            name: "Limited Event Draw (Kolaborasi / Skin Kasta Tertinggi)",
            currency_used: "Event Tokens / Tokens",
            cost_per_draw: "Bervariasi (Biasanya 50-60 Tokens per 1x)",
            pity_system: "Menggunakan sistem 'Exchange Tokens' (Pity Token). Jika ampas (tidak hoki), pemain bisa menukarkan token event dengan skin utama di Exchange Store.",
            estimated_max_cost: "Tergantung event, biasanya butuh 3.000 - 6.000 Tokens (sekitar Rp 700.000 - Rp 1.500.000) untuk menebus (redeem) skin utama dari Pity Token.",
            bot_advice: "Gacha event limited itu kejam! Kalau tabungan token kamu nggak cukup buat nebus di Exchange Store (Pity), lebih baik jangan gacha sama sekali biar tokennya nggak hangus sia-sia."
        },
        {
            id: "diamond_draw",
            name: "Diamond Draw",
            currency_used: "Diamonds",
            cost_per_draw: "60 Diamonds (1x) / 270 Diamonds (5x)",
            pity_system: "Pasti mendapatkan King's Crystal pada tarikan ke-201.",
            estimated_max_cost: "10.800 Diamonds",
            bot_advice: "Gacha ini 100% gratis! Rajin-rajin main Ranked dan selesaikan misi harian buat kumpulin Diamond."
        }
    ],

    general_rules: [
        {
            rule: "Gambler's Fallacy (Ilusi Penjudi)",
            detail: "Peluang mendapatkan hadiah utama sebelum mencapai Pity sangatlah kecil (biasanya di bawah 1%). Jangan berharap 'hoki satu kali tarikan', selalu siapkan budget maksimal untuk mencapai Pity."
        },
        {
            rule: "Daily Single Pull Discount",
            detail: "Beberapa event gacha memberikan diskon untuk 1x tarikan pertama setiap harinya (misal: dari 60 token menjadi 10 token). Manfaatkan ini untuk menyicil Pity dengan sangat hemat."
        }
    ]
};

async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 23] Memulai Eksekusi: Edukasi Matematika Gacha");
    console.log("🛠️  Metode: Static Gacha Probability Injector");
    console.log("==================================================");

    const processedFolder = path.join(__dirname, '../../../data/processed/id');
    const outPath = path.join(processedFolder, 'gacha_economics.json');

    // Buat folder jika belum ada
    if (!fs.existsSync(processedFolder)) fs.mkdirSync(processedFolder, { recursive: true });

    try {
        console.log(`📦 [INFO] Menyuntikkan Data Gacha: Pity System, Estimasi Biaya, & Probabilitas...`);
        
        fs.writeFileSync(outPath, JSON.stringify(GACHA_DB, null, 2));

        console.log(`✅ [BINGO] Data Matematika Gacha berhasil disintesis.`);

        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Fase 23 Selesai! Bot siap jadi penasihat Gacha! 🎰`);
        console.log(`💾 File tersimpan di: data/processed/id/gacha_economics.json`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
    }
}

module.exports = { execute };