// gerarContextoIA.js
import fetch from "node-fetch";
import { buscarContexto } from "./buscarContexto.js";

export async function gerarContextoIA(pergunta, chave) {
    const perguntaEmbed = await fetch("https://api.groq.com/openai/v1/embeddings", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${chave}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "nomic-embed-text",
            input: pergunta
        })
    }).then(r => r.json());

    const contexto = buscarContexto(perguntaEmbed.data[0].embedding);

    return `
DOCUMENTOS ENCONTRADOS:
${contexto}

---

PERGUNTA DO USUÁRIO:
${pergunta}
`;
}
