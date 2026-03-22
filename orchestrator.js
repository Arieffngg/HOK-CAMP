const fs = require('fs');
const path = require('path');

/**
 * 🎮 HOK CAMP - MASTER ORCHESTRATOR (5 PILLARS AUTO-SCANNER)
 * 👨‍💻 Tech Lead: Arief
 * Cara Penggunaan: Ubah angka ACTIVE_PHASE ("00" s/d "47") untuk menjalankan modul.
 */
const ACTIVE_PHASE = "47"; 

async function bootstrap() {
    console.log("=========================================");
    console.log("🚀 HOK CAMP - ORCHESTRATOR ENGINE");
    console.log(`🎯 Target Eksekusi: Fase ${ACTIVE_PHASE}`);
    console.log("=========================================\n");

    const scraperDir = path.join(__dirname, 'src/scrapers');
    let targetFilePath = null;

    try {
        const pillars = fs.readdirSync(scraperDir);
        for (const pillar of pillars) {
            const pillarPath = path.join(scraperDir, pillar);
            if (fs.statSync(pillarPath).isDirectory()) {
                const files = fs.readdirSync(pillarPath);
                // Cari file yang berawalan dengan nomor fase
                const found = files.find(file => file.startsWith(`${ACTIVE_PHASE}_`));
                
                if (found) {
                    targetFilePath = path.join(pillarPath, found);
                    break;
                }
            }
        }

        if (!targetFilePath) {
            console.error(`❌ ERROR: Modul Fase ${ACTIVE_PHASE} tidak ditemukan di sub-folder manapun!`);
            return;
        }

        const scraper = require(targetFilePath);
        if (typeof scraper.execute === 'function') {
            await scraper.execute();
        } else if (typeof scraper.executeSeeder === 'function') {
            await scraper.executeSeeder();
        } else {
            console.error(`❌ ERROR: Modul ${targetFilePath} tidak memiliki eksekusi valid.`);
        }

    } catch (error) {
        console.error("🚨 CRITICAL SYSTEM ERROR:");
        console.error(error.message);
    } finally {
        console.log("\n=========================================");
        console.log("🏁 Operasi Orchestrator Selesai.");
        console.log("=========================================");
    }
}

bootstrap();
