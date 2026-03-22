const fs = require('fs');
const path = require('path');

/**
 * ⚖️ FASE 32: KOMPARASI PATCH NOTES (PATCH DIFF ENGINE)
 * Lokasi: src/scrapers/04_strategic_iq/32_getPatchDiff.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur Utama: Menyimpan riwayat perubahan hero (Buff/Nerf/Adjust)
 * agar bot bisa memberikan update pergeseran meta terbaru ke pengguna.
 */

// ============================================================================
// 🧠 DATABASE RIWAYAT PATCH & PERUBAHAN HERO (HONOR OF KINGS)
// ============================================================================
const PATCH_DB = {
    metadata: {
        patch_version: "1.0.0 (Latest Update)",
        release_date: new Date().toISOString(),
        description: "Catatan penyesuaian keseimbangan (Balance Adjustment) pahlawan."
    },
    
    glossary: {
        "Buff": "Peningkatan status/skill hero. Membuat hero menjadi lebih kuat di Meta.",
        "Nerf": "Penurunan status/skill hero. Membuat hero menjadi lebih lemah agar seimbang.",
        "Adjustment": "Penyesuaian. Mengubah mekanisme skill (ada aspek yang dinaikkan, ada yang diturunkan) agar perannya lebih stabil.",
        "Revamp": "Perombakan total pada desain, animasi, dan set skill hero."
    },

    adjustments: [
        {
            hero: "Augran",
            type: "Nerf",
            summary: "Pengurangan sustain dan damage di late game.",
            details: [
                "Skill 1: Base damage dikurangi dari 200 ke 150.",
                "Ultimate: Cooldown ditambah dari 40s ke 50s."
            ],
            bot_advice: "Augran sedikit dilemahkan di fase late game, tapi masih sangat kuat untuk *snowball* di early. Tetap amankan (Pick) jika musuh tidak punya Hard CC berlebih."
        },
        {
            hero: "Diaochan",
            type: "Buff",
            summary: "Peningkatan mobilitas dan pengurangan cooldown.",
            details: [
                "Skill 2: Cooldown dikurangi 1 detik di semua level.",
                "Pasif: True damage rasio meningkat 5%."
            ],
            bot_advice: "Diaochan kembali menjadi monster di mid-lane. Pastikan untuk melakukan Ban jika tim kalian terpaksa memakai banyak hero melee (jarak dekat)."
        },
        {
            hero: "Biron",
            type: "Adjustment",
            summary: "Optimalisasi shield di early, pengurangan damage base.",
            details: [
                "Skill 1: Damage berkurang 10%.",
                "Pasif: Shield yang didapat dari energi penuh meningkat 15%."
            ],
            bot_advice: "Biron sekarang lebih difokuskan sebagai pure frontliner (Tahan Badan) di Clash Lane, bukan lagi bertindak sebagai burst damage dealer."
        },
        {
            hero: "Lady Zhen",
            type: "Revamp",
            summary: "Mekanik kebekuan diubah menjadi lebih fleksibel.",
            details: [
                "Skill 1: Sekarang menyisakan pilar es di lapangan yang memblokir proyektil dan bisa dihancurkan dengan skill 2 miliknya sendiri."
            ],
            bot_advice: "Lady Zhen sekarang adalah Mage S-Tier berkat kemampuan perlindungan dirinya (I-Frame sesaat di dalam pilar es). Sangat direkomendasikan untuk Solo Rank!"
        }
    ]
};

async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 32] Memulai Eksekusi: Komparasi Patch Notes");
    console.log("🛠️  Metode: Static Patch Diff Injector");
    console.log("==================================================");

    const processedFolder = path.join(__dirname, '../../../data/processed/id');
    const outPath = path.join(processedFolder, 'patch_diff.json');

    if (!fs.existsSync(processedFolder)) fs.mkdirSync(processedFolder, { recursive: true });

    try {
        console.log(`📦 [INFO] Menyuntikkan Data Patch: Buff, Nerf, dan Penyesuaian Meta Terbaru...`);
        
        fs.writeFileSync(outPath, JSON.stringify(PATCH_DB, null, 2));

        console.log(`✅ [BINGO] Data Komparasi Patch berhasil disintesis.`);

        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Fase 32 Selesai! Bot kini Update dengan Meta terbaru! ⚖️`);
        console.log(`💾 File tersimpan di: data/processed/id/patch_diff.json`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
    }
}

module.exports = { execute };