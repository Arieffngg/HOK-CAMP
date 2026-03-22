const fs = require('fs');
const path = require('path');

/**
 * 📈 FASE 29: MENDAPATKAN STATISTIK META DINAMIS (LOCAL FAST-COMPILER V3.0)
 * Lokasi: src/scrapers/04_strategic_iq/29_getMetaStats.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur Utama: 
 * Mengompilasi data meta_stats secara instan dari database lokal (Fase 02).
 * Menghapus ketergantungan pada Puppeteer untuk performa yang lebih stabil dan cepat.
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
    console.log("🟢 [FASE 29] Memulai Eksekusi: Meta Stats Compiler");
    console.log("🛠️  Metode: Local Fast-Compiler (V3.0)");
    console.log("==================================================");

    const detailsDir = path.join(__dirname, '../../../data/processed/id/hero_details');
    const processedFolder = path.join(__dirname, '../../../data/processed/id');
    const outPath = path.join(processedFolder, 'meta_stats.json');

    if (!fs.existsSync(processedFolder)) fs.mkdirSync(processedFolder, { recursive: true });

    try {
        if (!fs.existsSync(detailsDir)) {
            throw new Error("Folder hero_details tidak ditemukan. Harap jalankan Fase 02 terlebih dahulu!");
        }

        console.log("   💾 [READ] Membaca data statistik dari arsip detail pahlawan (Fase 02)...");
        const files = fs.readdirSync(detailsDir).filter(f => f.endsWith('.json'));
        const metaData = [];

        for (const file of files) {
            const heroData = JSON.parse(fs.readFileSync(path.join(detailsDir, file), 'utf8'));
            
            // Ekstrak meta_stats jika tersedia
            if (heroData.meta_stats) {
                metaData.push({
                    id: heroData.id,
                    name: heroData.name,
                    tier: heroData.meta_stats.tier || "Unknown",
                    win_rate: heroData.meta_stats.win_rate || "0%",
                    pick_rate: heroData.meta_stats.match_rate || "0%", // Match rate disesuaikan menjadi Pick Rate
                    ban_rate: heroData.meta_stats.ban_rate || "0%",
                    last_updated: new Date().toISOString()
                });
            }
        }

        if (metaData.length > 0) {
            // 📊 Sortir berdasarkan Win Rate tertinggi ke terendah
            metaData.sort((a, b) => parseFloat(b.win_rate) - parseFloat(a.win_rate));

            // Simpan ke meta_stats.json
            fs.writeFileSync(outPath, JSON.stringify({
                metadata: {
                    source: "Local Database Compilation (Fase 02)",
                    data_type: "Global Meta Stats",
                    total_heroes: metaData.length,
                    timestamp: new Date().toISOString()
                },
                heroes: metaData
            }, null, 2));

            console.log(`   ✅ [BINGO] Kompilasi lokal berhasil! ${metaData.length} hero diproses dalam sekejap.`);
            console.log(`   📈 TOP META: ${metaData[0].name} memimpin dengan Win Rate ${metaData[0].win_rate}!`);
            
            console.log(`\n==================================================`);
            console.log(`🏆 [SUCCESS] Fase 29 Selesai! Bot kini punya Radar Meta super cepat! 📈`);
            console.log(`💾 File tersimpan di: data/processed/id/meta_stats.json`);
            console.log(`==================================================`);
        } else {
            console.log(`   ⚠️ [WARN] Tidak ada data meta_stats yang ditemukan di dalam hero_details.`);
        }

    } catch (error) {
        console.error(`\n🚨 [COMPILER ERROR]: ${error.message}`);
        logToDatabase('ERROR', `[FASE 29 COMPILER] ${error.message}`);
    }
}

module.exports = { execute };