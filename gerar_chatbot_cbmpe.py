import os

# Cria a pasta do projeto
os.makedirs("chatbot-cbmpe", exist_ok=True)

# -----------------------------
# Arquivo: index.html
# -----------------------------
html = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chatbot CBMPE</title>
  <link rel="stylesheet" href="style.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
</head>
<body>
  <div class="chat-container">
    <h1>🤖 Chatbot CBMPE</h1>
    <div id="chat-output" class="chat-box"></div>
    <div class="input-area">
      <input id="chat-input" placeholder="Digite sua resposta...">
      <button id="send-btn">Enviar</button>
    </div>
  </div>
  <script src="script.js"></script>
</body>
</html>
"""

# -----------------------------
# Arquivo: style.css
# -----------------------------
css = """body {
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #8b0000, #ff6347);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  margin: 0;
  color: #fff;
}
.chat-container {
  width: 400px;
  background: #fff;
  color: #000;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.chat-box {
  height: 400px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
}
.input-area {
  display: flex;
  gap: 8px;
}
input {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
}
button {
  padding: 10px 15px;
  border: none;
  background: #b22222;
  color: white;
  border-radius: 8px;
  cursor: pointer;
}
button:hover {
  background: #8b0000;
}
.bot {
  background: #f0f0f0;
  padding: 8px;
  border-radius: 8px;
  margin-bottom: 6px;
}
.user {
  background: #b22222;
  color: white;
  padding: 8px;
  border-radius: 8px;
  text-align: right;
  margin-bottom: 6px;
}
"""

# -----------------------------
# Arquivo: script.js
# -----------------------------
js = """const chatOutput = document.getElementById("chat-output");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");

const cbmpeFlow = [
  {
    id: "welcome",
    question: "👋 Olá! Bem-vindo ao atendimento do CBMPE. Qual é o nome da sua empresa?",
    type: "text",
    validation: (input) => input.trim().length > 2
  },
  {
    id: "cnpj",
    question: "Informe o CNPJ da empresa (somente números):",
    type: "text",
    validation: (input) => /^\\d{14}$/.test(input.replace(/\\D/g, ""))
  },
  {
    id: "servico",
    question: "Você deseja solicitar o AVCB ou regularização preventiva?",
    type: "choice",
    options: ["Solicitar AVCB", "Regularização Preventiva"]
  },
  {
    id: "end",
    question: "✅ Obrigado! Posso agora te explicar o passo a passo da emissão do AVCB. Deseja que eu envie as instruções?",
  }
];

let step = 0;

function showMessage(text, sender = "bot") {
  const msg = document.createElement("div");
  msg.className = sender;
  msg.textContent = text;
  chatOutput.appendChild(msg);
  chatOutput.scrollTop = chatOutput.scrollHeight;
}

function nextQuestion() {
  const current = cbmpeFlow[step];
  if (!current) return;
  showMessage(current.question);
}

async function sendToServer(message) {
  try {
    const response = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });
    const data = await response.json();
    showMessage(data.reply);
  } catch (error) {
    showMessage("⚠️ Erro ao conectar com o servidor de IA.");
  }
}

sendBtn.addEventListener("click", () => {
  const input = chatInput.value.trim();
  const current = cbmpeFlow[step];

  if (!input) return;

  if (current.validation && !current.validation(input)) {
    showMessage("⚠️ Resposta inválida. Tente novamente.");
    return;
  }

  showMessage(input, "user");
  chatInput.value = "";

  if (current.id === "end") {
    sendToServer(input);
    return;
  }

  step++;
  setTimeout(nextQuestion, 600);
});

nextQuestion();
"""

# -----------------------------
# Arquivo: server.js
# -----------------------------
server = """import express from "express";
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
"""

# -----------------------------
# Arquivo: package.json
# -----------------------------
package_json = """{
  "name": "chatbot-cbmpe",
  "version": "1.0.0",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.1",
    "express": "^4.18.2",
    "node-fetch": "^3.3.2"
  }
}
"""

# -----------------------------
# Arquivo: .env
# -----------------------------
env = "GROQ_API_KEY=coloque_sua_chave_aqui"

# Grava todos os arquivos
files = {
    "index.html": html,
    "style.css": css,
    "script.js": js,
    "server.js": server,
    "package.json": package_json,
    ".env": env
}

for name, content in files.items():
    with open(os.path.join("chatbot-cbmpe", name), "w", encoding="utf-8") as f:
        f.write(content)

print("✅ Projeto 'chatbot-cbmpe' criado com sucesso!")
print("👉 Agora abra a pasta no VS Code e rode:")
print("   npm install")
print("   npm start")
print("Depois abra o 'index.html' no navegador para conversar com o chatbot!")
