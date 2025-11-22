// ==========================================================
// mainFinanceiro.js
// ==========================================================
document.addEventListener("DOMContentLoaded", () => {
  const content = document.querySelector(".content");
  let lancamentosTbodyListener = null;

  // ======== Carregar Cadastro ========
  async function carregarCadastro(lancamento = null) {
    content.innerHTML = telasFinanceiro["Cadastro de lançamentos"];
    const form = content.querySelector(".form-cadastro-lancamento");
    if (!form) return;

    if (lancamento) {
      form.descricao.value = lancamento.description || "";
      form.valor.value = lancamento.value || "";
      form.dataset.id = lancamento.id;
    } else {
      form.reset();
      form.removeAttribute("data-id");
    }
  }

  // ======== Carregar Histórico ========
  async function carregarHistorico() {
    content.innerHTML = telasFinanceiro["Histórico de lançamentos"];
    const tbody = content.querySelector("#tabelaLancamentosBody");
    const loading = content.querySelector("#loadingHistoricoFinanceiro");
    loading.style.display = "block";

    const lancamentos = await listarLancamentosFinanceiros();

    tbody.innerHTML = lancamentos.length
      ? lancamentos.map(l => `
          <tr>
            <td>${l.description || "-"}</td>
            <td>${l.value?.toFixed(2) || "-"}</td>
            <td>${l.document ? `<a href="${l.document}" target="_blank">Arquivo</a>` : "-"}</td>
            <td>
              <button class="btn-editar-lancamento" data-id="${l.id}">Editar</button>
              <button class="btn-excluir-lancamento" data-id="${l.id}">Excluir</button>
            </td>
          </tr>
        `).join("")
      : `<tr><td colspan="4">Nenhum lançamento encontrado.</td></tr>`;

    attachLancamentosTableListener();
    loading.style.display = "none";
  }

  // ======== Eventos Tabela ========
  function attachLancamentosTableListener() {
    const tbody = content.querySelector("#tabelaLancamentosBody");
    if (!tbody) return;

    if (lancamentosTbodyListener) {
      try { tbody.removeEventListener("click", lancamentosTbodyListener); } catch {}
      lancamentosTbodyListener = null;
    }

    lancamentosTbodyListener = async function(e) {
      const btnEditar = e.target.closest(".btn-editar-lancamento");
      const btnExcluir = e.target.closest(".btn-excluir-lancamento");

      if (btnEditar) {
        e.stopPropagation();
        const id = btnEditar.dataset.id;
        const lancamentos = await listarLancamentosFinanceiros();
        const lancamento = lancamentos.find(l => l.id == id);
        if (lancamento) carregarCadastro(lancamento);
        return;
      }

      if (btnExcluir) {
        e.stopPropagation();
        const id = btnExcluir.dataset.id;
        if (confirm("Deseja excluir este lançamento?")) {
          await deletarLancamentoFinanceiro(id);
          await carregarHistorico();
        }
      }
    };

    tbody.addEventListener("click", lancamentosTbodyListener);
  }

  // ======== Envio Formulário ========
  content.addEventListener("submit", async (e) => {
    if (!e.target.classList.contains("form-cadastro-lancamento")) return;
    e.preventDefault();

    const form = e.target;
    const arquivo = form.documento.files[0] || null;

    const dados = {
      descricao: form.descricao.value.trim(),
      valor: form.valor.value.trim(),
      documento: arquivo
    };

    try {
      if (form.dataset.id) {
        await atualizarLancamentoFinanceiro(form.dataset.id, dados);
      } else {
        await criarLancamentoFinanceiro(dados);
      }

      form.reset();
      form.removeAttribute("data-id");

    } catch (err) {
      console.error("Erro ao salvar lançamento:", err);
      alert("Não foi possível salvar o lançamento. Verifique os dados e tente novamente.");
    }
  });

  // ======== Navegação Menu ========
  const menu = document.querySelector("#menuFinanceiro");
  if (menu) {
    menu.addEventListener("click", async (e) => {
      if (!e.target.classList.contains("subitem")) return;
      const item = e.target.textContent.trim();

      if (item === "Cadastro de lançamentos") await carregarCadastro();
      if (item === "Histórico de lançamentos") await carregarHistorico();
    });
  }
});
