const fs = require('fs');
const path = require('path');

/**
 * 🌍 FASE 34: PANDUAN SISTEM POWER & MEDALI (REGIONAL MASTERY)
 * Lokasi: src/scrapers/04_strategic_iq/34_getRegionalMastery.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur Utama: Menyuntikkan aturan sistem Hero Power dan perolehan 
 * gelar kehormatan (Title: Kabupaten, Kota, Provinsi, Nasional).
 */

// ============================================================================
// 🧠 DATABASE SISTEM POWER & MEDALI (HONOR OF KINGS)
// ============================================================================
const MASTERY_DB = {
    metadata: {
        title: "Honor of Kings - Regional Mastery & Hero Power System",
        description: "Panduan kalkulasi Hero Power dan jadwal perolehan gelar (Title/Medali)."
    },

    title_tiers: [
        {
            tier: "Junior (Perunggu / Bronze)",
            scope: "Tingkat Kabupaten / Distrik",
            requirements: "Masuk Top 100 Hero Power di wilayah Kabupaten/Distrik Anda (Biasanya minimal 1.000 Power).",
            reset_schedule: "Dihitung dan dibagikan setiap hari Senin pagi."
        },
        {
            tier: "Intermediate (Perak / Silver)",
            scope: "Tingkat Kota",
            requirements: "Masuk Top 100 Hero Power di wilayah Kota Anda (Biasanya minimal 2.000 Power).",
            reset_schedule: "Dihitung dan dibagikan setiap hari Senin pagi."
        },
        {
            tier: "Advanced (Emas / Gold)",
            scope: "Tingkat Provinsi",
            requirements: "Masuk Top 100 Hero Power di wilayah Provinsi Anda (Biasanya minimal 3.000 Power).",
            reset_schedule: "Dihitung dan dibagikan setiap hari Senin pagi."
        },
        {
            tier: "Supreme (Nasional / Legendary)",
            scope: "Tingkat Negara (Nasional)",
            requirements: "Masuk Top 100 Hero Power di seluruh server Negara (Biasanya minimal 4.000 Power).",
            reset_schedule: "Dihitung dan dibagikan setiap Tanggal 1 setiap bulannya."
        }
    ],

    power_mechanics: {
        win_loss_impact: "Menang dalam Ranked/Peak Match akan menambah Hero Power, kalah akan mengurangi. Semakin tinggi rank musuh dan semakin baik performa Anda (Skor KDA/MVP), semakin besar Power yang didapat.",
        peak_power_limits: [
            { rank: "Diamond", max_power: "Maksimal perolehan power dari match dibatasi sekitar 2000 - 2500. Jika sudah mentok, kemenangan tidak akan menambah power lagi." },
            { rank: "Master", max_power: "Maksimal perolehan power dibatasi sekitar 3000 - 4000." },
            { rank: "Grandmaster / Mythic", max_power: "Batas power terbuka jauh lebih tinggi. Wajib mencapai tier ini untuk bisa mengejar gelar Provinsi atau Nasional." }
        ],
        challenge_value: "Nilai pengaman. Jika Anda sering mendapat MVP atau menang berturut-turut, Anda mengumpulkan Challenge Value. Nilai ini bisa dikonversi menjadi Hero Power ekstra, dan menahan agar power Anda tidak turun drastis saat kalah."
    },

    bot_advice: [
        "Untuk mengejar gelar Provinsi atau Nasional, bermain Solo Rank terkadang lebih disarankan karena poin performa individu (MVP) lebih mudah didapat dibandingkan bermain Party berlima.",
        "Jangan spam satu hero terus-menerus jika Power Anda sudah mencapai 'Limit' di Rank Anda saat ini. Naikkan Rank (Bintang) Anda terlebih dahulu, baru lanjut push power lagi!",
        "Pastikan Anda mengaktifkan akses Lokasi (GPS) di dalam game setiap hari Senin untuk mendaftarkan diri Anda di papan peringkat wilayah."
    ]
};

async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 34] Memulai Eksekusi: Panduan Sistem Power & Medali");
    console.log("🛠️  Metode: Static Regional Mastery Injector");
    console.log("==================================================");

    const processedFolder = path.join(__dirname, '../../../data/processed/id');
    const outPath = path.join(processedFolder, 'regional_mastery.json');

    if (!fs.existsSync(processedFolder)) fs.mkdirSync(processedFolder, { recursive: true });

    try {
        console.log(`📦 [INFO] Menyuntikkan Logika Mastery: Tier Kabupaten s/d Nasional, Limit Power, dll...`);
        
        fs.writeFileSync(outPath, JSON.stringify(MASTERY_DB, null, 2));

        console.log(`✅ [BINGO] Aturan Sistem Power dan Medali berhasil dikonfigurasi.`);

        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Fase 34 Selesai! Bot kini paham gelar kehormatan (Title)! 🌍`);
        console.log(`💾 File tersimpan di: data/processed/id/regional_mastery.json`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
    }
}

module.exports = { execute };