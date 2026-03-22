const fs = require('fs');
const path = require('path');

/**
 * 💰 FASE 14: ANALISIS EFISIENSI FARMING BASELINE
 * Lokasi: src/scrapers/02_game_intelligence/14_getFarmingMetrics.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur Utama: Menyuntikkan standar GPM (Gold Per Minute), jadwal gelombang minion, 
 * dan aturan distribusi gold (Last Hit & Roam) untuk evaluasi performa pemain.
 */

// ============================================================================
// 🧠 DATABASE METRIK FARMING & EKONOMI MAKRO (HONOR OF KINGS)
// ============================================================================
const FARMING_DB = {
    metadata: {
        title: "Honor of Kings - Farming Efficiency & Macro Economy",
        description: "Baseline data untuk bot mengevaluasi GPM pemain dan memberikan tips rotasi."
    },

    // 📈 1. STANDAR GPM (GOLD PER MINUTE) BERDASARKAN ROLE
    gpm_baselines: {
        farm_lane: {
            role: "Marksman (ADC)",
            priority: "Sangat Tinggi (Pusat Ekonomi)",
            metrics: {
                excellent: "800+ GPM",
                good: "700 - 800 GPM",
                average: "600 - 700 GPM",
                poor: "< 600 GPM (Butuh perbaikan rotasi atau sering mati)"
            },
            focus: "Fokus mengamankan Last Hit minion dan mengambil monster kecil (Firehawk/Burung) di dekat lane."
        },
        jungle: {
            role: "Jungler (Assassin/Fighter)",
            priority: "Sangat Tinggi (Pusat Tempo)",
            metrics: {
                excellent: "750+ GPM",
                good: "650 - 750 GPM",
                average: "550 - 650 GPM",
                poor: "< 550 GPM (Hutan sering dicuri musuh atau telat rotasi)"
            },
            focus: "Membersihkan camp hutan dengan cepat, mengambil objektif (Tyrant/Overlord), dan 'pajak' minion saat ganking (jika perlu)."
        },
        mid_lane: {
            role: "Mage",
            priority: "Tinggi",
            metrics: {
                excellent: "700+ GPM",
                good: "600 - 700 GPM",
                average: "550 - 600 GPM",
                poor: "< 550 GPM"
            },
            focus: "Clear minion wave tercepat lalu segera rotasi ke Farm/Clash Lane untuk Ganking."
        },
        clash_lane: {
            role: "Fighter / Tank",
            priority: "Menengah",
            metrics: {
                excellent: "650+ GPM",
                good: "550 - 650 GPM",
                average: "500 - 550 GPM",
                poor: "< 500 GPM"
            },
            focus: "Mengamankan minion Melee tambahan (EXP lebih tinggi di early), mendominasi duel 1v1, dan cut wave jika mendominasi."
        },
        roam: {
            role: "Support / Tank",
            priority: "Rendah (Pemberi Utilitas)",
            metrics: {
                excellent: "500+ GPM (Banyak Assist)",
                good: "400 - 500 GPM",
                average: "350 - 400 GPM",
                poor: "< 350 GPM"
            },
            focus: "Wajib membeli Item Roam agar tidak menyedot Gold/EXP dari Carry. Fokus mencari Assist dan membuka Vision."
        }
    },

    // ⚔️ 2. JADWAL GELOMBANG MINION (WAVE TIMINGS)
    minion_waves: [
        {
            time: "00:10",
            event: "Gelombang Minion Pertama Muncul dari Base."
        },
        {
            time: "04:00",
            event: "Siege Minion (Gerobak/Meriam) mulai bergabung dengan gelombang, memberikan Gold/EXP ekstra."
        },
        {
            time: "10:00",
            event: "Statistik Minion (HP, Attack, Kecepatan Gerak) meningkat secara signifikan."
        },
        {
            time: "Dynamic",
            event: "Super Minion muncul di satu lane jika Base Tower (Tower tier 3/High Ground) di lane tersebut hancur."
        },
        {
            time: "20:00+",
            event: "Fase Tempest Dragon: Gelombang minion di SEMUA lane digantikan oleh Tempest Vanguard yang sangat tebal jika naga dikalahkan."
        }
    ],

    // 💰 3. MEKANIK DISTRIBUSI GOLD & EXP
    economy_rules: {
        last_hit_bonus: {
            rule: "Last Hit Murni",
            effect: "Memberikan ~50% ekstra Gold dibandingkan jika minion mati dibunuh oleh minion teman atau tower.",
            tip: "Pemain Farm Lane wajib berlatih timing Last Hit."
        },
        gold_sharing: {
            rule: "Berbagi Lane (Tanpa Item Roam)",
            effect: "Jika ada 2 Hero di dekat minion mati, Gold/EXP akan dibagi (masing-masing mendapat ~80% dari total nilai). Sangat merugikan Carry di Early Game."
        },
        roaming_item_effect: {
            rule: "Guerrilla / Item Roam (Menit 0 - 10)",
            effect: "Hero yang memakai Item Roam TIDAK AKAN membagi (menyedot) Gold/EXP dari minion. Seluruh 100% Gold/EXP diberikan ke rekan tim di dekatnya. Roamer akan mendapat 30% Gold/EXP ekstra secara terpisah dari sistem."
        },
        tower_gold: {
            rule: "Penghancuran Tower",
            effect: "Menghancurkan tower akan memberikan Gold lokal untuk pemain di sekitarnya, DAN Gold global untuk seluruh anggota tim di peta."
        }
    }
};

async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 14] Memulai Eksekusi: Baseline Efisiensi Farming");
    console.log("🛠️  Metode: Static Macro Economy Injector");
    console.log("==================================================");

    const processedFolder = path.join(__dirname, '../../../data/processed/id');
    const outPath = path.join(processedFolder, 'farming_metrics.json');

    if (!fs.existsSync(processedFolder)) fs.mkdirSync(processedFolder, { recursive: true });

    try {
        console.log(`📦 [INFO] Menyuntikkan Intelijen Ekonomi: Standar GPM, Minion Waves, & Aturan Last Hit...`);
        
        fs.writeFileSync(outPath, JSON.stringify(FARMING_DB, null, 2));

        console.log(`✅ [BINGO] Data Metrik Farming berhasil dikemas.`);

        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Fase 14 Selesai! Otak Makro Ekonomi siap digunakan! 💰`);
        console.log(`💾 File tersimpan di: data/processed/id/farming_metrics.json`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
    }
}

module.exports = { execute };