// =============================
// === MODAL DE SERVIÇOS =======
// =============================
document.addEventListener("DOMContentLoaded", () => {

  const modal = document.getElementById("modalServicos");
  const btnAbrir = document.getElementById("abrirModal");
  const btnFechar = document.getElementById("fecharModal");

  if (btnAbrir && btnFechar && modal) {
    btnAbrir.addEventListener("click", () => {
      modal.style.display = "flex";
      document.body.classList.add("modal-aberto-servicos");
    });

    btnFechar.addEventListener("click", () => {
      modal.style.display = "none";
      document.body.classList.remove("modal-aberto-servicos");
    });

    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
        document.body.classList.remove("modal-aberto-servicos");
      }
    });
  }

  // =============================
  // === VÍDEO DE FUNDO ==========
  // =============================
  const video = document.getElementById("bg-video");

  if (video) {
    video.muted = true;
    video.playsInline = true;

    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        document.body.addEventListener(
          "touchstart",
          () => video.play(),
          { once: true }
        );
      });
    }
  }

  // =============================
  // ====== CHATBOT ==============
  // =============================
  const chatToggle = document.querySelector("#chatToggle");
  const chatWindow = document.querySelector("#chatWindow");
  const chatMessages = document.querySelector("#chatMessages");
  const chatInput = document.querySelector("#chatInput");
  const sendBtn = document.querySelector("#sendBtn");

  const btnFecharChat = document.querySelector("#closeChat");
  const btnMinimizarChat = document.querySelector("#minimizeChat");
  const chatHeader = document.querySelector("#chatHeader");

  if (!chatToggle || !chatWindow || !chatMessages) {
    console.warn("⚠️ Chatbot: elementos não encontrados.");
  } else {

    let step = 0;
    let aberto = false;
    let minimizado = false;

    const userData = { nome: "", email: "" };
    const numeroCorretor = "5511941800934";

    const perguntas = [
      "Olá! 👋 Eu sou o assistente da Fortune Solutions. Qual é o seu nome?",
      "Perfeito, {nome}! Poderia me informar seu e-mail?",
      "Tudo certo, {nome}! Escolha uma das opções abaixo 👇"
    ];

    function adicionarMensagem(texto, tipo = "bot") {
      const msg = document.createElement("div");
      msg.classList.add("message", tipo);
      msg.textContent = texto;
      chatMessages.appendChild(msg);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function criarBotoesOpcoes() {
      chatInput.disabled = true;
      sendBtn.disabled = true;

      const opcoes = [
        "Comprar imóvel",
        "Vender imóvel",
        "Alugar imóvel",
        "Reforma",
        "Outros assuntos"
      ];

      const container = document.createElement("div");
      container.style.marginTop = "10px";
      container.style.display = "flex";
      container.style.flexDirection = "column";
      container.style.gap = "8px";

      opcoes.forEach(opcao => {
        const botao = document.createElement("button");
        botao.textContent = opcao;
        botao.classList.add("option-btn");

        botao.onclick = () => selecionarOpcao(opcao);
        container.appendChild(botao);
      });

      chatMessages.appendChild(container);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function selecionarOpcao(opcao) {
      adicionarMensagem(opcao, "user");

      const mensagem = `Olá, meu nome é ${userData.nome}, meu e-mail é ${userData.email}, e estou interessado em ${opcao}.`;
      const url = `https://wa.me/${numeroCorretor}?text=${encodeURIComponent(mensagem)}`;

      adicionarMensagem(
        `Perfeito, ${userData.nome}! Você será redirecionado ao nosso atendimento via WhatsApp sobre "${opcao}".`,
        "bot"
      );

      setTimeout(() => {
        window.open(url, "_blank");
        chatWindow.style.display = "none";
        aberto = false;
        resetarChat();
      }, 900);
    }

    function proximaPergunta(resposta) {
      if (step === 0) {
        userData.nome = resposta;
        step++;
        adicionarMensagem(perguntas[1].replace("{nome}", userData.nome));

      } else if (step === 1) {
        userData.email = resposta;
        step++;
        adicionarMensagem(perguntas[2].replace("{nome}", userData.nome));
        criarBotoesOpcoes();
      }
    }

    function enviarMensagem() {
      const texto = chatInput.value.trim();
      if (texto === "") return;

      adicionarMensagem(texto, "user");
      chatInput.value = "";
      proximaPergunta(texto);
    }

    function iniciarChat() {
      chatMessages.innerHTML = "";
      chatInput.disabled = false;
      sendBtn.disabled = false;
      chatInput.value = "";
      step = 0;
      userData.nome = "";
      userData.email = "";
      adicionarMensagem(perguntas[0]);
    }

    function resetarChat() {
      chatMessages.innerHTML = "";
      chatInput.value = "";
      chatInput.disabled = false;
      sendBtn.disabled = false;
      step = 0;
      userData.nome = "";
      userData.email = "";
      minimizado = false;
      chatWindow.classList.remove("minimizado");
    }

    // === EVENTOS DO CHAT ===

    // abre / fecha
    chatToggle.addEventListener("click", () => {
      aberto = !aberto;

      if (aberto) {
        chatWindow.style.display = "flex";

        if (!minimizado && chatMessages.children.length === 0) {
          resetarChat();
          iniciarChat();
        }

      } else {
        chatWindow.style.display = "none";
      }
    });

    // enviar msg
    sendBtn?.addEventListener("click", enviarMensagem);
    chatInput?.addEventListener("keypress", (e) => {
      if (e.key === "Enter") enviarMensagem();
    });

    // fechar chat
    btnFecharChat?.addEventListener("click", (ev) => {
      ev.stopPropagation();
      resetarChat();
      chatWindow.style.display = "none";
      aberto = false;
    });

    // minimizar
    btnMinimizarChat?.addEventListener("click", (ev) => {
      ev.stopPropagation();
      minimizado = !minimizado;
      chatWindow.classList.toggle("minimizado");
      chatWindow.style.display = "flex";
    });

    // restaurar ao clicar no cabeçalho
    chatHeader?.addEventListener("click", () => {
      if (minimizado) {
        minimizado = false;
        chatWindow.classList.remove("minimizado");
        chatWindow.style.display = "flex";
      }
    });

  }
});

