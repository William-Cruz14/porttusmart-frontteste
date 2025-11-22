// ==========================================================
// mainComunicados.js
// ==========================================================
document.addEventListener("DOMContentLoaded", () => {
  const content = document.querySelector(".content");

  async function carregarTelaComunicados() {
    content.innerHTML = telasMoradorComunicados["Meus Comunicados"];
    const tbody = content.querySelector(".tabela-comunicados-body");
    const loading = content.querySelector(".loading-comunicados");

    if (!tbody) return;

    loading.style.display = "block";

    try {
      const comunicados = await listarComunicados();

      tbody.innerHTML = comunicados.length
        ? comunicados.map(c => `
            <tr>
              <td>${c.titulo}</td>
              <td>${c.mensagem}</td>
              <td>${c.bloco}</td>
              <td>${c.apartamento}</td>
            </tr>
          `).join("")
        : `<tr><td colspan="4">Nenhum comunicado encontrado.</td></tr>`;

    } catch (err) {
      console.error("Erro ao carregar comunicados:", err);
      tbody.innerHTML = `<tr><td colspan="4">Erro ao carregar comunicados.</td></tr>`;
    } finally {
      loading.style.display = "none";
    }
  }

  // Menu
  const menu = document.querySelector("#menuComunicados");
  if (menu) {
    menu.addEventListener("click", (e) => {
      if (!e.target.classList.contains("subitem")) return;
      if (e.target.textContent.trim() === "Meus Comunicados") {
        carregarTelaComunicados();
      }
    });
  }
});
