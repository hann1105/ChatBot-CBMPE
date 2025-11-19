import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = 3000;

const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!GROQ_API_KEY || GROQ_API_KEY === "chave") {
  console.error("❌ ERRO: Chave GROQ_API_KEY inválida no .env");
  process.exit(1);
}

app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant", // MODELO CORRETO
          messages: [
            {
              role: "system",
              content:
                "Você é um assistente virtual do Corpo de Bombeiros Militar de Pernambuco. Ajude o usuário com dúvidas sobre regularização de empresas e emissão do AVCB, e se precisar de ajuda de contato ou qualquer tipo de ajuda",
            },
            { role: "user", content: message },
          ],
        }),
      }
    );

    const text = await groqResponse.text(); // Lê como texto SEMPRE

    // Tenta converter para JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("❌ A Groq NÃO retornou JSON:", text);
      return res.status(500).json({
        reply: "A Groq retornou uma resposta inesperada. Verifique o modelo e a chave.",
      });
    }

    if (!groqResponse.ok) {
      console.error("⚠️ Erro da API Groq:", data);
      return res.status(500).json({
        reply: `Erro na API Groq: ${data.error?.message || "Desconhecido"}`,
      });
    }

    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error("❌ Erro no servidor:", err);
    res
      .status(500)
      .json({ reply: "Erro interno no servidor. Veja o console do Node.js." });
  }
});

app.listen(PORT, () =>
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
);




/*import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = 3000;

// Verificar se a chave está presente ANTES de iniciar o servidor
const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!GROQ_API_KEY || GROQ_API_KEY === 'chave') {
    console.error("❌ ERRO: A variável GROQ_API_KEY não foi configurada corretamente no arquivo .env.");
    console.error("chave");
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

app.listen(PORT, () => console.log(`🚀 Servidor rodando em http://localhost:${PORT}`));*/