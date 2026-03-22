const fs = require('fs');
const path = require('path');

/**
 * 🗳️ FASE 33: MESIN VOTING TIER LIST KOMUNITAS
 * Lokasi: src/scrapers/04_strategic_iq/33_getCommunityTierList.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur Utama: Membangun struktur database interaktif untuk mencatat
 * dan mengalkulasi voting Tier List dari member Discord secara real-time.
 */

// ============================================================================
// 🧠 GENERATOR PAPAN SUARA (BALLOT BUILDER)
// ============================================================================
async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 33] Memulai Eksekusi: Mesin Voting Tier List");
    console.log("🛠️  Metode: Dynamic Community Database Builder");
    console.log("==================================================");

    const heroListPath = path.join(__dirname, '../../../data/processed/id/heroList.json');
    const processedFolder = path.join(__dirname, '../../../data/processed/id');
    const outPath = path.join(processedFolder, 'community_tier_list.json');

    // Buat folder jika belum ada
    if (!fs.existsSync(processedFolder)) fs.mkdirSync(processedFolder, { recursive: true });

    try {
        // 🛡️ Validasi keberadaan data Master Hero
        if (!fs.existsSync(heroListPath)) {
            throw new Error("Data heroList.json tidak ditemukan. Selesaikan Fase 01 terlebih dahulu.");
        }

        const heroes = JSON.parse(fs.readFileSync(heroListPath, 'utf8'));
        console.log(`📦 [INFO] Menginisialisasi Papan Suara (Ballot) untuk ${heroes.length} Pahlawan...`);

        // 📝 Struktur Dasar Papan Voting
        const TIER_BOARD = {
            metadata: {
                title: "Honor of Kings - Community Tier List",
                description: "Papan skor dinamis yang akan diupdate oleh interaksi member Discord.",
                last_updated: new Date().toISOString(),
                total_voters: 0
            },
            voting_rules: {
                allowed_tiers: ["S", "A", "B", "C", "D"],
                mechanic: "Member Discord menggunakan command '!vote [Nama Hero] [Tier]'. Sistem akan mengakumulasi suara dan menentukan 'current_tier' berdasarkan suara terbanyak (Majority Rule)."
            },
            heroes: {}
        };

        // ⚙️ Inisialisasi setiap hero dengan skor 0
        heroes.forEach(hero => {
            TIER_BOARD.heroes[hero.id] = {
                name: hero.name,
                role: hero.role,
                current_tier: "TBD", // To Be Determined (Belum Ditentukan)
                total_votes: 0,
                votes: {
                    "S": 0,
                    "A": 0,
                    "B": 0,
                    "C": 0,
                    "D": 0
                }
            };
        });

        // 💾 Simpan ke file JSON
        fs.writeFileSync(outPath, JSON.stringify(TIER_BOARD, null, 2));

        console.log(`✅ [BINGO] Papan Voting Komunitas berhasil disiapkan.`);

        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Fase 33 Selesai! Member Discord siap melakukan voting! 🗳️`);
        console.log(`💾 File tersimpan di: data/processed/id/community_tier_list.json`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
    }
}

module.exports = { execute };