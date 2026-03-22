const fs = require('fs');
const path = require('path');

/**
 * ⏱️ FASE 16: INFOGRAFIS WAKTU ROTASI HUTAN (JUNGLE TIMINGS)
 * Lokasi: src/scrapers/02_game_intelligence/16_getJungleRotations.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur Utama: Menyuntikkan database statis waktu kemunculan monster hutan (Spawn/Respawn)
 * serta pola rotasi dasar untuk Jungler.
 */

// ============================================================================
// 🧠 DATABASE JUNGLE TIMINGS & ROTATION (HONOR OF KINGS)
// ============================================================================
const JUNGLE_DB = {
    metadata: {
        title: "Honor of Kings - Jungle Timings & Rotation Guide",
        description: "Panduan mutlak waktu kemunculan monster hutan dan rute rotasi dasar Jungler."
    },

    timers: {
        buff_monsters: {
            name: "Azure Golem (Blue) & Crimson Golem (Red)",
            initial_spawn: "00:30",
            respawn_time: "90 detik (1 menit 30 detik) setelah dikalahkan",
            buff_duration: "70 detik",
            note: "Jika Anda membunuh buff pada menit 01:00, buff tersebut akan muncul kembali pada menit 02:30."
        },
        small_camps: {
            name: "Monster Hutan Kecil (Serigala, Babi Hutan, Kadal, dll)",
            initial_spawn: "00:30",
            respawn_time: "70 detik (1 menit 10 detik) setelah dikalahkan",
            note: "Sumber Gold/EXP tambahan untuk memastikan Jungler mencapai Level 4 setelah rotasi penuh."
        },
        river_monsters: {
            firehawk: {
                name: "Firehawk (Burung Mid Lane)",
                initial_spawn: "00:30",
                respawn_time: "60 detik (1 menit)",
                note: "Sangat penting diamankan oleh Mage/Support/Jungler karena memberikan vision (penglihatan) di area sungai musuh."
            }
        },
        epic_monsters_reminder: {
            tyrant_overlord: "Muncul di 02:00. Respawn setiap 4 menit.",
            shadow_dragons: "Muncul di 10:00. Menggantikan versi sebelumnya.",
            tempest_dragon: "Muncul di 20:00 (Sudden Death Phase)."
        }
    },

    standard_rotations: [
        {
            name: "Rotasi Biru (Blue Start)",
            ideal_for: "Jungler pemakan Mana (Luna, Nakoruru, Li Bai, Wuyan).",
            pathing: [
                "1. Azure Golem (Blue Buff) - Mulai jam 00:30.",
                "2. Selesaikan sisa monster kecil di area Biru.",
                "3. Bergeser ke area Merah (ambil Crimson Golem).",
                "4. Selesaikan monster kecil terakhir (Harusnya mencapai Level 4).",
                "5. Gank Clash Lane atau Farm Lane yang terdekat dengan Red Buff.",
                "6. Persiapan kontes Tyrant pertama di menit 02:00."
            ]
        },
        {
            name: "Rotasi Merah (Red Start)",
            ideal_for: "Jungler berbasis Basic Attack / Physical (Pei, Wukong, Dian Wei).",
            pathing: [
                "1. Crimson Golem (Red Buff) - Mulai jam 00:30.",
                "2. Selesaikan sisa monster kecil di area Merah.",
                "3. Bergeser ke area Biru (ambil Azure Golem).",
                "4. Selesaikan monster kecil terakhir (Level 4).",
                "5. Gank lane yang berlawanan.",
                "6. Persiapan kontes Tyrant/Overlord di menit 02:00."
            ]
        },
        {
            name: "Invade / Counter-Jungle",
            ideal_for: "Jungler early game yang sangat kuat (Pei, Ukyo Tachibana) dibantu Roamer inisiator.",
            pathing: [
                "1. Abaikan buff sendiri, langsung bergerak bersama Roamer/Mage ke Buff musuh di detik 00:30.",
                "2. Curi buff menggunakan Smite.",
                "3. Segera kembali ke area hutan sendiri agar tidak terkepung.",
                "4. Melakukan rotasi normal dengan keunggulan 3 Buff."
            ]
        }
    ],

    jungler_tips: [
        "Selalu perhatikan mini-map sebelum melakukan Invade. Jika Mage dan Roamer musuh menghilang, mereka mungkin sedang menunggu Anda di semak.",
        "Smite (Retribution) memberikan 1500 True Damage di level 1. Jangan gunakan di awal, simpan untuk melakukan 'Last Hit' agar buff tidak dicuri musuh.",
        "Meninggalkan monster kecil satu ekor di area hutan musuh akan menunda waktu respawn seluruh camp tersebut, merugikan ekonomi Jungler musuh."
    ]
};

async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 16] Memulai Eksekusi: Infografis Waktu Rotasi Hutan");
    console.log("🛠️  Metode: Static Jungle Timings Injector");
    console.log("==================================================");

    const processedFolder = path.join(__dirname, '../../../data/processed/id');
    const outPath = path.join(processedFolder, 'jungle_rotations.json');

    if (!fs.existsSync(processedFolder)) fs.mkdirSync(processedFolder, { recursive: true });

    try {
        console.log(`📦 [INFO] Menyuntikkan Data Rotasi: Waktu Spawn, Respawn, dan Pathing Jungler...`);
        
        fs.writeFileSync(outPath, JSON.stringify(JUNGLE_DB, null, 2));

        console.log(`✅ [BINGO] Data Waktu Rotasi Hutan berhasil disintesis.`);

        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Fase 16 Selesai! Bot siap menjadi Coach Jungler! ⏱️`);
        console.log(`💾 File tersimpan di: data/processed/id/jungle_rotations.json`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
    }
}

module.exports = { execute };