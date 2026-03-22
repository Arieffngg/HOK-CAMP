const { launchBrowser } = require('../../utils/fetcher');
const fs = require('fs');
const path = require('path');

/**
 * 🤝 FASE 02b: DATABASE HUBUNGAN & RELASI PAHLAWAN (THE MATCHMAKER V1.0)
 * Lokasi: src/scrapers/01_core_data/02b_getHeroRelationships.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur Utama: Multiverse Tab Engine, DOM State Clicker, Anti-Garbage Filter.
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

async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 02b] Memulai Eksekusi: Database Hubungan Pahlawan");
    console.log("🛠️  Metode: IP World Matchmaker (Multiverse Tab Engine)");
    console.log("==================================================");

    const processedFolder = path.join(__dirname, '../../../data/processed/id');
    const heroListPath = path.join(processedFolder, 'heroList.json');
    const outPath = path.join(processedFolder, 'hero_relationships.json');

    if (!fs.existsSync(processedFolder)) fs.mkdirSync(processedFolder, { recursive: true });
    if (!fs.existsSync(heroListPath)) {
        console.error("❌ [ERROR] heroList.json tidak ditemukan! Harap jalankan Fase 01.");
        return;
    }

    const heroes = JSON.parse(fs.readFileSync(heroListPath, 'utf8'));
    let browserInstance;
    const allRelationships = [];

    try {
        browserInstance = await launchBrowser();
        
        console.log(`📊 [INFO] Menyiapkan armada untuk melacak hubungan ${heroes.length} Pahlawan...`);

        // 🛸 MULTIVERSE TAB ENGINE
        for (const hero of heroes) {
            console.log(`\n   🛸 [JUMP] Melacak jaring koneksi: ${hero.name} (ID: ${hero.id})...`);
            
            const detailPage = await browserInstance.newPage();
            try {
                await detailPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
                await detailPage.setViewport({ width: 1440, height: 900 });
                
                const targetUrl = `https://world.honorofkings.com/ipworld/id/relationship.html?heroId=${hero.id}`;
                await detailPage.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 35000 });

                // 🍪 Hapus blocker & buka paksa area klik
                await detailPage.evaluate(() => {
                    document.querySelectorAll('#onetrust-consent-sdk, .ot-sdk-container, [class*="cookie"], .mask, .overlay').forEach(el => el.remove());
                    document.body.style.setProperty('overflow', 'auto', 'important');
                    // Paksa buka dropdown list agar item bisa diklik tanpa hover
                    const dialogList = document.querySelector('.dialog-portrait-change');
                    if(dialogList) dialogList.style.display = 'block';
                });

                // ⏳ Tunggu container hubungan termuat
                const hasRelation = await detailPage.waitForSelector('.relation-description', { timeout: 8000 }).then(() => true).catch(() => false);

                if (!hasRelation) {
                    console.log(`      ⚠️ [WARN] Data hubungan tidak ditemukan/belum dirilis untuk ${hero.name}.`);
                    allRelationships.push({
                        hero_id: hero.id,
                        hero_name: hero.name,
                        relationships: []
                    });
                } else {
                    // 🎯 DOM STATE CLICKER (Loop untuk setiap orang yang berhubungan)
                    const extractedRelations = [];
                    
                    // Hitung jumlah relasi yang ada
                    const relationCount = await detailPage.evaluate(() => document.querySelectorAll('.dp-item').length);
                    console.log(`      🤝 Ditemukan ${relationCount} koneksi hero. Memulai ekstraksi...`);

                    for (let i = 0; i < relationCount; i++) {
                        // Klik relasi ke-i
                        await detailPage.evaluate((index) => {
                            const items = document.querySelectorAll('.dp-item');
                            if (items[index]) items[index].click();
                        }, i);

                        // Beri jeda agar React/Vue merender ulang teks di tengah
                        await new Promise(r => setTimeout(r, 600));

                        // Ekstrak data setelah teks berubah
                        const relData = await detailPage.evaluate((index) => {
                            const item = document.querySelectorAll('.dp-item')[index];
                            const relatedId = item.getAttribute('data-id');
                            const relatedName = item.getAttribute('data-name');
                            
                            const titleEl = document.querySelector('.relation-center-title');
                            // Ambil teks dari kontainer desktop agar tidak duplikat dengan mobile
                            const descEl = document.querySelector('.relation-center-box:not(.relation-center-box--mobile) .relation-text');
                            
                            return {
                                related_hero_id: relatedId,
                                related_hero_name: relatedName,
                                relation_title: titleEl ? titleEl.innerText.trim() : "Terkoneksi",
                                relation_desc: descEl ? descEl.innerText.trim() : ""
                            };
                        }, i);

                        if (relData.related_hero_id) {
                            extractedRelations.push({
                                related_hero_id: relData.related_hero_id,
                                related_hero_name: relData.related_hero_name,
                                relation_title: sanitizeText(relData.relation_title),
                                relation_desc: sanitizeText(relData.relation_desc)
                            });
                        }
                    }

                    allRelationships.push({
                        hero_id: hero.id,
                        hero_name: hero.name,
                        relationships: extractedRelations
                    });

                    console.log(`      ✔️ Selesai menyadap ${extractedRelations.length} status relasi.`);
                }

            } catch (errInner) {
                console.log(`      ❌ [ERROR] Gagal membedah relasi ${hero.name}: ${errInner.message}`);
                allRelationships.push({ hero_id: hero.id, hero_name: hero.name, relationships: [] });
            } finally {
                console.log(`      🚪 Menutup dimensi tab ini.`);
                await detailPage.close().catch(() => {});
            }
            
            // Jeda antar pahlawan agar server aman
            await new Promise(r => setTimeout(r, 1000));
        }

        // SIMPAN HASIL AKHIR
        fs.writeFileSync(outPath, JSON.stringify(allRelationships, null, 2));

        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Fase 02b Ekspedisi Hubungan Pahlawan Selesai!`);
        console.log(`💾 Seluruh Relasi (Teman/Musuh/Keluarga) tersimpan di: data/processed/id/hero_relationships.json`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
        logToDatabase('ERROR', `[FASE 02b] ${error.message}`);
    } finally {
        if (browserInstance) await browserInstance.close();
    }
}

module.exports = { execute };