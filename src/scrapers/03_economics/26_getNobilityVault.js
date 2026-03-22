const fs = require('fs');
const path = require('path');

/**
 * 🎁 FASE 26: ETALASE HADIAH VIP PUBLIK (NOBILITY VAULT)
 * Lokasi: src/scrapers/03_economics/26_getNobilityVault.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur Utama: Menyuntikkan database statis berisi detail skin eksklusif
 * dan item kosmetik yang hanya tersedia melalui sistem Nobility (VIP).
 */

// ============================================================================
// 🧠 DATABASE HADIAH EKSKLUSIF NOBILITY (HONOR OF KINGS)
// ============================================================================
const VAULT_DB = {
    metadata: {
        title: "Honor of Kings - Nobility Exclusive Vault",
        description: "Daftar skin dan item kosmetik eksklusif yang dikunci berdasarkan level Nobility."
    },

    exclusive_skins: [
        {
            level_required: "V4",
            hero_name: "Xiang Yu",
            skin_name: "Summer Daze (Beach Party)",
            tier: "Epic",
            features: ["Efek skill tema musim panas/pantai.", "Model Xiang Yu tanpa baju besi (casual)."],
            rarity_note: "Hanya didapat setelah membelanjakan 2.000 Token."
        },
        {
            level_required: "V5",
            hero_name: "Zilong",
            skin_name: "Royal Admiral (Royal Major General)",
            tier: "Epic",
            features: ["Efek skill biru kristal kerajaan.", "Animasi masuk yang gagah."],
            rarity_note: "Hanya didapat setelah membelanjakan 5.000 Token."
        },
        {
            level_required: "V6",
            hero_name: "Di Renjie",
            skin_name: "Magician",
            tier: "Epic",
            features: ["Mengubah kartu Di Renjie menjadi kartu remi ajaib.", "Salah satu skin paling ikonik di HOK."],
            rarity_note: "Hanya didapat setelah membelanjakan 10.000 Token."
        },
        {
            level_required: "V8",
            hero_name: "Consort Yu",
            skin_name: "Cloud Weaver",
            tier: "Legend",
            features: ["Efek Recall eksklusif.", "Animasi berjalan melayang.", "Tampilan sutra awan yang sangat detail."],
            rarity_note: "Hadiah kasta tertinggi untuk level V8 (50.000 Token)."
        }
    ],

    exclusive_cosmetics: {
        recall_effects: [
            { level: "V7", name: "Nobility Gold Recall", desc: "Efek pulang ke markas dengan pilar cahaya emas." },
            { level: "V10", name: "Supreme V10 Recall", desc: "Efek recall paling megah di game." }
        ],
        borders_and_icons: [
            { level: "V3", name: "Nobility Bronze Border" },
            { level: "V7", name: "Nobility Gold Border" },
            { level: "V9", name: "Gold Personal Card", desc: "Kartu nama profil berwarna emas." },
            { level: "V10", name: "Supreme V10 Badge", desc: "Badge khusus yang muncul saat loading screen." }
        ]
    },

    vault_mechanics: [
        "Hadiah skin Nobility akan langsung dikirim ke pesan (Mailbox) atau bisa diklaim di halaman Nobility setelah level tercapai.",
        "Jika level Nobility turun, skin yang sudah didapat TETAP bisa digunakan selamanya.",
        "Hadiah ini tidak dapat dibeli menggunakan Voucher diskon atau Tokens secara langsung."
    ]
};

async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 26] Memulai Eksekusi: Etalase Hadiah VIP");
    console.log("🛠️  Metode: Static Vault Injector");
    console.log("==================================================");

    const processedFolder = path.join(__dirname, '../../../data/processed/id');
    const outPath = path.join(processedFolder, 'nobility_vault.json');

    if (!fs.existsSync(processedFolder)) fs.mkdirSync(processedFolder, { recursive: true });

    try {
        console.log(`📦 [INFO] Menyuntikkan Data Vault: Skin V4-V8, Recall V7, dan Border...`);
        
        fs.writeFileSync(outPath, JSON.stringify(VAULT_DB, null, 2));

        console.log(`✅ [BINGO] Data Etalase Hadiah VIP berhasil dikemas.`);

        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Fase 26 Selesai! Bot kini hafal semua hadiah Sultan! 🎁`);
        console.log(`💾 File tersimpan di: data/processed/id/nobility_vault.json`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
    }
}

module.exports = { execute };