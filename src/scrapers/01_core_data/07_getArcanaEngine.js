const fs = require('fs');
const path = require('path');

/**
 * 🧩 FASE 07: LOGIKA OPTIMASI & ATRIBUT CAP ARCANA
 * Lokasi: src/scrapers/01_core_data/07_getArcanaEngine.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur Utama: 
 * 1. Regex Text-to-Math Parser (Mengubah string stat menjadi angka kalkulasi).
 * 2. Max Cap Calculator Engine (Menemukan kombinasi 30 Arcana terbaik untuk tiap atribut).
 */

function logToDatabase(level, message) {
    const logPath = path.join(__dirname, '../../../logs/error.log');
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}\n`;
    if (!fs.existsSync(path.dirname(logPath))) fs.mkdirSync(path.dirname(logPath), { recursive: true });
    fs.appendFileSync(logPath, logEntry);
}

// ============================================================================
// 🧠 FUNGSI 1: REGEX PARSER (STRING TO MATH)
// ============================================================================
function parseStatString(statString) {
    // Regex untuk memecah "+1.6% Critical Rate" atau "+3.2 Physical Attack"
    const regex = /^\+([0-9.]+)(%?)\s+(.*)$/;
    const match = statString.trim().match(regex);
    
    if (!match) return null;

    return {
        value: parseFloat(match[1]),
        is_percent: match[2] === '%',
        attribute: match[3].trim()
    };
}

// ============================================================================
// 🚀 FUNGSI UTAMA: EKSEKUSI ENGINE
// ============================================================================
async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 07] Memulai Eksekusi: Arcana Math Engine");
    console.log("==================================================");

    const arcanaDbPath = path.join(__dirname, '../../../data/processed/en/arcana.json');
    const outputPath = path.join(__dirname, '../../../data/processed/en/arcana_engine.json');

    if (!fs.existsSync(arcanaDbPath)) {
        console.error("❌ [ERROR] arcana.json tidak ditemukan! Harap jalankan Fase 00 terlebih dahulu.");
        return;
    }

    try {
        console.log("📖 [READ] Memuat Master Database Arcana...");
        const rawArcana = JSON.parse(fs.readFileSync(arcanaDbPath, 'utf8'));
        
        const engineData = {
            dictionary: {},
            max_caps: {},
            categories: { red: [], blue: [], green: [] }
        };

        const allAttributes = new Set();

        // ---------------------------------------------------------
        // 🔬 PROSES 1: PARSING MATEMATIKA & KATEGORISASI
        // ---------------------------------------------------------
        for (const [id, data] of Object.entries(rawArcana)) {
            const parsedStats = [];
            
            data.stats.forEach(statStr => {
                const parsed = parseStatString(statStr);
                if (parsed) {
                    parsedStats.push(parsed);
                    allAttributes.add(parsed.attribute); // Kumpulkan semua tipe atribut yang ada di game
                }
            });

            const enrichedArcana = {
                id: id,
                name: data.name,
                raw_stats: data.stats,
                math_stats: parsedStats
            };

            engineData.dictionary[id] = enrichedArcana;

            // Masukkan ke kategori warna untuk kalkulasi Cap nanti
            if (id.startsWith('red_')) engineData.categories.red.push(enrichedArcana);
            else if (id.startsWith('blue_')) engineData.categories.blue.push(enrichedArcana);
            else if (id.startsWith('green_')) engineData.categories.green.push(enrichedArcana);
        }

        console.log(`✅ [PARSED] Berhasil mengekstrak ${allAttributes.size} jenis atribut unik dari Arcana.`);

        // ---------------------------------------------------------
        // 🧮 PROSES 2: KALKULASI THEORETICAL MAX CAPS (30 SLOTS)
        // ---------------------------------------------------------
        console.log("⚙️ [CALC] Menghitung Maximum Caps & Kombinasi Terbaik per Atribut...");

        for (const attr of allAttributes) {
            let maxRed = 0, maxBlue = 0, maxGreen = 0;
            let isPercent = false;
            let bestRed = null, bestBlue = null, bestGreen = null;

            // Cari yang paling besar di Merah
            engineData.categories.red.forEach(arcana => {
                const stat = arcana.math_stats.find(s => s.attribute === attr);
                if (stat && stat.value > maxRed) {
                    maxRed = stat.value;
                    isPercent = stat.is_percent;
                    bestRed = arcana.name;
                }
            });

            // Cari yang paling besar di Biru
            engineData.categories.blue.forEach(arcana => {
                const stat = arcana.math_stats.find(s => s.attribute === attr);
                if (stat && stat.value > maxBlue) {
                    maxBlue = stat.value;
                    isPercent = stat.is_percent;
                    bestBlue = arcana.name;
                }
            });

            // Cari yang paling besar di Hijau
            engineData.categories.green.forEach(arcana => {
                const stat = arcana.math_stats.find(s => s.attribute === attr);
                if (stat && stat.value > maxGreen) {
                    maxGreen = stat.value;
                    isPercent = stat.is_percent;
                    bestGreen = arcana.name;
                }
            });

            // Kalkulasi Total (Setiap warna maskimal 10 slot)
            const totalValue = ((maxRed * 10) + (maxBlue * 10) + (maxGreen * 10));

            // Simpan ke Max Caps Database
            engineData.max_caps[attr] = {
                max_value: parseFloat(totalValue.toFixed(1)), // Fix presisi float JS
                is_percent: isPercent,
                formatted_cap: `+${parseFloat(totalValue.toFixed(1))}${isPercent ? '%' : ''} ${attr}`,
                best_combo: {
                    red: bestRed ? `10x ${bestRed} (+${parseFloat((maxRed * 10).toFixed(1))}${isPercent ? '%' : ''})` : null,
                    blue: bestBlue ? `10x ${bestBlue} (+${parseFloat((maxBlue * 10).toFixed(1))}${isPercent ? '%' : ''})` : null,
                    green: bestGreen ? `10x ${bestGreen} (+${parseFloat((maxGreen * 10).toFixed(1))}${isPercent ? '%' : ''})` : null
                }
            };
        }

        // Hapus array kategori temporer agar JSON akhir rapi
        delete engineData.categories;

        // ---------------------------------------------------------
        // 💾 PROSES 3: SIMPAN ENGINE
        // ---------------------------------------------------------
        fs.writeFileSync(outputPath, JSON.stringify(engineData, null, 2));

        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Arcana Math Engine Selesai!`);
        console.log(`💾 File "arcana_engine.json" telah dibuat.`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
        logToDatabase('ERROR', `[FASE 07] ${error.message}`);
    }
}

module.exports = { execute };