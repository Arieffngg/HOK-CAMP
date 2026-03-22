const fs = require('fs');
const path = require('path');

/**
 * 🛡️ FASE 46: KAMUS KODE ERROR & ANTI-CHEAT (BAN WAVE INTEL)
 * Lokasi: src/scrapers/05_integration_ai/46_getBanWaveIntel.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur Utama: Menyuntikkan database statis tentang kode error login/jaringan,
 * durasi hukuman ban (Anti-Cheat), dan panduan penyelesaian masalah (Troubleshooting).
 */

// ============================================================================
// 🧠 DATABASE KODE ERROR & SISTEM KEAMANAN (HONOR OF KINGS)
// ============================================================================
const SECURITY_DB = {
    metadata: {
        title: "Honor of Kings - Error Codes & Anti-Cheat Intelligence",
        description: "Panduan penyelesaian masalah untuk kode error in-game dan daftar hukuman sistem keamanan."
    },

    common_error_codes: [
        {
            code: "Error 100015 / 100016",
            issue: "Network Timeout / Gagal terhubung ke server login.",
            solution: "Ganti koneksi dari Wi-Fi ke Data Seluler (atau sebaliknya). Jika menggunakan VPN/DNS kustom, matikan terlebih dahulu. Restart game."
        },
        {
            code: "Error 5.1.2.x / Version Mismatch",
            issue: "Versi klien game tidak sinkron dengan server.",
            solution: "Pergi ke Google Play Store / App Store dan lakukan Update aplikasi secara manual. Jangan masuk ke game sebelum update selesai."
        },
        {
            code: "Error 154140677",
            issue: "Server penuh atau sedang dalam tahap antrean (Queue).",
            solution: "Jangan tekan tombol 'Batal'. Tunggu di layar antrean hingga sistem memasukkan Anda secara otomatis."
        },
        {
            code: "Resource Download Failed / Mentok di 99%",
            issue: "Korupsi data saat mengunduh aset in-game (Skin/Map).",
            solution: "Gunakan fitur 'Repair' (Perbaiki) berbentuk ikon Kunci Pas di kanan atas layar Login. Jika gagal, hapus cache aplikasi dari pengaturan HP."
        }
    ],

    anti_cheat_system: {
        description: "Honor of Kings memiliki toleransi NOL terhadap kecurangan. Pelanggaran berat akan mengakibatkan pemblokiran akun (Banned) secara instan.",
        violations: [
            {
                type: "Map Hack / Vision Mod",
                severity: "Sangat Berat (Lethal)",
                penalty: "Banned Permanen (3650 Hari / 10 Tahun).",
                details: "Menggunakan aplikasi pihak ketiga untuk membuka kabut/semak di peta."
            },
            {
                type: "Skin Mod / Script",
                severity: "Berat",
                penalty: "Banned 7 Hari hingga 10 Tahun.",
                details: "Mengubah file in-game untuk memakai skin berbayar secara gratis. Walau hanya terlihat di layar sendiri, sistem tetap mendeteksinya sebagai modifikasi ilegal."
            },
            {
                type: "Win Trading (Joki MMR Ilegal)",
                severity: "Berat",
                penalty: "Banned 30 Hari hingga 365 Hari + Reset Leaderboard.",
                details: "Mengatur matchmaking (biasanya di Peak Tournament atau tier tinggi) agar bertemu teman sendiri dan sengaja mengalah demi menaikkan Hero Power."
            },
            {
                type: "Top-Up Ilegal (Refund Fraud)",
                severity: "Berat",
                penalty: "Token menjadi Minus (-) / Banned Permanen.",
                details: "Melakukan top-up melalui jasa tidak resmi hasil curian (Carding) atau melakukan penarikan dana (Refund) setelah Token digunakan."
            }
        ],
        bot_advice: "Akun kamu ke-Banned 10 Tahun (3650 Hari)? Ikhlasin aja Bang, bikin akun baru. Sistem Anti-Cheat Tencent itu sekelas militer, hampir mustahil salah deteksi kalau soal Map Hack atau Mod."
    }
};

async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 46] Memulai Eksekusi: Kamus Kode Error & Anti-Cheat");
    console.log("🛠️  Metode: Static Security Database Injector");
    console.log("==================================================");

    const processedFolder = path.join(__dirname, '../../../data/processed/id');
    const outPath = path.join(processedFolder, 'ban_wave_intel.json');

    // Buat folder jika belum ada
    if (!fs.existsSync(processedFolder)) fs.mkdirSync(processedFolder, { recursive: true });

    try {
        console.log(`📦 [INFO] Menyuntikkan Intelijen Keamanan: Kode Error, Hukuman Map Hack & Skin Mod...`);
        
        fs.writeFileSync(outPath, JSON.stringify(SECURITY_DB, null, 2));

        console.log(`✅ [BINGO] Data Kamus Kode Error berhasil disintesis.`);

        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Fase 46 Selesai! Bot siap jadi tim Cyber Security! 🛡️`);
        console.log(`💾 File tersimpan di: data/processed/id/ban_wave_intel.json`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
    }
}

module.exports = { execute };