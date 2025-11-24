// sindico_notificacoes.js
const API_URL_NOTIFICACOES = "https://api.porttusmart.tech/api/v1/users/persons/";
const TOKEN_NOTIFICACOES = localStorage.getItem("access_token");

// Elementos
// Elementos
const bellBtn = document.getElementById("notification-bell");
const dropdown = document.getElementById("notification-dropdown");
const notificationCount = document.getElementById("notification-count");

// ========================================
// 🔥 BUSCAR TODAS AS PÁGINAS DA API (SEM CORS)
// ========================================
async function buscarTodasPaginas(urlInicial) {
  let url = urlInicial;
  let resultados = [];

  while (url) {
    // Garante HTTPS
    url = url.replace("http://", "https://");

    const resp = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TOKEN_NOTIFICACOES}` // sem Content-Type
      }
    });

    if (!resp.ok) throw new Error(`Erro ao buscar página (${resp.status})`);

    const data = await resp.json();

    resultados = resultados.concat(data.results || []);

    url = data.next ? data.next.replace("http://", "https://") : null;
  }

  return resultados;
}

// ========================================
// 🔥 CARREGAR NOTIFICAÇÕES
// ========================================
async function carregarNotificacoes() {
  if (!TOKEN_NOTIFICACOES) {
    dropdown.innerHTML = `<p class="no-notifications">Usuário não autenticado.</p>`;
    atualizarContador(0);
    return;
  }

  try {
    const usuarios = await buscarTodasPaginas(API_URL_NOTIFICACOES);
    const pendentes = usuarios.filter(u => !u.is_active);

    atualizarLista(pendentes);
  } catch (error) {
    console.error("Erro ao carregar notificações:", error);
    dropdown.innerHTML = `<p class="no-notifications">Erro ao carregar notificações.</p>`;
    atualizarContador(0);
  }
}

// ========================================
// 🔥 ATUALIZAR CONTADOR
// ========================================
function atualizarContador(qtd) {
  notificationCount.textContent = qtd > 0 ? qtd : "";
  notificationCount.style.display = qtd > 0 ? "inline-block" : "none";
}

// ========================================
// 🔥 ATUALIZAR LISTA DE NOTIFICAÇÕES
// ========================================
function atualizarLista(usuarios) {
  dropdown.innerHTML = "";

  if (usuarios.length === 0) {
    dropdown.innerHTML = `<p class="no-notifications">Nenhuma nova solicitação.</p>`;
    atualizarContador(0);
    return;
  }

  atualizarContador(usuarios.length);

  usuarios.forEach(usuario => {
    const bloco = usuario.apartment?.block || "N/A";
    const numero = usuario.apartment?.number || "N/A";

    const item = document.createElement("div");
    item.className = "notification-item";
    item.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:5px; padding:5px 0;">
        <strong>${usuario.name}</strong>
        <span>Morador do bloco ${bloco} apartamento ${numero}</span>
        <div style="display:flex; gap:10px; margin-top:5px;">
          <button class="btn-approve" data-id="${usuario.id}">Aprovar</button>
          <button class="btn-reject" data-id="${usuario.id}">Rejeitar</button>
        </div>
      </div>
    `;

    item.querySelector(".btn-approve").addEventListener("click", () => aprovarUsuario(usuario.id));
    item.querySelector(".btn-reject").addEventListener("click", () => rejeitarUsuario(usuario.id));
    dropdown.appendChild(item);
  });
}

// ========================================
// 🔥 APROVAR (PATCH → precisa Content-Type)
// ========================================
async function aprovarUsuario(id) {
  if (!confirm("Deseja aprovar este usuário?")) return;

  try {
    const resp = await fetch(`${API_URL_NOTIFICACOES}${id}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${TOKEN_NOTIFICACOES}`,
        "Content-Type": "application/json" // OK aqui
      },
      body: JSON.stringify({ is_active: true })
    });

    if (!resp.ok) throw new Error(`Status ${resp.status}`);
    alert("Usuário aprovado com sucesso!");
    carregarNotificacoes();
  } catch (err) {
    console.error("Erro ao aprovar:", err);
    alert("Erro ao aprovar usuário.");
  }
}

// ========================================
// 🔥 REJEITAR
// ========================================
async function rejeitarUsuario(id) {
  if (!confirm("Tem certeza que deseja rejeitar este usuário?")) return;

  try {
    const resp = await fetch(`${API_URL_NOTIFICACOES}${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${TOKEN_NOTIFICACOES}` }
    });

    if (!resp.ok) throw new Error(`Status ${resp.status}`);
    alert("Usuário rejeitado e removido!");
    carregarNotificacoes();
  } catch (err) {
    console.error("Erro ao rejeitar:", err);
    alert("Erro ao rejeitar usuário.");
  }
}

// ========================================
// 🔔 EVENTOS DO SINO
// ========================================
bellBtn.addEventListener("click", () => {
  dropdown.classList.toggle("active");
});

document.addEventListener("click", (e) => {
  if (!bellBtn.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.classList.remove("active");
  }
});

// ========================================
// 🔄 AUTO–LOAD
// ========================================
carregarNotificacoes();
setInterval(carregarNotificacoes, 30000);
