const { launchBrowser } = require('../../utils/fetcher');
const fs = require('fs');
const path = require('path');

/**
 * 🎙️ FASE 04: DATABASE PENGISI SUARA & KUTIPAN (V42 - DYNAMIC MEMORY LOOP)
 * Lokasi: src/scrapers/01_core_data/04_getVoiceActors.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur Utama:
 * 1. Dynamic Memory Loop: Mengingat dan mengeklik berdasarkan Nama Skin untuk membypass pengacakan urutan HTML oleh Swiper.js.
 * 2. Auto-Slider: Memaksa tekan tombol "Next" jika mendeteksi ada skin yang belum diekstrak tapi tersembunyi.
 * 3. Desktop Reversion: Kembali ke rute /voice.html yang lebih stabil.
 * 4. Absolute Scope Lock: Menghindari Swiper Phantom Node menggunakan data-id.
 */

function logToDatabase(level, message) {
    const logPath = path.join(__dirname, '../../../logs/error.log');
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}\n`;
    if (!fs.existsSync(path.dirname(logPath))) fs.mkdirSync(path.dirname(logPath), { recursive: true });
    fs.appendFileSync(logPath, logEntry);
}

// ✨ PEMBERSIH TEKS
function sanitizeText(text) {
    if (!text) return "";
    return text.replace(/<[^>]*>?/gm, '').replace(/\\n/g, ' ').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
}

// 🎙️ EKSTRAKTOR SUARA (DIKUNCI PADA SCOPE DATA-ID)
const extractVoicesPuppeteer = async (page, scopeSel) => {
    return await page.evaluate((sel) => {
        const BASE_URL = "https://world.honorofkings.com";
        const voiceItems = document.querySelectorAll(`${sel} .dinfo-voice-item, ${sel} .voice-item`);
        
        return Array.from(voiceItems).map(v => {
            const text = v.querySelector('span em')?.innerText.trim() || v.innerText.trim() || "";
            const mp3Attr = v.getAttribute('data-mp3') || v.querySelector('audio')?.getAttribute('src');
            const audioUrl = mp3Attr ? (mp3Attr.startsWith('http') ? mp3Attr : BASE_URL + mp3Attr) : "";
            return { text, audio_url: audioUrl };
        }).filter(v => v.text !== "" && v.audio_url !== "");
    }, scopeSel);
};

async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 04] Memulai Eksekusi: Voice Miner (Dynamic Memory V42)");
    console.log("🎯 Sumber: IP World Desktop (/voice.html)");
    console.log("==================================================");

    // ⚙️ PENGATURAN MODE (False = Aktifkan Delta Radar / Skip yang sudah ada)
    const CLEAN_SLATE_MODE = false; 

    const heroListPath = path.join(__dirname, '../../../data/processed/id/heroList.json');
    const processedFolder = path.join(__dirname, '../../../data/processed/id/hero_voices');
    const reportPath = path.join(__dirname, '../../../data/processed/id/voice_audit_report.md');

    if (!fs.existsSync(processedFolder)) fs.mkdirSync(processedFolder, { recursive: true });
    if (!fs.existsSync(heroListPath)) {
        console.error("❌ [ERROR] heroList.json tidak ditemukan!");
        return;
    }

    const heroes = JSON.parse(fs.readFileSync(heroListPath, 'utf8'));
    let browserInstance;
    const globalStats = [];

    // 🧬 LOGIKA OVERRIDE ID (Flowborn Triplet)
    const HERO_ID_OVERRIDES = { "582": "581", "584": "581" };

    try {
        browserInstance = await launchBrowser();
        
        for (const targetHero of heroes) {
            console.log(`\n🎙️ [PROCESS] Meninjau data suara: ${targetHero.name}...`);
            
            const outPath = path.join(processedFolder, `${targetHero.id}.json`);

            // 📡 1. DELTA RADAR
            if (!CLEAN_SLATE_MODE && fs.existsSync(outPath)) {
                const existingData = JSON.parse(fs.readFileSync(outPath, 'utf8'));
                if (existingData.total_lines > 0) {
                    console.log(`   ⏭️ [RADAR SKIP] Data suara ${targetHero.name} sudah lengkap (${existingData.total_lines} VL).`);
                    const auditSummary = Object.entries(existingData.audit || {}).map(([skin, count]) => `${skin}: ${count}`).join('<br>');
                    globalStats.push({ id: existingData.hero_id, name: existingData.hero_name, count: existingData.total_lines, summary: auditSummary });
                    continue;
                }
            }

            // 🧬 2. BRIDGE FAST-CLONE
            if (targetHero.id === "582" || targetHero.id === "584") {
                const sourcePath = path.join(processedFolder, '581.json');
                if (fs.existsSync(sourcePath)) {
                    const cloneData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
                    cloneData.hero_id = targetHero.id;
                    cloneData.hero_name = targetHero.name;
                    fs.writeFileSync(outPath, JSON.stringify(cloneData, null, 2));
                    console.log(`   🧬 [CLONE] Suara ${targetHero.name} dikloning dari Flowborn.`);
                    const auditSummary = Object.entries(cloneData.audit || {}).map(([skin, count]) => `${skin}: ${count}`).join('<br>');
                    globalStats.push({ id: cloneData.hero_id, name: cloneData.hero_name, count: cloneData.total_lines, summary: auditSummary });
                    continue;
                }
            }

            // 🚀 3. DIRECT DESKTOP TELEPORTATION & SCOPE LOCK
            const targetId = HERO_ID_OVERRIDES[targetHero.id] || targetHero.id;
            const directUrl = `https://world.honorofkings.com/ipworld/id/voice.html?heroId=${targetId}`;
            const domScope = `div[data-id="${targetId}"]:not(.swiper-slide-duplicate)`;

            const page = await browserInstance.newPage();
            
            try {
                // 🖥️ DESKTOP EMULATION
                await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
                await page.setViewport({ width: 1366, height: 768 });
                
                await page.goto(directUrl, { waitUntil: 'networkidle0', timeout: 60000 });

                await page.addStyleTag({ content: `
                    #onetrust-consent-sdk, .ot-sdk-container, div[class*="cookie"], .mask, .overlay { display: none !important; pointer-events: none !important; }
                    body { overflow: auto !important; position: static !important; }
                `});

                // ⏳ WAKTU STABILISASI DOM (API HAR)
                await new Promise(r => setTimeout(r, 4500));

                const vaName = await page.evaluate((sel) => {
                    return document.querySelector(`${sel} .cv-name`)?.innerText.replace('CV:', '').trim() || "Unknown";
                }, domScope);

                // ✨ VARIABEL OTANGAN DYNAMIC MEMORY
                const skinResults = [];
                const auditSummary = {};
                const processedSkins = [];  // Memori Skin yang SUDAH diklik & disadap
                const knownSkins = new Set(); // Radar Skin yang PERNAH dilihat di DOM
                let failsafe = 0;

                console.log(`   🧠 [SCAN] Memulai ekstraksi berbasis Ingatan Dinamis (V42)...`);

                // ⚡ Trigger awal: Klik skin yang sedang aktif agar API kepancing
                await page.evaluate((sel) => {
                    const first = document.querySelector(`${sel} .role-skin-item--selected`) || document.querySelector(`${sel} .role-skin-item`);
                    if(first) first.click();
                }, domScope);
                await new Promise(r => setTimeout(r, 2000));

                while (failsafe < 50) {
                    failsafe++;

                    // 1. Ekstrak data dari tombol-tombol yang ada di layar
                    const action = await page.evaluate((sel, processed) => {
                        const scope = document.querySelector(sel) || document;
                        const btns = Array.from(scope.querySelectorAll('.role-skin-item'));
                        const namesInDom = btns.map(b => b.querySelector('span')?.innerText.trim() || "Unknown");
                        
                        let targetBtn = null;
                        let targetName = null;
                        
                        // Cari tombol yang NAMANYA BELUM ADA di memori "processed"
                        for (let i = 0; i < btns.length; i++) {
                            if (!processed.includes(namesInDom[i])) {
                                targetBtn = btns[i];
                                targetName = namesInDom[i];
                                break;
                            }
                        }
                        
                        // Jika ketemu target baru, KLIK!
                        if (targetBtn) {
                            targetBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            targetBtn.click();
                            return { found: true, name: targetName, discovered: namesInDom };
                        }
                        
                        return { found: false, discovered: namesInDom };
                    }, domScope, processedSkins);

                    // 2. Tambahkan semua nama yang terlihat ke Radar
                    action.discovered.forEach(n => knownSkins.add(n));

                    // 3. Logika Aksi
                    if (action.found) {
                        // Tunggu transisi API & DOM Swiper yang menggeser UI
                        await new Promise(r => setTimeout(r, 2500));

                        // Ekstrak baris suara dari skin tersebut
                        const lines = await extractVoicesPuppeteer(page, domScope);
                        
                        // Tandai sudah selesai disadap
                        processedSkins.push(action.name);
                        
                        if (lines.length > 0) {
                            skinResults.push({ name: action.name, lines: lines });
                            auditSummary[action.name] = lines.length;
                            console.log(`      ✔️ Tersadap: ${action.name} (${lines.length} audio)`);
                        } else {
                            console.log(`      ⚠️ Kosong: ${action.name} (Tidak ada suara / API timeout)`);
                        }
                    } else {
                        // Tidak ada tombol yang belum diproses di DOM saat ini.
                        if (processedSkins.length >= knownSkins.size) {
                            // Semua skin yang tercatat di Radar sudah disadap! (SELESAI)
                            break;
                        } else {
                            // Ada skin yang tercatat di Radar tapi tidak ada di layar (Swiper menyembunyikannya)
                            // Paksa tekan tombol Next pada Carousel!
                            const swiped = await page.evaluate((sel) => {
                                const scope = document.querySelector(sel) || document;
                                const nextBtn = scope.querySelector('.swiper-button-next');
                                if (nextBtn && !nextBtn.classList.contains('swiper-button-disabled')) { 
                                    nextBtn.click(); 
                                    return true; 
                                }
                                return false;
                            }, domScope);
                            
                            if (swiped) {
                                await new Promise(r => setTimeout(r, 1000));
                            } else {
                                console.log(`      ⚠️ [WARN] Ada skin tertinggal di Radar, tapi tombol geser macet.`);
                                break; // Failsafe agar tidak infinite loop
                            }
                        }
                    }
                }

                const totalLinesCount = Object.values(auditSummary).reduce((a, b) => a + b, 0);

                if (totalLinesCount > 0) {
                    fs.writeFileSync(outPath, JSON.stringify({
                        hero_id: targetHero.id, hero_name: targetHero.name, voice_actor: vaName,
                        total_lines: totalLinesCount, audit: auditSummary, data: skinResults
                    }, null, 2));
                    
                    console.log(`   ✅ [BINGO] Disadap ${totalLinesCount} kutipan dari ${Object.keys(auditSummary).length} Skin.`);
                    const strSummary = Object.entries(auditSummary).map(([k, v]) => `${k}: ${v}`).join('<br>');
                    globalStats.push({ id: targetHero.id, name: targetHero.name, count: totalLinesCount, summary: strSummary });
                } else {
                    console.log(`   ⚠️ [WARN] Data suara kosong untuk ${targetHero.name}.`);
                    globalStats.push({ id: targetHero.id, name: targetHero.name, count: 0, summary: "EMPTY" });
                }

            } catch (errInner) {
                console.error(`   🚨 [ERROR]: ${errInner.message}`);
                globalStats.push({ id: targetHero.id, name: targetHero.name, count: 0, summary: "ERROR" });
            } finally {
                await page.close().catch(() => {});
            }
            
            await new Promise(r => setTimeout(r, 500));
        }

        // --------------------------------------------------------------------
        // 📊 4. AUTO-REPORTER (Markdown Generator)
        // --------------------------------------------------------------------
        console.log("\n📝 [REPORT] Menyusun laporan audit keseluruhan...");
        
        let reportContent = `# 🛡️ Voice Audit Report - Honor of Kings (ID)\n\n`;
        reportContent += `| ID | Pahlawan | Total VL | Detail Per Skin |\n`;
        reportContent += `|:---|:---|:---|:---|\n`;

        let totalGlobalLines = 0;
        globalStats.sort((a, b) => parseInt(a.id) - parseInt(b.id)).forEach(s => {
            reportContent += `| ${s.id} | **${s.name}** | ${s.count} | ${s.summary} |\n`;
            totalGlobalLines += s.count || 0;
        });

        reportContent += `\n\n## 📈 Statistik Kumulatif\n`;
        reportContent += `- **Total Pahlawan Terdata:** ${globalStats.length}\n`;
        reportContent += `- **Total Keseluruhan Voice Lines:** **${totalGlobalLines.toLocaleString()}** Baris Audio.\n`;

        fs.writeFileSync(reportPath, reportContent);
        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Fase 04 (Dynamic Memory V42) Selesai!`);
        console.log(`💾 [SAVED] Laporan Audit: data/processed/id/voice_audit_report.md`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
    } finally {
        if (browserInstance) await browserInstance.close();
    }
}

module.exports = { execute };