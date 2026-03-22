const fs = require('fs');
const path = require('path');

/**
 * 🎬 FASE 11: MATRIKS HITBOX & FRAME DATA SKILL (DATA MINER V2.4)
 * Lokasi: src/scrapers/02_game_intelligence/11_getFrameData.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur Utama: Deep Semantic Scanning, Expanded Mechanics (8 Kategori),
 * Full Context Extractor (Menampilkan keseluruhan deskripsi) & Ultimate Localized Regex.
 */

function logToDatabase(level, message) {
    const logPath = path.join(__dirname, '../../../logs/error.log');
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}\n`;
    if (!fs.existsSync(path.dirname(logPath))) fs.mkdirSync(path.dirname(logPath), { recursive: true });
    fs.appendFileSync(logPath, logEntry);
}

// 🧠 KAMUS KATA KUNCI (REGEX FLEKSIBEL) UNTUK MEKANIK MIKRO V2.4
const MECHANIC_CATEGORIES = {
    cc_immunity: {
        regex: /kebal crowd control|kebal.*crowd control|imun.*crowd control|mengabaikan.*crowd control|menghapus.*crowd control|kebal efek control|iron body|super armor|immune|kekebalan crowd control/i,
        name: "🛡️ CC Immunity & Super Armor"
    },
    iframe: {
        regex: /tidak dapat ditarget|tidak bisa ditarget|untargetable|kebal.*damage|menghindari.*damage|menghilang dari|tidak dapat diserang/i,
        name: "👻 I-Frame & Untargetable"
    },
    true_damage: {
        regex: /true damage|damage murni|kerusakan nyata|damage sejati|damage nyata/i,
        name: "⚔️ True Damage"
    },
    suppression: {
        regex: /suppress|menekan target|menekan musuh|efek menekan/i,
        name: "⛓️ Suppression (Hard CC)"
    },
    airborne: {
        regex: /airborne|menerbangkan|menghempaskan|knockup|terlempar ke udara|mengangkat|knock up/i,
        name: "🌪️ Airborne & Knockup"
    },
    damage_reduction: {
        regex: /mengurangi damage yang diterima|damage reduction|pengurangan damage|reduksi damage/i,
        name: "🛡️ Damage Reduction"
    },
    sustain: {
        regex: /memulihkan health|memulihkan hp|lifesteal|spell vamp|memulihkan darah|memulihkan.*health/i,
        name: "💚 Healing & Sustain"
    },
    mobility: {
        regex: /blink|dash|menerjang|melompat|berpindah tempat|charge/i,
        name: "🏃‍♂️ Blink, Dash & Mobility"
    }
};

async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 11] Memulai Eksekusi: Combat Matrix Miner (V2.4)");
    console.log("🛠️  Metode: Full Context Scanning (Tanpa Pemotongan) + Ultimate Localized Regex");
    console.log("==================================================");

    const detailsDir = path.join(__dirname, '../../../data/processed/id/hero_details');
    const outPath = path.join(__dirname, '../../../data/processed/id/combat_matrix.json');

    if (!fs.existsSync(detailsDir)) {
        console.error("❌ [ERROR] Folder hero_details tidak ditemukan. Jalankan Fase 02 terlebih dahulu!");
        return;
    }

    try {
        const files = fs.readdirSync(detailsDir).filter(f => f.endsWith('.json'));
        console.log(`📦 [INFO] Memindai teks skill dari ${files.length} Pahlawan...`);

        // 🗂️ Struktur Matriks Tempur Dinamis
        const combatMatrix = {};
        for (const key in MECHANIC_CATEGORIES) {
            combatMatrix[key] = {
                category_name: MECHANIC_CATEGORIES[key].name,
                heroes: []
            };
        }

        for (const file of files) {
            const heroData = JSON.parse(fs.readFileSync(path.join(detailsDir, file), 'utf8'));
            const skills = heroData.skills || [];

            // Pindai hero ini terhadap SEMUA kategori mekanik
            for (const key in MECHANIC_CATEGORIES) {
                const regex = MECHANIC_CATEGORIES[key].regex;
                const triggeredSkills = [];

                skills.forEach(skill => {
                    const desc = skill.description || "";
                    const match = desc.match(regex);
                    
                    if (match) {
                        // ✨ PERBAIKAN V2.4: Selalu ambil KESELURUHAN deskripsi
                        triggeredSkills.push({
                            skill_name: skill.name,
                            skill_type: skill.type,
                            keyword_found: match[0],
                            desc_snippet: desc
                        });
                    }
                });

                // Jika hero memiliki skill di kategori ini, masukkan ke dalam database
                if (triggeredSkills.length > 0) {
                    combatMatrix[key].heroes.push({
                        hero_id: heroData.id,
                        hero_name: heroData.name,
                        skills: triggeredSkills
                    });
                }
            }
        }

        // Simpan hasil ekstraksi
        fs.writeFileSync(outPath, JSON.stringify(combatMatrix, null, 2));

        console.log(`\n✅ [BINGO] Full Context Scanning Selesai! Hasil Ekstraksi:`);
        for (const key in combatMatrix) {
            const count = combatMatrix[key].heroes.length;
            console.log(`   ${MECHANIC_CATEGORIES[key].name.padEnd(30)} : ${count} Hero`);
        }

        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Fase 11 Selesai! Matriks Super-Detail terbentuk.`);
        console.log(`💾 File tersimpan di: data/processed/id/combat_matrix.json`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
        logToDatabase('ERROR', `[FASE 11] ${error.message}`);
    }
}

module.exports = { execute };