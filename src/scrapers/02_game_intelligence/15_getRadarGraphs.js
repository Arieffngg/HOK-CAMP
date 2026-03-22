const fs = require('fs');
const path = require('path');

/**
 * 🕸️ FASE 15: BEDAH PARAMETER GRAFIK RADAR MATCH
 * Lokasi: src/scrapers/02_game_intelligence/15_getRadarGraphs.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur Utama: Menyuntikkan aturan evaluasi statistik (Radar Chart) pasca-pertandingan 
 * agar Bot bisa menganalisis gaya bermain (Playstyle) user di Discord.
 */

// ============================================================================
// 🧠 DATABASE PARAMETER RADAR CHART (HONOR OF KINGS)
// ============================================================================
const RADAR_DB = {
    metadata: {
        title: "Honor of Kings - Post-Match Radar Chart Parameters",
        description: "Metrik yang digunakan untuk mengevaluasi gaya bermain dan kontribusi pemain dalam satu match."
    },

    radar_axes: {
        output: {
            name: "Output (Damage)",
            description: "Mengukur seberapa besar Damage yang diberikan kepada Hero musuh dibandingkan dengan total durasi pertandingan dan rata-rata tim.",
            key_metric: "Hero Damage Dealt",
            dominant_roles: ["Mage", "Marksman", "Assassin"],
            analysis: "Jika nilai Output sangat tinggi, pemain sukses menjadi 'Carry' atau 'Damage Dealer' utama. Namun jika Output tinggi tapi Teamfight rendah, bisa jadi pemain hanya melakukan 'Poke' tanpa eksekusi."
        },
        survival: {
            name: "Survival (Bertahan Hidup)",
            description: "Mengukur efisiensi pertahanan pemain. Dihitung berdasarkan jumlah Kematian (Death) yang rendah, serta rasio Damage Taken (Damage yang diterima dan ditahan).",
            key_metric: "Deaths & Damage Taken",
            dominant_roles: ["Tank", "Support", "Clash Lane"],
            analysis: "Nilai Survival yang tinggi berarti pemain pintar menjaga posisi (positioning) atau sukses menahan badan (Tebe) tanpa harus mati sia-sia."
        },
        teamfight: {
            name: "Teamfight (Partisipasi)",
            description: "Mengukur seberapa sering pemain terlibat dalam peperangan tim yang membuahkan hasil (Kill/Assist).",
            key_metric: "Kill Participation (Rasio Kill + Assist vs Total Tim Kill)",
            dominant_roles: ["Support", "Mage", "Jungler"],
            analysis: "Pemain dengan nilai Teamfight tinggi adalah 'Team Player' sejati yang selalu hadir di momen krusial. Jika nilai ini rendah, pemain mungkin terlalu asik Farming/Split Push."
        },
        farming: {
            name: "Farming (Ekonomi)",
            description: "Mengukur efisiensi perolehan Gold dan EXP pemain per menit.",
            key_metric: "Gold Per Minute (GPM)",
            dominant_roles: ["Marksman", "Jungler"],
            analysis: "Menunjukkan kemampuan pemain melakukan Last Hit, rotasi Jungle, dan mengamankan objektif tanpa membuang waktu."
        },
        push: {
            name: "Push (Objektif Menara)",
            description: "Mengukur kontribusi Damage yang diberikan khusus kepada struktur (Tower/Base) musuh.",
            key_metric: "Tower Damage",
            dominant_roles: ["Marksman", "Fighter (Split Pusher)"],
            analysis: "Pemain dengan nilai Push maksimal adalah kunci kemenangan (Objective Gaming). KDA jelek tidak masalah jika nilai Push-nya menembus langit!"
        }
    },

    playstyle_archetypes: [
        {
            name: "The KDA Player",
            condition: "Tinggi di Output dan Survival, tapi sangat rendah di Push dan Teamfight.",
            bot_roast: "Hayo ngaku, kamu pasti mainnya cuma mau cari kill doang kan? Tower musuh tuh dipukul, jangan cuma musuhnya doang!"
        },
        {
            name: "The Unsung Hero",
            condition: "Tinggi di Survival, Teamfight, dan Push, tapi rendah di Output dan Farming.",
            bot_roast: "Respect! Kamu rela miskin dan pasang badan demi tim menang. Fix Roamer sejati!"
        },
        {
            name: "The Split Pusher",
            condition: "Sangat tinggi di Push dan Farming, tapi rendah di Teamfight.",
            bot_roast: "Asik nyangkul di lane orang sambil nyuri tower ya? Zilong atau Li Xin nih pasti!"
        },
        {
            name: "The Hard Carry",
            condition: "Tinggi di Output, Farming, dan Teamfight.",
            bot_roast: "Punggung aman, Bang? Pasti capek ya nge-carry tim yang berat!"
        }
    ]
};

async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 15] Memulai Eksekusi: Bedah Parameter Grafik Radar");
    console.log("🛠️  Metode: Static Radar Diagnostics Injector");
    console.log("==================================================");

    const processedFolder = path.join(__dirname, '../../../data/processed/id');
    const outPath = path.join(processedFolder, 'radar_parameters.json');

    if (!fs.existsSync(processedFolder)) fs.mkdirSync(processedFolder, { recursive: true });

    try {
        console.log(`📦 [INFO] Menyuntikkan Aturan Analisis 5 Sumbu Radar (Output, Survival, Teamfight, Farming, Push)...`);
        
        fs.writeFileSync(outPath, JSON.stringify(RADAR_DB, null, 2));

        console.log(`✅ [BINGO] Data Parameter Radar berhasil disintesis.`);

        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Fase 15 Selesai! Bot kini bisa membaca sifat player (Playstyle)! 🕸️`);
        console.log(`💾 File tersimpan di: data/processed/id/radar_parameters.json`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
    }
}

module.exports = { execute };