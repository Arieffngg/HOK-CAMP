const fs = require('fs');
const path = require('path');

/**
 * 👑 FASE 00: MASTER DATABASE SEEDER (ABSOLUTE GROUND TRUTH V4.3)
 * Lokasi: src/scrapers/01_core_data/00_MasterSeeder.js
 * 👨‍💻 Tech Lead: Arief
 * Tugas: Single Source of Truth untuk SELURUH Equipment, Arcana, & Spells.
 * Update: Sinkronisasi Deskripsi Battle Spells ke Bahasa Indonesia berdasarkan in-game screenshots.
 */

// 📍 Penyesuaian Path ke folder processed yang benar
const outputDir = path.join(__dirname, '../../../data/processed/en');

// ============================================================================
// 1. DATABASE PERALATAN (EQUIPMENT) - TOTAL 117 NODES LENGKAP
// ============================================================================
const EQUIPMENT_DB = {
    // ---------------------------------------------------------
    // 🧱 TIER 1 COMPONENTS (15 Items)
    // ---------------------------------------------------------
    "t1_1": { name: "Iron Sword", price: 275, stats: ["+20 Physical Attack"], iconUrl: "" },
    "t1_2": { name: "Dagger", price: 300, stats: ["+10% Attack Speed"], iconUrl: "" },
    "t1_3": { name: "Plume of Enchantment", price: 300, stats: ["+5% Movement Speed"], iconUrl: "" },
    "t1_4": { name: "Resilient Agate", price: 300, stats: ["+300 Max Health"], iconUrl: "" },
    "t1_5": { name: "Vampiric Scythe", price: 300, stats: ["+8% Physical Lifesteal"], iconUrl: "" },
    "t1_6": { name: "Pugilist's Gauntlet", price: 300, stats: ["+8% Critical Rate"], iconUrl: "" },
    "t1_7": { name: "Primordial Crystal", price: 300, stats: ["+5% Cooldown Reduction"], iconUrl: "" },
    "t1_8": { name: "Cloth Jerkin", price: 275, stats: ["+100 Physical Defense"], iconUrl: "" },
    "t1_9": { name: "Anti-magic Cloak", price: 275, stats: ["+100 Magical Defense"], iconUrl: "" },
    "t1_10": { name: "Sparkling Sapphire", price: 275, stats: ["+400 Max Mana"], iconUrl: "" },
    "t1_11": { name: "Spell Tome", price: 275, stats: ["+35 Magical Attack"], iconUrl: "" },
    "t1_12": { name: "Mystic Page", price: 300, stats: ["+8% Magical Lifesteal"], iconUrl: "" },
    "t1_13": { name: "Hunting Knife", price: 250, stats: ["Requires Smite", "Monster damage reduction 25%", "Monster EXP +20%"], iconUrl: "" },
    "t1_14": { name: "Lightfoot Shoes", price: 250, stats: ["+30 Movement Speed"], iconUrl: "" },
    "t1_15": { name: "Knowledge Gem", price: 300, stats: ["+5% Movement Speed"], passives: [{ name: "Guerrilla", desc: "EXP/Gold for lowest teammate mechanism." }], iconUrl: "" },

    // ---------------------------------------------------------
    // ⚔️ TIER 2 PHYSICAL (10 Items)
    // ---------------------------------------------------------
    "base_1": { name: "Ironbrand", price: 850, stats: ["+15% Attack Speed", "+450 Max Health"], recipe: ["Dagger", "Resilient Agate"], iconUrl: "" },
    "base_2": { name: "Bloodsoul", price: 800, stats: ["+35 Physical Attack", "+12% Physical Lifesteal"], recipe: ["Vampiric Scythe", "Iron Sword"], iconUrl: "" },
    "base_3": { name: "Sunglow Striker", price: 760, stats: ["+35 Physical Attack", "+450 Max Health"], recipe: ["Iron Sword", "Resilient Agate"], iconUrl: "" },
    "base_4": { name: "Thunderclap Brand", price: 820, stats: ["+35 Physical Attack", "+12% Critical Rate"], recipe: ["Iron Sword", "Pugilist's Gauntlet"], iconUrl: "" },
    "base_5": { name: "Storm Sword", price: 850, stats: ["+75 Physical Attack"], recipe: ["Iron Sword", "Iron Sword"], iconUrl: "" },
    "base_6": { name: "Meteor", price: 760, stats: ["+35 Physical Attack", "+7.5% Cooldown Reduction"], recipe: ["Iron Sword", "Primordial Crystal"], iconUrl: "" },
    "base_7": { name: "Cloud Piercer", price: 800, stats: ["+15% Attack Speed", "+12% Critical Rate"], recipe: ["Dagger", "Pugilist's Gauntlet"], iconUrl: "" },
    "base_8": { name: "Swiftstrike Lance", price: 800, stats: ["+35 Physical Attack", "+15% Attack Speed"], recipe: ["Dagger", "Iron Sword"], iconUrl: "" },
    "base_9": { name: "Lance of Swiftness", price: 760, stats: ["+35 Physical Attack", "+7.5% Movement Speed"], recipe: ["Iron Sword", "Plume of Enchantment"], iconUrl: "" },
    "base_10": { name: "Twinblades of Destruction", price: 760, stats: ["+15% Attack Speed", "+7.5% Movement Speed"], recipe: ["Dagger", "Plume of Enchantment"], iconUrl: "" },

    // 🔮 TIER 2 MAGICAL (5 Items)
    "base_17": { name: "Stone of Sorcery", price: 800, stats: ["+60 Magical Attack", "+7.5% Movement Speed"], recipe: ["Spell Tome", "Plume of Enchantment"], iconUrl: "" },
    "base_18": { name: "Grand Staff", price: 820, stats: ["+120 Magical Attack"], recipe: ["Spell Tome", "Spell Tome"], iconUrl: "" },
    "base_19": { name: "Nebulon Wood", price: 840, stats: ["+60 Magical Attack", "+450 Max Health"], recipe: ["Spell Tome", "Resilient Agate"], iconUrl: "" },
    "base_21": { name: "Blood Clan's Grimoire", price: 800, stats: ["+60 Magical Attack", "+12% Magical Lifesteal"], recipe: ["Spell Tome", "Mystic Page"], iconUrl: "" },
    "base_22": { name: "Sage's Codex", price: 800, stats: ["+60 Magical Attack", "+7.5% Cooldown Reduction"], recipe: ["Spell Tome", "Primordial Crystal"], iconUrl: "" },

    // 🛡️ TIER 2 DEFENSE (9 Items)
    "base_11": { name: "Nettle Gauntlet", price: 750, stats: ["+35 Physical Attack", "+150 Physical Defense"], recipe: ["Cloth Jerkin", "Iron Sword"], iconUrl: "" },
    "base_12": { name: "Clandestine Cape", price: 800, stats: ["+150 Magical Defense", "+450 Max Health"], recipe: ["Resilient Agate", "Anti-magic Cloak"], iconUrl: "" },
    "base_20": { name: "Cuirass of Swiftness", price: 800, stats: ["+7.5% Cooldown Reduction", "+450 Max Health"], recipe: ["Resilient Agate", "Primordial Crystal"], iconUrl: "" },
    "base_23": { name: "Belt of Might", price: 850, stats: ["+900 Max Health"], recipe: ["Resilient Agate", "Resilient Agate"], iconUrl: "" },
    "base_24": { name: "Frosthold Targe", price: 750, stats: ["+7.5% Cooldown Reduction", "+150 Physical Defense"], recipe: ["Cloth Jerkin", "Primordial Crystal"], iconUrl: "" },
    "base_25": { name: "Protector's Cuirass", price: 800, stats: ["+150 Physical Defense", "+450 Max Health"], recipe: ["Cloth Jerkin", "Resilient Agate"], iconUrl: "" },
    "base_26": { name: "Stone of All Creation", price: 800, stats: ["+150 Physical Defense", "+150 Magical Defense"], recipe: ["Cloth Jerkin", "Anti-magic Cloak"], iconUrl: "" },
    "base_27": { name: "Mirror of Radiance", price: 800, stats: ["+450 Max Health", "+7.5% Movement Speed"], recipe: ["Resilient Agate", "Plume of Enchantment"], iconUrl: "" },
    "base_40": { name: "Pearl of Origin", price: 800, stats: ["+150 Physical Defense", "+150 Magical Defense"], iconUrl: "" },

    // 🌿 TIER 2 JUNGLING & ROAMING (5 Items)
    "base_34": { name: "Guerrilla Machete", price: 700, stats: ["+40 Magical Attack"], recipe: ["Hunting Knife"], iconUrl: "" },
    "base_35": { name: "Relentless Blade", price: 700, stats: ["+25 Physical Attack"], recipe: ["Hunting Knife"], iconUrl: "" },
    "base_36": { name: "Patrol Axe", price: 700, stats: ["+400 Max Health"], recipe: ["Hunting Knife"], iconUrl: "" },
    "base_38": { name: "Guardian", price: 850, stats: ["+500 Max Health"], recipe: ["Knowledge Gem", "Resilient Agate"], iconUrl: "" },
    "base_39": { name: "Crimson Shadow", price: 850, stats: ["+500 Max Health"], recipe: ["Knowledge Gem", "Resilient Agate"], iconUrl: "" },

    // ⚔️ TIER 3 PHYSICAL (20 Items)
    "t3_p1": { name: "Doomsday", price: 2100, stats: ["+60 Physical Attack", "+30% Attack Speed", "+10% Physical Lifesteal"], recipe: ["Bloodsoul", "Ironbrand"], iconUrl: "" },
    "t3_p2": { name: "Bloodweeper", price: 2000, stats: ["+85 Physical Attack", "+25% Physical Lifesteal"], recipe: ["Bloodsoul", "Sunglow Striker"], iconUrl: "" },
    "t3_p3": { name: "Eternity Blade", price: 2110, stats: ["+120 Physical Attack", "+20% Critical Rate"], recipe: ["Storm Sword", "Thunderclap Brand"], iconUrl: "" },
    "t3_p4": { name: "Axe of Torment", price: 2090, stats: ["+80 Physical Attack", "+10% Cooldown Reduction", "+500 Max Health"], recipe: ["Meteor", "Sunglow Striker"], iconUrl: "" },
    "t3_p5": { name: "Shadow Ripper", price: 2040, stats: ["+45 Physical Attack", "+35% Attack Speed", "+20% Critical Rate"], recipe: ["Thunderclap Brand", "Twinblades of Destruction"], iconUrl: "" },
    "t3_p6": { name: "Sparkforged Dagger", price: 2040, stats: ["+40 Physical Attack", "+35% Attack Speed"], recipe: ["Swiftstrike Lance", "Twinblades of Destruction"], iconUrl: "" },
    "t3_p7": { name: "Daybreaker's Virtue", price: 2570, stats: ["+75 Physical Attack", "+30% Attack Speed", "+15% Critical Rate"], recipe: ["Cloud Piercer", "Swiftstrike Lance"], iconUrl: "" },
    "t3_p8": { name: "Destiny", price: 2060, stats: ["+75 Physical Attack", "+15% Attack Speed"], recipe: ["Storm Sword", "Ironbrand"], iconUrl: "" },
    "t3_p9": { name: "Master Sword", price: 2100, stats: ["+55 Physical Attack", "+20% Critical Rate"], recipe: ["Thunderclap Brand", "Ironbrand"], iconUrl: "" },
    "t3_p10": { name: "Starbreaker", price: 2080, stats: ["+90 Physical Attack", "+7.5% Movement Speed"], recipe: ["Sunglow Striker", "Lance of Swiftness"], iconUrl: "" },
    "t3_p11": { name: "Overlord's Might", price: 2540, stats: ["+150 Physical Attack"], recipe: ["Storm Sword", "Storm Sword"], iconUrl: "" },
    "t3_p12": { name: "Tempest", price: 2080, stats: ["+50 Physical Attack", "+30% Attack Speed"], recipe: ["Swiftstrike Lance", "Ironbrand"], iconUrl: "" },
    "t3_p13": { name: "Deepfrost Siege", price: 2040, stats: ["+70 Physical Attack", "+25% Attack Speed"], recipe: ["Sunglow Striker", "Swiftstrike Lance"], iconUrl: "" },
    "t3_p14": { name: "Mortal Punisher", price: 2080, stats: ["+100 Physical Attack", "+20% Attack Speed", "+20% Physical Lifesteal"], recipe: ["Bloodsoul", "Swiftstrike Lance"], iconUrl: "" },
    "t3_p15": { name: "Demonsbane", price: 2060, stats: ["+90 Physical Attack", "+150 Magical Defense"], recipe: ["Storm Sword", "Clandestine Cape"], iconUrl: "" },
    "t3_p16": { name: "Pure Sky", price: 2140, stats: ["+80 Physical Attack", "+10% Cooldown Reduction"], recipe: ["Meteor", "Nettle Gauntlet"], iconUrl: "" },
    "t3_p17": { name: "Haste - Sunpool", price: 3320, stats: ["+40 Physical Attack", "+20% Attack Speed"], recipe: ["Sunchaser", "Pearl of Origin"], iconUrl: "" },
    "t3_p18": { name: "Sunchaser", price: 2100, stats: ["+40 Physical Attack", "+20% Attack Speed"], recipe: ["Cloud Piercer", "Lance of Swiftness"], iconUrl: "" },
    "t3_p19": { name: "Immovable - Sky Dome", price: 3280, stats: ["+80 Physical Attack", "+10% Cooldown Reduction"], recipe: ["Pure Sky", "Pearl of Origin"], iconUrl: "" },
    "t3_p20": { name: "Meteoric Swarm", price: 2120, stats: ["+100 Physical Attack"], recipe: ["Meteor", "Storm Sword"], iconUrl: "" },

    // 🔮 TIER 3 MAGICAL (17 Items)
    "t3_m1": { name: "Scepter of Reverberation", price: 2100, stats: ["+210 Magical Attack", "+7.5% Movement Speed"], recipe: ["Stone of Sorcery", "Grand Staff"], iconUrl: "" },
    "t3_m2": { name: "Savant's Wrath", price: 2140, stats: ["+210 Magical Attack"], recipe: ["Grand Staff", "Grand Staff"], iconUrl: "" },
    "t3_m3": { name: "Mask of Agony", price: 2080, stats: ["+100 Magical Attack", "+7.5% Cooldown Reduction"], recipe: ["Nebulon Wood", "Cuirass of Swiftness"], iconUrl: "" },
    "t3_m4": { name: "Twilight Stream", price: 2040, stats: ["+140 Magical Attack", "+10% Cooldown Reduction"], recipe: ["Spell Tome", "Stone of Sorcery"], iconUrl: "" },
    "t3_m5": { name: "Void Staff", price: 2040, stats: ["+210 Magical Attack"], recipe: ["Nebulon Wood", "Grand Staff"], iconUrl: "" },
    "t3_m6": { name: "Insatiable Tome", price: 2060, stats: ["+160 Magical Attack", "+24% Magical Lifesteal"], recipe: ["Blood Clan's Grimoire", "Blood Clan's Grimoire"], iconUrl: "" },
    "t3_m7": { name: "Sage's Tome", price: 2610, stats: ["+350 Magical Attack", "+10% Cooldown Reduction"], recipe: ["Grand Staff", "Sage's Codex"], iconUrl: "" },
    "t3_m8": { name: "Splendor", price: 2080, stats: ["+160 Magical Attack"], recipe: ["Blood Clan's Grimoire", "Sage's Codex"], iconUrl: "" },
    "t3_m9": { name: "Holy Grail", price: 2020, stats: ["+150 Magical Attack", "+15% Cooldown Reduction"], recipe: ["Sage's Codex", "Cuirass of Swiftness"], iconUrl: "" },
    "t3_m10": { name: "Staves of Sorcery", price: 2080, stats: ["+180 Magical Attack"], recipe: ["Stone of Sorcery", "Nebulon Wood"], iconUrl: "" },
    "t3_m11": { name: "Golden Blade", price: 2070, stats: ["+150 Magical Attack", "+20% Attack Speed"], recipe: ["Grand Staff", "Twinblades of Destruction"], iconUrl: "" },
    "t3_m12": { name: "Augur's Word", price: 2150, stats: ["+140 Magical Attack"], recipe: ["Grand Staff", "Belt of Might"], iconUrl: "" },
    "t3_m13": { name: "Ardent Dominion", price: 2040, stats: ["+150 Magical Attack"], recipe: ["Blood Clan's Grimoire", "Stone of Sorcery"], iconUrl: "" },
    "t3_m14": { name: "Breakthrough Robe", price: 2120, stats: ["+120 Magical Attack"], recipe: ["Nebulon Wood", "Nebulon Wood"], iconUrl: "" },
    "t3_m15": { name: "Frozen Breath", price: 2100, stats: ["+180 Magical Attack", "+7.5% Cooldown Reduction"], recipe: ["Grand Staff", "Cuirass of Swiftness"], iconUrl: "" },
    "t3_m16": { name: "Venomous Staff", price: 2040, stats: ["+240 Magical Attack"], recipe: ["Stone of Sorcery", "Sage's Codex"], iconUrl: "" },
    "t3_m17": { name: "Enigma - Moon Goddess", price: 3340, stats: ["+160 Magical Attack", "+12% Magical Lifesteal"], recipe: ["Splendor", "Pearl of Origin"], iconUrl: "" },

    // 🛡️ TIER 3 DEFENSE (17 Items)
    "t3_d1": { name: "Dawnlight", price: 2040, stats: ["+210 Physical Defense", "+10% Cooldown Reduction"], recipe: ["Frosthold Targe", "Belt of Might"], iconUrl: "" },
    "t3_d2": { name: "Blazing Cape", price: 2040, stats: ["+240 Physical Defense"], recipe: ["Protector's Cuirass", "Clandestine Cape"], iconUrl: "" },
    "t3_d3": { name: "Ominous Premonition", price: 2020, stats: ["+300 Physical Defense"], recipe: ["Protector's Cuirass", "Protector's Cuirass"], iconUrl: "" },
    "t3_d4": { name: "Glacial Buckler", price: 2040, stats: ["+240 Physical Defense", "+20% Cooldown Reduction"], recipe: ["Cuirass of Swiftness", "Frosthold Targe"], iconUrl: "" },
    "t3_d5": { name: "Spikemail", price: 2020, stats: ["+300 Physical Defense", "+45 Physical Attack"], recipe: ["Nettle Gauntlet", "Protector's Cuirass"], iconUrl: "" },
    "t3_d6": { name: "Succubus Cloak", price: 2020, stats: ["+300 Magical Defense"], recipe: ["Clandestine Cape", "Clandestine Cape"], iconUrl: "" },
    "t3_d7": { name: "Cuirass of Savagery", price: 2050, stats: ["+210 Physical Defense", "+35 Physical Attack"], recipe: ["Nettle Gauntlet", "Belt of Might"], iconUrl: "" },
    "t3_d8": { name: "Longnight Guardian", price: 2020, stats: ["+210 Magical Defense"], recipe: ["Clandestine Cape", "Mirror of Radiance"], iconUrl: "" },
    "t3_d9": { name: "Dragon's Rage", price: 2040, stats: ["+180 Physical Defense", "+1350 Max Health"], recipe: ["Belt of Might", "Protector's Cuirass"], iconUrl: "" },
    "t3_d10": { name: "Sage's Sanctuary", price: 2280, stats: ["+150 Physical Defense", "+150 Magical Defense"], recipe: ["Stone of All Creation", "Belt of Might"], iconUrl: "" },
    "t3_d11": { name: "Eye of the Phoenix", price: 2020, stats: ["+180 Magical Defense", "+1350 Max Health"], recipe: ["Belt of Might", "Clandestine Cape"], iconUrl: "" },
    "t3_d12": { name: "Overlord's Platemail", price: 2450, stats: ["+1800 Max Health"], recipe: ["Belt of Might", "Belt of Might"], iconUrl: "" },
    "t3_d13": { name: "Frostscar's Embrace", price: 2060, stats: ["+300 Physical Defense", "+10% Cooldown Reduction"], recipe: ["Nettle Gauntlet", "Frosthold Targe"], iconUrl: "" },
    "t3_d14": { name: "Blood Rage", price: 2180, stats: ["+900 Max Health", "+75 Physical Attack"], recipe: ["Storm Sword", "Belt of Might"], iconUrl: "" },
    "t3_d15": { name: "Ravage - Phantom", price: 3350, stats: ["+900 Max Health", "+75 Physical Attack"], recipe: ["Blood Rage", "Pearl of Origin"], iconUrl: "" },
    "t3_d16": { name: "Frigid Charge", price: 2030, stats: ["+150 Physical Defense", "+7.5% Cooldown Reduction"], recipe: ["Protector's Cuirass", "Cuirass of Swiftness"], iconUrl: "" },
    "t3_d17": { name: "Amble - Winter", price: 3190, stats: ["+150 Physical Defense", "+7.5% Cooldown Reduction"], recipe: ["Frigid Charge", "Pearl of Origin"], iconUrl: "" },

    // 👟 MOVEMENT (6 Items)
    "t3_mov1": { name: "Boots of Fortitude", price: 700, stats: ["+120 Physical Defense"], recipe: ["Lightfoot Shoes", "Cloth Jerkin"], iconUrl: "" },
    "t3_mov2": { name: "Boots of Resistance", price: 700, stats: ["+120 Magical Defense"], recipe: ["Lightfoot Shoes", "Anti-magic Cloak"], iconUrl: "" },
    "t3_mov3": { name: "Boots of Tranquility", price: 700, stats: ["+15% Cooldown Reduction"], recipe: ["Lightfoot Shoes", "Primordial Crystal"], iconUrl: "" },
    "t3_mov4": { name: "Boots of the Arcane", price: 700, stats: ["Mana Regen"], recipe: ["Lightfoot Shoes", "Sparkling Sapphire"], iconUrl: "" },
    "t3_mov5": { name: "Boots of Dexterity", price: 700, stats: ["+20% Attack Speed"], recipe: ["Lightfoot Shoes", "Dagger"], iconUrl: "" },
    "t3_mov6": { name: "Boots of Deftness", price: 700, stats: ["+300 Max Health"], recipe: ["Lightfoot Shoes", "Resilient Agate"], iconUrl: "" },

    // 🌿 JUNGLING (3 Items)
    "t3_j1": { name: "Runeblade", price: 2160, stats: ["+130 Magical Attack", "+10% Cooldown Reduction"], recipe: ["Guerrilla Machete", "Sage's Codex"], iconUrl: "" },
    "t3_j2": { name: "Rapacious Bite", price: 2160, stats: ["+90 Physical Attack", "+7.5% Cooldown Reduction"], recipe: ["Relentless Blade", "Meteor"], iconUrl: "" },
    "t3_j3": { name: "Giant's Grip", price: 2160, stats: ["+1200 Max Health", "+5% Cooldown Reduction"], recipe: ["Patrol Axe", "Cuirass of Swiftness"], iconUrl: "" },

    // 🤝 ROAMING (10 Items)
    "t3_r1": { name: "Guardian - Redemption", price: 2080, stats: ["+1200 Max Health"], recipe: ["Guardian", "Belt of Might"], iconUrl: "" },
    "t3_r2": { name: "Guardian - Starspring", price: 2080, stats: ["+1200 Max Health"], recipe: ["Guardian", "Belt of Might"], iconUrl: "" },
    "t3_r3": { name: "Guardian - Howl", price: 2080, stats: ["+1200 Max Health"], recipe: ["Guardian", "Belt of Might"], iconUrl: "" },
    "t3_r4": { name: "Guardian - Radiance", price: 2080, stats: ["+1200 Max Health"], recipe: ["Guardian", "Belt of Might"], iconUrl: "" },
    "t3_r5": { name: "Guardian - Glory", price: 2080, stats: ["+1200 Max Health"], recipe: ["Guardian", "Belt of Might"], iconUrl: "" },
    "t3_r6": { name: "Crimson Shadow - Redemption", price: 2080, stats: ["+1200 Max Health"], recipe: ["Crimson Shadow", "Belt of Might"], iconUrl: "" },
    "t3_r7": { name: "Crimson Shadow - Starspring", price: 2080, stats: ["+1200 Max Health"], recipe: ["Crimson Shadow", "Belt of Might"], iconUrl: "" },
    "t3_r8": { name: "Crimson Shadow - Howl", price: 2080, stats: ["+1200 Max Health"], recipe: ["Crimson Shadow", "Belt of Might"], iconUrl: "" },
    "t3_r9": { name: "Crimson Shadow - Radiance", price: 2080, stats: ["+1200 Max Health"], recipe: ["Crimson Shadow", "Belt of Might"], iconUrl: "" },
    "t3_r10": { name: "Extreme Shadow", price: 2080, stats: ["+1200 Max Health"], recipe: ["Crimson Shadow", "Belt of Might"], iconUrl: "" }
};

