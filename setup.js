const fs = require('fs');
const path = require('path');

// ============================================================================
// 🏗️ HOK CAMP - PROJECT SCAFFOLDING GENERATOR (THE 5 PILLARS V4.2 - BUGFIX)
// 👨‍💻 Tech Lead: Arief
// Fix: Menghilangkan double-escaping pada generator Orchestrator agar
// variabel ACTIVE_PHASE terbaca dengan benar.
// ============================================================================

const DIRS = [
    'data/raw',
    'data/processed/en',
    'data/processed/id',
    'data/assets',
    'logs/screenshots',
    'src/config',
    'src/database',
    'src/logger',
    'src/scrapers/01_core_data',
    'src/scrapers/02_game_intelligence',
    'src/scrapers/03_economics',
    'src/scrapers/04_strategic_iq',
    'src/scrapers/05_integration_ai',
    'src/utils'
];

const UTILS = [
    { name: 'fetcher.js', desc: 'Pembungkus Puppeteer standar dengan rate-limit mematuhi etika' },
    { name: 'dataParser.js', desc: 'Pembersih teks/HTML & Regex Master' },
    { name: 'assetDownloader.js', desc: 'Engine untuk mengunduh asset dengan jeda waktu aman' },
    { name: 'apiInterceptor.js', desc: 'Penyadap respons XHR/JSON Network publik' },
    { name: 'i18nMerger.js', desc: 'Penggabung data EN dan ID untuk fitur multi-bahasa' },
    { name: 'mathEngine.js', desc: 'Engine matematika lokal untuk kalkulasi GPM, EV, dan Damage' }
];

