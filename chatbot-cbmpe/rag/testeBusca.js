import fetch from "node-fetch";
import { buscarContexto } from "./buscarContexto.js";
import { gerarBaseVetorial } from "./gerarEmbeddings.js";
import { getMemoriaVetorial } from "./embeddings.js";

const CHAVE = process.env.GROQ_API_KEY;

// Pergunta para testar
const pergunta = "qual a competência do Corpo de Bombeiros Militar de Pernambuco?";

// 1. gerar embedding da pergunta
const embed = await fetch("https://api.groq.com/openai/v1/embeddings", {
    method: "POST",
    headers: {
        "Authorization": `Bearer ${CHAVE}`,
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        model: "nomic-embed-text",
        input: pergunta
    })
}).then(r => r.json());

const perguntaEmbedding = embed.data[0].embedding;

// 2. Ver se sua memória vetorial está preenchida
console.log("Total de chunks carregados:", getMemoriaVetorial().length);

// 3. Buscar contexto
const contexto = buscarContexto(perguntaEmbedding);

console.log("\n=== CONTEXTO ENCONTRADO ===\n");
console.log(contexto);
