const fs = require('fs');
const path = require('path');

/**
 * 💰 FASE 12: KALKULASI EFISIENSI GOLD ITEM (THEORYCRAFTING ENGINE)
 * Lokasi: src/scrapers/02_game_intelligence/12_getItemEfficiency.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur Utama: Algoritma penentu nilai tukar Gold terhadap Stat (Gold per Stat),
 * serta kalkulator efisiensi harga vs stat (Gold Efficiency %).
 */

function logToDatabase(level, message) {
    const logPath = path.join(__dirname, '../../../logs/error.log');
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}\n`;
    if (!fs.existsSync(path.dirname(logPath))) fs.mkdirSync(path.dirname(logPath), { recursive: true });
    fs.appendFileSync(logPath, logEntry);
}

// 🧮 HARGA DASAR STAT (DIAMBIL DARI ITEM TIER 1)
// Harga 1 Unit Stat = Harga Item Dasar / Jumlah Stat yang Diberikan
const BASE_STAT_VALUES = {
    "Physical Attack": 275 / 20,        // Iron Sword (13.75 Gold per 1 PA)
    "Attack Speed (%)": 300 / 10,       // Dagger (30.00 Gold per 1% AS)
    "Movement Speed (%)": 300 / 5,      // Plume of Enchantment (60.00 Gold per 1% MS)
    "Max Health": 300 / 300,            // Resilient Agate (1.00 Gold per 1 HP)
    "Physical Lifesteal (%)": 300 / 8,  // Vampiric Scythe (37.50 Gold per 1% PL)
    "Critical Rate (%)": 300 / 8,       // Pugilist's Gauntlet (37.50 Gold per 1% Crit)
    "Cooldown Reduction (%)": 300 / 5,  // Primordial Crystal (60.00 Gold per 1% CDR)
    "Physical Defense": 275 / 100,      // Cloth Jerkin (2.75 Gold per 1 PD)
    "Magical Defense": 275 / 100,       // Anti-magic Cloak (2.75 Gold per 1 MD)
    "Max Mana": 275 / 400,              // Sparkling Sapphire (0.6875 Gold per 1 Mana)
    "Magical Attack": 275 / 35,         // Spell Tome (7.857 Gold per 1 MA)
    "Magical Lifesteal (%)": 300 / 8,   // Mystic Page (37.50 Gold per 1% ML)
    "Movement Speed": 250 / 30          // Lightfoot Shoes (8.333 Gold per 1 MS Flat)
};

// 🧹 FUNGSI PEMBACA STRING STAT
function parseStatString(statStr) {
    // Regex menangkap "+20 Physical Attack" atau "+10% Attack Speed"
    const regex = /^\+?([0-9.]+)(%?)\s+(.*)$/i;
    const match = statStr.trim().match(regex);
    
    if (!match) return null;

    let value = parseFloat(match[1]);
    let isPercent = match[2] === '%';
    let attribute = match[3].trim();

    // Normalisasi nama atribut agar cocok dengan BASE_STAT_VALUES
    if (isPercent) {
        attribute = `${attribute} (%)`;
    }

    return { value, attribute, isPercent };
}

async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 12] Memulai Eksekusi: Item Gold Efficiency Engine");
    console.log("🛠️  Metode: MOBA Theorycrafting & Algoritma Nilai Tukar");
    console.log("==================================================");

    const itemsPath = path.join(__dirname, '../../../data/processed/en/items.json');
    const outPath = path.join(__dirname, '../../../data/processed/id/item_efficiency.json');

    if (!fs.existsSync(itemsPath)) {
        console.error("❌ [ERROR] File items.json tidak ditemukan! Harap jalankan Fase 00.");
        return;
    }

    try {
        console.log(`📦 [INFO] Memuat database perlengkapan (Equipment)...`);
        const itemsDB = JSON.parse(fs.readFileSync(itemsPath, 'utf8'));
        
        const efficiencyReport = {
            base_gold_values: BASE_STAT_VALUES,
            analyzed_items: []
        };

        for (const [id, item] of Object.entries(itemsDB)) {
            // Kita hanya menghitung efisiensi untuk item yang punya harga > 0 dan punya stats
            if (!item.price || !item.stats || item.stats.length === 0) continue;

            let totalStatValue = 0;
            const parsedStats = [];

            item.stats.forEach(statStr => {
                const parsed = parseStatString(statStr);
                if (parsed) {
                    const baseValue = BASE_STAT_VALUES[parsed.attribute];
                    if (baseValue) {
                        const goldValue = parsed.value * baseValue;
                        totalStatValue += goldValue;
                        parsedStats.push({
                            stat: statStr,
                            estimated_gold_value: Math.round(goldValue)
                        });
                    } else {
                        parsedStats.push({
                            stat: statStr,
                            estimated_gold_value: "Unquantifiable (Unique/Passive)"
                        });
                    }
                }
            });

            // Hitung persentase efisiensi
            // Rumus: (Total Nilai Stat / Harga Jual) * 100
            let efficiencyPercent = 0;
            if (totalStatValue > 0) {
                efficiencyPercent = (totalStatValue / item.price) * 100;
            }

            efficiencyReport.analyzed_items.push({
                item_id: id,
                name: item.name,
                tier: id.startsWith('t1_') ? 1 : (id.startsWith('base_') ? 2 : 3),
                price: item.price,
                total_stat_gold_value: Math.round(totalStatValue),
                efficiency_percentage: parseFloat(efficiencyPercent.toFixed(2)),
                stats_breakdown: parsedStats
            });
        }

        // Urutkan berdasarkan efisiensi tertinggi ke terendah
        efficiencyReport.analyzed_items.sort((a, b) => b.efficiency_percentage - a.efficiency_percentage);

        // Simpan Hasil
        fs.writeFileSync(outPath, JSON.stringify(efficiencyReport, null, 2));

        console.log(`\n✅ [BINGO] Kalkulasi Selesai! Mengaudit ${efficiencyReport.analyzed_items.length} Item.`);
        
        // Cerminan 3 Item Paling Efisien secara stats murni
        console.log(`\n🏆 TOP 3 ITEM PALING EFISIEN (Stat Murni tanpa menghitung Pasif):`);
        for (let i = 0; i < Math.min(3, efficiencyReport.analyzed_items.length); i++) {
            const it = efficiencyReport.analyzed_items[i];
            console.log(`   ${i+1}. ${it.name} - Harga: ${it.price}G | Nilai Stat: ${it.total_stat_gold_value}G | Efisiensi: ${it.efficiency_percentage}%`);
        }

        console.log(`\n⚠️ Note: Item dengan efisiensi di bawah 100% biasanya memiliki efek Pasif unik yang OP (tidak bisa diukur dengan Gold).`);

        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Fase 12 Selesai! Matriks Ekonomi Item tercipta.`);
        console.log(`💾 File tersimpan di: data/processed/id/item_efficiency.json`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
        logToDatabase('ERROR', `[FASE 12] ${error.message}`);
    }
}

module.exports = { execute };