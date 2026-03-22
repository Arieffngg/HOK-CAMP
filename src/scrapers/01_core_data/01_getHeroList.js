const { launchBrowser, fetchPage } = require('../../utils/fetcher');
const fs = require('fs');
const path = require('path');

/**
 * 🦸 FASE 01: MENDAPATKAN DAFTAR PAHLAWAN (SIMULASI NAVIGASI USER + PARSER)
 * Lokasi: src/scrapers/01_core_data/01_getHeroList.js
 * 👨‍💻 Tech Lead: Arief
 */

function logToDatabase(level, message) {
    const logPath = path.join(__dirname, '../../../logs/error.log');
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}\n`;
    if (!fs.existsSync(path.dirname(logPath))) fs.mkdirSync(path.dirname(logPath), { recursive: true });
    fs.appendFileSync(logPath, logEntry);
}

// ============================================================================
// 🧹 FUNGSI PARSER: MERAPIKAN DATA MENTAH MENJADI FORMAT DISCORD BOT
// ============================================================================
async function parseHeroData() {
    console.log("\n🧹 [PARSING] Memulai pembersihan data Daftar Pahlawan...");
    const rawPath = path.join(__dirname, '../../../data/raw/heroList_raw.json');
    const processedDir = path.join(__dirname, '../../../data/processed/id');
    const processedPath = path.join(processedDir, 'heroList.json');

    try {
        if (!fs.existsSync(rawPath)) throw new Error("File heroList_raw.json tidak ditemukan!");
        if (!fs.existsSync(processedDir)) fs.mkdirSync(processedDir, { recursive: true });

        const rawData = JSON.parse(fs.readFileSync(rawPath, 'utf8'));
        const heroListRaw = rawData.data.heroList;
        
        const cleanHeroList = [];

        for (const hero of heroListRaw) {
            cleanHeroList.push({
                id: hero.heroId.toString(),
                name: hero.heroName,
                role: hero.mainJobName,
                sub_role: hero.minorJobName || null,
                lane: hero.recommendRoadName,
                icon_url: hero.icon || null
            });
        }

        cleanHeroList.sort((a, b) => parseInt(a.id) - parseInt(b.id));

        // Karena fs.writeFileSync, data lama otomatis akan tertimpa (overwrite)
        fs.writeFileSync(processedPath, JSON.stringify(cleanHeroList, null, 2));
        console.log(`✨ [PARSED] ${cleanHeroList.length} Pahlawan berhasil dirapikan!`);
        console.log(`💾 [SAVED] File matang siap pakai di: data/processed/id/heroList.json`);

    } catch (error) {
        console.error(`❌ [PARSE ERROR]: ${error.message}`);
        logToDatabase('ERROR', `[FASE 01 PARSER] ${error.message}`);
    }
}

async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 01] Memulai Eksekusi: Simulasi Navigasi Hero");
    console.log("==================================================");

    // ✨ SAKELAR UPDATE PATCH (TECH LEAD MODE)
    const CLEAN_SLATE_MODE = true; 

    if (CLEAN_SLATE_MODE) {
        console.log("🧹 [CLEAN SLATE] Mode Update Aktif! Menghapus data hero list lama...");
        const rawPath = path.join(__dirname, '../../../data/raw/heroList_raw.json');
        const processedPath = path.join(__dirname, '../../../data/processed/id/heroList.json');
        if (fs.existsSync(rawPath)) fs.unlinkSync(rawPath);
        if (fs.existsSync(processedPath)) fs.unlinkSync(processedPath);
    }

    let browserInstance;
    let capturedHeroData = null; 
    let apiListener = null;

    try {
        browserInstance = await launchBrowser();
        const homepageUrl = 'https://camp.honorofkings.com/h5/app/index.html#/hero-homepage';
        const page = await fetchPage(browserInstance, homepageUrl);

        console.log("🏠 [INFO] Berhasil mendarat di Hero Homepage.");
        await new Promise(r => setTimeout(r, 3000));

        console.log("🍪 [ACTION] Membantai popup Cookie & Terms...");
        await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button, div[role="button"]'));
            const cookieBtn = btns.find(b => {
                const txt = b.textContent.toLowerCase();
                return txt.includes('accept') || txt.includes('agree') || txt.includes('got it') || txt.includes('confirm');
            });
            if (cookieBtn) cookieBtn.click();
            const allElements = document.querySelectorAll('*');
            for (const el of allElements) {
                const style = window.getComputedStyle(el);
                if (style.position === 'fixed' && style.bottom === '0px' && style.zIndex > 100) el.remove();
            }
        });
        await new Promise(r => setTimeout(r, 1000));

        console.log("👤 [ACTION] Membuka menu Profil di kanan atas...");
        try {
            await page.evaluate(() => {
                const avatars = Array.from(document.querySelectorAll('img[class*="avatar" i], div[class*="avatar" i], img[class*="user" i]'));
                for (const av of avatars) {
                    const rect = av.getBoundingClientRect();
                    if (rect.top < 100 && rect.left > window.innerWidth / 2) { av.click(); return; }
                }
            });
            await new Promise(r => setTimeout(r, 2000));

            console.log("🌐 [ACTION] Mengubah bahasa halaman ke 'Indonesia'...");
            await page.waitForSelector('.setting-dropdown-item[dt-eid="web_app_camp_language"]', { timeout: 5000 });
            await page.click('.setting-dropdown-item[dt-eid="web_app_camp_language"]');
            await new Promise(r => setTimeout(r, 1500));

            await page.waitForSelector('.language-item[data-language="id"]', { timeout: 5000 });
            await page.click('.language-item[data-language="id"]');
            await new Promise(r => setTimeout(r, 500)); 
            
            console.log("   🔄 Mengklik tombol 'Change' dan menunggu reload...");
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 20000 }).catch(() => null),
                page.click('.language-btn')
            ]);
            
            console.log("✅ [SUCCESS] Bahasa berhasil dikunci ke Indonesia.");
            await new Promise(r => setTimeout(r, 4000));
            
            await page.evaluate(() => {
                const overlays = document.querySelectorAll('[style*="position: fixed"][style*="bottom: 0px"]');
                overlays.forEach(el => el.remove());
            });
        } catch (langError) {
            console.log(`⚠️ [WARN] Gagal mengubah bahasa: ${langError.message}`);
        }

        console.log("📡 [ACTION] Memasang jaring penyadap API XHR/Fetch...");
        apiListener = async (response) => {
            const request = response.request();
            if (request.resourceType() === 'xhr' || request.resourceType() === 'fetch') {
                try {
                    const url = response.url();
                    if (url.includes('getallherobriefinfo')) {
                        const json = await response.json();
                        if (json && json.data && json.data.heroList) {
                            console.log(`\n🎣 [BINGO] API Daftar Hero Utama tertangkap dari: ${url.split('?')[0]}`);
                            if (!capturedHeroData) capturedHeroData = json; 
                        }
                    }
                } catch (e) {}
            }
        };
        page.on('response', apiListener);
        
        console.log("⏳ [WAIT] Menunggu tombol navigasi hero muncul...");
        await page.waitForSelector('.toolsItem-YoXCI', { timeout: 10000 }).catch(() => { throw new Error("Elemen navigasi utama tidak muncul."); });
        console.log("🖱️ [ACTION] Mencari dan mengeklik tombol 'Semua hero'...");

        const clickResult = await page.evaluate(() => {
            const items = Array.from(document.querySelectorAll('.toolsItem-YoXCI'));
            const target = items.find(el => {
                const text = el.textContent.trim().toLowerCase();
                return text.includes('semua hero') || text.includes('all heroes');
            });
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                target.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
                target.click();
                return { success: true, foundText: target.textContent.trim() };
            }
            return { success: false, availableText: items.map(i => i.textContent.trim()) };
        });

        if (!clickResult.success) throw new Error(`Gagal menemukan tombol 'Semua hero'.`);
        console.log(`✅ [INFO] Tombol '${clickResult.foundText}' berhasil diklik!`);

        console.log("⏳ [WAIT] Menunggu animasi daftar pahlawan (DOM update)...");
        await new Promise(r => setTimeout(r, 4000)); 

        console.log("👆 [ACTION] Mencari dan mengeklik salah satu hero di daftar...");
        const heroClickResult = await page.evaluate(() => {
            const images = Array.from(document.querySelectorAll('img'));
            const heroAvatars = images.filter(img => img.getBoundingClientRect().width > 35 && img.getBoundingClientRect().width < 100);
            if (heroAvatars.length > 0) {
                const wrapper = heroAvatars[0].closest('a, div[role="button"], li') || heroAvatars[0];
                wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
                wrapper.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
                wrapper.click();
                return { success: true, method: "Visual Avatar" };
            }
            return { success: false };
        });

        if (heroClickResult.success) {
            console.log(`✅ [SUCCESS] Berhasil mengeklik hero via pendekatan: ${heroClickResult.method}`);
            console.log("⏳ [INFO] API Hero seharusnya sudah ter-trigger. Menunggu respon jaringan...");
            await new Promise(r => setTimeout(r, 6000)); 
        } else {
            console.log("⚠️ [WARN] Gagal menemukan pahlawan di layar untuk diklik.");
        }

        if (apiListener) page.off('response', apiListener); 

        if (capturedHeroData) {
            const rawDir = path.join(__dirname, '../../../data/raw');
            if (!fs.existsSync(rawDir)) fs.mkdirSync(rawDir, { recursive: true });
            
            const outPath = path.join(rawDir, 'heroList_raw.json');
            fs.writeFileSync(outPath, JSON.stringify(capturedHeroData, null, 2));
            
            console.log(`\n==================================================`);
            console.log(`🏆 [MISSION ACCOMPLISHED] Data API berhasil dicuri!`);
            console.log(`💾 [SAVED] File mentah aman di: data/raw/heroList_raw.json`);
            console.log(`==================================================`);

            await parseHeroData();

        } else {
            console.log(`\n⚠️ [MISSION FAILED] Jaring penyadap kosong.`);
        }

    } catch (error) {
        console.error(`❌ [ERROR]:`, error.message);
        logToDatabase('ERROR', `[FASE 01] ${error.message}`);
    } finally {
        if (browserInstance) {
            await browserInstance.close();
            console.log("\n🧹 [CLEANUP] Browser ditutup.");
        }
    }
}

module.exports = { execute };