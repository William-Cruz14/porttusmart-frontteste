// ==========================================================
// mainMensagens.js
// ==========================================================
document.addEventListener("DOMContentLoaded", () => {
  const content = document.querySelector(".content");

  async function carregarTelaEnviarMensagem() {
    content.innerHTML = telasMoradorMensagens["Enviar Mensagem"];

    const btnEnviar = document.querySelector("#btnEnviarMensagem");
    const feedback = document.querySelector(".feedback-mensagem");

    btnEnviar.addEventListener("click", async () => {
      const titulo = document.querySelector("#mensagemTitulo").value;
      const mensagem = document.querySelector("#mensagemConteudo").value;

      if (!titulo || !mensagem) {
        feedback.style.color = "red";
        feedback.style.display = "block";
        feedback.textContent = "Preencha todos os campos.";
        return;
      }

      try {
        await enviarMensagem({ titulo, mensagem });
        feedback.style.color = "green";
        feedback.style.display = "block";
        feedback.textContent = "Mensagem enviada com sucesso!";
      } catch (err) {
        feedback.style.color = "red";
        feedback.style.display = "block";
        feedback.textContent = "Erro ao enviar mensagem.";
        console.error(err);
      }
    });
  }

  async function carregarTelaHistoricoMensagens() {
    content.innerHTML = telasMoradorMensagens["Histórico de Mensagens"];
    const tbody = document.querySelector(".tabela-historico-mensagens-body");
    const loading = document.querySelector(".loading-mensagens");
    loading.style.display = "block";

    try {
      const mensagens = await listarMensagens();

      tbody.innerHTML = mensagens.length
        ? mensagens.map(m => `
            <tr>
              <td>${m.titulo}</td>
              <td>${m.mensagem}</td>
              <td>${m.bloco}</td>
              <td>${m.apartamento}</td>
            </tr>
          `).join("")
        : `<tr><td colspan="4">Nenhuma mensagem encontrada.</td></tr>`;
    } catch (err) {
      console.error(err);
      tbody.innerHTML = `<tr><td colspan="4">Erro ao carregar mensagens.</td></tr>`;
    } finally {
      loading.style.display = "none";
    }
  }

  // Navegação usando data-tela
  const menu = document.querySelector("#menuMensagens");
  if (menu) {
    menu.addEventListener("click", (e) => {
      if (!e.target.classList.contains("subitem")) return;

      const tela = e.target.dataset.tela; // <-- usa data-tela

      if (tela === "Enviar Mensagem") carregarTelaEnviarMensagem();
      if (tela === "Histórico de Mensagens") carregarTelaHistoricoMensagens();
    });
  }
});
