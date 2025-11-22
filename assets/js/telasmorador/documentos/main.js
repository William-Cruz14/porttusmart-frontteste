// ==========================================================
// mainDocumentosCondominio.js
// ==========================================================
document.addEventListener("DOMContentLoaded", () => {
  const content = document.querySelector(".content");

  // ===== Função para criar a modal de resumo =====
  function criarModalResumo(texto) {
    // Remove modal existente se houver
    const modalExistente = document.querySelector(".modal-resumo");
    if (modalExistente) modalExistente.remove();

    // Cria modal
    const modal = document.createElement("div");
    modal.classList.add("modal-resumo");
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.background = "rgba(0,0,0,0.5)";
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.zIndex = "9999";

    const modalContent = document.createElement("div");
    modalContent.style.background = "#fff";
    modalContent.style.padding = "20px";
    modalContent.style.borderRadius = "8px";
    modalContent.style.maxWidth = "700px";
    modalContent.style.width = "90%";
    modalContent.style.maxHeight = "80%";
    modalContent.style.overflowY = "auto";
    modalContent.innerHTML = `<h3>Resumo do Documento</h3><p>${texto}</p>`;

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Fechar";
    closeBtn.style.marginTop = "15px";
    closeBtn.style.padding = "8px 12px";
    closeBtn.style.background = "#007b57";
    closeBtn.style.color = "#fff";
    closeBtn.style.border = "none";
    closeBtn.style.borderRadius = "5px";
    closeBtn.style.cursor = "pointer";

    closeBtn.addEventListener("click", () => modal.remove());

    modalContent.appendChild(closeBtn);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
  }

  // ===== Carregar Tela de Documentos =====
  async function carregarTelaDocumentos() {
    content.innerHTML = telasMoradorDocumentos["Documentos do condomínio"];
    const tbody = content.querySelector(".documentos-tbody");
    const loading = content.querySelector(".loading-documentos");

    loading.style.display = "block";

    try {
      const docs = await listarDocumentos();

      tbody.innerHTML = docs.length
        ? docs.map(d => `
            <tr>
              <td>${d.titulo}</td>
              <td>${d.descricao}</td>
              <td class="acoes-documentos">
                <button class="btn-baixar-doc" data-file="${d.arquivo}">
                  Baixar
                </button>
                <button class="btn-resumir-doc" data-id="${d.id}">
                  Resumir
                </button>
              </td>
            </tr>
          `).join("")
        : `<tr><td colspan="3">Nenhum documento encontrado.</td></tr>`;

      // ===== Botão de baixar =====
      document.querySelectorAll(".btn-baixar-doc").forEach(btn => {
        btn.addEventListener("click", () => {
          const fileUrl = btn.getAttribute("data-file");
          if (!fileUrl) return;
          window.open(fileUrl, "_blank");
        });
      });

      // ===== Botão de resumir =====
      document.querySelectorAll(".btn-resumir-doc").forEach(btn => {
        btn.addEventListener("click", async () => {
          const docId = btn.getAttribute("data-id");
          if (!docId) return;

          btn.disabled = true;
          btn.textContent = "Gerando resumo...";

          try {
            const token = localStorage.getItem("access_token");
            const res = await fetch(`https://api.porttusmart.tech/api/v1/core/notices/${docId}/summarize/`, {
              headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) throw new Error("Erro ao gerar resumo");

            const data = await res.json();
            criarModalResumo(data.summary);

          } catch (err) {
            console.error("Erro ao gerar resumo:", err);
            alert("Não foi possível gerar o resumo. Tente novamente.");
          } finally {
            btn.disabled = false;
            btn.textContent = "Resumir";
          }
        });
      });

    } catch (err) {
      console.error("Erro ao carregar documentos:", err);
      tbody.innerHTML = `<tr><td colspan="3">Erro ao carregar documentos.</td></tr>`;
    } finally {
      loading.style.display = "none";
    }
  }

  // ===== Navegação do menu =====
  const menu = document.querySelector("#menuDocumentos");
  if (menu) {
    menu.addEventListener("click", (e) => {
      if (!e.target.classList.contains("subitem")) return;
      const item = e.target.textContent.trim();
      if (item === "Documentos do condomínio") carregarTelaDocumentos();
    });
  }
});
