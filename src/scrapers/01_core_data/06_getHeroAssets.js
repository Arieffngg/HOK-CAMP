const fs = require('fs');
const path = require('path');

/**
 * 🎨 FASE 06: DATABASE ASET VISUAL (LOCAL SYNERGY V6.2)
 * Lokasi: src/scrapers/01_core_data/06_getHeroAssets.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur: Integrasi Data Lokal (Visuals Cover/Icon & Skills).
 * Catatan: Fitur ekstraksi "Skin Gallery" ditangguhkan dan dipisah ke fase khusus.
 */

function logToDatabase(level, message) {
    const logPath = path.join(__dirname, '../../../logs/error.log');
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}\n`;
    if (!fs.existsSync(path.dirname(logPath))) fs.mkdirSync(path.dirname(logPath), { recursive: true });
    fs.appendFileSync(logPath, logEntry);
}

async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 06] Memulai Eksekusi: Visual Assets Integrator");
    console.log("🛠️  Metode: Local JSON Synergy (Super Cepat v6.2)");
    console.log("==================================================");

    const CLEAN_SLATE_MODE = false; 

    const heroListPath = path.join(__dirname, '../../../data/processed/id/heroList.json');
    const processedDetailsDir = path.join(__dirname, '../../../data/processed/id/hero_details');
    const assetsFolder = path.join(__dirname, '../../../data/processed/id/hero_assets');
    
    if (!fs.existsSync(assetsFolder)) fs.mkdirSync(assetsFolder, { recursive: true });
    if (!fs.existsSync(heroListPath)) {
        console.error("❌ [ERROR] heroList.json tidak ditemukan!");
        return;
    }

    const heroes = JSON.parse(fs.readFileSync(heroListPath, 'utf8'));
    let successCount = 0;

    try {
        console.log("📦 [DATABASE] Memulai kompilasi aset visual dari arsip lokal...");

        for (const targetHero of heroes) {
            const outPath = path.join(assetsFolder, `${targetHero.id}.json`);
            const localProcPath = path.join(processedDetailsDir, `${targetHero.id}.json`);

            // 📡 DELTA RADAR
            if (!CLEAN_SLATE_MODE && fs.existsSync(outPath)) {
                // Opsional: Lompati jika sudah ada (bisa dimatikan jika ingin resync)
                // console.log(`   ⏭️ [RADAR SKIP] Aset ${targetHero.name} sudah tersimpan.`);
                // continue;
            }

            // 📂 1. AMBIL DATA LOKAL (Visuals & Skills dari Fase 02 Processed)
            let visualData = { icon: "", cover: "", world_icon: "" };
            let skillIcons = [];
            
            if (fs.existsSync(localProcPath)) {
                const procData = JSON.parse(fs.readFileSync(localProcPath, 'utf8'));
                if (procData.visuals) {
                    visualData = procData.visuals;
                }
                skillIcons = procData.skills || [];
            }

            // 💾 2. SIMPAN HASIL KOMPILASI
            const finalAssets = {
                hero_id: targetHero.id,
                hero_name: targetHero.name,
                visuals: visualData,
                skill_icons: skillIcons.map(s => ({ name: s.name, type: s.type, icon: s.icon }))
            };

            fs.writeFileSync(outPath, JSON.stringify(finalAssets, null, 2));
            console.log(`   ✅ [COMPILED] ${targetHero.name} -> Cover diamankan & ${skillIcons.length} Skills.`);
            successCount++;
        }

        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Fase 06 Selesai! ${successCount} Pahlawan berhasil diintegrasikan.`);
        console.log(`💾 Data tersimpan di: data/processed/id/hero_assets/`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
        logToDatabase('ERROR', `[FASE 06] ${error.message}`);
    }
}

module.exports = { execute };