const SCRAPERS = [
    // 🏛️ PILAR 1: CORE DATA
    { id: '00', name: '00_MasterSeeder.js', pillar: '01_core_data', emoji: '👑', title: 'FASE 00: MASTER DATABASE SEEDER', task: 'Single Source of Truth untuk Equipment, Arcana, & Spells.' },
    { id: '01', name: '01_getHeroList.js', pillar: '01_core_data', emoji: '🦸', title: 'FASE 01: MENDAPATKAN DAFTAR PAHLAWAN', task: 'Menavigasi profil H5, menyadap JSON, merapikannya.' },
    { id: '02', name: '02_getHeroDetail.js', pillar: '01_core_data', emoji: '🔍', title: 'FASE 02: MENDAPATKAN DETAIL PROFIL PAHLAWAN', task: 'Scraping data mentah dan ensiklopedia ringan.' },
    { id: '03', name: '03_getHeroGuides.js', pillar: '01_core_data', emoji: '🎒', title: 'FASE 03: MENDAPATKAN PANDUAN & BUILD PAHLAWAN', task: 'Ekstraksi data strategi (Presets).' },
    { id: '04', name: '04_getVoiceActors.js', pillar: '01_core_data', emoji: '🎙️', title: 'FASE 04: DATABASE PENGISI SUARA & KUTIPAN', task: 'Ekstraksi Voice Lines, Kloning instan.' },
    { id: '05', name: '05_getHeroLore.js', pillar: '01_core_data', emoji: '📖', title: 'FASE 05: DATABASE LORE & BIOGRAFI PAHLAWAN', task: 'Ekstraksi HTML murni dari DOM untuk narasi cerita.' },
    { id: '06', name: '06_getHeroAssets.js', pillar: '01_core_data', emoji: '🎨', title: 'FASE 06: DATABASE ASET VISUAL', task: 'Mengekstrak URL Avatar, Banner, Skin, dan Ikon Skill.' },
    { id: '07', name: '07_getArcanaEngine.js', pillar: '01_core_data', emoji: '🧩', title: 'FASE 07: LOGIKA OPTIMASI & ATRIBUT CAP ARCANA', task: 'Mengkalkulasi nilai maksimal Arcana.' },
    { id: '08', name: '08_getLoreTimeline.js', pillar: '01_core_data', emoji: '📜', title: 'FASE 08: ARSIP KRONOLOGI LORE RESMI', task: 'Sinkronisasi IP World, integrasi sistem VIP.' },
    { id: '09', name: '09_getMobaJargon.js', pillar: '01_core_data', emoji: '📖', title: 'FASE 09: ENSIKLOPEDIA KAMUS MOBA', task: 'Membangun kamus istilah kompetitif.' },

    // ⚙️ PILAR 2: GAME INTELLIGENCE
    { id: '10', name: '10_getMapEntities.js', pillar: '02_game_intelligence', emoji: '🐲', title: 'FASE 10: MASTER MAP ENTITIES INJECTOR', task: 'Injeksi data ekologi peta, Lanes, dan Match Phases.' },
    { id: '11', name: '11_getFrameData.js', pillar: '02_game_intelligence', emoji: '🎬', title: 'FASE 11: MATRIKS HITBOX & FRAME DATA SKILL', task: 'Ekstraksi metrik tempur secara masif.' },
    { id: '12', name: '12_getItemEfficiency.js', pillar: '02_game_intelligence', emoji: '💰', title: 'FASE 12: KALKULASI EFISIENSI GOLD ITEM', task: 'Menentukan nilai emas per status dasar.' },
    { id: '13', name: '13_getDamageCalc.js', pillar: '02_game_intelligence', emoji: '🧮', title: 'FASE 13: KALKULATOR DAMAGE & FORMULA ARMOR', task: 'Mendokumentasikan formula matematika in-game.' },
    { id: '14', name: '14_getFarmingMetrics.js', pillar: '02_game_intelligence', emoji: '💰', title: 'FASE 14: ANALISIS EFISIENSI FARMING BASELINE', task: 'Menyusun standar GPM global Role/Lane.' },
    { id: '15', name: '15_getRadarGraphs.js', pillar: '02_game_intelligence', emoji: '🕸️', title: 'FASE 15: BEDAH PARAMETER GRAFIK RADAR MATCH', task: 'Mendokumentasikan parameter Radar Chart.' },
    { id: '16', name: '16_getJungleRotations.js', pillar: '02_game_intelligence', emoji: '⏱️', title: 'FASE 16: INFOGRAFIS WAKTU ROTASI HUTAN', task: 'Mendokumentasikan waktu mutlak entitas hutan.' },
    { id: '17', name: '17_getWallDashMaps.js', pillar: '02_game_intelligence', emoji: '🗺️', title: 'FASE 17: PARAMETER DIMENSI PETA & OBJEKTIF', task: 'Mendokumentasikan Tower Range, Bush, Wall Dash.' },
    { id: '18', name: '18_getMVPParameters.js', pillar: '02_game_intelligence', emoji: '🏅', title: 'FASE 18: PARAMETER EVALUASI MVP RESMI', task: 'Mendokumentasikan algoritma skor MVP.' },
    { id: '19', name: '19_getStatusEffects.js', pillar: '02_game_intelligence', emoji: '🔮', title: 'FASE 19: KAMUS CROWD CONTROL & EFEK STATUS', task: 'Mendokumentasikan kasta CC dan interaksi.' },
    { id: '20', name: '20_getHiddenPassives.js', pillar: '02_game_intelligence', emoji: '🕵️', title: 'FASE 20: MATRIKS INTERAKSI RAHASIA HERO', task: 'Mendokumentasikan Easter Eggs antar hero.' },

    // 💰 PILAR 3: ECONOMICS
    { id: '21', name: '21_getDynamicStore.js', pillar: '03_economics', emoji: '🛒', title: 'FASE 21: KATALOG HARGA & TAG SKIN', task: 'Mendokumentasikan mata uang dan standar harga.' },
    { id: '22', name: '22_getPersonalOffers.js', pillar: '03_economics', emoji: '🎯', title: 'FASE 22: PENAWARAN EVENT DISKON PUBLIK', task: 'Mendokumentasikan mekanik diskon resmi.' },
    { id: '23', name: '23_getGachaEconomics.js', pillar: '03_economics', emoji: '🎰', title: 'FASE 23: EDUKASI MATEMATIKA GACHA', task: 'Mendokumentasikan probabilitas Gacha.' },
    { id: '24', name: '24_getEconomyInflation.js', pillar: '03_economics', emoji: '📉', title: 'FASE 24: ANALISIS VALUE SUBSKRIPSI', task: 'Mendokumentasikan ROI Honor Pass & Paket Hemat.' },
    { id: '25', name: '25_getNobilityTiers.js', pillar: '03_economics', emoji: '💎', title: 'FASE 25: MATRIKS KASTA NOBILITY', task: 'Mendokumentasikan syarat Token V1-V10.' },
    { id: '26', name: '26_getNobilityVault.js', pillar: '03_economics', emoji: '🎁', title: 'FASE 26: ETALASE HADIAH VIP PUBLIK', task: 'Mengkatalogkan skin eksklusif VIP.' },
    { id: '27', name: '27_getVIPSharingLimits.js', pillar: '03_economics', emoji: '🤝', title: 'FASE 27: ATURAN BERBAGI SKIN VIP', task: 'Mendokumentasikan syarat fitur Skin Sharing.' },
    { id: '28', name: '28_getTopUpMilestones.js', pillar: '03_economics', emoji: '💳', title: 'FASE 28: INFO EVENT AKUMULASI TOP-UP', task: 'Mendokumentasikan mekanik Recharge.' },

    // 🧠 PILAR 4: STRATEGIC IQ
    { id: '29', name: '29_getMetaStats.js', pillar: '04_strategic_iq', emoji: '📈', title: 'FASE 29: MENDAPATKAN STATISTIK META DINAMIS', task: 'Menyadap Live Win/Pick/Ban rate hero.' },
    { id: '30', name: '30_getHeroSynergy.js', pillar: '04_strategic_iq', emoji: '🤝', title: 'FASE 30: SINERGI MEKANIK & COUNTER HERO', task: 'Memetakan duo/trio dan counter hero.' },
    { id: '31', name: '31_getDraftSimulator.js', pillar: '04_strategic_iq', emoji: '🎲', title: 'FASE 31: PENGUMPULAN DATA SIMULASI DRAFT PICK', task: 'Membangun database Brain AI.' },
    { id: '32', name: '32_getPatchDiff.js', pillar: '04_strategic_iq', emoji: '⚖️', title: 'FASE 32: KOMPARASI PATCH NOTES', task: 'Ekstraksi histori pahlawan.' },
    { id: '33', name: '33_getCommunityTierList.js', pillar: '04_strategic_iq', emoji: '🗳️', title: 'FASE 33: MESIN VOTING TIER LIST KOMUNITAS', task: 'Menyusun Papan Tier List Discord.' },
    { id: '34', name: '34_getRegionalMastery.js', pillar: '04_strategic_iq', emoji: '🌍', title: 'FASE 34: PANDUAN SISTEM POWER & MEDALI', task: 'Rumus matematika Power Honor & Medali.' },
    { id: '35', name: '35_getEliteMatchmaking.js', pillar: '04_strategic_iq', emoji: '🎟️', title: 'FASE 35: INFO ATURAN ANTREAN ELITE', task: 'Aturan Lane Pre-selection & Privilese.' },
    { id: '36', name: '36_getStrategicIntelligence.js', pillar: '04_strategic_iq', emoji: '🧠', title: 'FASE 36: MATRIKS INTELIJEN STRATEGIS', task: 'Logic Tree dan Blueprint Macro.' },
    { id: '37', name: '37_getRankedEcosystem.js', pillar: '04_strategic_iq', emoji: '🌟', title: 'FASE 37: MATRIKS SISTEM RANKED', task: 'Hierarki Rank dan algoritma MMR.' },
    { id: '38', name: '38_getSentimentAlgos.js', pillar: '04_strategic_iq', emoji: '📊', title: 'FASE 38: MATRIKS POLLING & SENTIMEN', task: 'Template Polling interaktif.' },

    // 🤖 PILAR 5: INTEGRATION & AI
    { id: '39', name: '39_getPlayerProfile.js', pillar: '05_integration_ai', emoji: '🕵️‍♂️', title: 'FASE 39: MELACAK PROFIL PEMAIN PUBLIK', task: 'Ekstrak profil pemain via URL.' },
    { id: '40', name: '40_getInfra.js', pillar: '05_integration_ai', emoji: '🛡️', title: 'FASE 40: EKSTRAKSI STATUS SERVER', task: 'Status Web & API HoK.' },
    { id: '41', name: '41_getOfficialNews.js', pillar: '05_integration_ai', emoji: '📰', title: 'FASE 41: RELAI PENGUMUMAN RESMI', task: 'Deduplikasi berita dan event.' },
    { id: '42', name: '42_getTribunalHonor.js', pillar: '05_integration_ai', emoji: '⚖️', title: 'FASE 42: PANDUAN TRIBUNAL & REPUTASI', task: 'Credit Score & Pinalti.' },
    { id: '43', name: '43_getIntimacySystem.js', pillar: '05_integration_ai', emoji: '🤝', title: 'FASE 43: SISTEM INTIMASI & HUBUNGAN', task: 'Formula poin Bucin, Brodi, dll.' },
    { id: '44', name: '44_getHardwareMatrix.js', pillar: '05_integration_ai', emoji: '📱', title: 'FASE 44: HARDWARE & GRAFIS', task: 'Spek Minimum & Rekomendasi.' },
    { id: '45', name: '45_getServerTimers.js', pillar: '05_integration_ai', emoji: '⏰', title: 'FASE 45: JADWAL RESET SERVER', task: 'Waktu reset harian/mingguan.' },
    { id: '46', name: '46_getBanWaveIntel.js', pillar: '05_integration_ai', emoji: '🛡️', title: 'FASE 46: KAMUS KODE ERROR', task: 'Daftar kode error & pinalti anti-cheat.' },
    { id: '47', name: '47_getSystemMailbox.js', pillar: '05_integration_ai', emoji: '🧠', title: 'FASE 47: MESIN RAG & AI ENGINE', task: 'Knowledge Graph & System Prompt AI.' }
];

