const chatOutput = document.getElementById("chat-output");
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
    validation: (input) => /^\d{14}$/.test(input.replace(/\D/g, ""))
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
