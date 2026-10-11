
const CONFIG = {
  // WhatsApp com código do país e DDD, só números (esse é o número do seu projeto anterior)
  whatsapp: "5584999824438",

  // Link do AppBarber/Booksy. Se deixar vazio, os botões "Agendar" abrem o formulário
  // desta página, que envia o pedido pelo WhatsApp. Se preencher, abrem o link.
  bookingUrl: "",

  instagram: "https://www.instagram.com/barbeariaestilo",

  // Link do Perfil da Empresa no Google. Vazio = abre a busca da barbearia no Google Maps.
  googleUrl: "",

  mensagemPadrao: "Olá! Gostaria de agendar um horário na barbearia.",
};

const HORARIO = {
  abre: 9 * 60,          // 09:00
  fecha: 20 * 60,        // 20:00
  diasAbertos: [2, 3, 4, 5, 6], // terça (2) a sábado (6)
  passo: 30,             // intervalo entre horários, em minutos
};

const SERVICOS = {
  corte:       { nome: "Corte social ou moderno", min: 30 },
  barba:       { nome: "Barba completa",          min: 30 },
  combo:       { nome: "Combo barba e cabelo",    min: 50 },
  sobrancelha: { nome: "Sobrancelha",             min: 15 },
  pigmentacao: { nome: "Pigmentação",             min: 20 },
  limpeza:     { nome: "Limpeza de pele",         min: 30 }, // duração estimada
};

const DIAS = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];

/* ---------- Utilidades ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const pad = (n) => String(n).padStart(2, "0");
const toHHMM = (min) => `${pad(Math.floor(min / 60))}:${pad(min % 60)}`;

// Data e hora atuais no fuso de Natal
function agoraEmNatal() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Fortaleza",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "numeric", minute: "numeric", hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t).value;
  const data = `${get("year")}-${get("month")}-${get("day")}`;
  const minutos = parseInt(get("hour"), 10) * 60 + parseInt(get("minute"), 10);
  const diaSemana = new Date(+get("year"), +get("month") - 1, +get("day")).getDay();
  return { data, minutos, diaSemana };
}

function linkWhatsApp(mensagem) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

function telefoneFormatado() {
  const d = CONFIG.whatsapp.replace(/^55/, "");
  return `(${d.slice(0, 2)}) ${d.slice(2, -4)}-${d.slice(-4)}`;
}

/* ---------- Links e contatos ---------- */
function configurarLinks() {
  $$("[data-wa]").forEach((a) => {
    const msg = a.getAttribute("data-wa") || CONFIG.mensagemPadrao;
    a.href = linkWhatsApp(msg);
    a.target = "_blank";
  });

  $$("[data-tel]").forEach((a) => {
    a.href = `tel:+${CONFIG.whatsapp}`;
    a.textContent = telefoneFormatado();
  });

  $$("[data-insta]").forEach((a) => {
    if (CONFIG.instagram) a.href = CONFIG.instagram;
    else a.style.display = "none";
  });

  const googleFallback =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Barber Shop & Club, Av. Afonso Pena 1200, Petrópolis, Natal RN");
  $$("[data-google]").forEach((a) => {
    a.href = CONFIG.googleUrl || googleFallback;
  });

  $("#ano").textContent = new Date().getFullYear();
}

/* ---------- Status de funcionamento ---------- */
function configurarStatus() {
  const box = $("#status");
  const txt = $("#status-text");
  if (!box || !txt) return;
  try {
    const { minutos, diaSemana } = agoraEmNatal();
    const aberto = HORARIO.diasAbertos.includes(diaSemana);
    let msg;
    if (aberto && minutos >= HORARIO.abre && minutos < HORARIO.fecha) {
      msg = "Aberto agora, fechamos às 20h";
      box.classList.add("open");
    } else if (aberto && minutos < HORARIO.abre) {
      msg = "Fechado agora, abrimos hoje às 9h";
    } else if (diaSemana === 6 || diaSemana === 0) {
      msg = "Fechado agora, abrimos terça às 9h";
    } else {
      msg = "Fechado agora, abrimos amanhã às 9h";
    }
    txt.textContent = msg;
  } catch (e) { /* mantém o texto padrão */ }
}

/* ---------- Modal de agendamento ---------- */
const modal = $("#modalAgendamento");
const form = $("#formAgendamento");
const campos = {
  nome: $("#nome"),
  servico: $("#servico"),
  barbeiro: $("#barbeiro"),
  data: $("#data"),
  hora: $("#hora"),
};
const erros = {
  nome: $("#erroNome"),
  servico: $("#erroServico"),
  data: $("#erroData"),
};

function limparErros() {
  Object.values(erros).forEach((e) => (e.textContent = ""));
}

// Barbeiros no formulário: usa os nomes reais já preenchidos na seção Equipe
function preencherBarbeiros() {
  $$(".barber h3:not([data-placeholder])").forEach((h3) => {
    const opt = document.createElement("option");
    opt.value = opt.textContent = h3.textContent.trim();
    campos.barbeiro.appendChild(opt);
  });
}