async function runSetup() {
    console.log("==================================================");
    console.log("🚀 MEMULAI PROSES SCAFFOLDING (THE 5 PILLARS V4.2)");
    console.log("==================================================\n");

    DIRS.forEach(dir => {
        const dirPath = path.join(__dirname, dir);
        if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
    });

    if (!fs.existsSync(path.join(__dirname, '.env'))) {
        fs.writeFileSync(path.join(__dirname, '.env'), `HOK_SESSION_ID=\nHOK_OPEN_ID=\nHOK_TOKEN=\n`);
    }

    UTILS.forEach(util => {
        const utilPath = path.join(__dirname, 'src/utils', util.name);
        if (!fs.existsSync(utilPath)) {
            const content = `/**\n * Tools: ${util.name}\n * Fungsi: ${util.desc}\n */\n\nmodule.exports = {};\n`;
            fs.writeFileSync(utilPath, content);
        }
    });

    let createdScrapers = 0;
    SCRAPERS.forEach(scraper => {
        const scraperPath = path.join(__dirname, 'src/scrapers', scraper.pillar, scraper.name);
        if (!fs.existsSync(scraperPath)) {
            const isSeeder = scraper.id === '00';
            const functionName = isSeeder ? 'executeSeeder' : 'execute';
            const content = `/**\n * ${scraper.emoji} ${scraper.title}\n * Lokasi: src/scrapers/${scraper.pillar}/${scraper.name}\n * 👨‍💻 Tech Lead: Arief\n * Tugas: ${scraper.task}\n */\n\nconst { launchBrowser, fetchPage } = require('../../utils/fetcher');\nconst fs = require('fs');\nconst path = require('path');\n\nasync function ${functionName}() {\n    console.log("==================================================");\n    console.log("🟢 Memulai Eksekusi: ${scraper.title}");\n    console.log("==================================================");\n    try {\n        // Tulis logika Anda di sini\n    } catch (error) {\n        console.error('❌ Gagal mengeksekusi ${scraper.name}:', error.message);\n    }\n}\n\nmodule.exports = { ${functionName} };\n`;
            fs.writeFileSync(scraperPath, content);
            createdScrapers++;
        }
    });

    // 🎯 GENERATOR ORCHESTRATOR (FIXED INTERPOLATION)
    const orchestratorPath = path.join(__dirname, 'orchestrator.js');
    if (!fs.existsSync(orchestratorPath)) {
        // Menggunakan single quote untuk membungkus kode agar tidak terjadi tabrakan template literal
        const orchContent = `const fs = require('fs');
const path = require('path');

/**
 * 🎮 HOK CAMP - MASTER ORCHESTRATOR (5 PILLARS AUTO-SCANNER)
 * 👨‍💻 Tech Lead: Arief
 * Cara Penggunaan: Ubah angka ACTIVE_PHASE ("00" s/d "47") untuk menjalankan modul.
 */
const ACTIVE_PHASE = "01"; 

async function bootstrap() {
    console.log("=========================================");
    console.log("🚀 HOK CAMP - ORCHESTRATOR ENGINE");
    console.log(\`🎯 Target Eksekusi: Fase \${ACTIVE_PHASE}\`);
    console.log("=========================================\\n");

    const scraperDir = path.join(__dirname, 'src/scrapers');
    let targetFilePath = null;

    try {
        const pillars = fs.readdirSync(scraperDir);
        for (const pillar of pillars) {
            const pillarPath = path.join(scraperDir, pillar);
            if (fs.statSync(pillarPath).isDirectory()) {
                const files = fs.readdirSync(pillarPath);
                // Cari file yang berawalan dengan nomor fase
                const found = files.find(file => file.startsWith(\`\${ACTIVE_PHASE}_\`));
                
                if (found) {
                    targetFilePath = path.join(pillarPath, found);
                    break;
                }
            }
        }

        if (!targetFilePath) {
            console.error(\`❌ ERROR: Modul Fase \${ACTIVE_PHASE} tidak ditemukan di sub-folder manapun!\`);
            return;
        }

        const scraper = require(targetFilePath);
        if (typeof scraper.execute === 'function') {
            await scraper.execute();
        } else if (typeof scraper.executeSeeder === 'function') {
            await scraper.executeSeeder();
        } else {
            console.error(\`❌ ERROR: Modul \${targetFilePath} tidak memiliki eksekusi valid.\`);
        }

    } catch (error) {
        console.error("🚨 CRITICAL SYSTEM ERROR:");
        console.error(error.message);
    } finally {
        console.log("\\n=========================================");
        console.log("🏁 Operasi Orchestrator Selesai.");
        console.log("=========================================");
    }
}

bootstrap();
`;
        fs.writeFileSync(orchestratorPath, orchContent);
    }

    console.log(`\n🏆 SETUP SELESAI! Silakan jalankan 'node orchestrator.js'`);
}

runSetup();