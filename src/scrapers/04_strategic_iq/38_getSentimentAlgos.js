const fs = require('fs');
const path = require('path');

/**
 * 📊 FASE 38: MATRIKS POLLING & SENTIMEN (COMMUNITY ENGAGEMENT)
 * Lokasi: src/scrapers/04_strategic_iq/38_getSentimentAlgos.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur Utama: Template jajak pendapat (Polling) interaktif untuk memancing 
 * diskusi (engagement) di Discord, beserta algoritma respons bot.
 */

// ============================================================================
// 🧠 DATABASE TEMPLATE POLLING (HONOR OF KINGS)
// ============================================================================
const SENTIMENT_DB = {
    metadata: {
        title: "Honor of Kings - Community Polling & Sentiment Matrix",
        description: "Template pertanyaan dan algoritma respons untuk fitur interaktif Discord Bot."
    },

    poll_templates: [
        {
            id: "poll_hardest_role",
            question: "🔥 Menurut kalian, ROLE apa yang paling bikin stres kalau dapet tim ampas?",
            options: ["Jungler", "Roamer", "Farm Lane (ADC)", "Mid Lane", "Clash Lane"],
            bot_reactions: {
                "Jungler": "Fakta! Retri meleset dikit langsung dihujat satu tim. 🥲",
                "Roamer": "Bener banget. Udah pasang badan sampai mati, eh timnya malah mundur. 😭",
                "Farm Lane (ADC)": "Nasib ADC: di-gank 4 orang di early game, tapi Mid sama Jungle kita malah asik farming burung. 🦅",
                "Mid Lane": "Disuruh rotasi atas bawah, tapi minion di mid malah dicuri Jungler. Sedih! 🧙‍♀️",
                "Clash Lane": "Clash Lane tuh kayak main game beda server. Ujug-ujug base hancur aja. 🏝️"
            }
        },
        {
            id: "poll_most_annoying_hero",
            question: "🤬 Siapa Hero yang kalau di-pick musuh bikin kalian pengen banting HP?",
            options: ["Donghuang / Liang", "Diaochan", "Augran", "Dolia", "Guiguzi"],
            bot_reactions: {
                "Donghuang / Liang": "Ultimate Suppression emang nggak ada obat! Purify pun menangis melihatnya. 🐍",
                "Diaochan": "Tariannya bikin pusing, apalagi kalau dia bawa Purify. Wajib beli Dominance Ice! 💃",
                "Augran": "Jalannya nembus tembok, lifesteal-nya deras. Ini hero atau hantu? 👻",
                "Dolia": "Baru aja selamat dari Ultimate musuh, eh di-reset lagi sama Dolia. Kelar hidup! 🧜‍♀️",
                "Guiguzi": "Tiba-tiba ngilang, tiba-tiba kesedot, tiba-tiba rata satu tim. 🕳️"
            }
        },
        {
            id: "poll_meta_vs_comfort",
            question: "⚖️ Lagi Solo Rank (Tier Grandmaster), kalian tim apa nih?",
            options: [
                "Tim Meta (Pick hero OP walau belum terlalu jago)",
                "Tim Comfort (Pick hero andalan walau lagi di-Nerf)"
            ],
            bot_reactions: {
                "Tim Meta (Pick hero OP walau belum terlalu jago)": "Bagus! Draft yang menang adalah setengah dari kemenangan match. 📈",
                "Tim Comfort (Pick hero andalan walau lagi di-Nerf)": "Mental baja! Mikro mekanik lebih penting daripada meta. Gas terus Bang! ⚔️"
            }
        }
    ],

    sentiment_logic: {
        description: "Bot akan mengumpulkan reaksi (emoticon) atau pesan balasan. Setelah waktu polling habis (misal: 24 jam), bot akan memanggil 'bot_reactions' sesuai dengan opsi yang mendapat suara terbanyak."
    }
};

async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 38] Memulai Eksekusi: Matriks Polling & Sentimen");
    console.log("🛠️  Metode: Static Engagement Injector");
    console.log("==================================================");

    const processedFolder = path.join(__dirname, '../../../data/processed/id');
    const outPath = path.join(processedFolder, 'sentiment_algos.json');

    // Buat folder jika belum ada
    if (!fs.existsSync(processedFolder)) fs.mkdirSync(processedFolder, { recursive: true });

    try {
        console.log(`📦 [INFO] Menyuntikkan Template Polling: Hardest Role, Annoying Heroes...`);
        
        fs.writeFileSync(outPath, JSON.stringify(SENTIMENT_DB, null, 2));

        console.log(`✅ [BINGO] Data Polling dan Sentimen berhasil dikemas.`);

        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Fase 38 Selesai! PILAR 4 (STRATEGIC IQ) RESMI TAMAT! 📊🧠`);
        console.log(`💾 File tersimpan di: data/processed/id/sentiment_algos.json`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
    }
}

module.exports = { execute };