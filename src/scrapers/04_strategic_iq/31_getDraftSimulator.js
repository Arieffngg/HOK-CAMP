const fs = require('fs');
const path = require('path');

/**
 * 🎲 FASE 31: PENGUMPULAN DATA SIMULASI DRAFT PICK
 * Lokasi: src/scrapers/04_strategic_iq/31_getDraftSimulator.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur Utama: Membangun 'Brain AI' untuk Draft Pick. Berisi aturan Ban, 
 * First Pick yang aman (Blind Pick), Flex Pick, dan fase drafting.
 */

// ============================================================================
// 🧠 DATABASE BRAIN AI DRAFT PICK (HONOR OF KINGS)
// ============================================================================
const DRAFT_DB = {
    metadata: {
        title: "Honor of Kings - Draft Pick Simulator & Brain AI",
        description: "Knowledge base untuk bot memandu pemain saat fase Ban & Pick di Ranked/Turnamen."
    },
    
    draft_phases: [
        { 
            phase: "Ban Phase 1 (Fase Ban Awal)", 
            action: "Masing-masing tim melakukan 2 Ban bergantian.", 
            bot_tip: "Ban hero Meta S-Tier yang terlalu OP (seperti Augran, Dolia, Da Qiao) atau hero yang menjadi Hard Counter dari rencana strategi tim Anda." 
        },
        { 
            phase: "Pick Phase 1 (Fase Pick Awal)", 
            action: "Tim A (First Pick) memilih 1 hero. Tim B memilih 2 hero. Tim A memilih 2 hero. Tim B memilih 1 hero.", 
            bot_tip: "Gunakan First Pick (B1) untuk mengambil hero Power Pick/Meta yang terlepas dari Ban. Tim B (R1/R2) harus segera merespons dengan mengambil hero kunci untuk kombo tim mereka." 
        },
        { 
            phase: "Ban Phase 2 (Fase Ban Kedua)", 
            action: "Masing-masing tim melakukan 2 Ban bergantian.", 
            bot_tip: "Gunakan 'Respect Ban' atau 'Target Ban' ke arah role musuh yang belum terisi (Misal: Jungler musuh belum pick, maka ban hero Jungler andalan mereka)." 
        },
        { 
            phase: "Pick Phase 2 (Fase Pick Terakhir)", 
            action: "Tim B memilih 1 hero. Tim A memilih 2 hero. Tim B memilih 1 hero (Last Pick).", 
            bot_tip: "Gunakan Last Pick (R5) untuk 'Counter Pick' telak! Hero yang di-pick terakhir tidak akan bisa di-counter lagi oleh musuh." 
        }
    ],

    pick_priorities: {
        first_picks_blind_safe: [
            { 
                role: "Clash Lane", 
                heroes: ["Dun", "Sun Ce", "Mayene", "Biron"], 
                reason: "Sangat kuat menahan lane sendirian (sustain), sulit di-gank, dan memiliki impact teamfight yang stabil terlepas dari apa musuhnya." 
            },
            { 
                role: "Mid Lane", 
                heroes: ["Wang Zhaojun", "Mai Shiranui", "Lady Zhen"], 
                reason: "Clear minion wave sangat cepat dari jarak aman dan memiliki skill CC area yang pasti berguna di setiap situasi." 
            },
            { 
                role: "Roamer", 
                heroes: ["Zhang Fei", "Yaria", "Donghuang"], 
                reason: "Hero utilitas murni yang bisa masuk ke hampir semua jenis komposisi tim (Fleksibel)." 
            }
        ],
        flex_picks: [
            { 
                hero: "Dun", 
                roles: ["Clash Lane", "Jungler"], 
                advantage: "Membuat musuh kebingungan saat fase Draft. Musuh mengira Dun akan di Clash Lane dan mencoba me-counter-nya, padahal Dun dimainkan sebagai Jungler tebal." 
            },
            { 
                hero: "Dharma", 
                roles: ["Clash Lane", "Jungler"], 
                advantage: "Sama fleksibelnya, kuat di duel 1v1 di lane maupun mengamankan objektif monster di hutan." 
            },
            { 
                hero: "Liang", 
                roles: ["Mid Lane", "Roamer"], 
                advantage: "Bisa menjadi damage dealer pendukung di mid, atau full support CC/Roamer untuk me-lock hero lincah lawan secara absolut." 
            }
        ]
    },

    draft_syndrome: [
        { 
            error_name: "Full Physical / No Magic Damage", 
            consequence: "Jika tim Anda tidak memiliki Mage, tim musuh hanya perlu menumpuk item Physical Defense (Ominous Premonition/Spikemail) dan tim Anda tidak akan bisa menembus armor mereka." 
        },
        { 
            error_name: "No Hard CC / No Frontliner", 
            consequence: "Jika tim Anda terlalu banyak hero tipis (Assassin/Mage/Marksman) tanpa Tank/Roamer tebal, tim akan mudah diacak-acak dan kesulitan membuka Vision saat ingin mengamankan Lord/Tyrant." 
        },
        { 
            error_name: "Too Many Late Game Heroes", 
            consequence: "Memilih Li Xin, Hou Yi, dan Diaochan di satu tim. Tim akan sangat lemah di 10 menit pertama. Hutan akan diinvasi habis-habisan dan game bisa selesai sebelum hero kalian sempat 'jadi'." 
        }
    ]
};

async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 31] Memulai Eksekusi: Data Simulasi Draft Pick");
    console.log("🛠️  Metode: Draft AI Rules Injector");
    console.log("==================================================");

    const processedFolder = path.join(__dirname, '../../../data/processed/id');
    const outPath = path.join(processedFolder, 'draft_simulator.json');

    if (!fs.existsSync(processedFolder)) fs.mkdirSync(processedFolder, { recursive: true });

    try {
        console.log(`📦 [INFO] Menyuntikkan Logika Brain AI: Fase Ban/Pick, Flex Pick, & Blind Pick...`);
        
        fs.writeFileSync(outPath, JSON.stringify(DRAFT_DB, null, 2));

        console.log(`✅ [BINGO] Aturan Draft Simulator berhasil dikonfigurasi.`);

        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Fase 31 Selesai! Otak AI Draft Pick siap beraksi! 🎲`);
        console.log(`💾 File tersimpan di: data/processed/id/draft_simulator.json`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
    }
}

module.exports = { execute };