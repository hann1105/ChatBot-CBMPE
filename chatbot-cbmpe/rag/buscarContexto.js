// buscarContexto.js
import { getMemoriaVetorial } from "./embeddings.js";
import cosineSimilarity from "compute-cosine-similarity";

export function buscarContexto(perguntaEmbedding) {
    const base = getMemoriaVetorial();

    let melhores = base
        .map(item => ({
            texto: item.texto,
            score: cosineSimilarity(perguntaEmbedding, item.embedding)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

    return melhores.map(m => m.texto).join("\n\n");
}
