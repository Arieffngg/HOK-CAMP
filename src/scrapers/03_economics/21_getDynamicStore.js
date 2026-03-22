const fs = require('fs');
const path = require('path');

/**
 * 🛒 FASE 21: KATALOG HARGA & TAG SKIN (STORE ECONOMICS)
 * Lokasi: src/scrapers/03_economics/21_getDynamicStore.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur Utama: Menyuntikkan database statis tentang mata uang in-game, 
 * hierarki kasta Skin (Tag), dan standar harga resminya dalam Tokens.
 */

// ============================================================================
// 🧠 DATABASE EKONOMI TOKO (HONOR OF KINGS)
// ============================================================================
const STORE_DB = {
    metadata: {
        title: "Honor of Kings - Store Economics & Skin Tiers",
        description: "Katalog mata uang, kasta skin (Tag), dan standar harga untuk referensi bot."
    },

    currencies: [
        {
            id: "tokens",
            name: "Tokens",
            type: "Premium (Berbayar)",
            description: "Mata uang utama yang didapatkan melalui Top-Up uang asli. Digunakan untuk membeli Skin, Honor Pass, dan Gacha."
        },
        {
            id: "limited_tokens",
            name: "Limited Tokens",
            type: "Premium (Event/Gratis)",
            description: "Versi gratis dari Tokens yang didapat dari event. Memiliki masa kedaluwarsa dan hanya bisa digunakan untuk membeli skin/hero langsung di Shop (tidak bisa untuk Gacha/Honor Pass)."
        },
        {
            id: "starstones",
            name: "Starstones",
            type: "Freemium (Grinding)",
            description: "Didapatkan dari bermain match, menyelesaikan misi harian, atau event. Digunakan untuk membeli Hero secara gratis."
        },
        {
            id: "diamonds",
            name: "Diamonds",
            type: "Freemium (Grinding/Event)",
            description: "Didapatkan dari pencapaian Ranked atau misi. Digunakan untuk Diamond Draw (Gacha gratis) atau membuka slot Arcana."
        }
    ],

    skin_tiers: [
        {
            tag: "Normal / Basic",
            standard_price: "288 Tokens",
            first_week_discount: "Tidak Ada",
            features: ["Perubahan model dasar (re-color atau modifikasi ringan).", "Tidak ada perubahan efek skill."],
            obtainable_via: ["Shop", "Skin Fragment Store (28 Fragments)"]
        },
        {
            tag: "Brave (Berani)",
            standard_price: "488 Tokens",
            first_week_discount: "60 Tokens (Sering diskon besar di awal rilis)",
            features: ["Perubahan model dan sedikit perubahan warna efek skill."],
            obtainable_via: ["Shop", "Skin Fragment Store (48 Fragments)"]
        },
        {
            tag: "Epic (Epik)",
            standard_price: "888 Tokens",
            first_week_discount: "710 Tokens (-20%)",
            features: ["Perubahan model drastis.", "Efek skill baru yang unik.", "Efek suara (SFX) baru.", "Voice lines baru."],
            obtainable_via: ["Shop", "Skin Fragment Store (88 Fragments - Hanya skin Epic klasik tertentu)"]
        },
        {
            tag: "Legend (Legenda)",
            standard_price: "1688 Tokens",
            first_week_discount: "1350 Tokens (-20%)",
            features: ["Semua fitur Epic.", "Efek Recall eksklusif.", "Animasi berjalan/standby eksklusif.", "Avatar frame / border profil khusus."],
            obtainable_via: ["Shop", "Tidak ada di Fragment Store"]
        },
        {
            tag: "Mythic (Mitos) / Honor Crystal",
            standard_price: "Gacha (Pity di 361 Tarikan)",
            estimated_cost: "Sekitar 15.000 - 20.000 Tokens (Tanpa diskon draw)",
            features: ["Skin kasta tertinggi.", "Animasi, model, efek, dan voice lines paling premium.", "Bisa memiliki dua form (mode) dalam in-game."],
            obtainable_via: ["Point Draw (Gacha Point) menggunakan Tokens/Honor Points untuk mendapatkan Honor Crystal."]
        },
        {
            tag: "Limited / Collab (Kolaborasi)",
            standard_price: "Bervariasi (Biasanya 888 - 1788 Tokens, atau Gacha Khusus)",
            first_week_discount: "Tergantung Event",
            features: ["Skin hasil kolaborasi dengan IP lain (seperti SNK, Saint Seiya, Bruce Lee, dll)."],
            obtainable_via: ["Hanya tersedia dalam rentang waktu event tertentu. Akan ditarik dari Shop setelah event selesai."]
        }
    ],

    general_rules: [
        {
            rule: "First Week Discount",
            detail: "Hampir semua skin Epic dan Legend baru yang dirilis langsung di Shop akan mendapatkan diskon 20% di minggu pertama peluncurannya."
        },
        {
            rule: "Hero Price Equivalency",
            detail: "Harga standar hero baru adalah 13.888 Starstones atau 588 Tokens. Ada juga hero yang berharga 18.888 Starstones atau 688 Tokens (biasanya hero yang mekaniknya lebih kompleks)."
        }
    ]
};

async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 21] Memulai Eksekusi: Katalog Harga & Tag Skin");
    console.log("🛠️  Metode: Static Store Economics Injector");
    console.log("==================================================");

    const processedFolder = path.join(__dirname, '../../../data/processed/id');
    const outPath = path.join(processedFolder, 'store_economics.json');

    // Buat folder jika belum ada
    if (!fs.existsSync(processedFolder)) fs.mkdirSync(processedFolder, { recursive: true });

    try {
        console.log(`📦 [INFO] Menyuntikkan Data Ekonomi: Kasta Skin, Harga Standar, & Mata Uang...`);
        
        fs.writeFileSync(outPath, JSON.stringify(STORE_DB, null, 2));

        console.log(`✅ [BINGO] Katalog Ekonomi Toko berhasil disintesis.`);

        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Fase 21 Selesai! Bot siap jadi kasir toko! 🛒`);
        console.log(`💾 File tersimpan di: data/processed/id/store_economics.json`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
    }
}

module.exports = { execute };