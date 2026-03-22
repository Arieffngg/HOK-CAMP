const fs = require('fs');
const path = require('path');

/**
 * 🤝 FASE 30: SINERGI MEKANIK & COUNTER HERO (EXPANDED V2.0)
 * Lokasi: src/scrapers/04_strategic_iq/30_getHeroSynergy.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur Utama: Database taktis untuk Sinergi Tim (Combo) dan Hard Counters.
 * Update: Penambahan meta AoE Combo, Double Sustain, dan Counter Burst Damage.
 */

// ============================================================================
// 🧠 DATABASE SINERGI & COUNTER (HONOR OF KINGS)
// ============================================================================
const SYNERGY_DB = {
    metadata: {
        title: "Honor of Kings - Strategic Synergy & Counter Matrix",
        description: "Panduan pasangan hero terbaik (Combo) dan cara melakukan counter mekanik mematikan.",
        last_updated: new Date().toISOString()
    },

    best_combos: [
        {
            id: "combo_ming_adc",
            name: "The Immortal Link (Ming + Static ADC)",
            heroes: ["Ming", "Di Renjie", "Garo", "Hou Yi"],
            description: "Ming mengikatkan talinya ke Marksman, memberikan buff Physical Attack, Attack Speed, dan Defense yang tidak masuk akal. Membuat Marksman menjadi mesin turret yang sakit namun susah dibunuh.",
            counter_tips: "Gunakan hero Assassin dengan Burst Damage sangat tinggi (seperti Nakoruru atau Wukong) untuk membunuh Marksman dalam 1 detik sebelum Ming sempat memberikan heal."
        },
        {
            id: "combo_daqiao_tp",
            name: "Elevator Strat (Taktik Lift Da Qiao)",
            heroes: ["Da Qiao", "Arli", "Li Xin", "Fuzi"],
            description: "Kombinasi split-push sempurna. Da Qiao menggunakan skill 2 untuk memulangkan teman yang sekarat ke base (Full HP seketika), lalu memanggil mereka kembali dengan Ultimate. Khusus Arli, ia bisa menggunakan skill payungnya untuk bolak-balik sendiri.",
            counter_tips: "Gunakan hero dengan skill Knockback (Guan Yu, Su Lie) untuk mendorong musuh keluar dari lingkaran portal Da Qiao agar mereka gagal pulang."
        },
        {
            id: "combo_wuyan_zhaojun",
            name: "Petrifying Blizzard (Wuyan + Wang Zhaojun)",
            heroes: ["Wuyan", "Wang Zhaojun"],
            description: "Wuyan menerjang dan membekukan (Petrify) musuh dalam area luas. Saat musuh menjadi batu, Zhaojun bisa dengan mudah menempatkan skill 2 (Freeze) dan menjatuhkan Ultimate (Blizzard) tepat di atas mereka tanpa meleset.",
            counter_tips: "Gunakan Purify atau hero dengan kemampuan Purify bawaan (Di Renjie) untuk kabur dari efek batu Wuyan."
        },
        {
            id: "combo_yaria_assassin",
            name: "The Parasite Core (Yaria + Jungler)",
            heroes: ["Yaria", "Lam", "Jing", "Nakoruru"],
            description: "Yaria menempel di atas kepala Assassin yang lincah, memberikan True Shield yang sangat tebal. Ini membuat Assassin bisa masuk ke garis belakang musuh dan membantai Mage/ADC tanpa takut mati.",
            counter_tips: "Gunakan hero dengan True Damage (Lu Bu, Marco Polo) yang bisa langsung mengabaikan perisai Yaria."
        },
        {
            id: "combo_aoe_wombo",
            name: "The Black Hole (Guiguzi + AoE Burst)",
            heroes: ["Guiguzi", "Marco Polo", "Gao", "Lian Po"],
            description: "Guiguzi menarik semua musuh ke satu titik dan mengurangi armor mereka. Setelah musuh terkumpul, hero dengan Ultimate area luas (AoE) seperti Marco Polo atau Gao langsung meluluhlantakkan mereka dalam sekejap (Wipeout).",
            counter_tips: "Jaga jarak antar pemain agar tidak berkerumun. Gunakan hero dengan skill Disengage (pukul mundur) seperti Su Lie atau Guan Yu untuk membatalkan inisiasi Guiguzi."
        },
        {
            id: "combo_immortal_sustain",
            name: "The Unkillable March (Double Healer)",
            heroes: ["Cai Yan", "Bian Que", "Ata"],
            description: "Kombinasi healing super masif. Cai Yan memberikan heal ledakan, sedangkan Bian Que memberikan heal berkelanjutan (Regen). Tim ini bisa melakukan push dari base ke base tanpa perlu pulang untuk isi darah.",
            counter_tips: "Wajib dan mutlak membeli item Anti-Heal (Mortal Punisher/Venomous Staff) sejak early game. Incar Cai Yan terlebih dahulu di setiap teamfight."
        }
    ],

    hard_counters: [
        {
            mechanic_to_counter: "Mobilitas Tinggi (High Mobility / Lincah)",
            heroes_countered: ["Li Bai", "Luna", "Han Xin", "Jing", "Shangguan"],
            best_counters: ["Donghuang", "Liang"],
            reason: "Donghuang dan Liang memiliki skill Ultimate 'Suppression' (Kasta CC Tertinggi). Skill ini akan mengunci target di tempat dan TIDAK BISA dibatalkan oleh Purify atau item apapun. Hero lincah akan mati kutu."
        },
        {
            mechanic_to_counter: "Shield Tebal (Heavy Shields)",
            heroes_countered: ["Zhang Fei", "Biron", "Liu Bang", "Ata"],
            best_counters: ["Lu Bu", "Marco Polo", "Diaochan"],
            reason: "Hero counter di atas memiliki mekanik True Damage. True Damage akan MENGABAIKAN besarnya perisai dan Armor musuh, langsung memotong bar HP murni mereka."
        },
        {
            mechanic_to_counter: "Regenerasi Tinggi (High Lifesteal / Healers)",
            heroes_countered: ["Cai Yan", "Dr. Bian", "Fatih", "Dian Wei"],
            best_counters: ["Hero apapun dengan item Mortal Punisher atau Venomous Staff"],
            reason: "Item Anti-Heal wajib dibeli sejak awal game untuk memotong kemampuan penyembuhan (Regen/Lifesteal) hero-hero tersebut hingga 50%."
        },
        {
            mechanic_to_counter: "Invisibility (Menghilang / Kamuflase)",
            heroes_countered: ["Prince of Lanling", "Wukong", "Guiguzi"],
            best_counters: ["Hou Yi", "Liang", "Shouyue", "Item: Crimson Shadow"],
            reason: "Skill pasif/aktif dari hero-hero counter ini dapat memunculkan 'Vision' (Penglihatan) absolut yang memaksa hero yang menghilang untuk terlihat jelas di peta."
        },
        {
            mechanic_to_counter: "Burst Damage / One-Shot",
            heroes_countered: ["Wukong", "Nakoruru", "Angela", "Daji"],
            best_counters: ["Consort Yu", "Zhuangzi", "Item: Pure Sky", "Item: Sage's Sanctuary"],
            reason: "Hero Burst sangat bergantung pada satu kombo cepat. Consort Yu kebal Physical Burst dengan skill 2. Sementara menggunakan item 'Pure Sky' mengurangi damage yang diterima sebesar 40%, membuat kombo Assassin terbuang sia-sia."
        },
        {
            mechanic_to_counter: "Attack Speed / Marksman DPS",
            heroes_countered: ["Hou Yi", "Garo", "Di Renjie", "Luban No.7"],
            best_counters: ["Wuyan", "Item: Ominous Premonition", "Item: Spikemail"],
            reason: "Wuyan memiliki pasif yang mengurangi Attack Speed musuh. Menggabungkannya dengan item Ominous Premonition akan mematikan sumber DPS (Damage per Second) utama dari Marksman secara telak."
        }
    ]
};

async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 30] Memulai Eksekusi: Sinergi Mekanik & Counter Hero");
    console.log("🛠️  Metode: Static Draft Intelligence Injector (V2.0)");
    console.log("==================================================");

    const processedFolder = path.join(__dirname, '../../../data/processed/id');
    const outPath = path.join(processedFolder, 'hero_synergy.json');

    // Buat folder jika belum ada
    if (!fs.existsSync(processedFolder)) fs.mkdirSync(processedFolder, { recursive: true });

    try {
        console.log(`📦 [INFO] Menyuntikkan Data Sinergi: Combo Mematikan & Hard Counters (Expanded)...`);
        
        fs.writeFileSync(outPath, JSON.stringify(SYNERGY_DB, null, 2));

        console.log(`✅ [BINGO] Data Matriks Sinergi berhasil disintesis dan di-upgrade.`);

        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Fase 30 Selesai! Bot kini siap jadi Coach Draft Pick PRO! 🤝`);
        console.log(`💾 File tersimpan di: data/processed/id/hero_synergy.json`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
    }
}

module.exports = { execute };