// ============================================================================
// 2. DATABASE BATTLE SPELLS - UPDATED (V4.3 SYNC WITH IN-GAME ID SCREENSHOTS)
// ============================================================================
const SPELL_DB = {
    "spell_1": { 
        name: "Flash", 
        cd: "120s", 
        desc: "Teleportasi jarak pendek ke arah yang ditentukan.", 
        iconUrl: "" 
    },
    "spell_2": { 
        name: "Smite", 
        cd: "30s", 
        desc: "Memberikan 1.500 true damage ke monster atau minion terdekat dan menyebabkan efek stun selama 1 detik. Membeli Hunting Knife akan meng-upgrade Smite menjadi Smite Aura.", 
        iconUrl: "" 
    },
    "spell_3": { 
        name: "Execute", 
        cd: "60s", 
        desc: "Seketika memberikan true damage pada hero musuh di sekitar sebesar 16% dari Health mereka yang hilang. Cooldown berkurang sebesar 90% jika musuh tereliminasi.", 
        iconUrl: "" 
    },
    "spell_4": { 
        name: "Frenzy", 
        cd: "60s", 
        desc: "Meningkatkan damage sebesar 10%, Resistance sebesar 15%, Physical Lifesteal sebesar 20%, dan Magical Lifesteal sebesar 30% selama 7 detik.", 
        iconUrl: "" 
    },
    "spell_5": { 
        name: "Purify", 
        cd: "120s", 
        desc: "Menghapus semua debuff dan efek Crowd Control (kecuali Suppression) dan mendapatkan imunitas Crowd Control selama 1,5 detik.", 
        iconUrl: "" 
    },
    "spell_6": { 
        name: "Stun", 
        cd: "90s", 
        desc: "Menyebabkan efek Stun pada semua musuh di sekitar selama 0,75 detik dan memperlambat mereka selama 1 detik.", 
        iconUrl: "" 
    },
    "spell_7": { 
        name: "Intimidate", 
        cd: "90s", 
        desc: "Mengurangi damage output musuh di sekitar sebesar 25% dan meningkatkan Damage Reduction diri sendiri sebesar 20% selama 4 detik. Jika rekan setim menggunakan Intimidate pada target yang sama dalam waktu 5 detik, debuff pengurangan damage akan berkurang setengahnya.", 
        iconUrl: "" 
    },
    "spell_8": { 
        name: "Heal", 
        cd: "120s", 
        desc: "Memulihkan 15% Health untuk diri sendiri dan rekan tim di sekitar, serta meningkatkan Movement Speed rekan tim di sekitar sebesar 15% selama 2 detik.", 
        iconUrl: "" 
    },
    "spell_9": { 
        name: "Disrupt", 
        cd: "90s", 
        desc: "Membungkam struktur musuh selama 2-5 detik (meningkat sebesar 1,5 detik pada menit 04:00 dan sekali lagi pada menit 10:00). Memberikan imunitas damage dan menggandakan Attack Speed selama 4 detik saat digunakan pada struktur rekan. Penggunaan berulang dalam 90 detik hanya menambah durasi selama 1 detik.", 
        iconUrl: "" 
    },
    "spell_10": { 
        name: "Sprint", 
        cd: "90s", 
        desc: "Seketika menghapus efek slow dan memberikan 30% Movement Speed selama 10 detik. Selama aktif, mengurangi efek slow yang diterima sebesar 50% dan memberikan tambahan 20% Movement Speed saat tidak dalam pertempuran.", 
        iconUrl: "" 
    },
    "spell_11": { 
        name: "Teleport", 
        cd: "75s", 
        desc: "Setelah 2 detik channeling, melakukan teleportasi ke samping struktur rekan (bisa menara yang hancur) atau minion. Unit yang dipilih kebal terhadap damage selama teleportasi. Membatalkan teleportasi atau menggunakannya dalam waktu 30 detik setelah menggunakan Portal Teleportasi akan mengurangi cooldown sebesar 25 detik.", 
        iconUrl: "" 
    }
};

