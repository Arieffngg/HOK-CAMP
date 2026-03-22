const fs = require('fs');
const path = require('path');

/**
 * 🤝 FASE 27: ATURAN BERBAGI SKIN VIP (V10 SHARING PROTOCOL)
 * Lokasi: src/scrapers/03_economics/27_getVIPSharingLimits.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur Utama: Menyuntikkan database statis tentang batasan, syarat, 
 * dan protokol penggunaan fitur 'Skin Sharing' bagi pemain Nobility V10.
 */

// ============================================================================
// 🧠 DATABASE PROTOKOL SKIN SHARING (HONOR OF KINGS)
// ============================================================================
const SHARING_DB = {
    metadata: {
        title: "Honor of Kings - V10 Skin Sharing Rules & Limits",
        description: "Panduan teknis mengenai batasan berbagi skin antara pemain V10 dan rekan tim."
    },

    core_mechanics: {
        eligibility: "Hanya pemain dengan status Nobility V10 yang dapat mengaktifkan fitur berbagi skin.",
        activation: "Fitur harus diaktifkan secara manual di menu Nobility V10 sebelum masuk ke dalam match.",
        scope: "Skin hanya bisa dipinjamkan kepada rekan tim yang berada dalam SATU PARTY (tim yang sama) saat bermain di mode yang mendukung."
    },

    usage_limits: {
        weekly_borrow_limit: {
            amount: 8,
            reset_day: "Senin (Waktu Server)",
            description: "Setiap pemain (non-V10) hanya dapat meminjam skin dari teman V10 mereka maksimal 8 kali dalam satu minggu."
        },
        individual_hero_limit: "Tidak ada batasan per hero. Pemain bisa meminjam skin berbeda untuk hero yang sama selama kuota mingguan masih ada."
    },

    skin_restrictions: {
        sharable: [
            "Skin Normal / Basic",
            "Skin Rare (Brave)",
            "Skin Epic",
            "Skin Legend",
            "Skin Limited (Beberapa varian tertentu)"
        ],
        non_sharable: [
            "Skin Mythic (Honor Crystal) - Beberapa server membatasi ini demi eksklusivitas mutlak.",
            "Skin Partner / Collab Khusus (Tergantung lisensi IP terkait).",
            "Skin yang sedang dalam masa promosi rilis hari pertama (tergantung kebijakan event)."
        ]
    },

    supported_modes: [
        "5v5 Quick Match (Normal)",
        "Ranked Match (Hanya jika dalam party yang sama)",
        "Mode Hiburan (Entertainment Modes)",
        "Custom Match"
    ],

    bot_faq: [
        {
            q: "Kalau saya party sama 2 orang V10, apakah limit pinjam saya nambah?",
            a: "Tidak. Limit 8 kali seminggu melekat pada AKUN peminjam, bukan pada pemberi pinjaman."
        },
        {
            q: "Apakah skin yang dipinjam dapet bonus stat?",
            a: "Ya, skin yang dipinjam memberikan bonus atribut dasar yang sama (+10 Attack/Power) seperti skin milik sendiri."
        }
    ]
};

async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 27] Memulai Eksekusi: Aturan Berbagi Skin VIP");
    console.log("🛠️  Metode: Static Policy Injector");
    console.log("==================================================");

    const processedFolder = path.join(__dirname, '../../../data/processed/id');
    const outPath = path.join(processedFolder, 'vip_sharing_limits.json');

    if (!fs.existsSync(processedFolder)) fs.mkdirSync(processedFolder, { recursive: true });

    try {
        console.log(`📦 [INFO] Menyuntikkan Protokol V10: Limit Mingguan (8x), Mode Support, & Restriksi...`);
        
        fs.writeFileSync(outPath, JSON.stringify(SHARING_DB, null, 2));

        console.log(`✅ [BINGO] Protokol Sharing VIP berhasil dikonfigurasi.`);

        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Fase 27 Selesai! Bot kini paham aturan 'Numpang Skin'! 🤝`);
        console.log(`💾 File tersimpan di: data/processed/id/vip_sharing_limits.json`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
    }
}

module.exports = { execute };