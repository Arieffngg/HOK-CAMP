const fs = require('fs');
const path = require('path');

/**
 * 🐲 FASE 10: MASTER MAP ENTITIES INJECTOR
 * Lokasi: src/scrapers/02_game_intelligence/10_getMapEntities.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur Utama: Single Source of Truth untuk Ekologi Peta, Monster Epik, 
 * Buff Hutan, Jenis Minion, dan Fase Pertandingan (Match Phases).
 */

// ============================================================================
// 🧠 DATABASE ENTITAS PETA (HONOR OF KINGS - ID EDITION)
// ============================================================================
const MAP_DB = {
    epic_monsters: [
        {
            id: "tyrant",
            name: "Tyrant",
            spawn_time: "02:00",
            respawn_interval: "4 Menit",
            despawn_time: "09:55",
            buff_effect: "Memberikan Gold dan EXP instan untuk seluruh anggota tim. Serangan berikutnya dari seluruh anggota tim akan memicu Chain Lightning (Kekuatan Petir) yang memberikan Magic Damage tambahan.",
            priority: "Sangat penting di Early Game untuk keunggulan level."
        },
        {
            id: "overlord",
            name: "Overlord",
            spawn_time: "02:00",
            respawn_interval: "4 Menit",
            despawn_time: "09:55",
            buff_effect: "Memberikan sedikit Gold/EXP. Memanggil 2 gelombang Overlord Vanguard (Naga) yang sangat kuat di satu lane pilihan untuk membantu melakukan Push (menghancurkan tower).",
            priority: "Penting untuk membuka visi (map control) dan menekan tower musuh."
        },
        {
            id: "shadow_tyrant",
            name: "Shadow Tyrant",
            spawn_time: "10:00",
            respawn_interval: "4 Menit",
            despawn_time: "19:30",
            buff_effect: "Memberikan buff 'Shadow Wrath'. Serangan tim akan memberikan efek berantai ekstra. Bergerak meninggalkan markas akan memberikan bonus Movement Speed.",
            priority: "Wajib diamankan untuk memenangkan peperangan tim (Teamfight) di Mid Game."
        },
        {
            id: "shadow_overlord",
            name: "Shadow Overlord",
            spawn_time: "10:00",
            respawn_interval: "4 Menit",
            despawn_time: "19:30",
            buff_effect: "Memanggil Shadow Vanguard raksasa dari markas yang membersihkan semua minion musuh di satu lane seketika. Meninggalkan jejak 'Shadow Path' yang memperkuat minion dan hero teman.",
            priority: "Kunci utama untuk menjebol Base Tower (High Ground) musuh."
        },
        {
            id: "tempest_dragon",
            name: "Tempest Dragon",
            spawn_time: "20:00",
            respawn_interval: "3 Menit",
            despawn_time: "Never",
            buff_effect: "Objektif Terkuat! Memberikan Shield (Perisai) permanen sebesar 20% Max HP. Seluruh serangan akan menyambar musuh terdekat dengan True Damage petir. Memanggil Tempest Vanguard super kuat di SEMUA lane.",
            priority: "Penentu akhir permainan (End Game). Siapa yang dapat, kemungkinan besar menang."
        }
    ],
    
    jungle_monsters: [
        {
            id: "blue_buff",
            name: "Azure Golem (Blue Buff)",
            spawn_time: "00:30",
            respawn_interval: "90 Detik",
            buff_effect: "Memberikan Azure Crest: Mengurangi Cooldown skill sebesar 20% dan meregenerasi Mana secara drastis setiap detiknya selama 70 detik.",
            ideal_for: "Mage dan Jungler/Assassin yang boros Mana (seperti Nakoruru, Li Bai, Luna)."
        },
        {
            id: "red_buff",
            name: "Crimson Golem (Red Buff)",
            spawn_time: "00:30",
            respawn_interval: "90 Detik",
            buff_effect: "Memberikan Crimson Crest: Basic Attack akan memberikan efek Slow kepada musuh dan memberikan True Damage tambahan berupa efek bakar (burn) selama 70 detik.",
            ideal_for: "Marksman dan Jungler berbasis Physical/Basic Attack (seperti Pei, Wukong)."
        },
        {
            id: "firehawk",
            name: "Firehawk",
            spawn_time: "00:30",
            respawn_interval: "60 Detik",
            buff_effect: "Berada di sungai mid-lane. Jika dikalahkan, akan berpatroli di area sungai lawan untuk memberikan penglihatan (Vision) ekstra selama 60 detik."
        }
    ],

    lanes: [
        {
            id: "clash_lane",
            name: "Clash Lane",
            characteristic: "Jalur dengan tambahan monster teleportasi. Terdapat tambahan EXP dari minion khusus (Melee/Mecha) di awal game. Dekat dengan area Overlord.",
            ideal_role: "Fighter / Tank. Bertugas bermain mandiri dan menang duel satu lawan satu."
        },
        {
            id: "mid_lane",
            name: "Mid Lane",
            characteristic: "Jalur tengah yang paling pendek. Gelombang minion tiba paling cepat. Memberikan akses rotasi tercepat ke sisi atas maupun bawah peta.",
            ideal_role: "Mage. Bertugas menguasai gelombang minion secepatnya lalu membantu rotasi (ganking) ke jalur lain."
        },
        {
            id: "farm_lane",
            name: "Farm Lane",
            characteristic: "Jalur yang dilindungi struktur peta dengan aman. Memberikan ekstra Gold dari minion uang (Ranged). Dekat dengan area Tyrant.",
            ideal_role: "Marksman + Roamer. Bertugas mengumpulkan gold secepat mungkin agar bisa menjadi Carry di late game."
        }
    ],

    match_phases: [
        {
            phase: "Early Game",
            duration: "Menit 00:00 - 04:00",
            mechanics: "Perisai Tower (Plating) aktif, memberikan pertahanan besar tapi menghadiahkan Gold jika dihancurkan. Perlindungan Jungle aktif (musuh mendapat reduksi damage 10% jika menyerang hutan kita)."
        },
        {
            phase: "Mid Game",
            duration: "Menit 04:00 - 10:00",
            mechanics: "Perisai Tower menghilang. Tyrant dan Overlord menjadi objektif rotasi utama. Fase terjadinya banyak teamfight berskala kecil hingga menengah."
        },
        {
            phase: "Late Game",
            duration: "Menit 10:00 - 20:00",
            mechanics: "Shadow Tyrant dan Shadow Overlord muncul. Satu kesalahan (terculik/mati) bisa menyebabkan kekalahan karena waktu respawn hero mulai sangat lama."
        },
        {
            phase: "Ultra Late Game",
            duration: "Menit 20:00+",
            mechanics: "Tempest Dragon muncul. Minion menjadi sangat tebal. Ini adalah fase hidup dan mati mutlak (Sudden Death)."
        }
    ]
};

async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 10] Memulai Eksekusi: Master Map Entities");
    console.log("🛠️  Metode: Static Intelligence Injector");
    console.log("==================================================");

    const processedFolder = path.join(__dirname, '../../../data/processed/id');
    const outPath = path.join(processedFolder, 'map_entities.json');

    // Buat folder jika belum ada
    if (!fs.existsSync(processedFolder)) {
        fs.mkdirSync(processedFolder, { recursive: true });
    }

    try {
        console.log(`📦 [INFO] Menyuntikkan Intelijen Peta: Monster, Lane, dan Fase...`);
        
        fs.writeFileSync(outPath, JSON.stringify(MAP_DB, null, 2));

        console.log(`✅ [BINGO] Data Entitas Peta (Gorge) berhasil dikemas.`);

        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Fase 10 Selesai! Bot kini memahami Peta Game! 🗺️`);
        console.log(`💾 File tersimpan di: data/processed/id/map_entities.json`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
    }
}

module.exports = { execute };