const fs = require('fs');
const path = require('path');

/**
 * 🏅 FASE 18: PARAMETER EVALUASI MVP RESMI
 * Lokasi: src/scrapers/02_game_intelligence/18_getMVPParameters.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur Utama: Menyuntikkan database statis tentang algoritma penilaian
 * skor pasca-pertandingan (MVP, SVP, dan Medali) berdasarkan Role.
 */

// ============================================================================
// 🧠 DATABASE ALGORITMA SKOR MVP (HONOR OF KINGS)
// ============================================================================
const MVP_DB = {
    metadata: {
        title: "Honor of Kings - MVP Scoring & Evaluation Guide",
        description: "Panduan parameter penilaian algoritma MVP, SVP, dan sistem rating pasca pertandingan."
    },

    scoring_factors: [
        {
            factor: "KDA (Kill/Death/Assist) Cleanliness",
            impact: "Sangat Tinggi",
            detail: "Sistem sangat menghargai pemain yang SEDIKIT MATI (Low Deaths). Pemain dengan skor 2/0/10 seringkali mendapat skor lebih tinggi daripada pemain dengan skor 10/6/2. Assist dihargai hampir setara dengan Kill."
        },
        {
            factor: "Kill Participation (Partisipasi Tim)",
            impact: "Tinggi",
            detail: "Persentase keterlibatan pemain (Kill + Assist) dari total Kill yang didapat tim. Semakin sering ikut teamfight, skor semakin meroket."
        },
        {
            factor: "Damage Dealt (Output Damage)",
            impact: "Tinggi (Fleksibel per Role)",
            detail: "Persentase damage yang diberikan ke hero musuh dibandingkan total damage tim. Sangat krusial untuk mendongkrak skor role Mage, Marksman, dan Assassin."
        },
        {
            factor: "Damage Taken (Damage Diterima)",
            impact: "Tinggi (Fleksibel per Role)",
            detail: "Persentase damage yang ditahan oleh pemain. Menjadi penyumbang skor terbesar untuk role Tank dan Clash Lane (Fighter)."
        },
        {
            factor: "Objective Contribution",
            impact: "Menengah",
            detail: "Damage yang diberikan kepada Tower dan monster epik (Tyrant/Overlord). Sangat membantu untuk hero spesialis Split Push."
        }
    ],

    role_adjustments: {
        description: "Algoritma HOK menyesuaikan bobot penilaian berdasarkan Class/Role hero yang dimainkan.",
        roles: {
            roamer_support: "Sistem memberikan multiplier (bobot ekstra) pada stat [Assist], [Damage Taken], dan [Heal/Shielding]. Ini alasan mengapa Roamer dengan skor 0/2/15 sangat mudah mendapatkan MVP.",
            jungler: "Sistem memberikan bobot ekstra pada [Kill Participation], [Gold Per Minute], dan pengambilan [Objektif Epic Monster].",
            clash_lane: "Sistem mencari keseimbangan rasio yang baik antara [Damage Dealt] dan [Damage Taken].",
            mage_marksman: "Sistem menuntut nilai [Damage Dealt] yang sangat tinggi dan jumlah [Death] yang seminimal mungkin."
        }
    },

    special_awards: {
        mvp: {
            name: "MVP (Most Valuable Player)",
            description: "Diberikan eksklusif kepada pemain dengan skor rating tertinggi di dalam tim yang MENANG."
        },
        svp: {
            name: "SVP (Losing MVP)",
            description: "Diberikan kepada pemain dengan skor rating tertinggi di dalam tim yang KALAH. (Pemain yang 'menggendong' tapi tetap kalah)."
        }
    },

    medal_thresholds: [
        {
            medal: "Gold Medal (Emas)",
            typical_score: "10.0 - 16.0+",
            meaning: "Performa luar biasa, berkontribusi jauh di atas rata-rata pemain di tier tersebut."
        },
        {
            medal: "Silver Medal (Perak)",
            typical_score: "7.0 - 9.9",
            meaning: "Performa baik dan stabil, menjalankan peran dengan semestinya."
        },
        {
            medal: "Bronze Medal (Perunggu)",
            typical_score: "0.0 - 6.9",
            meaning: "Performa di bawah standar, sering mati (feeding), atau kurang memberikan impak pada teamfight."
        }
    ],

    frequent_questions: [
        {
            q: "Kenapa saya kalah MVP padahal Kill saya paling banyak?",
            a: "Karena KDA bukan hanya soal Kill. Jika Anda mati 5 kali sedangkan teman Anda (Roamer) mati 0 kali dengan belasan Assist, algoritma menilai Roamer tersebut bermain lebih bersih dan efisien untuk tim."
        }
    ]
};

async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 18] Memulai Eksekusi: Parameter Evaluasi MVP Resmi");
    console.log("🛠️  Metode: Static Scoring Algorithm Injector");
    console.log("==================================================");

    const processedFolder = path.join(__dirname, '../../../data/processed/id');
    const outPath = path.join(processedFolder, 'mvp_parameters.json');

    if (!fs.existsSync(processedFolder)) fs.mkdirSync(processedFolder, { recursive: true });

    try {
        console.log(`📦 [INFO] Menyuntikkan Algoritma MVP: Role Adjustment, Skor KDA, & Medali...`);
        
        fs.writeFileSync(outPath, JSON.stringify(MVP_DB, null, 2));

        console.log(`✅ [BINGO] Data Parameter MVP berhasil disintesis.`);

        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Fase 18 Selesai! Bot siap menjadi juri pertandingan! 🏅`);
        console.log(`💾 File tersimpan di: data/processed/id/mvp_parameters.json`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
    }
}

module.exports = { execute };