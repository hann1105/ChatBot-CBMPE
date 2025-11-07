import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const PORT = 3000;

// Verificar se a chave está presente ANTES de iniciar o servidor
const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!GROQ_API_KEY || GROQ_API_KEY === 'SUA_CHAVE_DE_API_GROQ_AQUI') {
    console.error("❌ ERRO: A variável GROQ_API_KEY não foi configurada corretamente no arquivo .env.");
    console.error("Substitua 'SUA_CHAVE_DE_API_GROQ_AQUI' pela sua chave real.");
    process.exit(1);
}

app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { message } = req.body;
  
  try {
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "Você é um assistente virtual do Corpo de Bombeiros Militar de Pernambuco. Ajude o usuário com dúvidas sobre regularização de empresas e emissão do AVCB, de forma clara e cordial."
          },
          { role: "user", content: message }
        ]
      })
    });

    // Tratamento de Erro: Se a resposta não for OK (ex: 401 Unauthorized, 403 Forbidden)
    if (!groqResponse.ok) {
        let errorMsg = `Erro na API Groq (Status ${groqResponse.status}).`;
        try {
            const errorData = await groqResponse.json();
            errorMsg = errorData.error.message || errorMsg;
            console.error(`⚠️ Erro da API Groq (Status ${groqResponse.status}):`, errorData);
        } catch (e) {
            console.error("Não foi possível ler o erro JSON da Groq.", groqResponse.status);
        }
        // Retorna o erro específico para o frontend
        return res.status(500).json({ reply: `Erro ao conectar com a IA: ${errorMsg}` });
    }

    const data = await groqResponse.json();
    res.json({ reply: data.choices[0].message.content });
    
  } catch (err) {
    console.error("❌ Erro de Conexão no Servidor:", err);
    res.status(500).json({ reply: "Erro interno do servidor. Verifique o console do Node.js." });
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir arquivos estáticos (index.html, script.js, etc.)
app.use(express.static(__dirname));

// Rota principal -> envia o index.html quando acessa o navegador
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => console.log(`🚀 Servidor rodando em http://localhost:${PORT}`));