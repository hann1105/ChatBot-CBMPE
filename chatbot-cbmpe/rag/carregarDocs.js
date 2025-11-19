// carregarDocs.js
import fs from "fs";
import pdfParse from "pdf-parse"; // importação correta para ESM

/**
 * Lê todos os PDFs da pasta e retorna o texto completo.
 */
export async function carregarDocumentos() {
    const arquivos = fs.readdirSync("./documentos_cbmpe");
    let textos = [];

    for (const arquivo of arquivos) {
        if (arquivo.endsWith(".pdf")) {
            const dataBuffer = fs.readFileSync(`./documentos_cbmpe/${arquivo}`);
            const data = await pdfParse(dataBuffer);
            textos.push(data.text);
        }
    }

    return textos.join("\n\n");
}

/**
 * Divide um texto grande em pedaços menores.
 * @param {string} texto - Texto completo
 * @param {number} tamanhoMax - Tamanho máximo de cada chunk
 * @param {number} sobreposicao - Quantos caracteres se sobrepõem entre chunks
 * @returns {string[]} Array de chunks
 */
export function chunkText(texto, tamanhoMax = 1000, sobreposicao = 200) {
    const chunks = [];
    let inicio = 0;

    while (inicio < texto.length) {
        const fim = inicio + tamanhoMax;
        chunks.push(texto.slice(inicio, fim));
        inicio += tamanhoMax - sobreposicao; // sobreposição
    }

    return chunks;
}



/*import fs from "fs";
/*import pdfParse from "pdf-parse";
import * as pdfParse from "pdf-parse";


export async function carregarDocumentos() {
    const arquivos = fs.readdirSync("./documentos_cbmpe");
    let textos = [];

    for (const arquivo of arquivos) {
        const dataBuffer = fs.readFileSync(`./documentos_cbmpe/${arquivo}`);
        const data = await pdfParse.default(dataBuffer);
        textos.push(data.text);
    }

    return textos.join("\n\n");
}
*/
