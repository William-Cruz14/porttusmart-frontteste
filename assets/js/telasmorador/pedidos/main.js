// ==========================================================
// mainEntregas.js
// ==========================================================
document.addEventListener("DOMContentLoaded", () => {
  const content = document.querySelector(".content");

  async function carregarTelaEntregas() {
    content.innerHTML = telasMoradorEntregas["Minhas Entregas"];
    const tbody = content.querySelector(".tabela-historico-entregas-body");
    if (!tbody) return;

    const loading = content.querySelector(".loading-entregas");
    loading.style.display = "block";

    try {
      const entregas = await listarEntregas();

      tbody.innerHTML = entregas.length
        ? entregas.map((e, index) => {
            return `
              <tr>
                <td>${e.codigo}</td>
                <td>${e.status}</td>
                <td>${e.bloco}</td>
                <td>${e.apartamento}</td>

                <td>
                  ${
                    e.assinatura
                      ? `<button class="btn-download-assinatura" data-img="${e.assinatura}" data-id="${index}">Baixar</button>`
                      : "-"
                  }
                </td>
              </tr>
            `;
          }).join("")
        : `<tr><td colspan="5">Nenhuma entrega encontrada.</td></tr>`;

      // Ativa os botões de download
      document.querySelectorAll(".btn-download-assinatura").forEach(btn => {
        btn.addEventListener("click", () => {
          const img = btn.getAttribute("data-img");
          baixarImagem(img);
        });
      });

    } catch (err) {
      console.error("Erro ao carregar entregas:", err);
      tbody.innerHTML = `<tr><td colspan="5">Erro ao carregar entregas.</td></tr>`;
    } finally {
      loading.style.display = "none";
    }
  }

    function baixarImagem(base64) {
    window.open(base64, "_blank");
    }


  // Navegação
  const menu = document.querySelector("#menuEntregas");
  if (menu) {
    menu.addEventListener("click", (e) => {
      if (!e.target.classList.contains("subitem")) return;
      const item = e.target.textContent.trim();
      if (item === "Minhas Entregas") carregarTelaEntregas();
    });
  }
});
