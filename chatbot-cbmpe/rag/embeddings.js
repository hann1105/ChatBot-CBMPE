// embeddings.js

// Aqui fica armazenada a "memória vetorial"
let memoriaVetorial = [];

// Retorna toda a memória
export function getMemoriaVetorial() {
    return memoriaVetorial;
}

// Adiciona 1 embedding + texto original na memória
export function salvarEmbedding(texto, embedding) {
    memoriaVetorial.push({
        texto,
        embedding
    });
}

// Se quiser limpar tudo (opcional)
export function limparMemoria() {
    memoriaVetorial = [];
}
