// ==========================================================
// mainVeiculos.js
// ==========================================================
document.addEventListener("DOMContentLoaded", () => {
  const content = document.querySelector(".content");

  async function carregarTelaVeiculos() {
    content.innerHTML = telasMoradorVeiculos["Meus Veículos"];
    const tbody = content.querySelector(".tabela-historico-veiculos-body");
    if (!tbody) return;

    const loading = content.querySelector(".loading-veiculos");
    loading.style.display = "block";

    try {
      const veiculos = await listarVeiculos();

      tbody.innerHTML = veiculos.length
        ? veiculos.map((v) => {
            const bloco = v.owner?.apartment?.block || "-";
            const apartamento = v.owner?.apartment?.number || "-";

            return `
              <tr>
                <td>${v.plate || "-"}</td>
                <td>${v.model || "-"}</td>
                <td>${v.color || "-"}</td>
                <td>${bloco}</td>
                <td>${apartamento}</td>
              </tr>
            `;
          }).join("")
        : `<tr><td colspan="5">Nenhum veículo encontrado.</td></tr>`;

    } catch (err) {
      console.error("Erro ao carregar veículos:", err);
      tbody.innerHTML = `<tr><td colspan="5">Erro ao carregar veículos.</td></tr>`;
    } finally {
      loading.style.display = "none";
    }
  }

  // Navegação do menu
  const menu = document.querySelector("#menuVeiculos");
  if (menu) {
    menu.addEventListener("click", (e) => {
      if (!e.target.classList.contains("subitem")) return;
      const item = e.target.textContent.trim();
      if (item === "Meus Veículos") carregarTelaVeiculos();
    });
  }
});
