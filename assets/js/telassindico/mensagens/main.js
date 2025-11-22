// ==========================================================
// mainMensagens.js
// ==========================================================
document.addEventListener("DOMContentLoaded", () => {
  const content = document.querySelector(".content");
  let mensagensTbodyListener = null;

  // ======== Tela Principal (Mensagens Recebidas) ========
  async function carregarCaixaMensagens() {
    content.innerHTML = telasMensagens["Caixa de mensagens"];
    const tbody = content.querySelector("#tabelaMensagensBody");

    const mensagens = await listarMensagens();

    // 🔹 Filtra apenas mensagens com communication_type === "message"
    const mensagensFiltradas = (mensagens || []).filter(
      (m) => m.communication_type === "message"
    );

    tbody.innerHTML = mensagensFiltradas.length
      ? mensagensFiltradas
          .map(
            (m) => `
        <tr>
          <td>${m.title || "-"}</td>
          <td>${m.sender_name || "-"}</td>
          <td>${m.apartment_block || "-"}</td>
          <td>${m.apartment_number || "-"}</td>
          <td>${new Date(m.created_at).toLocaleDateString("pt-BR")}</td>
          <td>
            <button class="btn-visualizar-mensagem" 
                    data-id="${m.id}" 
                    data-title="${m.title || "-"}" 
                    data-message="${m.message || "-"}"
                    data-sender="${m.sender_name || "-"}"
                    data-block="${m.apartment_block || "-"}"
                    data-apartment="${m.apartment_number || "-"}">
              Visualizar
            </button>
            <button class="btn-responder-mensagem" 
                    data-apartamento="${m.apartment_number || ""}" 
                    data-bloco="${m.apartment_block || ""}">
              Responder
            </button>
          </td>
        </tr>
      `
          )
          .join("")
      : `<tr><td colspan="6" style="text-align:center;">Nenhuma mensagem recebida.</td></tr>`;

    attachMensagensTableListener();
  }

  // ======== Eventos da Tabela ========
  function attachMensagensTableListener() {
    const tbody = content.querySelector("#tabelaMensagensBody");
    if (!tbody) return;

    if (mensagensTbodyListener) {
      try {
        tbody.removeEventListener("click", mensagensTbodyListener);
      } catch {}
      mensagensTbodyListener = null;
    }

    mensagensTbodyListener = async function (e) {
      const btnResponder = e.target.closest(".btn-responder-mensagem");
      const btnVisualizar = e.target.closest(".btn-visualizar-mensagem");

      if (btnResponder) {
        e.stopPropagation();
        abrirModalResposta(btnResponder.dataset.apartamento, btnResponder.dataset.bloco);
        return;
      }

      if (btnVisualizar) {
        e.stopPropagation();
        abrirModalVisualizar(btnVisualizar.dataset);
        return;
      }
    };

    tbody.addEventListener("click", mensagensTbodyListener);
  }

  // ======== Modal: Responder ========
  function abrirModalResposta(apartamento, bloco) {
    const modal = document.getElementById("modalResponderMensagem");
    const destinatarioSpan = modal.querySelector("#destinatarioMensagem");
    const btnEnviar = modal.querySelector(".btn-enviar-mensagem");
    const btnFechar = modal.querySelector("#fecharModalMensagem");
    const textarea = modal.querySelector("#campoRespostaMensagem");

    destinatarioSpan.textContent = `Bloco ${bloco || "-"} • Apto ${apartamento || "-"}`;
    modal.style.display = "flex";

    btnFechar.onclick = () => {
      modal.style.display = "none";
      textarea.value = "";
    };

    btnEnviar.onclick = async () => {
      const mensagem = textarea.value.trim();
      if (!mensagem) {
        alert("Digite uma mensagem antes de enviar.");
        return;
      }

      await criarMensagem({
        titulo: "Resposta de comunicação",
        mensagem,
        apartamento,
        bloco,
      });

      modal.style.display = "none";
      textarea.value = "";
      await carregarCaixaMensagens();
    };
  }

  // ======== Modal: Visualizar ========
  function abrirModalVisualizar(data) {
    let modal = document.getElementById("modalVisualizarMensagem");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "modalVisualizarMensagem";
      modal.className = "modal-mensagem";
      modal.innerHTML = `
        <div class="modal-conteudo-mensagem">
          <h2 id="visualizarTitulo"></h2>
          <p class="modal-info-mensagem"><strong>Remetente:</strong> <span id="visualizarRemetente"></span></p>
          <p class="modal-info-mensagem"><strong>Bloco:</strong> <span id="visualizarBloco"></span> • 
          <strong>Apto:</strong> <span id="visualizarApartamento"></span></p>
          <div id="visualizarCorpo" style="margin: 15px 0; background:#f8f8f8; padding:15px; border-radius:6px; white-space:pre-wrap;"></div>
          <div class="modal-botoes-mensagem">
            <button class="btn-cancelar-mensagem" id="fecharModalVisualizar">Fechar</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    modal.querySelector("#visualizarTitulo").textContent = data.title || "Sem título";
    modal.querySelector("#visualizarRemetente").textContent = data.sender || "-";
    modal.querySelector("#visualizarBloco").textContent = data.block || "-";
    modal.querySelector("#visualizarApartamento").textContent = data.apartment || "-";
    modal.querySelector("#visualizarCorpo").textContent = data.message || "-";

    modal.style.display = "flex";

    modal.querySelector("#fecharModalVisualizar").onclick = () => {
      modal.style.display = "none";
    };
  }

  // ======== Menu ========
  const menu = document.querySelector("#menuMensagens");
  if (menu) {
    menu.addEventListener("click", (e) => {
      if (!e.target.classList.contains("subitem")) return;
      const item = e.target.textContent.trim();
      if (item === "Caixa de mensagens") carregarCaixaMensagens();
    });
  }
});
