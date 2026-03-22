const fs = require('fs');
const path = require('path');

/**
 * ⏰ FASE 45: MATRIKS JADWAL RESET SERVER (SERVER TIMERS & COUNTDOWNS)
 * Lokasi: src/scrapers/05_integration_ai/45_getServerTimers.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur Utama: Menyuntikkan database statis tentang zona waktu server,
 * jadwal reset harian/mingguan, dan rotasi toko untuk fitur Reminder Bot.
 */

// ============================================================================
// 🧠 DATABASE JADWAL & WAKTU SERVER (HONOR OF KINGS)
// ============================================================================
const TIMERS_DB = {
    metadata: {
        title: "Honor of Kings - Server Timers & Reset Schedules",
        description: "Panduan jadwal reset server harian, mingguan, dan rotasi musiman."
    },

    timezones: {
        server_time: "UTC+0 (Global Standard)",
        local_conversion: "WIB (UTC+7) = Server Time + 7 Jam",
        note: "Beberapa region mungkin menyesuaikan waktu secara lokal, namun sebagian besar reset siklus harian menggunakan patokan jam 05:00 Pagi."
    },

    daily_resets: {
        time: "05:00 WIB (Setiap Hari)",
        events: [
            "Reset Misi Harian (Daily Quests).",
            "Reset batas klaim hadiah Keintiman (Intimacy) harian.",
            "Reset 'First Win of the Day' (Kemenangan Pertama).",
            "Penyegaran stok item harian di Shop."
        ]
    },

    weekly_resets: {
        time: "Senin, 05:00 WIB",
        events: [
            "Reset batas mingguan Gold dan EXP (Jika sudah mencapai *Cap*).",
            "Reset limit pinjam skin Nobility V10 (Kembali ke 8x peminjaman).",
            "Penutupan dan perhitungan papan peringkat (Leaderboard) Hero Power.",
            "Distribusi gelar kehormatan (Title: Kabupaten, Kota, Provinsi).",
            "Misi mingguan Honor Pass diperbarui."
        ]
    },

    monthly_and_seasonal_events: {
        title_supreme: {
            event: "Distribusi Gelar Supreme (Nasional)",
            time: "Tanggal 1 setiap bulannya, pukul 05:00 WIB."
        },
        fragment_store: {
            event: "Rotasi Fragment Store (Skin & Hero)",
            time: "Setiap 2 minggu sekali (Biasanya bersamaan dengan mini-patch hari Selasa atau Kamis)."
        },
        ranked_season: {
            event: "Reset Musim Ranked (Season Drop)",
            time: "Sekitar setiap 3 bulan sekali. Biasanya dilakukan maintenance besar (Major Patch) pada hari Kamis malam hingga Jumat pagi."
        }
    },

    time_limited_modes: {
        description: "Beberapa mode Arcade (Hiburan) hanya dibuka pada waktu tertentu untuk menjaga agar antrean (matchmaking) tidak sepi.",
        modes: [
            "Awakening Match (Mode OP): Biasanya dibuka pada akhir pekan (Jumat - Minggu).",
            "Peak Tournament: Dibuka setiap hari pada jam sibuk (Contoh: 18:00 - 24:00 WIB) khusus untuk pemain tier Master ke atas."
        ]
    }
};

async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 45] Memulai Eksekusi: Matriks Jadwal Reset Server");
    console.log("🛠️  Metode: Static Chrono Database Injector");
    console.log("==================================================");

    const processedFolder = path.join(__dirname, '../../../data/processed/id');
    const outPath = path.join(processedFolder, 'server_timers.json');

    // Buat folder jika belum ada
    if (!fs.existsSync(processedFolder)) fs.mkdirSync(processedFolder, { recursive: true });

    try {
        console.log(`📦 [INFO] Menyuntikkan Data Jadwal: Daily Reset, Weekly Reset, & Rotasi...`);
        
        fs.writeFileSync(outPath, JSON.stringify(TIMERS_DB, null, 2));

        console.log(`✅ [BINGO] Data Jadwal Server berhasil disintesis.`);

        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Fase 45 Selesai! Bot siap menjadi alarm Discord! ⏰`);
        console.log(`💾 File tersimpan di: data/processed/id/server_timers.json`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
    }
}

module.exports = { execute };