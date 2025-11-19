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
    question: "Você deseja solicitar o **AVCB** ou **regularização preventiva**?",
    type: "choice",
    options: ["Solicitar AVCB", "Regularização Preventiva"]
  },
  {
    id: "end",
    question: "✅ Obrigado! Posso agora te explicar o passo a passo da emissão do AVCB. Digite sua dúvida ou a palavra 'Instruções' para continuar.",
  }
];

let step = 0;
let userResponses = {};

let isChattingFree = false; 

function showMessage(text, sender = "bot") {
  const msg = document.createElement("div");
  msg.className = sender;
  msg.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); 
  chatOutput.appendChild(msg);
  chatOutput.scrollTop = chatOutput.scrollHeight;
}

function nextQuestion() {
  const current = cbmpeFlow[step];
  if (!current) return;
  showMessage(current.question);
}

async function sendToServer(finalMessage) {
  showMessage("🤖 O assistente está preparando a resposta...", "bot");
  
  try {
    const response = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: finalMessage })
    });
    
    chatOutput.lastChild.remove(); 
    
    const data = await response.json();
    
    if (response.ok) {
        showMessage(data.reply);
    } else {
        showMessage(`⚠️ Erro ao conectar com a IA: ${data.reply || "Falha ao receber resposta do servidor."}`);
    }

  } catch (error) {
    chatOutput.lastChild.remove();
    showMessage("⚠️ Erro de rede: Não foi possível conectar ao backend (http://localhost:3000).");
  }
}

sendBtn.addEventListener("click", () => {
  const input = chatInput.value.trim();

  if (!input) return;

  // 1. Lógica para CHAT LIVRE (após o fluxo)
  if (isChattingFree) {
    showMessage(input, "user");
    chatInput.value = "";
    // Envia a mensagem do usuário diretamente para a IA no modo de chat livre
    sendToServer(input);
    return;
  }
  
  // 2. Lógica de FLUXO (inicial)
  const current = cbmpeFlow[step];

  if (!current) return;

  // Validação
  if (current.validation && !current.validation(input)) {
    showMessage("⚠️ Resposta inválida. Tente novamente.", "bot");
    return;
  }

  // Exibir a resposta do usuário
  showMessage(input, "user");
  chatInput.value = "";
  
  // Armazenar a resposta
  userResponses[current.id] = input;

  // Se for o último passo (end), enviar contexto completo para a IA e ativar o CHAT LIVRE.
  if (current.id === "end") {
    
    // Montar a mensagem final
    const fullContext = `Contexto da Empresa:\nNome: ${userResponses.welcome}\nCNPJ: ${userResponses.cnpj}\nServiço Desejado: ${userResponses.servico}\n\nPergunta do Usuário (passo final): ${input}`;
    
    sendToServer(fullContext);
    
    isChattingFree = true; 
    // Mantém step no limite para evitar erro, mas a lógica de if(isChattingFree) é que comanda agora
    step = cbmpeFlow.length; 
    return;
  }

  // Passar para a próxima pergunta
  step++;
  setTimeout(nextQuestion, 600);
});

// Inicia o fluxo
nextQuestion();
// Enviar mensagem ao pressionar ENTER
chatInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    sendBtn.click();
  }
});
