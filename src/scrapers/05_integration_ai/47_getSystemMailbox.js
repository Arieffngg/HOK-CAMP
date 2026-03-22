const fs = require('fs');
const path = require('path');

/**
 * 🧠 FASE 47: MESIN RAG & AI ENGINE (THE CORTEX)
 * Lokasi: src/scrapers/05_integration_ai/47_getSystemMailbox.js
 * 👨‍💻 Tech Lead: Arief
 * Fitur Utama: Menyatukan 46 database yang telah dibuat menjadi satu 'Knowledge Graph'
 * dan merumuskan 'System Prompt' (Persona Bot) untuk model AI (LLM) di Discord.
 */

// ============================================================================
// 🤖 TEMPLATE KEPRIBADIAN BOT (SYSTEM PROMPT)
// ============================================================================
const SYSTEM_PROMPT = `
Anda adalah "HOK Camp Assistant", sebuah AI cerdas, asisten pelatih (Coach), dan ensiklopedia berjalan untuk game Honor of Kings (HOK) server Indonesia (Global).
Anda dirancang dan diprogram oleh Tech Lead bernama "Arief".

TUGAS UTAMA ANDA:
1. Membantu pemain mencari build hero, penjelasan skill, dan arcana terbaik.
2. Memberikan tips makro (rotasi jungle, laning, objektif naga) dan mikro (mekanik hero, combo).
3. Menganalisis strategi musuh (Counter-pick, Sinergi Hero).
4. Menjelaskan sistem ekonomi game (Diskon, Gacha, Nobility/VIP, Honor Pass).

ATURAN MUTLAK (SANGAT PENTING):
- JANGAN PERNAH MENGARANG JAWABAN (HALUSINASI). Jika ditanya tentang stat, harga, atau lore, Anda WAJIB merujuk pada Master Database JSON yang terhubung dengan Anda (Knowledge Graph).
- Gunakan bahasa yang santai, ala "Gamers Indonesia" (gunakan kata seperti: OP, Nerf, Buff, Gank, TB-in, Roamer, Jungler, dll).
- Sapa pengguna Discord dengan ramah (misal: "Halo Bang!", "Siap Kapten!", "Wah, mainnya role apa nih?").
- Jika ditanya tentang hukuman (Banned/AFK), berikan jawaban yang tegas sesuai aturan Tribunal Tencent.

PENGETAHUAN TERKINI:
Anda terhubung dengan sistem RAG (Retrieval-Augmented Generation) yang berisi 40+ file JSON berisikan data mutakhir Honor of Kings, mulai dari Frame Data, Efisiensi Gold Item, hingga Waktu Rotasi Hutan.
`;

async function execute() {
    console.log("==================================================");
    console.log("🟢 [FASE 47] Memulai Eksekusi: Mesin RAG & AI Engine (THE CORTEX)");
    console.log("🛠️  Metode: Knowledge Graph & Prompt Synthesizer");
    console.log("==================================================");

    const processedFolderID = path.join(__dirname, '../../../data/processed/id');
    const processedFolderEN = path.join(__dirname, '../../../data/processed/en');
    
    const outGraphPath = path.join(processedFolderID, 'master_knowledge_graph.json');
    const outPromptPath = path.join(processedFolderID, 'bot_system_prompt.txt');

    try {
        console.log(`📦 [INFO] Memindai seluruh sel memori yang telah dibangun dari Fase 00 hingga 46...`);

        // 1. Memindai semua JSON yang telah kita buat
        const databases = [];
        
        if (fs.existsSync(processedFolderID)) {
            const files = fs.readdirSync(processedFolderID).filter(f => f.endsWith('.json'));
            files.forEach(f => databases.push({ category: "Regional Intelligence (ID)", file: f, path: `data/processed/id/${f}` }));
        }

        if (fs.existsSync(processedFolderEN)) {
            const files = fs.readdirSync(processedFolderEN).filter(f => f.endsWith('.json'));
            files.forEach(f => databases.push({ category: "Core Base (EN)", file: f, path: `data/processed/en/${f}` }));
        }

        // 2. Membangun Knowledge Graph
        const KNOWLEDGE_GRAPH = {
            metadata: {
                cortex_version: "V4.2",
                architect: "Arief (Tech Lead)",
                total_memory_banks: databases.length,
                last_synced: new Date().toISOString()
            },
            instruction_for_llm: "Gunakan indeks ini untuk memuat file JSON yang tepat ke dalam memori saat menjawab pertanyaan user.",
            memory_banks: databases
        };

        // 3. Menyimpan Otak Pusat
        fs.writeFileSync(outGraphPath, JSON.stringify(KNOWLEDGE_GRAPH, null, 2));
        fs.writeFileSync(outPromptPath, SYSTEM_PROMPT.trim());

        console.log(`✅ [BINGO] ${databases.length} Database berhasil dirangkai menjadi Knowledge Graph!`);
        console.log(`✅ [BINGO] System Prompt (Kepribadian AI) berhasil dicetak.`);

        console.log(`\n==================================================`);
        console.log(`🎉🎊 [GRAND SUCCESS] FASE 47 SELESAI! 🎊🎉`);
        console.log(`👑 SELURUH 5 PILAR ARSITEKTUR TELAH RAMPUNG 100%! 👑`);
        console.log(`💾 Peta Otak: data/processed/id/master_knowledge_graph.json`);
        console.log(`💾 Persona: data/processed/id/bot_system_prompt.txt`);
        console.log(`==================================================`);

    } catch (error) {
        console.error("🚨 [FATAL ERROR SISTEM]:", error.message);
    }
}

module.exports = { execute };