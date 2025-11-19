// gerarEmbeddings.js
import 'dotenv/config'; // carrega automaticamente o .env
import fetch from "node-fetch";
import { carregarDocumentos, chunkText } from "./carregarDocs.js";
import { salvarEmbedding } from "./embeddings.js"; // assume que você tem essa função pronta

async function gerarBaseVetorial(chave) {
    console.log("Iniciando geração de embeddings...");

    if (!chave) {
        throw new Error("Chave API não encontrada. Verifique seu .env");
    }

    const texto = await carregarDocumentos();
    const chunks = chunkText(texto);

    for (const chunk of chunks) {
        const response = await fetch("https://api.groq.com/openai/v1/embeddings", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${chave}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "nomic-embed-text",
                input: chunk
            })
        });

        const embed = await response.json();

        if (embed.error) {
            console.error("Erro ao gerar embedding:", embed.error);
            continue;
        }

        salvarEmbedding(chunk, embed.data[0].embedding);
    }

    console.log("Embeddings gerados e armazenados!");
}

// pega a chave diretamente do .env
const minhaChaveAPI = process.env.GROQ_API_KEY;

console.log("Chave carregada:", minhaChaveAPI ? "OK" : "NÃO");

gerarBaseVetorial(minhaChaveAPI).catch(err => {
    console.error("Erro ao gerar base vetorial:", err);
});


// Carrega variáveis do .env
/*import 'dotenv/config';
import fs from 'fs';
import fetch from 'node-fetch';
import { carregarDocumentos, chunkText } from './carregarDocs.js';
import { salvarEmbedding } from './embeddings.js';

// Testa se a chave API está carregada
const minhaChaveAPI = process.env.GROQ_API_KEY;
if (!minhaChaveAPI) {
    console.error("Erro: variável MINHA_CHAVE_API não encontrada no .env");
    process.exit(1);
}

export async function gerarBaseVetorial(chave) {
    console.log("Iniciando geração de embeddings...");

    // 1️⃣ Carregar PDFs
    const texto = await carregarDocumentos();
    console.log("PDFs carregados com sucesso.");

    // 2️⃣ Dividir em chunks
    const chunks = chunkText(texto, 1000, 200);
    console.log(`Texto dividido em ${chunks.length} chunks.`);

    // 3️⃣ Gerar embeddings
    for (const [i, chunk] of chunks.entries()) {
        try {
            console.log(`Enviando chunk ${i + 1}/${chunks.length} para a API...`);
            
            const response = await fetch("https://api.groq.com/openai/v1/embeddings", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${chave}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "nomic-embed-text",
                    input: chunk
                })
            });

            const embed = await response.json();

            // 4️⃣ Salvar embedding
            if (embed.data && embed.data[0] && embed.data[0].embedding) {
                salvarEmbedding(chunk, embed.data[0].embedding);
                console.log(`Chunk ${i + 1} processado.`);
            } else {
                console.error(`Erro ao processar chunk ${i + 1}: resposta inválida da API`, embed);
            }

        } catch (err) {
            console.error(`Erro ao processar chunk ${i + 1}:`, err);
        }
    }

    console.log("Todos os embeddings foram gerados e armazenados!");
}

// Chamada da função principal
gerarBaseVetorial(minhaChaveAPI).catch(err => {
    console.error("Erro ao gerar base vetorial:", err);
});
**/
