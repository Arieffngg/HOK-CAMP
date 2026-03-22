const { launchBrowser } = require('../../utils/fetcher');
const fs = require('fs');
const path = require('path');

/**
 * 📸 FASE 06b: SKIN GALLERY HARVESTER (THE RESILIENT SWEEPER V6.5)
 * Lokasi: src/scrapers/01_core_data/06b_getSkinGallery.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur: Notification Popup Buster, Fast-Resume, Resilient Waterfall Scroller, Atomic Save.
 */

function logToDatabase(level, message) {
    const logPath = path.join(__dirname, '../../../logs/error.log');
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}\n`;
    if (!fs.existsSync(path.dirname(logPath))) fs.mkdirSync(path.dirname(logPath), { recursive: true });
    fs.appendFileSync(logPath, logEntry);
}

// 🔤 KAMUS ALIAS PAHLAWAN
// Telah dibersihkan dari over-engineering. Hanya biarkan yang benar-benar berbeda.
const ALIAS_MAP = {
    "yango": "yuange"
};

async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 06b] Memulai Eksekusi: Skin Gallery Harvester");
    console.log("🛠️  Metode: Precise Sweeper (Resilient Engine V6.5)");
    console.log("==================================================");

    const heroListPath = path.join(__dirname, '../../../data/processed/id/heroList.json');
    const assetsFolder = path.join(__dirname, '../../../data/processed/id/hero_assets');
    const unmappedPath = path.join(assetsFolder, '_UNMAPPED_SKINS.json');
    
    if (!fs.existsSync(assetsFolder)) {
        console.error("❌ [ERROR] Folder hero_assets belum ada. Jalankan Fase 06 terlebih dahulu!");
        return;
    }

    // 🧠 1. MEMBANGUN PETA MEMORI & DAFTAR URL YANG SUDAH ADA (FAST-RESUME)
    const heroes = JSON.parse(fs.readFileSync(heroListPath, 'utf8'));
    const heroMap = {}; 
    const heroAssetsDB = {}; 
    const allSavedUrls = new Set(); // Menyimpan URL yang sudah sukses didownload

    console.log("📦 [DATABASE] Memuat data aset lokal untuk disuntikkan skin...");
    heroes.forEach(h => {
        const cleanName = h.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        heroMap[cleanName] = h.id;
        
        const assetFilePath = path.join(assetsFolder, `${h.id}.json`);
        if (fs.existsSync(assetFilePath)) {
            heroAssetsDB[h.id] = JSON.parse(fs.readFileSync(assetFilePath, 'utf8'));
            if (!heroAssetsDB[h.id].skin_gallery) heroAssetsDB[h.id].skin_gallery = [];
            
            // Catat URL yang sudah ada agar tidak di-klik ulang (Resume Later)
            heroAssetsDB[h.id].skin_gallery.forEach(s => allSavedUrls.add(s.poster_url));
        }
    });

    let unmappedSkins = [];
    if (fs.existsSync(unmappedPath)) {
        unmappedSkins = JSON.parse(fs.readFileSync(unmappedPath, 'utf8'));
        unmappedSkins.forEach(s => allSavedUrls.add(s.poster_url));
    }

    console.log(`⏩ [RESUME ENGINE] Ditemukan ${allSavedUrls.size} poster skin di database. Gambar ini akan otomatis dilewati.`);

    let browserInstance;
    try {
        browserInstance = await launchBrowser();
        const page = await browserInstance.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await page.setViewport({ width: 1440, height: 900 });

        // 🌐 2. MASUK KE GALERI GLOBAL
        console.log("📡 [FETCH] Menyelusup ke Fan Gallery Utama...");
        await page.goto('https://camp.honorofkings.com/h5/app/index.html#/fan-gallery/detail', { waitUntil: 'networkidle2', timeout: 60000 });

        // 🛡️ ULTIMATE POPUP & NOTIFICATION BUSTER
        await page.evaluate(() => {
            setInterval(() => {
                // 1. Centang Checkbox Privacy
                document.querySelectorAll('input[type="checkbox"], .adm-checkbox-input, .adm-checkbox-icon').forEach(c => {
                    if (!c.checked && typeof c.click === 'function') c.click();
                });

                // 2. Tombol Accept Privacy
                const btns = Array.from(document.querySelectorAll('button, .adm-button, a[role="button"]'));
                const confirmBtn = btns.find(b => /confirm|setuju|agree|ok|lanjut|accept/i.test(b.innerText));
                if (confirmBtn) confirmBtn.click();

                // 3. Tombol Notifikasi HOK Camp (DISABLE)
                const notifBtns = Array.from(document.querySelectorAll('.camp-modal-button-wrap'));
                const disableBtn = notifBtns.find(b => /disable|tolak/i.test(b.innerText));
                if (disableBtn) disableBtn.click();

                // 4. Bersihkan Overlay Sampah
                document.querySelectorAll('#onetrust-consent-sdk, .ot-sdk-container, [id*="cookie"], [class*="cookie"]')
                    .forEach(el => el.remove());
                
                document.body.style.setProperty('overflow', 'auto', 'important');
            }, 300);
        });

        // 🖱️ PINDAH KE TAB SKIN
        console.log("🖱️ [ACTION] Membuka segel Tab 'Skin'...");
        await page.waitForSelector('.adm-tabs-tab', { timeout: 15000 });
        await page.evaluate(() => {
            const tabs = Array.from(document.querySelectorAll('.adm-tabs-tab'));
            const skinTab = tabs.find(t => t.innerText && t.innerText.toLowerCase().includes('skin'));
            if (skinTab) skinTab.click();
        });

        await new Promise(r => setTimeout(r, 4000));
        console.log(`🎯 [SWEEP] Memulai Operasi Phantom Harvester...`);

        let scrollFailsafe = 0;

        while (scrollFailsafe < 50) {
            const cardHandles = await page.$$('.imgWrap-O03CT');
            let processedThisTurn = 0;

            for (const handle of cardHandles) {
                const isSniped = await page.evaluate((el) => el.getAttribute('data-sniped') === 'true', handle);
                if (isSniped) continue;

                try {
                    // ✨ LANGKAH 0: AMBIL URL DARI THUMBNAIL
                    const thumbSrc = await page.evaluate(el => el.querySelector('img')?.src || "", handle);
                    const BASE_CAMP = "https://camp.honorofkings.com";
                    const rawUrl = thumbSrc.split('?')[0]; 
                    const hdUrl = (rawUrl && !rawUrl.startsWith('http')) ? BASE_CAMP + rawUrl : rawUrl;

                    // ⏩ [FAST-RESUME] Jika URL sudah ada di database, lewati klik!
                    if (hdUrl && allSavedUrls.has(hdUrl)) {
                        await page.evaluate((el) => el.setAttribute('data-sniped', 'true'), handle);
                        processedThisTurn++;
                        continue; 
                    }

                    // ✨ LANGKAH 1: MASUK KLIK KARTU BARU
                    await handle.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    await new Promise(r => setTimeout(r, 600));
                    await handle.click();
                    
                    // Tunggu Class Spesifik muncul di Modal
                    await page.waitForFunction(() => {
                        const skinEl = document.querySelector('.tit-SgyzS');
                        const heroEl = document.querySelector('.subTit-lmsep');
                        return skinEl && heroEl && skinEl.innerText.trim().length > 0;
                    }, { timeout: 5000 }).catch(() => {});

                    // ✨ LANGKAH 2: EKSTRAKSI TEKS PRESISI
                    const extractedData = await page.evaluate(() => {
                        const skinNameEl = document.querySelector('.tit-SgyzS');
                        const heroNameEl = document.querySelector('.subTit-lmsep');

                        return { 
                            skinName: skinNameEl ? skinNameEl.innerText.trim() : "Unknown Skin",
                            heroName: heroNameEl ? heroNameEl.innerText.trim() : "Unknown Hero"
                        };
                    });

                    extractedData.url = hdUrl;

                    // ✨ LANGKAH 3: PENCARIAN, ALIAS, & ATOMIC SAVE
                    if (extractedData && extractedData.url && !allSavedUrls.has(extractedData.url)) {
                        allSavedUrls.add(extractedData.url); 
                        
                        let cleanStr = extractedData.heroName.toLowerCase().replace(/[^a-z0-9]/g, '');
                        if (ALIAS_MAP[cleanStr]) cleanStr = ALIAS_MAP[cleanStr];

                        const matchedId = heroMap[cleanStr] || Object.keys(heroMap).find(k => cleanStr.includes(k) || k.includes(cleanStr));

                        if (matchedId && heroAssetsDB[matchedId]) {
                            const exists = heroAssetsDB[matchedId].skin_gallery.some(s => s.poster_url === extractedData.url);
                            if (!exists) {
                                heroAssetsDB[matchedId].skin_gallery.push({
                                    skin_name: extractedData.skinName,
                                    poster_url: extractedData.url
                                });
                                console.log(`      📸 [SNIPED] ${extractedData.heroName} (${matchedId}) -> ${extractedData.skinName}`);
                                
                                // 💾 ATOMIC SAVE
                                const outPath = path.join(assetsFolder, `${matchedId}.json`);
                                fs.writeFileSync(outPath, JSON.stringify(heroAssetsDB[matchedId], null, 2));
                            }
                        } else {
                            console.log(`      ⚠️ [UNMAPPED] Hero: ${extractedData.heroName} | Skin: ${extractedData.skinName} (Disimpan ke Safety Net)`);
                            unmappedSkins.push({
                                hero_name: extractedData.heroName,
                                skin_name: extractedData.skinName,
                                poster_url: extractedData.url
                            });
                            fs.writeFileSync(unmappedPath, JSON.stringify(unmappedSkins, null, 2));
                        }
                    }

                    // ✨ LANGKAH 4: KELUAR TANPA ZOOM
                    await page.mouse.click(5, 500); 
                    await page.keyboard.press('Escape'); 
                    
                    await page.waitForFunction(() => {
                        return !document.querySelector('.tit-SgyzS');
                    }, { timeout: 3000 }).catch(() => {});
                    
                    await new Promise(r => setTimeout(r, 600)); 

                    await page.evaluate((el) => el.setAttribute('data-sniped', 'true'), handle);
                    processedThisTurn++;

                } catch (err) {
                    console.log(`      ❌ Kartu macet. Melakukan Force Close.`);
                    await page.mouse.click(5, 500);
                    await page.keyboard.press('Escape');
                    await page.evaluate((el) => el.setAttribute('data-sniped', 'true'), handle);
                }
            }

            // ✨ RESILIENT SCROLL ENGINE
            if (processedThisTurn === 0) {
                console.log(`   🔄 [SCROLL] Memancing konten H5 baru ke bawah... (Failsafe: ${scrollFailsafe + 1}/50)`);
                await page.evaluate(() => {
                    // Scroll ganda untuk memastikan H5 mendeteksi event
                    window.scrollBy(0, 1500);
                    const h5Container = document.querySelector('.galleryList-Pj1Vy, .adm-tabs-content') || document.body;
                    if (h5Container) h5Container.scrollTop += 1500;
                });
                
                // Beri waktu bagi jaringan dan React/Vue untuk me-render gambar baru
                await new Promise(r => setTimeout(r, 3500));
                scrollFailsafe++;
            } else {
                scrollFailsafe = 0; // Reset failsafe jika berhasil memproses sesuatu
            }
        }

        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Fase 06b Selesai! Operasi Sweeping Mantap.`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
    } finally {
        if (browserInstance) await browserInstance.close();
    }
}

module.exports = { execute };