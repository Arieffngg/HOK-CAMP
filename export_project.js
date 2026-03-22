const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

/**
 * 🗜️ HOK CAMP - MASTER PROJECT EXPORTER (V4.2.1)
 * Fitur: Auto-generate README dengan Disklaimer Komunitas & Lisensi GPLv3.
 */

// Konten README yang sudah menyertakan Disklaimer
const README_CONTENT = `# HOK-CAMP
Kecerdasan buatan berbasis Retrieval-Augmented Generation (RAG) terlengkap untuk ekosistem Honor of Kings (HOK) Global/Indonesia. Sistem ini dibangun dengan memadukan Web Scraping tingkat lanjut (Puppeteer Stealth), analitik matematis (Theorycrafting), dan manajemen memori terstruktur (The Cortex).

# 👑 HOK Camp Bot - Core Engine

Selamat datang di repositori inti **HOK Camp Intelligence Bot**. 
Proyek ini adalah arsitektur *Retrieval-Augmented Generation* (RAG) kelas Enterprise yang mengekstrak, memproses, dan menyintesis data dari ekosistem Honor of Kings.


> **⚠️ DISKLAIMER PENTING:** > Proyek ini dikembangkan murni oleh **KOMUNITAS** dan **TIDAK TERAFILIASI** dengan Tencent Games, TiMi Studio Group, atau Honor of Kings resmi.

## 🚀 CARA MENGGUNAKAN
Proyek ini dikirim tanpa database (\`data/\`). Anda harus menjalankan seeding manual.

### Bash Setup:
\`\`\`bash
npm init -y
npm install puppeteer discord.js dotenv
\`\`\`

### Seeding:
1. \`node setup.js\`
2. Jalankan \`node orchestrator.js\` secara berurutan (Fase 00-47).

*Baca file README.md lengkap di dalam ZIP untuk detail 5 Pilar dan instruksi Advance.*
`;

async function buildZip() {
    console.log("==================================================");
    console.log("📦 MEMULAI PROSES EXPORT PROJECT (CLEAN BUILD)...");
    
    // 1. Tulis README singkat untuk root (opsional, README lengkap biasanya sudah ada di src)
    fs.writeFileSync(path.join(__dirname, 'README.md'), README_CONTENT);
    
    const zipFileName = 'HOK CAMP.zip';
    const output = fs.createWriteStream(path.join(__dirname, zipFileName));
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
        console.log(`✅ [BINGO] File siap: ${zipFileName} (${(archive.pointer() / 1024 / 1024).toFixed(2)} MB)`);
    });

    archive.pipe(output);
    
    archive.glob('**/*', {
        cwd: __dirname,
        ignore: [
            'data/**', 
            'logs/**', 
            'node_modules/**', 
            '.env', 
            '*.zip', 
            'package-lock.json',
            '.git/**'
        ]
    });

    await archive.finalize();
}

buildZip();