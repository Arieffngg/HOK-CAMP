const fs = require('fs');
const path = require('path');

/**
 * 📉 FASE 24: ANALISIS VALUE SUBSKRIPSI (ROI CALCULATOR)
 * Lokasi: src/scrapers/03_economics/24_getEconomyInflation.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur Utama: Menyuntikkan database statis tentang Return on Investment (ROI)
 * untuk Honor Pass (Battle Pass) dan kartu bulanan.
 */

// ============================================================================
// 🧠 DATABASE ROI & SUBSKRIPSI (HONOR OF KINGS)
// ============================================================================
const ROI_DB = {
    metadata: {
        title: "Honor of Kings - Subscription ROI & Value Analysis",
        description: "Panduan valuasi untuk Honor Pass dan paket hemat. Berguna untuk menjawab pertanyaan 'Worth it nggak beli ini?'."
    },

    honor_pass: {
        description: "Sistem Battle Pass musiman (Season) di Honor of Kings.",
        tiers: [
            {
                name: "Basic Honor Pass",
                price: "388 Tokens",
                estimated_value: "Sekitar 4.000+ Tokens",
                roi_percentage: "1000%+",
                rewards: [
                    "1 Skin Eksklusif Level 1 (Brave Tier)",
                    "1 Skin Eksklusif Level 50 (Epic Tier)",
                    "1 Skin Tambahan dari Chest (Brave/Epic)",
                    "Hero Choice Chest",
                    "Ratusan Token/Voucher Diskon",
                    "Efek Eliminasi & Recall Eksklusif"
                ],
                bot_advice: "Basic Honor Pass adalah INVESASI TERBAIK di Honor of Kings! Kalau kamu cuma punya budget kecil, wajib prioritaskan beli ini setiap season (asal kamu rajin main sampai level 50)."
            },
            {
                name: "Premium Honor Pass",
                price: "988 Tokens",
                estimated_value: "Sekitar 4.500+ Tokens",
                roi_percentage: "450%",
                rewards: [
                    "Semua hadiah dari Basic Honor Pass",
                    "Langsung naik 30 Level instan",
                    "Avatar Frame Animasi Eksklusif",
                    "Bonus Honor Pass EXP mingguan"
                ],
                bot_advice: "Hanya disarankan untuk pemain 'Sultan' yang SIBUK dan tidak punya waktu untuk grinding level dari 0. Secara value (ROI), Basic Pass jauh lebih hemat."
            }
        ]
    },

    monthly_weekly_cards: [
        {
            name: "Weekly Card (Kartu Mingguan)",
            price: "Sekitar Rp 15.000",
            mechanics: "Mendapat sejumlah Token langsung, lalu harus login tiap hari selama 7 hari untuk mengklaim sisa token dan hadiah ekstra.",
            roi_percentage: "200% - 300%",
            bot_advice: "Cocok banget buat nyicil tabungan Token pelan-pelan kalau target kamu beli skin Epic bulan depan."
        }
    ],

    financial_tips: [
        "Jangan PERNAH menggunakan Token (uang asli) untuk membeli Starstones (uang gratisan) atau EXP Card. Itu adalah pemborosan terbesar.",
        "Skin Honor Pass Level 50 tidak akan bisa dibeli di Shop biasa setelah season berakhir. Jika terlewat, harus menunggu event Gacha Vault yang sangat mahal.",
        "Pastikan kamu mencapai Level 50 sebelum season berakhir. Jika kamu beli Pass di akhir season tapi levelmu masih belasan, kamu akan sangat rugi!"
    ]
};

async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 24] Memulai Eksekusi: Analisis Value Subskripsi");
    console.log("🛠️  Metode: Static ROI Economics Injector");
    console.log("==================================================");

    const processedFolder = path.join(__dirname, '../../../data/processed/id');
    const outPath = path.join(processedFolder, 'economy_roi.json');

    // Buat folder jika belum ada
    if (!fs.existsSync(processedFolder)) fs.mkdirSync(processedFolder, { recursive: true });

    try {
        console.log(`📦 [INFO] Menyuntikkan Data Valuasi: ROI Honor Pass, Harga, & Tips Finansial...`);
        
        fs.writeFileSync(outPath, JSON.stringify(ROI_DB, null, 2));

        console.log(`✅ [BINGO] Data ROI berhasil disintesis.`);

        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Fase 24 Selesai! Bot siap merekomendasikan Honor Pass! 📉`);
        console.log(`💾 File tersimpan di: data/processed/id/economy_roi.json`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
    }
}

module.exports = { execute };