const fs = require('fs');
const path = require('path');

/**
 * 🌟 FASE 37: MATRIKS SISTEM RANKED (RANKED ECOSYSTEM)
 * Lokasi: src/scrapers/04_strategic_iq/37_getRankedEcosystem.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur Utama: Database statis hierarki Ranked, perhitungan Bintang, 
 * Brave Points (Poin Keberanian), dan batasan Party Matchmaking.
 */

// ============================================================================
// 🧠 DATABASE EKOSISTEM RANKED (HONOR OF KINGS)
// ============================================================================
const RANKED_DB = {
    metadata: {
        title: "Honor of Kings - Ranked System & Ecosystem Matrix",
        description: "Panduan hierarki kasta (Tier), sistem bintang, dan mekanisme perlindungan rank."
    },

    tier_hierarchy: [
        { rank: "Bronze (Perunggu)", subdivisions: 3, stars_per_div: 3, draft_mode: false },
        { rank: "Silver (Perak)", subdivisions: 3, stars_per_div: 3, draft_mode: false },
        { rank: "Gold (Emas)", subdivisions: 4, stars_per_div: 4, draft_mode: false },
        { rank: "Platinum", subdivisions: 4, stars_per_div: 4, draft_mode: false },
        { rank: "Diamond (Berlian)", subdivisions: 5, stars_per_div: 5, draft_mode: true, notes: "Fase Ban & Pick dimulai dari sini." },
        { rank: "Master", subdivisions: 5, stars_per_div: 5, draft_mode: true },
        { rank: "Grandmaster (Raja)", subdivisions: "Tidak Terbatas", stars_per_div: "Bintang (+0 hingga +24)", draft_mode: true },
        { rank: "Mythic (Mitos)", subdivisions: "Pencapaian Khusus", stars_per_div: "Bintang (+25 hingga +49)", draft_mode: true },
        { rank: "Epic (Epik)", subdivisions: "Pencapaian Khusus", stars_per_div: "Bintang (+50 hingga +99)", draft_mode: true },
        { rank: "Legend (Legenda)", subdivisions: "Pencapaian Mutlak", stars_per_div: "Bintang (+100 atau lebih)", draft_mode: true }
    ],

    brave_points_system: {
        name: "Poin Keberanian (Brave Points)",
        mechanics: [
            {
                type: "Tier Protection (Perlindungan Bintang)",
                description: "Jika Anda kalah dalam pertandingan Ranked, sistem akan secara otomatis mengurangi sejumlah Poin Keberanian Anda UNTUK MENCEGAH bintang Anda berkurang. Batas poin yang dibutuhkan berbeda-beda tiap Tier (semakin tinggi Tier, semakin mahal)."
            },
            {
                type: "Extra Star (Bintang Tambahan)",
                description: "Jika Bar Poin Keberanian Anda sudah penuh (MAX) dan Anda memenangkan pertandingan, Anda akan mendapatkan BINTANG TAMBAHAN (Total dapat 2 bintang sekali menang). Bar poin kemudian akan direset."
            }
        ],
        sources_of_points: [
            "Menyelesaikan pertandingan tanpa AFK/Pelanggaran.",
            "Mendapatkan rentetan kemenangan (Win Streak).",
            "Mendapatkan medali Gold, Silver, MVP, atau SVP.",
            "Poin Kompensasi (Jika ada rekan satu tim yang AFK atau melakukan feeding secara sengaja)."
        ]
    },

    party_restrictions: {
        description: "Aturan pembatasan tier untuk bermain bersama (Party) di Mode Ranked.",
        rules: [
            "Pemain hanya bisa mengundang teman yang tier-nya 1 tingkat di bawah, setara, atau 1 tingkat di atasnya.",
            "Contoh: Pemain Platinum bisa Party dengan Gold dan Diamond, tapi TIDAK BISA dengan Silver atau Master.",
            "Pemain Grandmaster ke atas memiliki perhitungan Party berbasis jumlah Bintang (Maksimal selisih 25 Bintang jika ingin Party 5 orang, atau 50 Bintang dalam kondisi tertentu)."
        ]
    },

    season_reset: {
        rule: "Penurunan Rank Awal Musim (Season Drop)",
        description: "Setiap pergantian musim (sekitar 3 bulan sekali), rank pemain akan diturunkan (Soft Reset). Semakin tinggi rank Anda, semakin jauh penurunannya.",
        example: "Pemain Grandmaster biasanya akan diturunkan kembali ke Diamond, sedangkan pemain Diamond akan turun ke Platinum."
    }
};

async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 37] Memulai Eksekusi: Matriks Sistem Ranked");
    console.log("🛠️  Metode: Static Ranked Ecosystem Injector");
    console.log("==================================================");

    const processedFolder = path.join(__dirname, '../../../data/processed/id');
    const outPath = path.join(processedFolder, 'ranked_ecosystem.json');

    if (!fs.existsSync(processedFolder)) fs.mkdirSync(processedFolder, { recursive: true });

    try {
        console.log(`📦 [INFO] Menyuntikkan Data Ranked: Kasta, Brave Points, & Aturan Party...`);
        
        fs.writeFileSync(outPath, JSON.stringify(RANKED_DB, null, 2));

        console.log(`✅ [BINGO] Data Ekosistem Ranked berhasil dikemas.`);

        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Fase 37 Selesai! Bot kini paham kasta pemain! 🌟`);
        console.log(`💾 File tersimpan di: data/processed/id/ranked_ecosystem.json`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
    }
}

module.exports = { execute };