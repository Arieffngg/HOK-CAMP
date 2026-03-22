const { launchBrowser } = require('../../utils/fetcher');
const fs = require('fs');
const path = require('path');

/**
 * 📜 FASE 08: ARSIP KRONOLOGI LORE RESMI (THE GRAND ARCHIVIST V3.0)
 * Lokasi: src/scrapers/01_core_data/08_getLoreTimeline.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur Utama: Multiverse Tab Engine, Multi-Dimensional Extraction (Heroes, Characteristics, Lore).
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
    console.log("🟢 [FASE 08] Memulai Eksekusi: Arsip Kronologi Lore Resmi");
    console.log("🛠️  Metode: IP World Region Harvester (The Grand Archivist V3.0)");
    console.log("==================================================");

    const processedFolder = path.join(__dirname, '../../../data/processed/id');
    const outPath = path.join(processedFolder, 'world_regions.json');

    if (!fs.existsSync(processedFolder)) fs.mkdirSync(processedFolder, { recursive: true });

    let browserInstance;

    try {
        browserInstance = await launchBrowser();
        const basePage = await browserInstance.newPage();
        
        await basePage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await basePage.setViewport({ width: 1440, height: 900 });

        // 🚀 MASUK KE HALAMAN REGION UTAMA
        const targetUrl = 'https://world.honorofkings.com/ipworld/id/region.html';
        console.log(`🌐 [FETCH] Menyelusup ke Pangkalan Utama: ${targetUrl}`);
        
        await basePage.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 45000 });

        console.log("   🍪 [ACTION] Membantai Cookie & Privacy Blockers di Pangkalan...");
        await basePage.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button, a, div[role="button"]'));
            const acceptBtn = btns.find(b => b.innerText && b.innerText.toLowerCase().includes('accept'));
            if (acceptBtn) acceptBtn.click();
            document.querySelectorAll('#onetrust-consent-sdk, .ot-sdk-container, [class*="cookie"]').forEach(el => el.remove());
            document.body.style.setProperty('overflow', 'auto', 'important');
        });

        await new Promise(r => setTimeout(r, 3000));

        // 👁️ KUMPULKAN SEMUA LINK REGION
        console.log("   🗺️ [SCAN] Memetakan koordinat semua wilayah...");
        const regionLinks = await basePage.evaluate(() => {
            const links = [];
            const elements = document.querySelectorAll('.region-menu-a');
            
            elements.forEach(el => {
                const url = el.getAttribute('href');
                const titleNode = el.querySelector('.rgmenu-title b');
                const mottoNode = el.querySelector('.rgmenu-title em');
                
                const title = titleNode ? titleNode.innerText.trim() : "Unknown Region";
                const motto = mottoNode ? mottoNode.innerText.trim() : "";
                
                if (url && url.length > 5 && !url.includes('javascript:')) {
                    const absoluteUrl = url.startsWith('http') ? url : `https://world.honorofkings.com/ipworld/id/${url.replace(/^\//, '')}`;
                    links.push({ url: absoluteUrl, title, motto });
                }
            });
            return links;
        });

        console.log(`   ✅ [BINGO] Ditemukan ${regionLinks.length} wilayah yang siap dieksplorasi.`);

        const allRegionsData = [];

        // 🛸 MULTIVERSE TAB ENGINE: BUKA, EKSTRAK, TUTUP
        for (const region of regionLinks) {
            console.log(`\n   🛸 [JUMP] Melompat ke wilayah: ${region.title}...`);
            
            const detailPage = await browserInstance.newPage();
            try {
                await detailPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
                await detailPage.setViewport({ width: 1440, height: 900 });
                
                await detailPage.goto(region.url, { waitUntil: 'networkidle2', timeout: 35000 });

                // Hapus blocker di tab baru
                await detailPage.evaluate(() => {
                    document.querySelectorAll('#onetrust-consent-sdk, .ot-sdk-container, [class*="cookie"], .mask, .overlay').forEach(el => el.remove());
                    document.body.style.setProperty('overflow', 'auto', 'important');
                    document.body.style.setProperty('position', 'static', 'important');
                });

                console.log(`      📜 Menggali gulungan sejarah (Auto-Scroll)...`);
                await detailPage.evaluate(async () => {
                    await new Promise((resolve) => {
                        let totalHeight = 0;
                        const distance = 250;
                        const timer = setInterval(() => {
                            const scrollHeight = document.body.scrollHeight;
                            window.scrollBy(0, distance);
                            totalHeight += distance;
                            if (totalHeight >= scrollHeight || totalHeight > 10000) {
                                clearInterval(timer);
                                resolve();
                            }
                        }, 100);
                    });
                });
                await new Promise(r => setTimeout(r, 2500));

                // 🎯 EKSTRAKSI DOM MULTI-DIMENSI DARI TECH LEAD
                const extractedData = await detailPage.evaluate(() => {
                    const BASE_URL = "https://world.honorofkings.com";
                    const result = { paragraphs: [], heroes: [], characteristics: [] };

                    // 🦸 1. EKSTRAK HERO (Filter Swiper Duplicate)
                    const heroNodes = document.querySelectorAll('#region-hero-swiper .swiper-slide:not(.swiper-slide-duplicate)');
                    heroNodes.forEach(slide => {
                        const name = slide.querySelector('.rhero-rtop-lname')?.innerText.trim() || "";
                        const quote = slide.querySelector('.rhero-rtop-rlines')?.innerText.trim() || "";
                        const desc = slide.querySelector('.common-scroll p')?.innerText.trim() || "";
                        
                        const imgRaw = slide.querySelector('.rhero-limg img')?.getAttribute('data-src') || slide.querySelector('.rhero-limg img')?.getAttribute('src') || "";
                        const imgUrl = imgRaw ? (imgRaw.startsWith('http') ? imgRaw : BASE_URL + imgRaw) : "";
                        
                        if (name) {
                            result.heroes.push({ name, quote, description: desc, image_url: imgUrl });
                        }
                    });

                    // 🏰 2. EKSTRAK KARAKTERISTIK / LOKASI
                    const charSections = document.querySelectorAll('.part-characteristic');
                    charSections.forEach(section => {
                        const titleBoxes = section.querySelectorAll('.common-title-box');
                        titleBoxes.forEach(titleBox => {
                            const categoryName = titleBox.querySelector('.common-title')?.innerText.trim() || "Informasi Tambahan";
                            // Cari container area-box yang tepat berada setelah judul ini
                            const nextSibling = titleBox.nextElementSibling;
                            if (nextSibling && nextSibling.classList.contains('area-box')) {
                                const items = nextSibling.querySelectorAll('.area-item');
                                const categoryItems = [];
                                items.forEach(item => {
                                    const itemName = item.querySelector('.area-desc b')?.innerText.trim() || item.querySelector('.area-title b')?.innerText.trim() || "";
                                    const itemDesc = item.querySelector('.area-desc em')?.innerText.trim() || item.querySelector('.area-title em')?.innerText.trim() || "";
                                    
                                    const imgRaw = item.querySelector('.area-bg img')?.getAttribute('data-src') || item.querySelector('.area-bg img')?.getAttribute('src') || "";
                                    const imgUrl = imgRaw ? (imgRaw.startsWith('http') ? imgRaw : BASE_URL + imgRaw) : "";
                                    
                                    if (itemName) {
                                        categoryItems.push({ name: itemName, description: itemDesc, image_url: imgUrl });
                                    }
                                });
                                if (categoryItems.length > 0) {
                                    result.characteristics.push({ category: categoryName, items: categoryItems });
                                }
                            }
                        });
                    });

                    // 📖 3. EKSTRAK LORE MURNI (Filter Kebocoran HTML)
                    const textNodes = document.querySelectorAll('p, .desc, .text, .content, .summary');
                    const blacklist = ['Proxima Beta', 'All rights reserved', '©', 'PERJANJIAN LISENSI', 'KEBIJAKAN PRIVASI', 'COOKIE', 'This page does not support PC', 'HUBUNGI KAMI', 'ADVERTISING NOTICE', 'PEMBERITAHUAN LEGAL'];

                    textNodes.forEach(node => {
                        // Tolak elemen navigasi/footer
                        if (node.closest('footer') || node.closest('.nav') || node.closest('.header') || node.closest('.footer-wrap')) return;
                        
                        // ✨ BLOKIR KEBOCORAN: Jika tag P ini berada di dalam container Hero atau Karakteristik, ABAIKAN!
                        if (node.closest('.part-hero-swiper') || node.closest('.part-characteristic')) return;
                        
                        const text = node.innerText.trim();
                        const isBlacklisted = blacklist.some(kw => text.includes(kw)) || text.startsWith('page.');
                        
                        if (!isBlacklisted && text.length > 20) {
                            result.paragraphs.push(text);
                        }
                    });

                    result.paragraphs = [...new Set(result.paragraphs)];

                    return result;
                });

                allRegionsData.push({
                    id: region.url.split('/').pop().replace('.html', '').replace('region-detail-', ''),
                    name: region.title,
                    motto: region.motto,
                    source_url: region.url,
                    story_paragraphs: extractedData.paragraphs.map(p => sanitizeText(p)),
                    heroes: extractedData.heroes.map(h => ({
                        name: h.name,
                        quote: h.quote,
                        description: sanitizeText(h.description),
                        image_url: h.image_url
                    })),
                    characteristics: extractedData.characteristics.map(c => ({
                        category: c.category,
                        items: c.items.map(i => ({
                            name: i.name,
                            description: sanitizeText(i.description),
                            image_url: i.image_url
                        }))
                    }))
                });

                console.log(`      ✔️ Berhasil mengekstrak ${extractedData.paragraphs.length} paragraf murni.`);
                console.log(`      🦸 Menemukan ${extractedData.heroes.length} Pahlawan wilayah.`);
                let charCount = extractedData.characteristics.reduce((acc, curr) => acc + curr.items.length, 0);
                console.log(`      🏰 Menemukan ${charCount} Data Karakteristik / Lokasi.`);

            } catch (errInner) {
                console.log(`      ❌ [ERROR] Gagal membedah ${region.title}: ${errInner.message}`);
                allRegionsData.push({
                    id: region.url.split('/').pop().replace('.html', '').replace('region-detail-', ''),
                    name: region.title,
                    motto: region.motto,
                    source_url: region.url,
                    story_paragraphs: [],
                    heroes: [],
                    characteristics: []
                });
            } finally {
                console.log(`      🚪 Menutup dimensi tab ini.`);
                await detailPage.close().catch(() => {});
            }
            
            await new Promise(r => setTimeout(r, 1500));
        }

        // SIMPAN HASIL AKHIR
        fs.writeFileSync(outPath, JSON.stringify(allRegionsData, null, 2));

        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Fase 08 Ekspedisi Multi-Dimensi Selesai!`);
        console.log(`💾 Data Lore, Hero, & Karakteristik tersimpan di: data/processed/id/world_regions.json`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
        logToDatabase('ERROR', `[FASE 08] ${error.message}`);
    } finally {
        if (browserInstance) await browserInstance.close();
    }
}

module.exports = { execute };