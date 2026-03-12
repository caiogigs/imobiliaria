(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const ScrollLock = {
    lock() {
      document.documentElement.classList.add("is-locked");
      document.body.classList.add("is-locked");
      document.body.style.overflow = "hidden";
    },
    unlock() {
      document.documentElement.classList.remove("is-locked");
      document.body.classList.remove("is-locked");
      document.body.style.overflow = "";
    }
  };

  function onEscClose(handler) {
    const fn = (e) => {
      if (e.key === "Escape") handler();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }

  function initChatbot() {
    const chatToggle = $("#chatToggle");
    const chatWindow = $("#chatWindow");
    const chatMessages = $("#chatMessages");
    const chatInput = $("#chatInput");
    const sendBtn = $("#sendBtn");
    const btnClose = $("#closeChat");
    const btnMin = $("#minimizeChat");
    const chatHeader = $("#chatHeader");

    if (!chatToggle || !chatWindow || !chatMessages || !chatInput || !sendBtn) return;

    let aberto = false;
    let minimizado = false;
    let step = 0;

    const userData = { nome: "", email: "" };
    const numeroCorretor = "5511941800934";

    const perguntas = [
      "Olá! 👋 Eu sou o assistente da Fortune Solutions. Qual é o seu nome?",
      "Perfeito, {nome}! Poderia me informar seu e-mail?",
      "Tudo certo, {nome}! Escolha uma das opções abaixo 👇"
    ];

    function addMsg(texto, tipo = "bot") {
      const msg = document.createElement("div");
      msg.classList.add("message", tipo);
      msg.textContent = texto;
      chatMessages.appendChild(msg);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function isEmailValid(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
    }

    function setInputEnabled(enabled) {
      chatInput.disabled = !enabled;
      sendBtn.disabled = !enabled;
    }

    function resetChat() {
      chatMessages.innerHTML = "";
      chatInput.value = "";
      setInputEnabled(true);
      step = 0;
      userData.nome = "";
      userData.email = "";
      minimizado = false;
      chatWindow.classList.remove("minimizado");
    }

    function startChat() {
      resetChat();
      addMsg(perguntas[0]);
    }

    function createOptions() {
      setInputEnabled(false);

      const opcoes = [
        "Quero entender investimento imobiliário",
        "Quero investir para renda",
        "Quero entender valorização patrimonial",
        "Preciso de ajuda para decidir",
        "Outros assuntos"
      ];

      const container = document.createElement("div");
      container.className = "chat-options";
      container.style.marginTop = "10px";
      container.style.display = "flex";
      container.style.flexDirection = "column";
      container.style.gap = "8px";

      opcoes.forEach(opcao => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = opcao;
        btn.classList.add("option-btn");
        btn.addEventListener("click", () => selectOption(opcao));
        container.appendChild(btn);
      });

      chatMessages.appendChild(container);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function selectOption(opcao) {
      addMsg(opcao, "user");

      const mensagem = `Olá, meu nome é ${userData.nome}, meu e-mail é ${userData.email}, e estou interessado em ${opcao}.`;
      const url = `https://wa.me/${numeroCorretor}?text=${encodeURIComponent(mensagem)}`;

      addMsg(`Perfeito, ${userData.nome}! Abrindo WhatsApp sobre "${opcao}".`, "bot");

      setTimeout(() => {
        window.open(url, "_blank");
        chatWindow.style.display = "none";
        aberto = false;
        resetChat();
      }, 700);
    }

    function nextStep(resposta) {
      if (step === 0) {
        userData.nome = resposta;
        step = 1;
        addMsg(perguntas[1].replace("{nome}", userData.nome));
        return;
      }

      if (step === 1) {
        if (!isEmailValid(resposta)) {
          addMsg("Esse e-mail parece inválido. Pode digitar novamente? 😊");
          return;
        }
        userData.email = resposta;
        step = 2;
        addMsg(perguntas[2].replace("{nome}", userData.nome));
        createOptions();
      }
    }

    function send() {
      const texto = chatInput.value.trim();
      if (!texto) return;

      addMsg(texto, "user");
      chatInput.value = "";
      nextStep(texto);
    }

    chatToggle.addEventListener("click", () => {
      aberto = !aberto;

      if (aberto) {
        chatWindow.style.display = "flex";
        if (!minimizado && chatMessages.children.length === 0) {
          startChat();
        }
      } else {
        chatWindow.style.display = "none";
      }
    });

    sendBtn.addEventListener("click", send);
    chatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") send();
    });

    btnClose?.addEventListener("click", (e) => {
      e.stopPropagation();
      resetChat();
      chatWindow.style.display = "none";
      aberto = false;
    });

    btnMin?.addEventListener("click", (e) => {
      e.stopPropagation();
      minimizado = !minimizado;
      chatWindow.classList.toggle("minimizado");
      chatWindow.style.display = "flex";
    });

    chatHeader?.addEventListener("click", () => {
      if (minimizado) {
        minimizado = false;
        chatWindow.classList.remove("minimizado");
        chatWindow.style.display = "flex";
      }
    });
  }

  function initGaleria() {
    const modalGaleria = $("#modalGaleria");
    const closeBtn = $(".close-modal");
    const miniaturasContainer = $("#galeriaMiniaturas");
    const imagemGrande = $("#imagemGrande");
    const legendaFoto = $("#legendaFoto");
    const prevBtn = $("#prevBtn");
    const nextBtn = $("#nextBtn");

    const cards = $$(".card[data-galeria]");
    if (!modalGaleria || !miniaturasContainer || !imagemGrande || !prevBtn || !nextBtn || cards.length === 0) return;

    const setLegenda = (text) => { if (legendaFoto) legendaFoto.textContent = text || ""; };

    let imagensAtuais = [];
    let indiceAtual = 0;
    let removeEsc = null;

    const galerias = {
      renda: [
        { src: "../assets/imagens/investimento/investimento1.jpg", legenda: "Imóveis para geração de renda" },
        { src: "../assets/imagens/investimento/investimento3.jpg", legenda: "Estratégias ligadas à renda com patrimônio" },
        { src: "../assets/imagens/investimento/investimento4.jpg", legenda: "Mais clareza para investir com objetivo definido" }
      ],
      valorizacao: [
        { src: "../assets/imagens/investimento/investimento2.jpg", legenda: "Valorização patrimonial no tempo" },
        { src: "../assets/imagens/investimento/investimento4.jpg", legenda: "Imóvel como ativo patrimonial" },
        { src: "../assets/imagens/investimento/investimento1.jpg", legenda: "Construção de patrimônio com visão estratégica" }
      ],
      estrategia: [
        { src: "../assets/imagens/investimento/investimento3.jpg", legenda: "Estratégia e visão antes da decisão" },
        { src: "../assets/imagens/investimento/investimento2.jpg", legenda: "Mais clareza sobre o momento de investir" },
        { src: "../assets/imagens/investimento/investimento4.jpg", legenda: "Decisão com mais consciência e segurança" }
      ]
    };

    function highlightThumb() {
      $$("#galeriaMiniaturas img").forEach(img => {
        const i = Number(img.dataset.index);
        img.classList.toggle("active-thumb", i === indiceAtual);
      });
    }

    function updateImage() {
      if (!imagensAtuais.length) return;

      imagemGrande.style.opacity = 0;
      setTimeout(() => {
        imagemGrande.src = imagensAtuais[indiceAtual].src;
        setLegenda(imagensAtuais[indiceAtual].legenda);
        imagemGrande.style.opacity = 1;
        highlightThumb();
      }, 120);
    }

    function renderThumbs() {
      miniaturasContainer.innerHTML = "";
      imagensAtuais.forEach((item, idx) => {
        const img = document.createElement("img");
        img.src = item.src;
        img.alt = item.legenda || `Miniatura ${idx + 1}`;
        img.dataset.index = String(idx);
        img.loading = "lazy";
        img.addEventListener("click", () => {
          indiceAtual = idx;
          updateImage();
        });
        miniaturasContainer.appendChild(img);
      });
      highlightThumb();
    }

    function open(tipo) {
      imagensAtuais = galerias[tipo] || [];
      indiceAtual = 0;

      modalGaleria.classList.add("active");
      ScrollLock.lock();
      renderThumbs();
      updateImage();

      removeEsc = onEscClose(close);
    }

    function close() {
      modalGaleria.classList.remove("active");
      ScrollLock.unlock();
      if (removeEsc) removeEsc();
      removeEsc = null;
    }

    cards.forEach(card => {
      card.addEventListener("click", () => {
        const tipo = card.dataset.galeria;
        open(tipo);
      });
    });

    prevBtn.addEventListener("click", () => {
      if (!imagensAtuais.length) return;
      indiceAtual = (indiceAtual - 1 + imagensAtuais.length) % imagensAtuais.length;
      updateImage();
    });

    nextBtn.addEventListener("click", () => {
      if (!imagensAtuais.length) return;
      indiceAtual = (indiceAtual + 1) % imagensAtuais.length;
      updateImage();
    });

    closeBtn?.addEventListener("click", close);

    modalGaleria.addEventListener("click", (e) => {
      if (e.target === modalGaleria) close();
    });
  }

  function initFAQ() {
    const items = $$(".menu-expansivo .item");
    if (!items.length) return;

    items.forEach(item => {
      const titulo = $(".titulo", item);
      const conteudo = $(".conteudo", item);
      if (!titulo || !conteudo) return;

      titulo.addEventListener("click", () => {
        items.forEach(other => {
          if (other === item) return;
          const c = $(".conteudo", other);
          if (!c) return;
          c.style.maxHeight = null;
          c.classList.remove("ativo");
          c.style.padding = "0 16px";
        });

        const opened = conteudo.classList.contains("ativo");
        if (opened) {
          conteudo.style.maxHeight = null;
          conteudo.classList.remove("ativo");
          conteudo.style.padding = "0 16px";
        } else {
          conteudo.classList.add("ativo");
          conteudo.style.padding = "12px 16px";
          conteudo.style.maxHeight = conteudo.scrollHeight + "px";
        }
      });

      conteudo.style.padding = "0 16px";
    });

    window.addEventListener("resize", () => {
      items.forEach(item => {
        const conteudo = $(".conteudo", item);
        if (!conteudo) return;
        if (conteudo.classList.contains("ativo")) {
          conteudo.style.maxHeight = conteudo.scrollHeight + "px";
        }
      });
    });
  }

  function initServiceModals() {
    const triggers = $$(".servico-item[data-modal]");
    const modals = $$(".modal");
    if (!triggers.length || !modals.length) return;

    let openedModal = null;
    let removeEsc = null;

    const open = (modal) => {
      openedModal = modal;
      modal.style.display = "flex";
      ScrollLock.lock();
      removeEsc = onEscClose(close);

      tryInitScrollSpy(modal);
    };

    const close = () => {
      if (!openedModal) return;
      openedModal.style.display = "none";
      openedModal = null;
      ScrollLock.unlock();
      if (removeEsc) removeEsc();
      removeEsc = null;
    };

    triggers.forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-modal");
        if (!id) return;
        const modal = document.getElementById(id);
        if (!modal) return;
        open(modal);
      });
    });

    $$(".close").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const modal = btn.closest(".modal");
        if (!modal) return;
        modal.style.display = "none";
        if (openedModal === modal) {
          openedModal = null;
          ScrollLock.unlock();
          if (removeEsc) removeEsc();
          removeEsc = null;
        }
      });
    });

    modals.forEach(modal => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          if (modal === openedModal) close();
          else {
            modal.style.display = "none";
            ScrollLock.unlock();
          }
        }
      });
    });

    function tryInitScrollSpy(modal) {
      if (typeof bootstrap === "undefined") return;

      const scrollEl = $(".conteudo-scroll", modal);
      const nav = $("#navbar-example3", modal);

      if (!scrollEl || !nav) return;

      scrollEl.style.position = scrollEl.style.position || "relative";

      if (scrollEl._bs_scrollspy_instance) {
        try { scrollEl._bs_scrollspy_instance.dispose(); } catch (_) {}
      }

      try {
        const spy = new bootstrap.ScrollSpy(scrollEl, {
          target: "#navbar-example3",
          offset: 10
        });
        scrollEl._bs_scrollspy_instance = spy;
        scrollEl.scrollTop = 0;
      } catch (err) {
        console.warn("ScrollSpy: falha ao iniciar", err);
      }
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    initChatbot();
    initGaleria();
    initFAQ();
    initServiceModals();
  });

})();