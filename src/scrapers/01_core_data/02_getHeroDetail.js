const { launchBrowser, fetchPage } = require('../../utils/fetcher');
const fs = require('fs');
const path = require('path');

/**
 * 🔍 FASE 02: MENDAPATKAN DETAIL PROFIL PAHLAWAN (HEURISTIC RADAR)
 * Lokasi: src/scrapers/01_core_data/02_getHeroDetail.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur: Deep Search JSON Parser, Anti-Overwrite, Energy Added, Text Sanitizer!
 */

function logToDatabase(level, message) {
    const logPath = path.join(__dirname, '../../../logs/error.log');
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}\n`;
    if (!fs.existsSync(path.dirname(logPath))) fs.mkdirSync(path.dirname(logPath), { recursive: true });
    fs.appendFileSync(logPath, logEntry);
}

// ============================================================================
// 🧠 RADAR HEURISTIK (DEEP SEARCH JSON ENGINE)
// ============================================================================
function findObjWithKey(obj, keyToFind) {
    let result = null;
    function search(node) {
        if (result) return;
        if (node !== null && typeof node === 'object' && !Array.isArray(node)) {
            if (keyToFind in node) {
                result = node;
                return;
            }
            for (let key in node) {
                search(node[key]);
            }
        }
    }
    search(obj);
    return result || {};
}

function findSkillList(obj) {
    let bestList = [];
    function search(node) {
        if (node !== null && typeof node === 'object') {
            for (let key in node) {
                if (key === 'skillList' && Array.isArray(node[key])) {
                    if (node[key].length > bestList.length) bestList = node[key];
                } else if (typeof node[key] === 'object') {
                    search(node[key]);
                }
            }
        }
    }
    search(obj);
    return bestList;
}

// ✨ ALAT PEMBERSIH TEKS (TEXT SANITIZER)
function sanitizeText(text) {
    if (!text) return "";
    return text
        .replace(/<[^>]*>?/gm, '') // Menghapus semua tag HTML seperti <color=#ffc834> dan </color>
        .replace(/\n/g, ' ')       // Mengganti newline (\n) dengan spasi
        .replace(/\r/g, ' ')       // Mengganti carriage return (\r) dengan spasi
        .replace(/\s+/g, ' ')      // Menghapus spasi ganda yang berlebihan akibat penggantian
        .trim();                   // Membuang spasi di awal/akhir string
}

// ============================================================================
// 🧹 FUNGSI PARSER: MERAPIKAN DATA DETAIL PAHLAWAN
// ============================================================================
async function parseHeroDetails() {
    console.log("\n🧹 [PARSING] Memulai pembersihan data detail pahlawan (Mode Radar Heuristik)...");
    const rawFolder = path.join(__dirname, '../../../data/raw/hero_details');
    const processedFolder = path.join(__dirname, '../../../data/processed/id/hero_details');

    if (!fs.existsSync(processedFolder)) fs.mkdirSync(processedFolder, { recursive: true });

    try {
        if (!fs.existsSync(rawFolder)) throw new Error("Folder raw hero_details tidak ditemukan!");
        
        const files = fs.readdirSync(rawFolder).filter(f => f.endsWith('_raw.json'));
        let count = 0;

        for (const file of files) {
            const rawData = JSON.parse(fs.readFileSync(path.join(rawFolder, file), 'utf8'));

            const heroInfo = findObjWithKey(rawData, 'heroName');
            const displayData = findObjWithKey(rawData, 'heroCover');
            const baseData = findObjWithKey(rawData, 'winRate');
            const worldData = findObjWithKey(rawData, 'region');
            const skillList = findSkillList(rawData);

            if (!heroInfo.heroId) continue;

            const cleanDetail = {
                id: heroInfo.heroId?.toString() || "0",
                name: heroInfo.heroName || "Unknown",
                role: heroInfo.mainJobName || "",
                sub_role: heroInfo.minorJobName || null,
                lane: heroInfo.recommendRoadName || "",
                
                visuals: {
                    icon: heroInfo.icon || "",
                    cover: displayData.heroCover || "",
                    world_icon: displayData.heroWorldIcon || ""
                },

                meta_stats: {
                    tier: baseData.hot || "",
                    win_rate: baseData.winRate || "",
                    match_rate: baseData.matchRate || "",
                    ban_rate: baseData.banRate || ""
                },

                lore: {
                    height: worldData.height || "Unknown",
                    region: worldData.region || "Unknown",
                    identity: worldData.identity || "Unknown",
                    energy: worldData.energy || "Unknown"
                },

                skills: skillList.map(skill => {
                    let skillType = "Active";
                    if (skill.isPassive) skillType = "Passive";
                    else if (skill.isUlt) skillType = "Ultimate";

                    let manaCost = 0;
                    if (skill.skillCostList && typeof skill.skillCostList.skillCost !== 'undefined') {
                        manaCost = skill.skillCostList.skillCost;
                    } else if (typeof skill.skillCost !== 'undefined') {
                        manaCost = skill.skillCost;
                    }

                    return {
                        name: skill.skillName || "Unknown",
                        type: skillType,
                        icon: skill.skillIcon || "",
                        cooldown: typeof skill.skillCd !== 'undefined' ? skill.skillCd : 0,
                        mana_cost: manaCost,
                        // ✨ FIX: Menggunakan Text Sanitizer
                        description: sanitizeText(skill.skillDesc),
                        video_url: skill.skillVideo || ""
                    };
                })
            };

            const outPath = path.join(processedFolder, `${cleanDetail.id}.json`);
            fs.writeFileSync(outPath, JSON.stringify(cleanDetail, null, 2));
            count++;
        }

        console.log(`✨ [PARSED] ${count} Detail Pahlawan berhasil dirapikan! Radar sukses.`);
        console.log(`💾 [SAVED] File matang siap pakai di: data/processed/id/hero_details/`);

    } catch (error) {
        console.error(`❌ [PARSE ERROR]: ${error.message}`);
        logToDatabase('ERROR', `[FASE 02 PARSER] ${error.message}`);
    }
}

// ============================================================================
// 🚀 FUNGSI UTAMA: SCRAPING LOOP
// ============================================================================
async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 02] Memulai Eksekusi: Penyadapan Detail Hero (ID)");
    console.log("==================================================");

    // ✨ SAKELAR UPDATE PATCH: DI-OFF-KAN agar kita bisa tes Parser langsung
    // tanpa perlu membuang waktu 5 menit untuk scrape ulang file raw Anda.
    const CLEAN_SLATE_MODE = false;

    const heroListPath = path.join(__dirname, '../../../data/processed/id/heroList.json');
    const rawFolder = path.join(__dirname, '../../../data/raw/hero_details');
    const processedFolder = path.join(__dirname, '../../../data/processed/id/hero_details');
    
    // EKSEKUSI SAPU BERSIH 
    if (CLEAN_SLATE_MODE) {
        console.log("🧹 [CLEAN SLATE] Menghapus data detail lama yang cacat...");
        if (fs.existsSync(rawFolder)) fs.rmSync(rawFolder, { recursive: true, force: true });
        if (fs.existsSync(processedFolder)) fs.rmSync(processedFolder, { recursive: true, force: true });
    }

    if (!fs.existsSync(rawFolder)) fs.mkdirSync(rawFolder, { recursive: true });

    if (!fs.existsSync(heroListPath)) {
        console.error("❌ [ERROR] data/processed/id/heroList.json tidak ditemukan!");
        return;
    }

    const heroes = JSON.parse(fs.readFileSync(heroListPath, 'utf8'));
    console.log(`📊 [INFO] Menemukan ${heroes.length} Pahlawan di Database. Memulai operasi...`);

    let browserInstance;
    try {
        browserInstance = await launchBrowser();
        const page = await browserInstance.newPage();
        
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        console.log("\n🌐 [PRE-FLIGHT] Memasuki Homepage untuk mengunci bahasa...");
        await page.goto('https://camp.honorofkings.com/h5/app/index.html#/hero-homepage', { waitUntil: 'networkidle2' });
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
            
            console.log("✅ [SUCCESS] Bahasa Global berhasil dikunci ke 'Indonesia'.");
            await new Promise(r => setTimeout(r, 4000));
            
            await page.evaluate(() => {
                const overlays = document.querySelectorAll('[style*="position: fixed"][style*="bottom: 0px"]');
                overlays.forEach(el => el.remove());
            });

        } catch (langError) {
            console.log(`⚠️ [WARN] Gagal mengubah bahasa: ${langError.message}`);
        }

        console.log("\n🚀 [START] Memulai penyadapan detail per pahlawan...\n");

        for (const hero of heroes) {
            const rawPath = path.join(rawFolder, `${hero.id}_raw.json`);
            
            if (fs.existsSync(rawPath) && !CLEAN_SLATE_MODE) {
                console.log(`⏭️ [SKIP] Hero ${hero.name} (${hero.id}) sudah ada di database mentah.`);
                continue;
            }

            console.log(`🔍 [SCAN] Membedah profil: ${hero.name} (ID: ${hero.id})...`);
            let heroDataCaptured = null;

            const onResponse = async (response) => {
                const req = response.request();
                if (req.resourceType() === 'xhr' || req.resourceType() === 'fetch') {
                    const url = response.url();
                    if (url.includes('hero') || url.includes('detail')) {
                        try {
                            const json = await response.json();
                            
                            // Gunakan Radar Heuristik untuk mengendus isi Network
                            const hInfo = findObjWithKey(json, 'heroName');
                            const sList = findSkillList(json);
                            
                            // 🎯 BINGO HANYA JIKA ADA DATA SKILL YANG VALID
                            if (hInfo && hInfo.heroId && sList.length > 0) {
                                if (hInfo.heroId.toString() === hero.id.toString()) {
                                    heroDataCaptured = json;
                                }
                            }
                        } catch (e) {}
                    }
                }
            };

            page.on('response', onResponse);

            try {
                const detailUrl = `https://camp.honorofkings.com/h5/app/index.html#/hero-detail?heroId=${hero.id}`;
                await page.goto(detailUrl, { waitUntil: 'networkidle2', timeout: 20000 });
                
                // Memicu trigger API (Scroll sedikit ke area skill)
                await page.evaluate(() => window.scrollBy(0, 800));
                
                let waitTime = 0;
                while (!heroDataCaptured && waitTime < 8000) { 
                    await new Promise(r => setTimeout(r, 500));
                    waitTime += 500;
                }

                if (heroDataCaptured) {
                    fs.writeFileSync(rawPath, JSON.stringify(heroDataCaptured, null, 2));
                    console.log(`   ✅ [BINGO] Data Full Wiki ${hero.name} sukses diamankan.`);
                } else {
                    console.log(`   ⚠️ [WARN] API Full Wiki tidak tertangkap untuk ${hero.name}. Coba refresh manual...`);
                    await page.reload({ waitUntil: 'networkidle2' });
                    await new Promise(r => setTimeout(r, 3000));
                    if (heroDataCaptured) {
                        fs.writeFileSync(rawPath, JSON.stringify(heroDataCaptured, null, 2));
                        console.log(`   ✅ [RETRY BINGO] Data Full Wiki ${hero.name} sukses diamankan.`);
                    } else {
                        logToDatabase('WARN', `Gagal menyadap Full Wiki API untuk Hero ${hero.name} (${hero.id})`);
                    }
                }

            } catch (err) {
                console.error(`   ❌ [ERROR] Navigasi ${hero.name} gagal: ${err.message}`);
                logToDatabase('ERROR', `[FASE 02] ${hero.name}: ${err.message}`);
            }

            page.off('response', onResponse);
            await new Promise(r => setTimeout(r, 1500));
        }

    } catch (error) {
        console.error(`\n🚨 [FATAL ERROR]: ${error.message}`);
        logToDatabase('ERROR', `[FASE 02 FATAL] ${error.message}`);
    } finally {
        if (browserInstance) {
            console.log("\n🧹 [CLEANUP] Menutup browser...");
            await browserInstance.close();
        }
        
        await parseHeroDetails();
        console.log("🏁 [FASE 02] Operasi Orchestrator Selesai.");
    }
}

module.exports = { execute };