// =============================================
// === GALERIA DE FOTOS POR CARD (NOVA VERSÃO) ==
// =============================================

const modalGaleria = document.getElementById("modalGaleria");
const closeModal = document.querySelector(".close-modal");
const miniaturasContainer = document.getElementById("galeriaMiniaturas");
const imagemGrande = document.getElementById("imagemGrande");
const legendaFoto = document.getElementById("legendaFoto");  // <── ADICIONADO
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let imagensAtuais = [];
let indiceAtual = 0;

// GALERIAS + LEGENDA
const galerias = {
  completa: [
    { src: "../assets/imagens/casa/casa1.jpg", legenda: "Reforma completa - Cozinha" },
    { src: "../assets/imagens/casa/casa5.jpg", legenda: "Reforma completa - Sala de estar" },
    { src: "../assets/imagens/casa/casa4.jpg", legenda: "Reforma completa - Quarto" }
  ],
  pintura: [
    { src: "../assets/imagens/casa/casa1.jpg", legenda: "Pintura - Antes e Depois" },
    { src: "../assets/imagens/casa/casa5.jpg", legenda: "Pintura externa - Fachada" },
    { src: "../assets/imagens/casa/casa4.jpg", legenda: "Pintura interna - Sala" }
  ],
  personalizados: [
    { src: "../assets/imagens/casa/casa1.jpg", legenda: "Projeto personalizado - Detalhamento" },
    { src: "../assets/imagens/casa/casa5.jpg", legenda: "Ambiente planejado" },
    { src: "../assets/imagens/casa/casa4.jpg", legenda: "Acabamento especial" }
  ]
};

// === ABRIR MODAL DA GALERIA ===
document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("click", () => {
    const tipo = card.dataset.galeria;
    imagensAtuais = galerias[tipo] || [];
    indiceAtual = 0;

    modalGaleria.classList.add("active");
    document.body.classList.add("modal-aberto-galeria");

    atualizarImagem();
    renderMiniaturas();
  });
});

// === ATUALIZAR IMAGEM PRINCIPAL + LEGENDA ===
function atualizarImagem() {
  if (!imagemGrande) return;

  imagemGrande.style.opacity = 0;

  setTimeout(() => {
    imagemGrande.src = imagensAtuais[indiceAtual].src;
    legendaFoto.textContent = imagensAtuais[indiceAtual].legenda; // <── ADICIONADO
    imagemGrande.style.opacity = 1;
  }, 200);

  destacarMiniatura();
}

// === MINIATURAS ===
function renderMiniaturas() {
  miniaturasContainer.innerHTML = "";

  imagensAtuais.forEach((item, index) => {
    const img = document.createElement("img");
    img.src = item.src;
    img.dataset.index = index;

    img.addEventListener("click", () => {
      indiceAtual = index;
      atualizarImagem();
    });

    miniaturasContainer.appendChild(img);
  });

  destacarMiniatura();
}

// === DESTACAR MINIATURA ATUAL ===
function destacarMiniatura() {
  const miniaturas = miniaturasContainer.querySelectorAll("img");

  miniaturas.forEach(img => {
    if (parseInt(img.dataset.index) === indiceAtual) {
      img.classList.add("active-thumb");
    } else {
      img.classList.remove("active-thumb");
    }
  });
}

// === BOTÕES (LOOP INFINITO) ===
prevBtn.addEventListener("click", () => {
  indiceAtual = (indiceAtual - 1 + imagensAtuais.length) % imagensAtuais.length;
  atualizarImagem();
});

nextBtn.addEventListener("click", () => {
  indiceAtual = (indiceAtual + 1) % imagensAtuais.length;
  atualizarImagem();
});

// === FECHAR MODAL ===
closeModal.addEventListener("click", () => {
  modalGaleria.classList.remove("active");
  document.body.classList.remove("modal-aberto-galeria");
});

window.addEventListener("click", (e) => {
  if (e.target === modalGaleria) {
    modalGaleria.classList.remove("active");
    document.body.classList.remove("modal-aberto-galeria");
  }
});

const itens = document.querySelectorAll(".menu-expansivo .item");

itens.forEach(item => {
  const titulo = item.querySelector(".titulo");
  const conteudo = item.querySelector(".conteudo");

  titulo.addEventListener("click", () => {

    // Fechar outros
    itens.forEach(i => {
      if (i !== item) {
        const c = i.querySelector(".conteudo");
        c.style.maxHeight = null;
        c.classList.remove("ativo");
        c.style.padding = "0 20px";
      }
    });

    // Abrir/fechar este
    if (conteudo.style.maxHeight) {
      conteudo.style.maxHeight = null;
      conteudo.classList.remove("ativo");
      conteudo.style.padding = "0 20px";
    } else {
      conteudo.style.maxHeight = conteudo.scrollHeight + "px";
      conteudo.classList.add("ativo");
      conteudo.style.padding = "15px 20px";
    }
  });
});
