const fs = require('fs');
const path = require('path');

/**
 * 💎 FASE 25: MATRIKS KASTA NOBILITY (VIP SYSTEM V2.1 - HOTFIX)
 * Lokasi: src/scrapers/03_economics/25_getNobilityTiers.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur Utama: Injeksi database statis kasta Nobility (V1-V10) yang sinkron dengan data in-game.
 * Perbaikan: Memperbaiki kesalahan sintaksis string literal dan struktur objek.
 */

// ============================================================================
// 🧠 DATABASE KASTA NOBILITY & VIP (HONOR OF KINGS - IN-GAME SYNC)
// ============================================================================
const NOBILITY_DB = {
    metadata: {
        version: "2.1",
        title: "Honor of Kings - Nobility (VIP) Tiers & Privileges",
        description: "Honor of Kings Nobility (VIP) Tiers, Token Requirements, Exact In-Game Rewards, and IDR Cost Estimation",
        last_updated: "2026-03-16T16:44:08.863Z",
        tax_note: "Estimasi biaya Rupiah (Rp) dihitung dengan rasio kasar 1 Token = Rp 265 dan belum termasuk pajak platform (PPN/App Store)."
    },
    
    mechanics: {
        conversion: "Sistem Nobility terdiri dari 10 Level. Status diperoleh dengan menghabiskan Token. Habiskan 1 Token untuk mendapatkan 1 Poin Nobility.",
        region_lock: "Kebangsawananmu hanya berlaku di Regionmu saat ini.",
        degradation: "Jika kamu belum memakai Token dalam bulan kalender berjalan, maka di akhir bulan, Level Kebangsawananmu akan turun 1 tingkat. Ini berlanjut sampai level 0.",
        restoration: "Setelah level turun, kamu bisa memakai Token dalam jumlah berapa pun (walau cuma 1 Token) untuk langsung memulihkan status tertinggimu sebelumnya.",
        hidden_status: "Pemain dapat menyembunyikan badge Nobility mereka melalui menu Pengaturan Privasi."
    },
    
    tiers: {
        "V1": {
            token_required: 10,
            estimated_idr_cost: "Rp 2.650",
            one_time_package: [
                "Kartu EXP Ganda 1 Kemenangan x1",
                "Kartu Trial Pop Star Wang Zhaojun (3 Hari)"
            ],
            weekly_benefits: [
                "Starstone x128",
                "Fragmen Arcana x10"
            ]
        },
        "V2": {
            token_required: 100,
            estimated_idr_cost: "Rp 26.500",
            one_time_package: [
                "Kartu EXP Ganda 4 Kemenangan x1",
                "Kartu Trial Pop Star Wang Zhaojun (5 Hari)"
            ],
            weekly_benefits: [
                "Starstone x188",
                "Fragmen Arcana x20"
            ]
        },
        "V3": {
            token_required: 500,
            estimated_idr_cost: "Rp 132.500",
            one_time_package: [
                "Kartu EXP Ganda 10 Kemenangan x1",
                "Kartu Trial Pop Star Wang Zhaojun (7 Hari)"
            ],
            weekly_benefits: [
                "Starstone x288",
                "Fragmen Arcana x40"
            ]
        },
        "V4": {
            token_required: 2000,
            estimated_idr_cost: "Rp 530.000",
            one_time_package: [
                "Skin Epic: Summer Daze (Xiang Yu)",
                "Starstone x388"
            ],
            weekly_benefits: [
                "Starstone x288",
                "Fragmen Arcana x50",
                "Diamond x50"
            ]
        },
        "V5": {
            token_required: 5000,
            estimated_idr_cost: "Rp 1.325.000",
            one_time_package: [
                "Skin Epic: Royal Admiral (Zilong)",
                "Starstone x588"
            ],
            weekly_benefits: [
                "Starstone x388",
                "Fragmen Arcana x70",
                "Diamond x60"
            ]
        },
        "V6": {
            token_required: 10000,
            estimated_idr_cost: "Rp 2.650.000",
            one_time_package: [
                "Skin Epic: Magician (Di Renjie)",
                "Starstone x888"
            ],
            weekly_benefits: [
                "Starstone x488",
                "Fragmen Arcana x80",
                "Diamond x70"
            ]
        },
        "V7": {
            token_required: 20000,
            estimated_idr_cost: "Rp 5.300.000",
            one_time_package: [
                "Fragmen Arcana x2.000",
                "Nobility Level 7 Exclusive Avatar Border"
            ],
            weekly_benefits: [
                "Starstone x488",
                "Fragmen Arcana x90",
                "Diamond x80"
            ]
        },
        "V8": {
            token_required: 50000,
            estimated_idr_cost: "Rp 13.250.000",
            one_time_package: [
                "Skin Legend Baru (Consort Yu)",
                "Fragmen Arcana x3.200",
                "Name Color V8"
            ],
            weekly_benefits: [
                "Starstone x488",
                "Fragmen Arcana x100",
                "Diamond x90"
            ]
        },
        "V9": {
            token_required: 100000,
            estimated_idr_cost: "Rp 26.500.000",
            one_time_package: [
                "Banner Profil Baru",
                "Fragmen Arcana x4.800",
                "Gold Chat Text"
            ],
            weekly_benefits: [
                "Starstone x488",
                "Fragmen Arcana x110",
                "Diamond x100"
            ]
        },
        "V10": {
            token_required: 188888,
            estimated_idr_cost: "Rp 50.055.320",
            one_time_package: [
                "Fragmen Arcana x6.400",
                "SKIN SHARING: Bisa meminjamkan skin koleksimu ke rekan satu tim saat party.",
                "Exclusive V10 Avatar Border & Badge"
            ],
            weekly_benefits: [
                "Starstone x488",
                "Fragmen Arcana x120",
                "Diamond x110"
            ]
        }
    },

    discord_bot_logic: {
        command_ideas: [
            "!vip 8 -> Bot menampilkan syarat pengeluaran 50.000 Token (~Rp 13,2 Juta) dan benefit skin Legend Consort Yu.",
            "!vip rewards -> Menampilkan gaji mingguan (Starstone/Diamond) berdasarkan kasta VIP."
        ]
    }
};

async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 25] Memulai Eksekusi: Matriks Kasta Nobility");
    console.log("🛠️  Metode: Static VIP Economics Injector (In-Game Sync V2.1)");
    console.log("==================================================");

    const processedFolder = path.join(__dirname, '../../../data/processed/id');
    const outPath = path.join(processedFolder, 'nobility_tiers.json');

    // Buat folder jika belum ada
    if (!fs.existsSync(processedFolder)) fs.mkdirSync(processedFolder, { recursive: true });

    try {
        console.log(`📦 [INFO] Menyuntikkan Data Nobility: Syarat V1 hingga V10 (Beserta Estimasi IDR)...`);
        
        fs.writeFileSync(outPath, JSON.stringify(NOBILITY_DB, null, 2));

        console.log(`✅ [BINGO] Data Matriks Nobility V2.1 berhasil disintesis.`);

        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Fase 25 Selesai! Bot siap mendeteksi para Sultan! 💎`);
        console.log(`💾 File tersimpan di: data/processed/id/nobility_tiers.json`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
    }
}

module.exports = { execute };