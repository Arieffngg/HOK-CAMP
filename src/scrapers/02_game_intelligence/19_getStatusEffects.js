const fs = require('fs');
const path = require('path');

/**
 * 🔮 FASE 19: KAMUS CROWD CONTROL & EFEK STATUS
 * Lokasi: src/scrapers/02_game_intelligence/19_getStatusEffects.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur Utama: Menyuntikkan hierarki, jenis, dan penjelasan efek 
 * Crowd Control (CC), Debuff, serta Mekanik Imunitas di HOK.
 */

// ============================================================================
// 🧠 DATABASE EFEK STATUS & CROWD CONTROL (HONOR OF KINGS)
// ============================================================================
const STATUS_EFFECTS_DB = {
    metadata: {
        title: "Honor of Kings - Status Effects & Crowd Control Dictionary",
        description: "Hierarki kasta Crowd Control (CC), Debuff, dan mekanik perlawanannya."
    },

    hard_cc: {
        category_desc: "Efek yang sepenuhnya menghentikan pergerakan dan kemampuan target untuk merespons (menyerang/menggunakan skill).",
        effects: [
            {
                name: "Suppression (Menekan)",
                kasta: "Tertinggi (Absolute)",
                description: "Kasta CC paling tinggi di game. Mengunci target sepenuhnya di tempat. TIDAK BISA dibatalkan oleh Spell Purify maupun pasif CC Immunity (Super Armor).",
                examples: ["Ultimate Donghuang", "Ultimate Liang"]
            },
            {
                name: "Airborne / Knockup (Terhempas ke Udara)",
                kasta: "Tinggi",
                description: "Melemparkan target ke udara. Menghentikan pergerakan dan skill. Durasinya TIDAK BISA dikurangi oleh item Resistance (Boots of Resistance).",
                examples: ["Skill 1 Zilong", "Skill 2 Lian Po"]
            },
            {
                name: "Taunt (Mengejek)",
                kasta: "Tinggi",
                description: "Memaksa musuh untuk berjalan mendekat dan melakukan Basic Attack ke arah pengguna skill. Menghentikan proses channeling skill musuh.",
                examples: ["Ultimate Bai Qi", "Skill 2 Xiang Yu (dengan Arcana/Kondisi tertentu)"]
            },
            {
                name: "Stun (Pusing)",
                kasta: "Menengah",
                description: "Target tidak bisa bergerak, menyerang, atau menggunakan skill selama durasi tertentu.",
                examples: ["Skill 2 Daji", "Pasif Hou Yi"]
            },
            {
                name: "Freeze (Membeku) & Petrify (Membatu)",
                kasta: "Menengah",
                description: "Varian visual dari Stun. Target terkunci di tempat dan tidak bisa beraksi.",
                examples: ["Skill 2 Wang Zhaojun (Freeze)", "Skill Wuyan (Petrify)"]
            },
            {
                name: "Knockback (Pukul Mundur)",
                kasta: "Menengah",
                description: "Mendorong target menjauh dari pengguna skill. Menghentikan proses channeling skill target seketika.",
                examples: ["Skill 2 Li Xin (Light)", "Skill 2 Consort Yu (Ulti)"]
            }
        ]
    },

    soft_cc_and_debuffs: {
        category_desc: "Efek yang membatasi aksi target secara parsial, namun target masih bisa melakukan perlawanan (bergerak atau menyerang).",
        effects: [
            {
                name: "Silence (Bungkam)",
                description: "Target masih bisa bergerak dan melakukan Basic Attack, tetapi TIDAK BISA menggunakan Skill apa pun.",
                examples: ["Skill 1 Mulan", "Ultimate Sun Bin"]
            },
            {
                name: "Slow (Diperlambat)",
                description: "Mengurangi Movement Speed (Kecepatan Gerak) target.",
                examples: ["Hampir semua Mage dan efek dari Red Buff"]
            },
            {
                name: "Disarm (Melucuti Senjata)",
                description: "Target masih bisa bergerak dan menggunakan skill, tetapi TIDAK BISA menggunakan Basic Attack.",
                examples: ["Skill tertentu dari hero seperti Yao (jika turun dari perisai)"]
            },
            {
                name: "Armor/MR Pierce (Pengurangan Pertahanan)",
                description: "Mengurangi Physical Defense (Armor) atau Magical Defense musuh untuk sementara waktu.",
                examples: ["Pasif Di Renjie", "Skill 2 Li Bai"]
            }
        ]
    },

    immunities_and_counters: {
        category_desc: "Mekanik perlindungan yang meniadakan atau melawan efek CC dan Damage.",
        effects: [
            {
                name: "CC Immunity / Super Armor",
                description: "Kebal terhadap SEMUA jenis efek CC (termasuk Airborne, Stun, Slow) KECUALI Suppression. Visualnya biasa ditandai dengan garis putih pada bar HP hero.",
                examples: ["Ultimate Han Xin", "Pasif Lian Po saat menggunakan skill", "Spell Purify"]
            },
            {
                name: "I-Frame (Untargetable)",
                description: "Hero menghilang dari peta/tidak dapat ditarget. Selama durasi ini, hero kebal dari segala jenis Damage maupun CC.",
                examples: ["Ultimate Li Bai", "Skill 2 Diaochan", "Ultimate Mi Yue"]
            },
            {
                name: "Resistance (Resistensi)",
                description: "Atribut yang mengurangi DURASI efek CC yang diterima (seperti Stun atau Slow akan lebih cepat selesai). Maksimal Resistance yang berguna di game biasanya di-cap pada angka tertentu.",
                examples: ["Item Boots of Resistance (Sepatu Resist)"]
            }
        ]
    }
};

async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 19] Memulai Eksekusi: Kamus Crowd Control & Status");
    console.log("🛠️  Metode: Static Game Mechanics Injector");
    console.log("==================================================");

    const processedFolder = path.join(__dirname, '../../../data/processed/id');
    const outPath = path.join(processedFolder, 'status_effects.json');

    if (!fs.existsSync(processedFolder)) fs.mkdirSync(processedFolder, { recursive: true });

    try {
        console.log(`📦 [INFO] Menyuntikkan Hierarki CC: Hard CC, Soft CC, dan Mekanik Imunitas...`);
        
        fs.writeFileSync(outPath, JSON.stringify(STATUS_EFFECTS_DB, null, 2));

        console.log(`✅ [BINGO] Data Status Effects berhasil disintesis.`);

        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Fase 19 Selesai! Bot kini paham kasta mekanik in-game! 🔮`);
        console.log(`💾 File tersimpan di: data/processed/id/status_effects.json`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
    }
}

module.exports = { execute };