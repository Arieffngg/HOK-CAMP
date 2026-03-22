const fs = require('fs');
const path = require('path');
const https = require('https');

/**
 * 🛡️ FASE 40: EKSTRAKSI STATUS SERVER (INFRASTRUCTURE MONITOR)
 * Lokasi: src/scrapers/05_integration_ai/40_getInfra.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur Utama: Memonitor status ketersediaan (Uptime) web/API resmi HOK
 * dan menyimpan database jadwal maintenance rutin.
 */

// ============================================================================
// 📡 FUNGSI RADAR: MELAKUKAN PING KE SERVER TENCENT
// ============================================================================
function checkServer(url) {
    return new Promise((resolve) => {
        const start = Date.now();
        https.get(url, (res) => {
            const latency = Date.now() - start;
            // 200 = OK, 301/302 = Redirect (Wajar untuk web global)
            const isOnline = res.statusCode === 200 || res.statusCode === 301 || res.statusCode === 302;
            resolve({
                target: url,
                status: isOnline ? "🟢 ONLINE" : `🟡 HTTP ${res.statusCode}`,
                ping_ms: latency,
                checked_at: new Date().toISOString()
            });
        }).on('error', (err) => {
            resolve({
                target: url,
                status: "🔴 OFFLINE",
                error: err.message,
                checked_at: new Date().toISOString()
            });
        });
    });
}

// ============================================================================
// 🚀 FUNGSI EKSEKUSI
// ============================================================================
async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 40] Memulai Eksekusi: Monitor Status Server");
    console.log("🛠️  Metode: HTTP Ping & Static Maintenance DB");
    console.log("==================================================");

    const processedFolder = path.join(__dirname, '../../../data/processed/id');
    const outPath = path.join(processedFolder, 'server_infra.json');

    // Buat folder jika belum ada
    if (!fs.existsSync(processedFolder)) fs.mkdirSync(processedFolder, { recursive: true });

    try {
        console.log(`📡 [PING] Mengirim sinyal ke infrastruktur Honor of Kings...`);

        // Mengecek status web utama dan Camp
        const mainWebStatus = await checkServer('https://www.honorofkings.com/');
        const campWebStatus = await checkServer('https://camp.honorofkings.com/');

        const INFRA_DB = {
            metadata: {
                title: "Honor of Kings - Infrastructure & Server Status",
                description: "Monitor real-time (saat di-ping) dan panduan jadwal maintenance server."
            },
            live_status: [
                mainWebStatus,
                campWebStatus
            ],
            maintenance_rules: {
                weekly_reset: "Setiap hari Senin pukul 05:00 WIB (Reset batas Hero Power, Misi Mingguan, & Batas Pinjam Skin V10).",
                daily_reset: "Setiap hari pukul 05:00 WIB (Reset misi harian & event point).",
                major_patch: "Biasanya dilakukan pada hari Kamis (sekitar jam 04:00 - 08:00 WIB). Server akan ditutup sebagian atau sepenuhnya untuk update musim/hero baru."
            },
            bot_advice: [
                "Jika status server 🔴 OFFLINE, kemungkinan besar sedang ada Major Patch (Update Musim). Silakan tunggu pengumuman resmi.",
                "Jika bot mengatakan server ONLINE tapi ping in-game Anda tinggi (>100ms), coba gunakan fitur 'Network Boost' (Akselerasi Jaringan) di pengaturan in-game HOK."
            ]
        };

        fs.writeFileSync(outPath, JSON.stringify(INFRA_DB, null, 2));

        console.log(`   ✅ Status Web Utama: ${mainWebStatus.status} (${mainWebStatus.ping_ms}ms)`);
        console.log(`   ✅ Status Web Camp:  ${campWebStatus.status} (${campWebStatus.ping_ms}ms)`);

        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Fase 40 Selesai! Radar infrastruktur aktif! 🛡️`);
        console.log(`💾 File tersimpan di: data/processed/id/server_infra.json`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
    }
}

module.exports = { execute };