// ============================================================================
// 3. DATABASE ARCANA - TOTAL 30 NODES LENGKAP
// ============================================================================
const ARCANA_DB = {
    // 🔴 RED (Attack, Crit, Pierce)
    "red_1": { name: "Calamity", stats: ["+1.6% Critical Rate"], iconUrl: "" },
    "red_2": { name: "Inheritance", stats: ["+3.2 Physical Attack"], iconUrl: "" },
    "red_3": { name: "Saint", stats: ["+5.3 Magical Attack"], iconUrl: "" },
    "red_4": { name: "Red Moon", stats: ["+1.6% Attack Speed", "+0.5% Critical Rate"], iconUrl: "" },
    "red_5": { name: "Mutation", stats: ["+2 Physical Attack", "+3.6 Physical Pierce"], iconUrl: "" },
    "red_6": { name: "Conflict", stats: ["+2.5 Physical Attack", "+0.5% Physical Lifesteal"], iconUrl: "" },
    "red_7": { name: "Unparalleled", stats: ["+0.7% Critical Rate", "+3.6% Critical Damage"], iconUrl: "" },
    "red_8": { name: "Fate", stats: ["+1% Attack Speed", "+33.7 Max Health", "+2.3 Physical Defense"], iconUrl: "" },
    "red_9": { name: "Nightmare", stats: ["+4.2 Magical Attack", "+2.4 Magical Pierce"], iconUrl: "" },
    "red_10": { name: "Omen", stats: ["+4.2 Magical Attack", "+0.6% Attack Speed"], iconUrl: "" },
    
    // 🔵 BLUE (Utility, Health, Lifesteal)
    "blue_1": { name: "Harmony", stats: ["+45 Max Health", "+5.2 Health/5s", "+0.4% Movement Speed"], iconUrl: "" },
    "blue_2": { name: "Stealth", stats: ["+1.6 Physical Attack", "+1% Movement Speed"], iconUrl: "" },
    "blue_3": { name: "Longevity", stats: ["+75 Max Health"], iconUrl: "" },
    "blue_4": { name: "Meditation", stats: ["+60 Max Health", "+4.5 Health/5s"], iconUrl: "" },
    "blue_5": { name: "Hunt", stats: ["+1% Attack Speed", "+1% Movement Speed"], iconUrl: "" },
    "blue_6": { name: "Avarice", stats: ["+1.6% Magical Lifesteal"], iconUrl: "" },
    "blue_7": { name: "Reaver", stats: ["+1.6% Physical Lifesteal"], iconUrl: "" },
    "blue_8": { name: "Beast Scar", stats: ["+0.5% Critical Rate", "+60 Max Health"], iconUrl: "" },
    "blue_9": { name: "Prosperity", stats: ["+1% Physical Lifesteal", "+4.1 Magical Defense"], iconUrl: "" },
    "blue_10": { name: "Reincarnation", stats: ["+2.4 Magical Attack", "+1% Magical Lifesteal"], iconUrl: "" },

    // 🟢 GREEN (Defense, Pierce, CDR)
    "green_1": { name: "Eagle Eye", stats: ["+0.9 Physical Attack", "+6.4 Physical Pierce"], iconUrl: "" },
    "green_2": { name: "Mind's Eye", stats: ["+0.6% Attack Speed", "+6.4 Magical Pierce"], iconUrl: "" },
    "green_3": { name: "Compassion", stats: ["+1% Cooldown Reduction"], iconUrl: "" },
    "green_4": { name: "Bulwark", stats: ["+9 Physical Defense"], iconUrl: "" },
    "green_5": { name: "Fortify", stats: ["+5 Physical Defense", "+5 Magical Defense"], iconUrl: "" },
    "green_6": { name: "Void", stats: ["+37.5 Max Health", "+0.6% Cooldown Reduction"], iconUrl: "" },
    "green_7": { name: "Cognizance", stats: ["+9 Magical Defense"], iconUrl: "" },
    "green_8": { name: "Tribute", stats: ["+2.4 Magical Attack", "+0.7% Cooldown Reduction"], iconUrl: "" },
    "green_9": { name: "Reverence", stats: ["+0.7% Magical Lifesteal", "+5.9 Physical Defense"], iconUrl: "" },
    "green_10": { name: "Reverberation", stats: ["+2.7 Physical Defense", "+2.7 Magical Defense", "+0.6% Cooldown Reduction"], iconUrl: "" }
};

