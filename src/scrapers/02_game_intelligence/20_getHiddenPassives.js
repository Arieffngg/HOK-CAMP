const fs = require('fs');
const path = require('path');

/**
 * 🕵️ FASE 20: MATRIKS INTERAKSI RAHASIA HERO (EASTER EGGS V2.1)
 * Lokasi: src/scrapers/02_game_intelligence/20_getHiddenPassives.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur Utama: Menyuntikkan database statis tentang "Hidden Passives", 
 * buff rahasia, dan Voice Lines eksklusif saat kondisi tertentu terpenuhi.
 * Update V2.1: Menghapus "Ma Chao" dari daftar Tiger Generals untuk keamanan sinkronisasi Database ID.
 */

// ============================================================================
// 🧠 DATABASE INTERAKSI RAHASIA & EASTER EGGS (HONOR OF KINGS)
// ============================================================================
const HIDDEN_PASSIVES_DB = {
    metadata: {
        title: "Honor of Kings - Hidden Passives & Easter Eggs Matrix",
        description: "Daftar interaksi rahasia (buff/debuff ringan dan voice lines) berdasarkan lore saat hero tertentu bertarung."
    },
    
    interactions: [
        {
            id: "nemesis_kongming_simayi",
            name: "Nemesis: Kongming & Sima Yi",
            condition: "Kongming dan Sima Yi berada di tim yang berlawanan (Rival).",
            effect: "Keduanya mendapatkan buff rahasia ikonik yang memberikan tambahan +2 Magical Attack (AP).",
            lore: "Mereka adalah rival abadi dari era Tiga Kerajaan (Three Kingdoms) dengan kecerdasan yang setara.",
            heroes_involved: ["Kongming", "Sima Yi"]
        },
        {
            id: "nemesis_execution_kongming_simayi",
            name: "Strategic Superiority: Kongming vs Sima Yi",
            condition: "Kongming (Zhuge Liang) berhasil membunuh (Kill) Sima Yi.",
            effect: "Memicu Voice Line ejekan rahasia: 'Strategiku lebih unggul!' (atau variasi serupa yang merendahkan taktik Sima Yi).",
            lore: "Validasi mutlak atas superioritas taktik di antara dua ahli strategi terhebat di dataran Tiongkok.",
            heroes_involved: ["Kongming", "Sima Yi"]
        },
        {
            id: "lovers_houyi_change",
            name: "Lovers: Hou Yi & Chang'e",
            condition: "Hou Yi dan Chang'e berada di tim yang sama dan saling berdekatan.",
            effect: "Keduanya mendapatkan buff pasif simbolis yang memberikan +13 Physical Defense dan +14 Magical Defense.",
            lore: "Simbol cinta abadi. Angka 13 dan 14 melambangkan 'Seumur Hidup' dalam pelafalan slang Tiongkok (1314 - Yīshēng Yīshì).",
            heroes_involved: ["Hou Yi", "Chang'e"]
        },
        {
            id: "lovers_zhouyu_xiaoqiao",
            name: "Lovers: Zhou Yu & Xiao Qiao",
            condition: "Zhou Yu dan Xiao Qiao berada di tim yang sama dan berdekatan.",
            effect: "Mendapatkan buff ikonik yang sedikit meningkatkan atribut dasar saat mereka saling melindungi di pertempuran.",
            lore: "Pasangan suami-istri legendaris yang saling melengkapi di medan perang.",
            heroes_involved: ["Zhou Yu", "Xiao Qiao"]
        },
        {
            id: "tragic_lovers_lubu_diaochan",
            name: "Tragic Lovers: Lu Bu & Diaochan",
            condition: "Lu Bu berhasil membunuh (Kill) Diaochan di medan pertempuran.",
            effect: "Memicu Voice Line rahasia yang menyayat hati: 'Maafkan aku, Diaochan...' (beserta variasi dialog kesedihan lainnya).",
            lore: "Kisah cinta tragis di mana takdir dan peperangan memaksa mereka saling berhadapan sebagai musuh.",
            heroes_involved: ["Lu Bu", "Diaochan"]
        },
        {
            id: "great_wall_defenders",
            name: "The Great Wall Defenders",
            condition: "Hero dari fraksi Tembok Besar (seperti Mulan, Biron, Shouyue, Xuance) berada di tim yang sama.",
            effect: "Mendapatkan bonus Physical Penetration rahasia (+1) per anggota Fraksi Great Wall yang ada di tim (maksimal +5).",
            lore: "Para penjaga tembok besar selalu bertarung lebih kuat dan menembus batas jika mereka bersatu.",
            heroes_involved: ["Mulan", "Biron", "Shouyue", "Xuance"]
        },
        {
            id: "siblings_kaizer_luna",
            name: "Siblings: Kaizer & Luna",
            condition: "Kaizer dan Luna berada di tim yang sama atau saling berhadapan.",
            effect: "Mendapatkan buff rahasia +1 Movement Speed (Kecepatan Gerak) dan memicu dialog sapaan antar saudara.",
            lore: "Ikatan darah keluarga pemburu iblis yang kuat tak bisa diputuskan, meski ingatan dan jalan pedang mereka kini berbeda.",
            heroes_involved: ["Kaizer", "Luna"]
        },
        {
            id: "sisters_qiao",
            name: "Sisters: Da Qiao & Xiao Qiao",
            condition: "Da Qiao dan Xiao Qiao berada di tim yang sama.",
            effect: "Mendapatkan buff kecil Movement Speed (+1) dan saling bertukar Voice Lines unik saat berpapasan di Peta.",
            lore: "Dua saudari tak terpisahkan dari keluarga Qiao yang pesonanya melegenda.",
            heroes_involved: ["Da Qiao", "Xiao Qiao"]
        },
        {
            id: "tiger_generals",
            name: "The Five Tiger Generals",
            condition: "Guan Yu, Zhang Fei, Zilong, atau Huang Zhong berada dalam satu tim.",
            effect: "Memicu interaksi Voice Lines heroik tentang persaudaraan dan kejayaan Shu Han.",
            lore: "Jenderal-jenderal terkuat yang bersumpah setia di bawah panji yang sama (Lima Jenderal Macan).",
            heroes_involved: ["Guan Yu", "Zhang Fei", "Zilong", "Huang Zhong"]
        },
        {
            id: "hunters_vs_dragon",
            name: "Dragon Hunters",
            condition: "Hero pemburu naga membunuh Tyrant atau Overlord.",
            effect: "Beberapa hero memiliki dialog rahasia (Voice Lines) yang hanya akan terpicu jika mereka memberikan 'Last Hit' pada Monster Epic.",
            lore: "Penakluk monster akan selalu dikenang dalam sejarah Gorge.",
            heroes_involved: ["General Heroes"]
        }
    ]
};

async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 20] Memulai Eksekusi: Matriks Interaksi Rahasia Hero (V2.1)");
    console.log("🛠️  Metode: Static Easter Eggs Injector");
    console.log("==================================================");

    const processedFolder = path.join(__dirname, '../../../data/processed/id');
    const outPath = path.join(processedFolder, 'hidden_passives.json');

    // Buat folder jika belum ada (Tindakan pencegahan)
    if (!fs.existsSync(processedFolder)) {
        fs.mkdirSync(processedFolder, { recursive: true });
    }

    try {
        console.log(`📦 [INFO] Menyuntikkan Intelijen Rahasia: Easter Eggs, Nemesis, Tragic Kills, & Buff Fraksi...`);
        
        fs.writeFileSync(outPath, JSON.stringify(HIDDEN_PASSIVES_DB, null, 2));

        console.log(`✅ [BINGO] Data Hidden Passives berhasil disintesis (Clean ID Version).`);

        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Fase 20 Selesai! SEMUA PILAR GAME INTELLIGENCE KOMPLIT! 🕵️`);
        console.log(`💾 File tersimpan di: data/processed/id/hidden_passives.json`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
    }
}

module.exports = { execute };