const fs = require('fs');
const path = require('path');

/**
 * 📱 FASE 44: MATRIKS HARDWARE & GRAFIS (TECH SUPPORT ENGINE)
 * Lokasi: src/scrapers/05_integration_ai/44_getHardwareMatrix.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur Utama: Panduan spesifikasi minimum, setting grafis optimal,
 * dan troubleshooting untuk masalah lag/frame drop di Honor of Kings.
 */

// ============================================================================
// 🧠 DATABASE SPESIFIKASI & PENGATURAN GRAFIS (HONOR OF KINGS)
// ============================================================================
const HARDWARE_DB = {
    metadata: {
        title: "Honor of Kings - Hardware Specs & Graphics Optimization",
        description: "Panduan dukungan teknis untuk spesifikasi perangkat dan optimasi FPS."
    },

    device_specifications: {
        minimum: {
            os: "Android 5.1 / iOS 11.0",
            ram: "2 GB (Disarankan 3GB ke atas)",
            cpu: "Snapdragon 430 / Apple A9 atau setara",
            storage: "Minimal ruang kosong 5 GB"
        },
        recommended: {
            os: "Android 11.0 / iOS 14.0 atau lebih baru",
            ram: "4 GB - 8 GB",
            cpu: "Snapdragon 845 / Apple A11 Bionic atau setara",
            storage: "Minimal ruang kosong 8 GB - 10 GB (Untuk semua aset 3D & Skin)"
        }
    },

    graphics_settings_guide: [
        {
            setting: "Frame Rate (FPS)",
            priority: "Sangat Tinggi (Prioritas Utama)",
            options: ["Hemat Daya (30 FPS)", "Tinggi (60 FPS)", "Super Tinggi (90 FPS)", "Ultra (120 FPS)"],
            bot_advice: "Selalu prioritaskan Frame Rate setinggi mungkin yang didukung HP kamu! Turunkan Resolusi dan Kualitas Grafis jika HP mulai panas, tapi JANGAN turunkan Frame Rate agar pergerakan hero tetap mulus (tidak patah-patah)."
        },
        {
            setting: "Resolusi (Resolution)",
            priority: "Menengah",
            options: ["Hemat Daya", "Sedang", "Tinggi", "Ultra"],
            bot_advice: "Menentukan ketajaman gambar. Jika HP kamu kentang, ubah ke 'Sedang' atau 'Hemat Daya'. Ini sangat ampuh untuk mencegah HP cepat panas (Overheat)."
        },
        {
            setting: "Kualitas Grafis secara Umum (Overall Quality)",
            priority: "Rendah (Kosmetik)",
            options: ["Mulus", "Standar", "HD", "Ultra"],
            bot_advice: "Hanya mempengaruhi seberapa bagus efek skill, bayangan, dan pantulan air. Pemain kompetitif (Pro Player) biasanya menyetel ini ke 'Mulus' atau 'Standar' agar efek visual tidak menutupi indikator skill musuh saat war."
        }
    ],

    troubleshooting_tips: {
        "Ping Tinggi (Lag Jaringan)": "Masuk ke Pengaturan > Jaringan > Nyalakan 'Akselerasi Jaringan Dual-Mode' (menggabungkan Wi-Fi dan Data Seluler secara bersamaan).",
        "Frame Drop / Patah-patah saat Teamfight": "Matikan fitur 'Anti-Aliasing' dan 'Dynamic Resolution' di pengaturan Grafis. Kedua fitur ini sangat membebani kinerja prosesor HP.",
        "Aplikasi Force Close (Keluar Sendiri)": "Pastikan RAM HP kamu tidak kepenuhan. Tutup aplikasi lain yang berjalan di background sebelum membuka Honor of Kings. Jika masih terjadi, coba 'Repair' data di layar login."
    }
};

async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 44] Memulai Eksekusi: Matriks Hardware & Grafis");
    console.log("🛠️  Metode: Static Tech Support Injector");
    console.log("==================================================");

    const processedFolder = path.join(__dirname, '../../../data/processed/id');
    const outPath = path.join(processedFolder, 'hardware_matrix.json');

    // Buat folder jika belum ada
    if (!fs.existsSync(processedFolder)) fs.mkdirSync(processedFolder, { recursive: true });

    try {
        console.log(`📦 [INFO] Menyuntikkan Data Teknis: Spek Minimum, Optimasi FPS, & Network Boost...`);
        
        fs.writeFileSync(outPath, JSON.stringify(HARDWARE_DB, null, 2));

        console.log(`✅ [BINGO] Data Panduan Hardware berhasil disintesis.`);

        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Fase 44 Selesai! Bot kini bisa jadi IT Support! 📱`);
        console.log(`💾 File tersimpan di: data/processed/id/hardware_matrix.json`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
    }
}

module.exports = { execute };