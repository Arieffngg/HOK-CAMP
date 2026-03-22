const fs = require('fs');
const path = require('path');

/**
 * 🧮 FASE 13: KALKULATOR DAMAGE & FORMULA ARMOR (THEORYCRAFTING ENGINE)
 * Lokasi: src/scrapers/02_game_intelligence/13_getDamageCalc.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur Utama: Menyuntikkan aturan matematika baku Honor of Kings (Konstanta 602),
 * urutan Penetrasi, dan tipe kalkulasi Damage.
 */

// ============================================================================
// 🧠 DATABASE FORMULA MATEMATIKA (HONOR OF KINGS)
// ============================================================================
const FORMULA_DB = {
    metadata: {
        title: "Honor of Kings - Damage & Armor Mathematical Engine",
        magic_constant: 602,
        description: "Dokumentasi formula inti game untuk simulasi kalkulator Discord Bot."
    },
    
    defense_mechanics: {
        physical_defense: {
            name: "Physical Damage Reduction",
            formula: "Armor / (602 + Armor)",
            explanation: "Semakin tinggi Armor, semakin tinggi persentase Physical Damage yang ditahan. Namun, peningkatannya mengalami 'Diminishing Returns' (semakin tinggi armor, efek penambahannya semakin kecil). Konstanta dasar di HOK adalah 602.",
            example: "Jika hero memiliki 602 Armor, maka Reduksi Damage = 602 / (602 + 602) = 0.5 (Mampu menahan 50% Physical Damage)."
        },
        magical_defense: {
            name: "Magical Damage Reduction",
            formula: "Magic Defense / (602 + Magic Defense)",
            explanation: "Sama persis dengan mekanisme Physical Armor, menggunakan konstanta 602.",
            example: "Jika hero memiliki 301 Magic Defense, maka Reduksi = 301 / (602 + 301) = 33.3%."
        }
    },

    penetration_mechanics: {
        order_of_calculation: [
            "1. Flat Penetration (Angka Tetap, contoh: +64 Physical Pierce dari Arcana Eagle Eye)",
            "2. Percentage Penetration (Persentase, contoh: +40% Physical Pierce dari item Starbreaker)"
        ],
        effective_armor_formula: "(Target Armor - Flat Pen) * (100% - Percent Pen)",
        insight: "Sistem HOK menguntungkan attacker (penyerang) karena Flat Penetration dikurangi lebih dulu SEBELUM persentase. Namun, menumpuk Flat Penetration melawan tank ber-armor sangat tebal kurang efektif dibandingkan membeli item Percentage Penetration."
    },

    damage_types: [
        {
            type: "Physical Damage",
            color_in_game: "Merah (Red)",
            characteristic: "Dapat dikurangi oleh Physical Defense (Armor). Bisa memicu Physical Lifesteal dan Critical Hit (tergantung sumber damage/skill)."
        },
        {
            type: "Magical Damage",
            color_in_game: "Ungu (Purple)",
            characteristic: "Dapat dikurangi oleh Magical Defense (Resistance). Bisa memicu Magical Lifesteal. Sangat jarang yang bisa Kritis."
        },
        {
            type: "True Damage",
            color_in_game: "Putih (White)",
            characteristic: "MENGABAIKAN seluruh Armor, Magic Resist, DAN Shield (Perisai). Damage akan langsung memotong HP murni musuh.",
            heroes_with_true_damage: ["Lu Bu", "Diaochan", "Marco Polo", "Ming"]
        }
    ],

    healing_and_sustain: {
        physical_lifesteal: {
            mechanism: "Hanya berlaku pada Serangan Dasar (Basic Attack) atau skill tertentu yang dihitung sebagai serangan dasar.",
            formula: "Damage Fisik AKHIR (setelah dipotong Armor musuh) * Persentase Lifesteal"
        },
        magical_lifesteal: {
            mechanism: "Berlaku untuk semua tipe Magical Damage (Skill maupun Pasif).",
            formula: "Sama seperti Physical Lifesteal, dihitung dari damage akhir yang masuk ke musuh."
        },
        anti_heal_effect: {
            name: "Grievous Wounds (Mortal Punisher / Venomous Staff)",
            effect: "Mengurangi semua efek pemulihan HP (Lifesteal, Heal, Regen) musuh sebesar 35% - 50% tergantung item."
        }
    }
};

async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 13] Memulai Eksekusi: Kalkulator Damage & Formula");
    console.log("🛠️  Metode: Static Math Theorycrafting Injector");
    console.log("==================================================");

    const processedFolder = path.join(__dirname, '../../../data/processed/id');
    const outPath = path.join(processedFolder, 'damage_calculator.json');

    // Buat folder jika belum ada
    if (!fs.existsSync(processedFolder)) {
        fs.mkdirSync(processedFolder, { recursive: true });
    }

    try {
        console.log(`📦 [INFO] Menyuntikkan Aturan Matematika: Armor (Konstanta 602), Penetrasi, & Lifesteal...`);
        
        fs.writeFileSync(outPath, JSON.stringify(FORMULA_DB, null, 2));

        console.log(`✅ [BINGO] Data Math Engine berhasil dikemas secara mutlak.`);

        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Fase 13 Selesai! Otak Kalkulator Bot siap digunakan! 🧮`);
        console.log(`💾 File tersimpan di: data/processed/id/damage_calculator.json`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
    }
}

module.exports = { execute };