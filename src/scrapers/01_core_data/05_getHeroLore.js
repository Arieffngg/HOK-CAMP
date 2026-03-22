const { launchBrowser } = require('../../utils/fetcher');
const fs = require('fs');
const path = require('path');

/**
 * 📖 FASE 05: DATABASE LORE & BIOGRAFI PAHLAWAN (V4.4b - CLEAN SLATE EDITION)
 * Lokasi: src/scrapers/01_core_data/05_getHeroLore.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur Utama:
 * 1. ZLKData Bypass: Teleportasi langsung ke Raw Content Endpoint Tencent.
 * 2. Active Cookie Killer: Membantai modal "Accept Cookies" & membuka kunci scroll.
 * 3. Smooth Auto-Scroll: Memancing lazy-loading teks agar render maksimal.
 * 4. Universal Text Harvester: Menggunakan visual innerText untuk HTML yang berantakan.
 * 5. ✨ Clean Slate Mode: DIAKTIFKAN untuk menghapus cache/JSON kosong dari versi sebelumnya.
 */

function logToDatabase(level, message) {
    const logPath = path.join(__dirname, '../../../logs/error.log');
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}\n`;
    if (!fs.existsSync(path.dirname(logPath))) fs.mkdirSync(path.dirname(logPath), { recursive: true });
    fs.appendFileSync(logPath, logEntry);
}

async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 05] Memulai Eksekusi: Lore & Biography Miner");
    console.log("🎯 Sumber: Raw ZLKData Endpoint (.html) [Auto-Scroll Mode]");
    console.log("==================================================");

    // ✨ MENGAKTIFKAN CLEAN SLATE MODE (Hapus file lama yang kosong/rusak)
    const CLEAN_SLATE_MODE = true; 

    const heroListPath = path.join(__dirname, '../../../data/processed/id/heroList.json');
    const processedFolder = path.join(__dirname, '../../../data/processed/id/hero_lore');
    
    if (!fs.existsSync(processedFolder)) fs.mkdirSync(processedFolder, { recursive: true });
    if (!fs.existsSync(heroListPath)) {
        console.error("❌ [ERROR] heroList.json tidak ditemukan!");
        return;
    }

    const heroes = JSON.parse(fs.readFileSync(heroListPath, 'utf8'));
    let browserInstance;
    const HERO_ID_OVERRIDES = { "582": "581", "584": "581" };

    try {
        browserInstance = await launchBrowser();
        
        for (const targetHero of heroes) {
            console.log(`\n📖 [PROCESS] Membuka arsip cerita: ${targetHero.name}...`);
            
            const outPath = path.join(processedFolder, `${targetHero.id}.json`);

            // 📡 DELTA RADAR (Dengan logika Hapus File Rusak)
            if (fs.existsSync(outPath)) {
                if (CLEAN_SLATE_MODE) {
                    console.log(`   🧹 [CLEANUP] Menghapus data lama ${targetHero.name} untuk resync...`);
                    fs.unlinkSync(outPath);
                } else {
                    // Validasi: Jangan skip jika file JSON ternyata kosong/rusak
                    const existingData = JSON.parse(fs.readFileSync(outPath, 'utf8'));
                    if (existingData.story_paragraphs && existingData.story_paragraphs.length > 0) {
                        console.log(`   ⏭️ [RADAR SKIP] Lore ${targetHero.name} sudah tersimpan rapi.`);
                        continue;
                    } else {
                        console.log(`   🔄 [RETRY] Data lama ${targetHero.name} kosong. Mencoba ulang...`);
                    }
                }
            }

            // 🧬 BRIDGE FAST-CLONE (Flowborn)
            if (targetHero.id === "582" || targetHero.id === "584") {
                const sourcePath = path.join(processedFolder, '581.json');
                if (fs.existsSync(sourcePath)) {
                    const cloneData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
                    cloneData.hero_id = targetHero.id;
                    cloneData.hero_name = targetHero.name;
                    fs.writeFileSync(outPath, JSON.stringify(cloneData, null, 2));
                    console.log(`   🧬 [CLONE] Cerita ${targetHero.name} dikloning dari Flowborn.`);
                    continue;
                }
            }

            const targetId = HERO_ID_OVERRIDES[targetHero.id] || targetHero.id;
            
            // 🚀 TELEPORTASI LANGSUNG KE RAW CONTENT ZLKDATA
            const directUrl = `https://world.honorofkings.com/zlkdatasys/ip/story/id/${targetId}.html`;

            const page = await browserInstance.newPage();
            
            try {
                await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
                
                // Timeout diperpanjang agar tidak mudah putus
                const response = await page.goto(directUrl, { waitUntil: 'networkidle2', timeout: 60000 });

                // 🛡️ 404 GUARDIAN
                if (response && response.status() === 404) {
                    console.log(`   ⚠️ [WARN] Arsip belum dirilis (404) untuk ${targetHero.name}.`);
                    await page.close().catch(() => {});
                    continue;
                }

                console.log("   🍪 [ACTION] Membantai Cookie & Membuka Kunci Scroll...");
                await page.evaluate(() => {
                    // 1. Klik tombol Accept Cookies jika ada
                    const btns = Array.from(document.querySelectorAll('button, a, div[role="button"]'));
                    const acceptBtn = btns.find(b => b.innerText && b.innerText.toLowerCase().includes('accept'));
                    if (acceptBtn) acceptBtn.click();

                    // 2. Hapus paksa semua overlay yang menghalangi
                    const overlays = document.querySelectorAll('#onetrust-consent-sdk, .ot-sdk-container, [id*="cookie"], [class*="cookie"], .mask, .overlay');
                    overlays.forEach(el => el.remove());

                    // 3. Buka kunci scroll pada body
                    document.body.style.setProperty('overflow', 'auto', 'important');
                    document.body.style.setProperty('position', 'static', 'important');
                });

                console.log("   📜 [ACTION] Melakukan auto-scroll untuk merender seluruh teks (Lazy-Load)...");
                await page.evaluate(async () => {
                    await new Promise((resolve) => {
                        let totalHeight = 0;
                        const distance = 150; // Jarak gulir per detak
                        const timer = setInterval(() => {
                            const scrollHeight = document.body.scrollHeight;
                            window.scrollBy(0, distance);
                            totalHeight += distance;

                            // Berhenti jika sudah sampai bawah atau sudah scroll terlalu jauh (failsafe)
                            if (totalHeight >= scrollHeight || totalHeight > 15000) {
                                clearInterval(timer);
                                resolve();
                            }
                        }, 100); // Detak scroll tiap 100ms
                    });
                });

                console.log("   ⏳ [WAIT] Menunggu teks stabil dan ter-render maksimal...");
                await new Promise(r => setTimeout(r, 4000));

                // 🎨 EKSTRAKSI LORE MENGGUNAKAN VISUAL INNER-TEXT
                const loreData = await page.evaluate(() => {
                    const container = document.querySelector('.champion-descriptions') || document.body;
                    const paragraphs = [];
                    let mainTitle = "";

                    if (container) {
                        // 1. Ambil semua teks yang merupakan judul
                        const titleNodes = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6, .title, strong, b'));
                        const titleTexts = titleNodes.map(node => node.innerText.trim()).filter(t => t.length > 0);
                        
                        if (titleTexts.length > 0) mainTitle = titleTexts[0];

                        // 2. Baca teks layaknya manusia melihat layar
                        const rawText = container.innerText || "";
                        const rawLines = rawText.split('\n'); 
                        
                        rawLines.forEach(line => {
                            const cleanLine = line.trim();
                            if (cleanLine) {
                                // Cek apakah baris ini adalah judul bab/sub-bab
                                if (titleTexts.includes(cleanLine)) {
                                    paragraphs.push(`\n**${cleanLine}**`);
                                } else {
                                    paragraphs.push(cleanLine);
                                }
                            }
                        });
                    }

                    return {
                        title: mainTitle,
                        motto: "", 
                        story_paragraphs: paragraphs.filter(p => p !== "")
                    };
                });

                if (loreData.story_paragraphs.length > 0) {
                    const finalPayload = {
                        hero_id: targetHero.id,
                        hero_name: targetHero.name,
                        title: loreData.title,
                        motto: loreData.motto,
                        story_paragraphs: loreData.story_paragraphs
                    };

                    fs.writeFileSync(outPath, JSON.stringify(finalPayload, null, 2));
                    
                    const chapters = loreData.story_paragraphs.filter(p => p.startsWith('\n**')).length;
                    console.log(`   ✅ [BINGO] Disadap ${loreData.story_paragraphs.length} paragraf cerita (${chapters} Bab).`);
                } else {
                    console.log(`   ⚠️ [WARN] Konten cerita benar-benar kosong di server untuk ${targetHero.name}.`);
                }

            } catch (errInner) {
                console.error(`   🚨 [ERROR]: ${errInner.message}`);
            } finally {
                await page.close().catch(() => {});
            }
            
            await new Promise(r => setTimeout(r, 1000)); // Jeda ekstra untuk stabilitas memori
        }

        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Fase 05 (Lore & Biography) Selesai!`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
    } finally {
        if (browserInstance) await browserInstance.close();
    }
}

module.exports = { execute };