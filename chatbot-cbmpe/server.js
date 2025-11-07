import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { message } = req.body;
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: "Você é um assistente virtual do Corpo de Bombeiros Militar de Pernambuco. Ajude o usuário com dúvidas sobre regularização de empresas e emissão do AVCB, de forma clara e cordial."
          },
          { role: "user", content: message }
        ]
      })
    });
    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ reply: "Erro ao conectar com o servidor de IA." });
  }
});

app.listen(3000, () => console.log("🚀 Servidor rodando em http://localhost:3000"));
