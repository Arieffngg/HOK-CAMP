const fs = require('fs');
const path = require('path');

/**
 * 🎯 FASE 22: PENAWARAN & EVENT DISKON PUBLIK
 * Lokasi: src/scrapers/03_economics/22_getPersonalOffers.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur Utama: Menyuntikkan database statis tentang mekanik event diskon, 
 * Secret Shop, dan strategi hemat (Low-Spender) di Honor of Kings.
 */

// ============================================================================
// 🧠 DATABASE EVENT DISKON & PENAWARAN (HONOR OF KINGS)
// ============================================================================
const OFFERS_DB = {
    metadata: {
        title: "Honor of Kings - Discount Events & Special Offers Guide",
        description: "Panduan mutlak mengenai mekanik diskon, Secret Shop, dan penawaran waktu terbatas."
    },

    recurring_events: [
        {
            id: "secret_shop",
            name: "Secret Shop (Toko Misteri)",
            frequency: "Jarang (Biasanya saat event besar / perayaan khusus)",
            mechanics: [
                "Pemain akan diberikan kesempatan mengundi angka diskon secara acak (Biasanya 50%, 60%, atau 70%).",
                "Diskon tersebut akan berlaku untuk daftar skin dan hero eksklusif yang ada di dalam Secret Shop masing-masing pemain.",
                "Terdapat kuota pembelian (misal: hanya bisa membeli maksimal 3-5 item menggunakan harga diskon tersebut)."
            ],
            bot_advice: "Kalau dapet diskon 50% atau 60% di Secret Shop dan ada skin Hero *main* kamu, WAJIB sikat! Ini diskon paling besar di game."
        },
        {
            id: "first_week_discount",
            name: "Diskon Rilis Minggu Pertama (First Week Discount)",
            frequency: "Setiap ada Skin/Hero baru rilis",
            mechanics: [
                "Setiap skin kasta Epic atau Legend yang dijual langsung di Shop (Bukan Gacha) akan mendapat diskon flat sebesar 20% pada 7 hari pertama rilis.",
                "Skin Epic: 888 Tokens ➡️ 710 Tokens.",
                "Skin Legend: 1688 Tokens ➡️ 1350 Tokens."
            ],
            bot_advice: "Punya incaran skin baru? Jangan ditunda! Kalau lewat minggu pertama, kamu harus bayar harga normal (rugi ratusan token)."
        },
        {
            id: "fragment_store_rotation",
            name: "Rotasi Fragment Store",
            frequency: "Dua Minggu Sekali (Biasanya hari Selasa/Kamis)",
            mechanics: [
                "Toko yang memungkinkan pemain menukar Skin Fragments atau Hero Fragments dengan Hero/Skin permanen tanpa harus mengeluarkan Tokens (Gratis).",
                "Skin yang masuk rotasi biasanya kasta Normal (28 Frag) hingga Epic Klasik tertentu (88 Frag).",
                "Tidak semua skin Epic bisa masuk ke Fragment Store."
            ],
            bot_advice: "Jangan sembarangan pakai Skin Fragment buat beli skin normal! Tabung sampai 88 Fragment buat ditukar sama Skin Epic kalau pas lagi rotasi."
        }
    ],

    special_offers: [
        {
            id: "new_player_bundle",
            name: "Paket Pemain Baru (Beginner's Offer)",
            availability: "Satu kali per akun (Saat baru buat akun)",
            mechanics: "Penawaran top-up pertama dengan nominal sangat kecil (sekitar Rp 15.000) yang memberikan hadiah Hero permanen (misal: Zhao Yun/Mulan) dan beberapa item bonus.",
            value_rating: "Sangat Tinggi (Must Buy untuk Low-Spender)"
        },
        {
            id: "monthly_cards",
            name: "Kartu Bulanan (Weekly/Monthly Pass)",
            availability: "Bisa dibeli berulang kali",
            mechanics: "Membayar di muka untuk mendapatkan sedikit token instan, lalu login setiap hari untuk mengambil token tambahan. Total token yang didapat jauh lebih banyak daripada top-up biasa dengan harga yang sama.",
            value_rating: "Tinggi (Cocok untuk pemain sabar yang sering login)"
        }
    ],

    discount_coupons: {
        description: "Kupon yang bisa digunakan saat *checkout* di Shop.",
        rules: [
            "Kupon Diskon (misal: Potongan 50 Token) BISA digabungkan dengan Diskon Minggu Pertama.",
            "Kupon TIDAK BISA digunakan untuk skin Gacha, Honor Pass, atau Secret Shop.",
            "Kupon memiliki masa kedaluwarsa, pastikan untuk mengecek batas waktunya di Inventory."
        ]
    }
};

async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 22] Memulai Eksekusi: Penawaran & Event Diskon Publik");
    console.log("🛠️  Metode: Static Discount Mechanics Injector");
    console.log("==================================================");

    const processedFolder = path.join(__dirname, '../../../data/processed/id');
    const outPath = path.join(processedFolder, 'discount_offers.json');

    if (!fs.existsSync(processedFolder)) fs.mkdirSync(processedFolder, { recursive: true });

    try {
        console.log(`📦 [INFO] Menyuntikkan Data Promo: Secret Shop, Fragment Store, & Diskon Kupon...`);
        
        fs.writeFileSync(outPath, JSON.stringify(OFFERS_DB, null, 2));

        console.log(`✅ [BINGO] Data Mekanik Diskon berhasil disintesis.`);

        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Fase 22 Selesai! Bot kini paham cara hemat (F2P/Low-Spender)! 🎯`);
        console.log(`💾 File tersimpan di: data/processed/id/discount_offers.json`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
    }
}

module.exports = { execute };