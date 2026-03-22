const fs = require('fs');
const path = require('path');

/**
 * 🧠 FASE 36: MATRIKS INTELIJEN STRATEGIS (MACRO BLUEPRINT)
 * Lokasi: src/scrapers/04_strategic_iq/36_getStrategicIntelligence.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur Utama: Menyuntikkan Logic Tree untuk keputusan Makro (Macro-awareness),
 * mencakup strategi saat kalah Gold, cara Snowballing, dan prioritas objektif.
 */

// ============================================================================
// 🧠 DATABASE BLUEPRINT STRATEGI MAKRO (HONOR OF KINGS)
// ============================================================================
const STRATEGY_DB = {
    metadata: {
        title: "Honor of Kings - Strategic Macro Intelligence Blueprint",
        description: "Pohon logika keputusan taktis (Decision Making) untuk memandu pemain dalam berbagai situasi pertandingan."
    },

    situational_tactics: [
        {
            condition: "Playing from Behind (Tertinggal Gold & Level)",
            dos: [
                "Freeze Lane: Tarik minion ke dekat tower Anda agar aman saat farming.",
                "Turtling: Jangan pernah keluar dari area High Ground (Base) jika tidak terlihat satupun musuh di map.",
                "Beli Item Defensif: Mage beli Splendor, Marksman beli Pure Sky atau Sage's Sanctuary.",
                "Relakan Objektif: Jika tertinggal 3-5 ribu Gold, JANGAN kontes Tyrant/Overlord. Relakan saja daripada mati konyol dan terkena Wipeout."
            ],
            donts: [
                "Jangan masuk ke hutan sendiri tanpa vision (penglihatan).",
                "Jangan melakukan inisiasi teamfight (Open War) jika musuh tidak melakukan blunder fatal (Offside)."
            ],
            bot_advice: "Kunci comeback adalah KESABARAN. Tunggu musuh melakukan kesalahan di bawah tower kita (overdive), lalu hukum mereka!"
        },
        {
            condition: "Snowballing (Unggul Jauh di Early/Mid Game)",
            dos: [
                "Invasi Hutan Musuh: Jangan biarkan Jungler musuh farming. Ambil semua monster mereka (Kecuali Anda butuh regen HP).",
                "Kunci Objektif: Selalu ambil Shadow Tyrant atau Shadow Overlord tepat saat mereka muncul.",
                "Freeze Lane (Agresif): Diam di depan tower musuh tapi jangan pukul minionnya, biarkan musuh tidak mendapat EXP/Gold karena takut mendekat."
            ],
            donts: [
                "JANGAN Mukill (Nafsu Kill): Terlalu sering mengejar kill sampai masuk ke dalam tower musuh (Dive) seringkali menjadi awal dari blunder mematikan.",
                "Jangan tunda End Game: Jika ada kesempatan menghancurkan Base Crystal, hancurkan segera. Jangan main-main (Taunting) di depan markas musuh."
            ],
            bot_advice: "Keunggulan 10.000 Gold tidak ada artinya jika kalian semua mati konyol saat memperebutkan Tempest Dragon di menit 20."
        }
    ],

    macro_concepts: [
        {
            concept: "Split Push",
            ideal_heroes: ["Li Xin", "Milady", "Han Xin", "Fuzi"],
            execution_timing: "Lakukan Push di jalur yang berlawanan dengan lokasi objektif yang sedang diperebutkan. Contoh: Jika musuh berkerumun di bawah (Tyrant), lakukan Split Push di jalur atas (Top Lane).",
            golden_rule: "Selalu lihat mini-map. Jika 2 musuh atau lebih MENGHILANG dari peta, segera tinggalkan tower yang sedang Anda push dan bersembunyi di semak untuk Recall."
        },
        {
            concept: "Wave Management (Manajemen Minion)",
            explanation: "Seni mengatur ritme pertemuan minion. Sebelum melakukan war besar (Contoh: Kontes Tempest Dragon), pastikan minion di SEMUA JALUR sudah Anda dorong (Clear) melewati batas sungai tengah.",
            golden_rule: "Teamfight tanpa minion yang mendukung adalah sia-sia. Jika kalian menang war tapi minion masih ada di markas kalian, kalian tidak akan bisa nge-push."
        }
    ],

    objective_priority: {
        priority_list: [
            "1. Base Crystal Musuh (Kemenangan Mutlak)",
            "2. Tempest Dragon (Menit 20+)",
            "3. High Ground Tower (Tower Tier 3 - Sangat krusial untuk melumpuhkan musuh)",
            "4. Shadow Overlord / Shadow Tyrant (Menit 10+)",
            "5. Tower Tier 1 & 2",
            "6. Membunuh Hero Musuh (Kill)",
            "7. Buff / Monster Hutan"
        ],
        insight: "Kebanyakan pemain tier rendah menukar prioritas 6 dan 7 di atas prioritas 3. Ingat: Game MOBA adalah game HANCURKAN TOWER, bukan game BANYAK-BANYAKAN KILL."
    }
};

async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 36] Memulai Eksekusi: Matriks Intelijen Strategis");
    console.log("🛠️  Metode: Static Macro Blueprint Injector");
    console.log("==================================================");

    const processedFolder = path.join(__dirname, '../../../data/processed/id');
    const outPath = path.join(processedFolder, 'strategic_intelligence.json');

    // Buat folder jika belum ada
    if (!fs.existsSync(processedFolder)) fs.mkdirSync(processedFolder, { recursive: true });

    try {
        console.log(`📦 [INFO] Menyuntikkan Otak Makro: Taktik Comeback, Snowballing, & Prioritas Objektif...`);
        
        fs.writeFileSync(outPath, JSON.stringify(STRATEGY_DB, null, 2));

        console.log(`✅ [BINGO] Data Intelijen Strategis berhasil disintesis.`);

        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Fase 36 Selesai! Bot kini secerdas Coach Tim E-Sports! 🧠`);
        console.log(`💾 File tersimpan di: data/processed/id/strategic_intelligence.json`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
    }
}

module.exports = { execute };