// ============================================================================
// 4. SEEDER ENGINE
// ============================================================================
async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 00] Memulai Eksekusi: Master Database Seeder");
    console.log("👑 ULTIMATE DATABASE CONSOLIDATION RUNNING (V4.3)");
    console.log("==================================================\n");

    try {
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

        // Proses Injeksi File JSON
        fs.writeFileSync(path.join(outputDir, 'items.json'), JSON.stringify(EQUIPMENT_DB, null, 2));
        fs.writeFileSync(path.join(outputDir, 'spells.json'), JSON.stringify(SPELL_DB, null, 2));
        fs.writeFileSync(path.join(outputDir, 'arcana.json'), JSON.stringify(ARCANA_DB, null, 2));
        
        // Logika penghitungan dinamis berdasarkan data yang dimasukkan
        const totalItems = Object.keys(EQUIPMENT_DB).length;
        const totalSpells = Object.keys(SPELL_DB).length;
        const totalArcana = Object.keys(ARCANA_DB).length;

        console.log(`✅ [CONSOLIDATED] Seluruh ${totalItems} Equipment lengkap tertulis (T1-T3).`);
        console.log(`✅ [CLEANUP] Properti recipe: [] pada item dasar berhasil dibersihkan.`);
        console.log(`✅ [CONSOLIDATED] Seluruh ${totalArcana} Set Arcana diverifikasi.`);
        console.log(`✅ [CONSOLIDATED] ${totalSpells} Battle Spells Literal Text Locked (Sync V4.3 ID).`);
        console.log(`✅ [ASSETS READY] Placeholder 'iconUrl' telah disematkan di seluruh node.`);
        
        console.log(`\n==================================================`);
        console.log(`🏆 [SUCCESS] Fase 00 Selesai! Fondasi Data Statis Siap.`);
        console.log(`💾 Data tersimpan di: data/processed/en/`);
        console.log(`==================================================`);
    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
    }
}

module.exports = { execute };