const fs = require('fs');
const path = require('path');

/**
 * 🎒 FASE 03: PENGOLAHAN PANDUAN & BUILD PAHLAWAN (ITEM, ARCANA, SPELLS)
 * Lokasi: src/scrapers/01_core_data/03_getHeroGuides.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur: Deep Validator Parser (Fase 02 Raw), Multi-Layer Strategy Search.
 */

function logToDatabase(level, message) {
    const logPath = path.join(__dirname, '../../../logs/error.log');
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}\n`;
    if (!fs.existsSync(path.dirname(logPath))) fs.mkdirSync(path.dirname(logPath), { recursive: true });
    fs.appendFileSync(logPath, logEntry);
}

// ============================================================================
// 🧠 RADAR VALIDATOR (Mencari suitStrategy yang memiliki isi data nyata)
// ============================================================================
function findValidStrategy(obj) {
    let result = null;
    function search(node) {
        if (result) return;
        if (node !== null && typeof node === 'object') {
            // Jalur 1: Cek apakah node ini sendiri adalah strategi yang valid (punya equips/runes)
            if (Array.isArray(node.equips) && node.equips.length > 0) {
                result = node;
                return;
            }
            // Jalur 2: Cek apakah node punya key suitStrategy yang berisi data
            if (node.suitStrategy && typeof node.suitStrategy === 'object') {
                if (Array.isArray(node.suitStrategy.equips)) {
                    result = node.suitStrategy;
                    return;
                }
            }
            // Jalur 3: Cek apakah ada di dalam list (biasanya Tencent pakai ini)
            if (Array.isArray(node.suitStrategyList) && node.suitStrategyList.length > 0) {
                result = node.suitStrategyList[0];
                return;
            }
            
            // Rekursif ke dalam
            for (let key in node) {
                if (typeof node[key] === 'object') search(node[key]);
                if (result) return;
            }
        }
    }
    search(obj);
    return result;
}

function findHeroInfo(obj) {
    let info = null;
    function search(node) {
        if (info) return;
        if (node && typeof node === 'object') {
            if (node.heroName && node.heroId) {
                info = node;
                return;
            }
            for (let key in node) {
                if (typeof node[key] === 'object') search(node[key]);
            }
        }
    }
    search(obj);
    return info;
}

// ✨ PEMBERSIH TEKS
function sanitizeText(text) {
    if (!text) return "";
    return text
        .replace(/<[^>]*>?/gm, '')
        .replace(/\\n/g, ' ')
        .replace(/\n/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 03] Memulai Eksekusi: Panen Data Build dari RAW Fase 02");
    console.log("==================================================");

    const rawFolder = path.join(__dirname, '../../../data/raw/hero_details');
    const processedFolder = path.join(__dirname, '../../../data/processed/id/hero_guides');

    if (!fs.existsSync(processedFolder)) fs.mkdirSync(processedFolder, { recursive: true });

    try {
        if (!fs.existsSync(rawFolder)) {
            throw new Error("Folder raw hero_details tidak ditemukan. Jalankan Fase 02 dulu!");
        }

        const files = fs.readdirSync(rawFolder).filter(f => f.endsWith('_raw.json'));
        console.log(`📦 [INFO] Ditemukan ${files.length} file mentah. Memulai validasi struktur...`);

        let count = 0;
        for (const file of files) {
            const rawData = JSON.parse(fs.readFileSync(path.join(rawFolder, file), 'utf8'));
            
            // 📡 Cari strategi dan info hero secara terpisah untuk akurasi fallback
            const strategy = findValidStrategy(rawData);
            const hInfo = findHeroInfo(rawData);

            if (!strategy) {
                // Log hanya jika benar-benar tidak ditemukan data build sama sekali
                logToDatabase('WARN', `Hero ${file} tidak memiliki data strategy yang valid.`);
                continue;
            }

            // ⚔️ 1. ITEM BUILD
            const buildItems = (strategy.equips || []).map(item => ({
                id: item.equipId,
                name: item.equipName,
                icon: item.equipIcon,
                price: item.equipPrice,
                summary: item.equipDescLabel || "",
                description: sanitizeText(item.equipDesc)
            }));

            // 🧩 2. ARCANA BUILD
            const runeCounts = {};
            (strategy.runeIds || []).forEach(id => {
                runeCounts[id] = (runeCounts[id] || 0) + 1;
            });

            const arcanaBuild = (strategy.runes || []).map(rune => ({
                id: rune.runeId,
                name: rune.runeName,
                icon: rune.runeIcon,
                level: rune.runeLevel,
                count: runeCounts[rune.runeId] || 0,
                desc: sanitizeText(rune.runeDesc)
            }));

            // 🪄 3. SPELL (SUMMONER SKILL)
            const spell = strategy.skills ? {
                id: strategy.skills.skillId,
                name: strategy.skills.skillName,
                icon: strategy.skills.skillIcon,
                cooldown: strategy.skills.skillCd ? (strategy.skills.skillCd / 1000 + " Detik") : "0 Detik",
                description: sanitizeText(strategy.skills.skillDesc)
            } : null;

            const cleanGuide = {
                hero_id: file.replace('_raw.json', ''),
                hero_name: strategy.hero?.heroName || hInfo?.heroName || "Unknown",
                build_title: strategy.title || "Rekomendasi Utama",
                items: buildItems,
                arcana: arcanaBuild,
                recommended_spell: spell
            };

            const outPath = path.join(processedFolder, `${cleanGuide.hero_id}.json`);
            fs.writeFileSync(outPath, JSON.stringify(cleanGuide, null, 2));
            count++;
        }

        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] ${count} Panduan Build & Arcana Berhasil Diproses!`);
        console.log(`💾 [SAVED] Lokasi: data/processed/id/hero_guides/`);
        console.log(`==================================================`);

    } catch (error) {
        console.error(`❌ [ERROR]:`, error.message);
        logToDatabase('ERROR', `[FASE 03] ${error.message}`);
    }
}

module.exports = { execute };