// Horários disponíveis conforme serviço (duração) e data (não mostra horários que já passaram)
function atualizarHorarios() {
  const anterior = campos.hora.value;
  const servico = SERVICOS[campos.servico.value];
  const duracao = servico ? servico.min : HORARIO.passo;
  const { data: hoje, minutos: agora } = agoraEmNatal();
  const ehHoje = campos.data.value === hoje;

  campos.hora.innerHTML = '<option value="">Selecione</option>';
  for (let m = HORARIO.abre; m + duracao <= HORARIO.fecha; m += HORARIO.passo) {
    const opt = document.createElement("option");
    opt.value = opt.textContent = toHHMM(m);
    if (ehHoje && m <= agora) opt.disabled = true;
    campos.hora.appendChild(opt);
  }
  const ainda = Array.from(campos.hora.options).find((o) => o.value === anterior && !o.disabled);
  if (ainda) campos.hora.value = anterior;
}

function validarDia() {
  erros.data.textContent = "";
  if (!campos.data.value) return true;
  const [a, m, d] = campos.data.value.split("-").map(Number);
  const dia = new Date(a, m - 1, d).getDay();
  if (!HORARIO.diasAbertos.includes(dia)) {
    erros.data.textContent = `Fechamos às segundas e aos domingos. Escolha uma data de terça a sábado.`;
    return false;
  }
  return true;
}

function abrirAgendamento(servicoId) {
  if (typeof modal.showModal !== "function") {
    // navegador antigo sem <dialog>: vai direto para o WhatsApp
    window.open(linkWhatsApp(CONFIG.mensagemPadrao), "_blank", "noopener");
    return;
  }
  limparErros();
  const hoje = agoraEmNatal().data;
  campos.data.min = hoje;
  if (servicoId && SERVICOS[servicoId]) campos.servico.value = servicoId;
  atualizarHorarios();
  modal.showModal();
  (campos.servico.value ? campos.nome : campos.servico).focus();
}

function mostrarAviso(texto) {
  const toast = $("#toast");
  toast.textContent = texto;
  toast.classList.add("show");
  clearTimeout(mostrarAviso.t);
  mostrarAviso.t = setTimeout(() => toast.classList.remove("show"), 6000);
}

function configurarBotoesAgendar() {
  $$('[data-action="agendar"]').forEach((el) => {
    if (CONFIG.bookingUrl) {
      el.href = CONFIG.bookingUrl;
      el.target = "_blank";
      el.rel = "noopener";
      return;
    }
    el.addEventListener("click", (e) => {
      e.preventDefault();
      abrirAgendamento(el.dataset.service);
    });
  });
}

function configurarModal() {
  if (!modal || !form) return;

  $("#fecharModal").addEventListener("click", () => modal.close());
  // fecha ao clicar fora da caixa
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });

  campos.servico.addEventListener("change", atualizarHorarios);
  campos.data.addEventListener("change", () => { validarDia(); atualizarHorarios(); });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    limparErros();

    let ok = true;
    if (campos.nome.value.trim().length < 2) {
      erros.nome.textContent = "Informe seu nome.";
      ok = false;
    }
    if (!campos.servico.value) {
      erros.servico.textContent = "Escolha um serviço.";
      ok = false;
    }
    if (!campos.data.value || !campos.hora.value) {
      erros.data.textContent = "Escolha a data e o horário.";
      ok = false;
    } else if (!validarDia()) {
      ok = false;
    }
    if (!ok) {
      form.querySelector(".field-error:not(:empty)")?.previousElementSibling?.focus();
      return;
    }

    const servico = SERVICOS[campos.servico.value];
    const [ano, mes, dia] = campos.data.value.split("-").map(Number);
    const diaSemana = DIAS[new Date(ano, mes - 1, dia).getDay()];
    const barbeiro = campos.barbeiro.value || "Sem preferência";

    const mensagem =
      `Olá! Gostaria de agendar um horário na Barber Shop & Club.\n\n` +
      `*Nome:* ${campos.nome.value.trim()}\n` +
      `*Serviço:* ${servico.nome}\n` +
      `*Barbeiro:* ${barbeiro}\n` +
      `*Data:* ${pad(dia)}/${pad(mes)}/${ano} (${diaSemana})\n` +
      `*Horário:* ${campos.hora.value}\n\n` +
      `Podem confirmar?`;

    window.open(linkWhatsApp(mensagem), "_blank", "noopener");

    modal.close();
    form.reset();
    mostrarAviso("Pedido enviado para o WhatsApp. O horário só fica reservado depois da confirmação da barbearia.");
  });

  preencherBarbeiros();
}

/* ---------- Antes e depois (só funciona se o bloco estiver ativo no HTML) ---------- */
function configurarSliders() {
  $$(".ba").forEach((box) => {
    const input = $('input[type="range"]', box);
    if (!input) return;
    const atualizar = () => box.style.setProperty("--pos", input.value + "%");
    input.addEventListener("input", atualizar);
    atualizar();
  });
}

/* ---------- Início ---------- */
configurarLinks();
configurarStatus();
configurarBotoesAgendar();
configurarModal();
configurarSliders();
