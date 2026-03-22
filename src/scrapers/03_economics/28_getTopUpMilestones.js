const fs = require('fs');
const path = require('path');

/**
 * 💳 FASE 28: INFO EVENT AKUMULASI TOP-UP (RECHARGE MILESTONES V2.0)
 * Lokasi: src/scrapers/03_economics/28_getTopUpMilestones.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur Utama: Menyuntikkan database statis tentang mekanisme hadiah top-up 
 * (Daily vs cumulative) dengan sinkronisasi nilai IDR presisi (1 Token = Rp 265).
 * Update: Penambahan ROI Logic untuk perbandingan strategi spending.
 */

// ============================================================================
// 🧠 DATABASE MEKANIK RECHARGE (HONOR OF KINGS - ID PRECISION)
// ============================================================================
const RECHARGE_DB = {
    metadata: {
        title: "Honor of Kings - Recharge Events & Top-Up Milestones",
        description: "Panduan mekanisme hadiah tambahan saat melakukan pengisian ulang (Top-Up) Token.",
        conversion_rate: "1 Token = Rp 265 (Base Rate)",
        last_updated: "2026-03-20T20:31:00Z"
    },

    event_types: [
        {
            id: "daily_recharge",
            name: "Daily Recharge (Top-Up Harian)",
            frequency: "Sangat Sering (Biasanya 3-4 hari dalam seminggu)",
            mechanics: "Hadiah diberikan berdasarkan jumlah top-up DALAM SATU HARI. Biasanya reset setiap jam 05:00 WIB.",
            common_rewards: [
                "Skin Fragments",
                "Honor Points",
                "Avatar Frame terbatas (pada tier 300+ Tokens)"
            ],
            strategy: "Strategi 'Cicil Harian': Top-up 10 atau 60 Token setiap hari selama event untuk memaksimalkan jumlah Skin Fragment dengan biaya termurah."
        },
        {
            id: "cumulative_recharge",
            name: "Cumulative Recharge (Akumulasi Top-Up)",
            frequency: "Jarang (Event Besar/Kolaborasi)",
            mechanics: "Hadiah dihitung dari TOTAL top-up selama periode event (7-14 hari). Tier bisa mencapai 5000+ Tokens.",
            common_rewards: [
                "Skin Epic/Legend Pilihan (Tier Tinggi)",
                "Recall/Elimination Effect Eksklusif",
                "Limited Edition Emotes & Quick Chat"
            ],
            strategy: "Simpan budget Top-Up besar Anda untuk event ini. Sangat efektif jika digabungkan dengan pembelian Skin Legend baru agar 'Double Profit' (dapat skin + dapat bonus recharge)."
        }
    ],

    standard_milestones: [
        { 
            tokens: 10, 
            value_idr: "Rp 2.650", 
            reward_tier: "Bronze", 
            rewards: ["Skin Fragment x1", "Starstone x50"],
            best_for: "Pemain F2P yang ingin mengumpulkan fragment skin secara perlahan."
        },
        { 
            tokens: 60, 
            value_idr: "Rp 15.900", 
            reward_tier: "Silver", 
            rewards: ["Honor Points x30", "Skin Fragment x2"],
            best_for: "Aktivasi mingguan untuk mengincar draw di Point Draw."
        },
        { 
            tokens: 300, 
            value_idr: "Rp 79.500", 
            reward_tier: "Gold", 
            rewards: ["Honor Points x60", "Lucky Bag (Skin/Hero Trial)"],
            best_for: "Membeli Honor Pass sambil mendapatkan bonus harian."
        },
        { 
            tokens: 1000, 
            value_idr: "Rp 265.000", 
            reward_tier: "Platinum", 
            rewards: ["Exclusive Emote", "Skin Fragment x10", "Honor Points x120"],
            best_for: "Membeli Skin Epic rilis baru di minggu pertama."
        },
        { 
            tokens: 2000, 
            value_idr: "Rp 530.000", 
            reward_tier: "Diamond", 
            rewards: ["Limited Recall Effect", "Honor Points x200"],
            best_for: "Membeli Skin Legend atau mengejar Pity Gacha."
        }
    ],

    spending_wisdom: {
        comparison: "Jika dibandingkan, membeli Honor Pass (388 Token) saat event Daily Recharge (300 Token) memberikan ROI (Return on Investment) tertinggi bagi pemain menengah.",
        warning: "Jangan pernah melakukan top-up di luar periode event jika tujuannya adalah efisiensi. Selalu tunggu pengumuman event 'Recharge' muncul di tab event.",
        third_party: "Top-up melalui platform resmi pihak ketiga (seperti Codashop/UniPin) tetap akan mentrigger hadiah ini secara instan setelah token masuk ke akun."
    }
};

async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 28] Memulai Eksekusi: Info Event Akumulasi Top-Up");
    console.log("🛠️  Metode: Static Recharge Logic Injector (Precise IDR V2.0)");
    console.log("==================================================");

    const processedFolder = path.join(__dirname, '../../../data/processed/id');
    const outPath = path.join(processedFolder, 'recharge_milestones.json');

    if (!fs.existsSync(processedFolder)) fs.mkdirSync(processedFolder, { recursive: true });

    try {
        console.log(`📦 [INFO] Menyuntikkan Data Recharge Presisi: Milestones, Strategi Cicil, & ROI Analysis...`);
        
        fs.writeFileSync(outPath, JSON.stringify(RECHARGE_DB, null, 2));

        console.log(`✅ [BINGO] Data Akumulasi Top-Up berhasil dikompilasi ulang secara presisi.`);

        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Fase 28 Selesai! PILAR 3 (ECONOMICS) RESMI TAMAT! 💳💎`);
        console.log(`💾 File tersimpan di: data/processed/id/recharge_milestones.json`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
    }
}

module.exports = { execute };