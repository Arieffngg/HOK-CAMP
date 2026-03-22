const puppeteer = require('puppeteer');
require('dotenv').config(); // Load variabel dari .env

/**
 * 🛠️ TOOLS: fetcher.js
 * 👨‍💻 Tech Lead: Arief
 * Fungsi: Pembungkus Puppeteer standar dengan fitur Inject Cookies/Session
 * untuk bypass login Honor of Kings Camp.
 */

async function launchBrowser() {
    console.log("🚀 [FETCHER] Memulai Browser Instance...");
    const browser = await puppeteer.launch({
        headless: true, // ✨ FIX: Memaksa browser TAMPIL secara fisik
        defaultViewport: null, // ✨ FIX: Menyesuaikan resolusi monitor Anda
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled', // Mencegah deteksi bot dasar
            '--start-maximized' // Buka full screen agar elemen tidak tertutup
        ]
    });
    return browser;
}

/**
 * Membuka halaman dengan menyuntikkan sesi dari .env
 * @param {object} browser - Instance Puppeteer Browser
 * @param {string} url - Target URL
 * @returns {object} - Mengembalikan objek page
 */
async function fetchPage(browser, url) {
    const page = await browser.newPage();

    // 🕵️‍♂️ MENGELABUHI SERVER (SPOOFING USER AGENT)
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    // 🌐 Memaksa browser meminta bahasa Indonesia (opsional, tapi membantu)
    await page.setExtraHTTPHeaders({
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7'
    });

    // 🍪 INJEKSI COOKIES DARI .ENV
    const domain = ".honorofkings.com"; // Sesuaikan dengan domain target
    const cookiesToInject = [];

    if (process.env.HOK_SESSION_ID) {
        cookiesToInject.push({ name: 'session_id', value: process.env.HOK_SESSION_ID, domain: domain });
    }
    if (process.env.HOK_OPEN_ID) {
        cookiesToInject.push({ name: 'open_id', value: process.env.HOK_OPEN_ID, domain: domain });
    }
    if (process.env.HOK_TOKEN) {
        cookiesToInject.push({ name: 'token', value: process.env.HOK_TOKEN, domain: domain });
    }

    if (cookiesToInject.length > 0) {
        console.log(`💉 [FETCHER] Menyuntikkan ${cookiesToInject.length} Kredensial (Cookies) ke browser...`);
        await page.setCookie(...cookiesToInject);
    } else {
        console.log("⚠️ [FETCHER] Peringatan: Tidak ada kredensial di .env. Mengakses sebagai Guest.");
    }

    console.log(`🌐 [FETCHER] Menavigasi ke: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    return page;
}

module.exports = { launchBrowser, fetchPage };