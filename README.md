# 👑 HOK Camp Bot - Core Intelligence Engine (V4.2)

> **"Pioneering Community Intelligence for Honor of Kings Global"**

Arsitektur kecerdasan buatan berbasis **Retrieval-Augmented Generation (RAG)** terlengkap untuk ekosistem Honor of Kings (HOK) Global/Indonesia. Sistem ini dibangun selama lebih dari 3 bulan melalui riset mendalam, memadukan *Web Scraping* tingkat lanjut (Puppeteer Stealth), analitik matematis (*Theorycrafting*), dan manajemen memori terstruktur (*The Cortex*).

![Node.js](https://img.shields.io/badge/Node.js-v18+-green?style=for-the-badge&logo=node.js)
![License](https://img.shields.io/badge/License-GPLv3-blue?style=for-the-badge)
![AI](https://img.shields.io/badge/AI-RAG_Intelligence-orange?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Community_Driven-red?style=for-the-badge)

![Stars](https://img.shields.io/github/stars/Arieffngg/HOK-CAMP?style=for-the-badge&color=yellow)
![Forks](https://img.shields.io/github/forks/Arieffngg/HOK-CAMP?style=for-the-badge&color=blue)
![Issues](https://img.shields.io/github/issues/Arieffngg/HOK-CAMP?style=for-the-badge&color=red)

---

## ⚠️ DISKLAIMER PENTING (LEGAL SHIELD)

**PROYEK INI DIKEMBANGKAN MURNI OLEH KOMUNITAS INDEPENDEN.**
Proyek ini **TIDAK TERAFILIASI**, didukung, atau bekerja sama dengan **Tencent Games**, **TiMi Studio Group**, atau entitas resmi **Honor of Kings**. Semua aset (nama pahlawan, gambar, deskripsi) adalah milik sah pemegang hak cipta masing-masing. Proyek ini dibangun untuk tujuan edukasi, riset data AI, dan analisis strategi game.

---

## 🚀 PENDAHULUAN

**HOK Camp Bot** adalah sebuah ekosistem intelijen buatan yang membedah mekanik game hingga ke sel terkecil. Dengan riset lebih dari 3 bulan, sistem ini menggunakan **Puppeteer Stealth** untuk pengumpulan data dan **The Cortex Engine** untuk manajemen memori AI.

### 🛡️ DEVELOPER'S MOAT (PARIT PERTAHANAN)

Repositori ini sengaja didistribusikan **TANPA DATABASE (`data/`)**. Setiap pengembang diwajibkan melakukan *seeding* manual melalui 47 Fase pilar intelijen. Ini adalah filter integritas: hanya mereka yang memahami arsitektur ini yang layak menjadi kontributor atau pengguna unit ini.

---

## 🛠️ INSTALASI & SETUP CEPAT

### 1. Persiapan Lingkungan (Bash)

Pastikan Node.js v18+ sudah terinstal. Jalankan perintah berikut di terminal:

```bash
# 1. Inisialisasi Proyek
npm init -y

# 2. Instalasi Library Inti
npm install puppeteer discord.js dotenv
```
### 2. Membangun Pengetahuan (Seeding)
Bot ini tidak menyertakan database bawaan secara langsung. Anda wajib membangunnya secara mandiri:

```bash
# 1. Jalankan inisialisasi folder:
node setup.js

# 2. Konfigurasi Seeding: Buka file orchestrator.js, lalu atur variabel ACTIVE_PHASE ke nomor fase target (mulai dari "00").

# 3. Eksekusi Fase: Jalankan perintah eksekusi secara berurutan hingga fase "47":
node orchestrator.js

```

---

## 🏛️ ARSITEKTUR 5 PILAR INTELIJEN

### 🧱 PILAR 1: CORE DATA (Fondasi & Lore)

| Fase | Modul | Deskripsi & Fitur Utama |
| :--- | :--- | :--- |
| **00** | `MasterSeeder` | Ground Truth untuk 117 Equipment, Arcana, & Spell. |
| **01** | `getHeroList` | Penyadapan API XHR untuk daftar pahlawan global. |
| **02** | `getHeroDetail` | Ekstraksi stat winrate, deskripsi skill (Sanitized). |
| **02b** | `Relationships` | Memetakan jaring sosial antar pahlawan (Musuh/Sahabat). |
| **03** | `HeroGuides` | Ekstraksi build item & arcana rekomendasi pro-player. |
| **04** | `VoiceActors` | Penambangan ribuan kutipan suara (Voice Lines) HD. |
| **05** | `HeroLore` | Ekstraksi narasi biografi menggunakan Text Harvester. |
| **06** | `HeroAssets` | Kompilasi lokal URL visual (Avatar, Cover, Ikon Skill). |
| **06b** | `SkinGallery` | Penangkapan poster Skin HD dengan Resilient Sweeper. |
| **07** | `ArcanaEngine` | Kalkulator limitasi atribut maksimal 30 slot Arcana. |
| **08** | `LoreTimeline` | Arsip wilayah faksi (Chang'an, Jixia, Sunset, dll). |
| **09** | `MobaJargon` | Ensiklopedia istilah teknik gamers Indonesia. |

### ⚙️ PILAR 2: GAME INTELLIGENCE (Mekanik & Theorycrafting)

| Fase | Modul | Deskripsi & Fitur Utama |
| :--- | :--- | :--- |
| **10** | `MapEntities` | Data Monster Epik, Respawn, & Fase Match. |
| **11** | `FrameData` | Scanner deteksi True Damage, I-Frame, & CC Immunity. |
| **12** | `GoldEfficiency` | Kalkulasi nilai tukar Gold vs Stat (ROI Item). |
| **13** | `DamageCalc` | Formula Armor (602) & kalkulasi penetrasi. |
| **14** | `FarmingMetrics` | Standar GPM (Gold Per Minute) untuk evaluasi performa. |
| **15** | `RadarGraphs` | Diagnosis gaya main (Output vs Survival vs Push). |
| **16** | `JungleRotation` | Waktu mutlak spawn hutan & rute Jungler PRO. |
| **17** | `MapDimensions` | Mekanik fisik Tower, Semak, & Wall Dash. |
| **18** | `MVPParameters` | Bedah algoritma penilaian medali & skor akhir. |
| **19** | `StatusEffects` | Hierarki kasta Crowd Control (Suppression > Airborne). |
| **20** | `HiddenPassives` | Database Easter Eggs & Interaksi rahasia antar hero. |

### 💰 PILAR 3: ECONOMICS (Finansial, Toko & VIP)

| Fase | Modul | Deskripsi & Fitur Utama |
| :--- | :--- | :--- |
| **21** | `DynamicStore` | Katalog harga Token/Starstone & kasta Skin. |
| **22** | `PersonalOffers` | Mekanik Secret Shop, Fragment Store, & Diskon. |
| **23** | `GachaEconomics` | Hitungan Pity System & probabilitas Honor Crystal. |
| **24** | `EconomyROI` | Valuasi keuntungan Honor Pass & Weekly Pass. |
| **25** | `NobilityTiers` | Syarat Tokens & estimasi IDR untuk V1 s/d V10. |
| **26** | `NobilityVault` | Katalog hadiah eksklusif skin bangsawan VIP. |
| **27** | `VIPSharing` | Aturan limitasi fitur Skin Sharing V10. |
| **28** | `TopUpMilestones` | Taktik cicil harian vs akumulasi top-up besar. |

### 🧠 PILAR 4: STRATEGIC IQ (Otak Turnamen & Meta)

| Fase | Modul | Deskripsi & Fitur Utama |
| :--- | :--- | :--- |
| **29** | `MetaStats` | Peringkat Win/Pick/Ban rate hero secara dinamis. |
| **30** | `HeroSynergy` | Matriks Combo Mematikan & Hard Counters. |
| **31** | `DraftSimulator` | Panduan Ban/Pick, Flex Pick, & Blind Pick. |
| **32** | `PatchDiff` | Sejarah perubahan hero (Buff/Nerf/Adjust). |
| **33** | `TierList` | Database voting interaktif untuk komunitas Discord. |
| **34** | `RegionalPower` | Mekanik Hero Power & Gelar (Kabupaten s/d Nasional). |
| **35** | `EliteMatch` | Aturan Peak Tournament & Lane Pre-selection. |
| **36** | `StrategicIntel` | Blueprint strategi kalah Gold vs Snowballing. |
| **37** | `RankedEco` | Hierarki liga & mekanisme Brave Points. |
| **38** | `SentimentAlgos` | Polling komunitas (Hardest Role, Annoying Heroes). |

### 🤖 PILAR 5: INTEGRATION & AI (The Central Cortex)

| Fase | Modul | Deskripsi & Fitur Utama |
| :--- | :--- | :--- |
| **39** | `ProfileTracker` | Scraper profil pemain via URL (Rank/WR/Heroes). |
| **40** | `InfraStatus` | Radar latensi (Ping) ke server pusat HOK. |
| **41** | `NewsRelay` | Mesin deduplikasi berita patch agar tidak spam. |
| **42** | `Tribunal` | Buku hukum Credit Score & pinalti perilaku toxic. |
| **43** | `Intimacy` | Panduan level Bucin (Lovers) & Shared Hero lvl 2. |
| **44** | `Hardware` | Solusi teknis HP panas, lag, & spek minimum. |
| **45** | `ServerTimers` | Alarm reset harian (05:00) & rotasi toko. |
| **46** | `BanWave` | Kamus kode error & pinalti Map Hack (10 Tahun). |
| **47** | `TheCortex` | Penyatuan database ke Master Knowledge Graph & AI. |
