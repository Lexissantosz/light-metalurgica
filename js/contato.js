const contactForm = document.querySelector(".contact-form");

function obterProdutoDaUrl() {
  const params = new URLSearchParams(window.location.search);
  const produto = params.get("produto");
  return produto ? produto.trim() : "";
}

function criarStatusFormulario(form) {
  let status = form.querySelector(".form-status");

  if (!status) {
    status = document.createElement("p");
    status.className = "form-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    status.setAttribute("aria-atomic", "true");
    form.appendChild(status);
  }

  return status;
}

function configurarCampos(form) {
  const nome = form.querySelector("#nome");
  const telefone = form.querySelector("#telefone");
  const email = form.querySelector("#email");
  const assunto = form.querySelector("#assunto");
  const mensagem = form.querySelector("#mensagem");
  const produto = obterProdutoDaUrl();

  if (nome) nome.autocomplete = "name";
  if (telefone) {
    telefone.autocomplete = "tel";
    telefone.inputMode = "tel";
  }
  if (email) email.autocomplete = "email";

  if (produto) {
    if (assunto && !assunto.value.trim()) {
      assunto.value = `Orçamento — ${produto}`;
    }

    if (mensagem && !mensagem.value.trim()) {
      mensagem.value = `Olá! Gostaria de solicitar informações e orçamento para o equipamento ${produto}.`;
    }
  }
}

function definirEstadoEnvio(form, enviando) {
  const botao = form.querySelector('button[type="submit"]');
  if (!botao) return;

  if (enviando) {
    if (!botao.dataset.originalText) {
      botao.dataset.originalText = botao.textContent.trim();
    }

    botao.disabled = true;
    botao.setAttribute("aria-busy", "true");
    botao.textContent = "Enviando...";
  } else {
    botao.disabled = false;
    botao.removeAttribute("aria-busy");
    botao.textContent = botao.dataset.originalText || "Enviar solicitação";
  }
}

function atualizarStatus(status, tipo, mensagem) {
  status.className = `form-status form-status-${tipo}`;
  status.textContent = mensagem;
}

async function enviarFormulario(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const status = criarStatusFormulario(form);

  if (!form.reportValidity()) {
    atualizarStatus(
      status,
      "error",
      "Confira os campos obrigatórios antes de enviar."
    );
    return;
  }

  if (form.dataset.enviando === "true") return;

  form.dataset.enviando = "true";
  definirEstadoEnvio(form, true);
  atualizarStatus(status, "loading", "Enviando sua solicitação...");

  try {
    const resposta = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: {
        Accept: "application/json"
      }
    });

    if (!resposta.ok) {
      throw new Error(`Formspree retornou status ${resposta.status}`);
    }

    form.reset();
    configurarCampos(form);

    atualizarStatus(
      status,
      "success",
      "Solicitação enviada. A equipe comercial poderá entrar em contato pelos dados informados."
    );
  } catch (erro) {
    console.error("Erro ao enviar formulário:", erro);

    atualizarStatus(
      status,
      "error",
      "Não foi possível enviar agora. Seus dados continuam preenchidos para você tentar novamente."
    );
  } finally {
    form.dataset.enviando = "false";
    definirEstadoEnvio(form, false);
  }
}

if (contactForm) {
  const status = criarStatusFormulario(contactForm);
  status.textContent = "";

  configurarCampos(contactForm);
  contactForm.addEventListener("submit", enviarFormulario);
}
