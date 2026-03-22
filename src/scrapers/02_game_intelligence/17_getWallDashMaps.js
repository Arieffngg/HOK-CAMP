const fs = require('fs');
const path = require('path');

/**
 * 🗺️ FASE 17: PARAMETER DIMENSI PETA & OBJEKTIF (WALL DASH & BUSH MECHANICS)
 * Lokasi: src/scrapers/02_game_intelligence/17_getWallDashMaps.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur Utama: Menyuntikkan database statis tentang interaksi fisik peta 
 * seperti Tower, Bush (Semak), dan mekanik Wall Dash.
 */

// ============================================================================
// 🧠 DATABASE DIMENSI PETA & MEKANIK FISIK (HONOR OF KINGS)
// ============================================================================
const MAP_DIMENSIONS_DB = {
    metadata: {
        title: "Honor of Kings - Map Dimensions & Physics Guide",
        description: "Panduan mekanik fisik peta: Tower, Semak (Bush), dan interaksi menembus dinding (Wall Dash)."
    },

    structures: {
        towers: {
            name: "Menara (Turrets)",
            mechanics: [
                "🎯 **Targeting Prioritas:** Tower selalu menyerang Minion terlebih dahulu. Namun, jika Anda menyerang Hero musuh di dalam area jangkauan Tower musuh, Tower akan LANGSUNG menargetkan Anda.",
                "📈 **Damage Escalation:** Damage dari tembakan Tower akan terus MENINGKAT setiap kali mengenai target yang sama secara berturut-turut. Semakin lama menahan badan (Tebe) di tower, semakin cepat mati.",
                "🛡️ **Anti-Backdoor Protection:** Tower memiliki perisai pertahanan sangat besar yang mengurangi damage secara drastis jika TIDAK ADA minion teman di sekitarnya. Jangan push tanpa minion!",
                "💰 **Tower Plating (Menit 0-4):** Di awal game, Tower memiliki perisai ekstra. Menghancurkan perisai ini akan memberikan bonus Gold."
            ]
        },
        base_crystal: {
            name: "Kristal Markas (Base Crystal)",
            mechanics: [
                "💖 **Regenerasi Cepat:** Berada di area Kristal (Fountain) memulihkan HP dan Mana dengan sangat cepat.",
                "🛡️ **Shield Otomatis:** Kristal akan memunculkan Shield (Perisai) secara otomatis jika sedang diserang.",
                "☠️ **True Damage Fountain:** Masuk terlalu dalam ke titik *spawn* musuh (Fountain) akan memberikan True Damage mematikan yang mengabaikan segala jenis kelebalan/I-Frame."
            ]
        }
    },

    environment: {
        bushes: {
            name: "Semak-Semak (Brush / Bush)",
            mechanics: [
                "👻 **Vision Obscurity:** Berada di dalam semak membuat Anda tidak terlihat (Invisible) oleh musuh yang ada di luarnya, kecuali mereka memiliki skill pembuka Vision (seperti skill 1 Hou Yi).",
                "⚔️ **Attack Reveal:** Jika Anda menyerang (Basic Attack atau Skill) musuh dari DALAM semak, posisi Anda akan langsung ketahuan dan semak tidak lagi menyembunyikan Anda selama beberapa detik.",
                "👁️ **Shared Vision:** Jika satu musuh masuk ke semak dan melihat Anda, seluruh tim musuh di peta bisa melihat Anda."
            ],
            tips: "Gunakan semak untuk melakukan Recall (Teleport) agar aman, atau untuk menyiapkan taktik Ganking (Begal) bersama tim."
        },
        walls: {
            name: "Dinding Peta (Walls)",
            mechanics: [
                "🏃‍♂️ **Wall Dash (Tembus Dinding):** Banyak hero memiliki skill Blink/Dash yang bisa menembus dinding (contoh: Li Bai, Han Xin, Pei).",
                "📏 **Ketebalan Dinding:** Jika indikator target skill Anda lebih dari setengah menembus dinding, hero Anda akan berhasil melompat menembus dinding tersebut. Jika kurang, hero Anda akan menabrak dinding (Gagal Dash).",
                "💥 **Interaksi Skill:** Beberapa skill hero (seperti tembok Nuwa atau babi hutan Agudo) bertindak seperti dinding fisik sementara yang bisa memblokir pergerakan."
            ]
        }
    },

    strategic_chokepoints: [
        {
            location: "Sungai Mid Lane (River)",
            importance: "Sangat Tinggi",
            description: "Area paling sering terjadi pertempuran (Teamfight) di early-mid game karena memperebutkan Firehawk dan memberikan akses cepat ke Tyrant/Overlord."
        },
        {
            location: "Area Pit Naga (Tyrant & Overlord Pits)",
            importance: "Krusial",
            description: "Pintu masuk ke area naga sangat sempit. Hero dengan Area of Effect (AoE) besar seperti Diaochan, Wuyan, atau Lian Po sangat mendominasi pertarungan di lorong-lorong ini."
        }
    ]
};

async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 17] Memulai Eksekusi: Parameter Dimensi Peta & Objektif");
    console.log("🛠️  Metode: Static Map Dimensions Injector");
    console.log("==================================================");

    const processedFolder = path.join(__dirname, '../../../data/processed/id');
    const outPath = path.join(processedFolder, 'map_dimensions.json');

    if (!fs.existsSync(processedFolder)) fs.mkdirSync(processedFolder, { recursive: true });

    try {
        console.log(`📦 [INFO] Menyuntikkan Data Interaksi Fisik Peta: Tower, Bush, dan Wall Dash...`);
        
        fs.writeFileSync(outPath, JSON.stringify(MAP_DIMENSIONS_DB, null, 2));

        console.log(`✅ [BINGO] Data Parameter Fisik Peta berhasil disintesis.`);

        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Fase 17 Selesai! Pengetahuan Geografis Bot makin komplit! 🗺️`);
        console.log(`💾 File tersimpan di: data/processed/id/map_dimensions.json`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
    }
}

module.exports = { execute };