const fs = require('fs');
const path = require('path');

/**
 * 🤝 FASE 43: SISTEM INTIMASI & HUBUNGAN (INTIMACY SYSTEM)
 * Lokasi: src/scrapers/05_integration_ai/43_getIntimacySystem.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur Utama: Menyuntikkan database aturan hubungan pemain (Lovers, Bros, dll),
 * cara mendapatkan poin intimasi, dan keuntungan seperti Shared Heroes.
 */

// ============================================================================
// 🧠 DATABASE SISTEM INTIMASI & SOSIAL (HONOR OF KINGS)
// ============================================================================
const INTIMACY_DB = {
    metadata: {
        title: "Honor of Kings - Intimacy & Relationship System",
        description: "Panduan sistem sosial, jenis hubungan, pengumpulan poin, dan hadiah keintiman antar pemain."
    },

    relationship_types: [
        {
            id: "lovers",
            name: "Lovers (Kekasih)",
            max_partners: 1,
            description: "Hubungan romantis. Hanya bisa memiliki 1 partner. Menampilkan ikon hati (Hati Merah/Pink) di loading screen."
        },
        {
            id: "bros",
            name: "Bros (Saudara/Brodi)",
            max_partners: 5,
            description: "Hubungan persaudaraan kuat. Cocok untuk teman mabar laki-laki. Menampilkan ikon kepalan tangan (Fist Bump)."
        },
        {
            id: "besties",
            name: "Besties (Sahabat)",
            max_partners: 5,
            description: "Hubungan persahabatan sejati. Menampilkan ikon kelinci/ikon persahabatan yang imut."
        },
        {
            id: "buddies",
            name: "Buddies (Teman Dekat)",
            max_partners: 5,
            description: "Hubungan pertemanan solid. Menampilkan ikon daun semanggi (Clover)."
        }
    ],

    intimacy_points: {
        how_to_earn: [
            "Bermain Normal Match bersama (+3 Poin per match).",
            "Bermain Ranked Match bersama (+6 Poin per match).",
            "Mengirim Koin Emas harian (+2 Poin).",
            "Memberikan item Intimasi dari Backpack (seperti Mawar/Roses, Cincin) memberikan poin instan dalam jumlah besar (Tergantung jenis item)."
        ],
        weekly_limit: "Poin intimasi yang didapat dari bermain mabar dibatasi maksimal 140 Poin per minggu (batas ini tidak berlaku untuk pemberian item Intimasi seperti Mawar)."
    },

    privileges_and_rewards: [
        {
            level: "Level 1 (100 Poin)",
            reward: "Membuka status Hubungan. Ikon hubungan akan mulai muncul di Profil dan Loading Screen saat bermain bersama."
        },
        {
            level: "Level 2 (600 Poin)",
            reward: "Shared Heroes (Berbagi Hero): Kamu bisa menggunakan semua Hero yang dimiliki oleh partnermu (Hanya berlaku di Normal Match, TIDAK berlaku di Ranked)."
        },
        {
            level: "Level 3 (1200 Poin)",
            reward: "Membuka Voice Lines interaksi khusus saat berada di dalam match dan animasi khusus saat melakukan respawn/recall bersama."
        },
        {
            level: "Level 4 (2000 Poin)",
            reward: "Peningkatan visual ikon Hubungan (menjadi lebih menyala/ada efek sayap) di Loading Screen."
        },
        {
            level: "Level 5+ (3000+ Poin)",
            reward: "Mendapatkan bingkai avatar eksklusif dan efek nama di lobi."
        }
    ],

    bot_advice: [
        "Tips: Kalau mau nyoba hero yang belum kamu punya sebelum beli, mabar aja sama teman yang Intimasinya udah Level 2 (Shared Heroes) di mode Classic!",
        "Hati-hati, jika kamu menghapus (Delete) pertemanan dengan partnermu, seluruh poin intimasi akan di-reset menjadi 0 dan status hubungan akan hancur."
    ]
};

async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 43] Memulai Eksekusi: Sistem Intimasi & Hubungan");
    console.log("🛠️  Metode: Static Social System Injector");
    console.log("==================================================");

    const processedFolder = path.join(__dirname, '../../../data/processed/id');
    const outPath = path.join(processedFolder, 'intimacy_system.json');

    if (!fs.existsSync(processedFolder)) fs.mkdirSync(processedFolder, { recursive: true });

    try {
        console.log(`📦 [INFO] Menyuntikkan Data Sosial: Lovers, Bros, Poin Intimasi, & Shared Heroes...`);
        
        fs.writeFileSync(outPath, JSON.stringify(INTIMACY_DB, null, 2));

        console.log(`✅ [BINGO] Data Sistem Intimasi berhasil dikemas.`);

        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Fase 43 Selesai! Bot siap jadi Mak Comblang Discord! 🤝`);
        console.log(`💾 File tersimpan di: data/processed/id/intimacy_system.json`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
    }
}

module.exports = { execute };