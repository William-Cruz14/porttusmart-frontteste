// ==========================================================
// ===== MAIN OCORRÊNCIAS =====
// ==========================================================
document.addEventListener("DOMContentLoaded", () => {
  const content = document.querySelector(".content");
  let ocorrenciasTbodyListener = null;

  // ===== Funções Bloco/Apartamento Dinâmicos =====
  async function getApartamentosDoCondominio() {
    const cond = JSON.parse(localStorage.getItem("condominioSelecionado"));
    if (!cond) return [];

    try {
      const resposta = await listarApartamentos(); // função da API
      const todos = resposta?.results || [];
      return todos.filter(a => a.condominium === cond.code_condominium);
    } catch (err) {
      console.error("Erro ao carregar apartamentos:", err);
      return [];
    }
  }

  async function carregarBlocosOcorrencia() {
    const apartamentos = await getApartamentosDoCondominio();
    return [...new Set(apartamentos.map(a => a.block))];
  }

  async function carregarApartamentosOcorrencia(bloco) {
    const apartamentos = await getApartamentosDoCondominio();
    return apartamentos.filter(a => a.block === bloco);
  }

  async function prepararSelectsOcorrencia(form) {
    const selectBloco = form.querySelector("#selectBlocoOcorrencia");
    const selectApto = form.querySelector("#selectAptoOcorrencia");
    if (!selectBloco || !selectApto) return;

    const blocos = await carregarBlocosOcorrencia();
    selectBloco.innerHTML =
      `<option value="">Selecione o bloco</option>` +
      blocos.map(b => `<option value="${b}">${b}</option>`).join("");

    selectApto.innerHTML = `<option value="">Selecione o apartamento</option>`;
    selectApto.disabled = true;

    selectBloco.addEventListener("change", async () => {
      const blocoSel = selectBloco.value;
      if (!blocoSel) {
        selectApto.innerHTML = `<option value="">Selecione o apartamento</option>`;
        selectApto.disabled = true;
        return;
      }

      const aptos = await carregarApartamentosOcorrencia(blocoSel);
      selectApto.innerHTML =
        `<option value="">Selecione o apartamento</option>` +
        aptos.map(a => `<option value="${a.number}">${a.number}</option>`).join("");
      selectApto.disabled = false;
    });
  }

  // ======== Tela de Cadastro ========
  async function carregarCadastro(ocorrencia = null) {
    content.innerHTML = telasOcorrencias["Registrar ocorrência"];
    const form = content.querySelector(".form-cadastro-ocorrencia");
    if (!form) return;

    // Prepara selects dinâmicos
    await prepararSelectsOcorrencia(form);

    if (ocorrencia) {
      const bloco =
        ocorrencia.apartment_block ||
        ocorrencia.reported_by?.apartment?.block ||
        "";
      const apto =
        ocorrencia.apartment_number ||
        ocorrencia.reported_by?.apartment?.number ||
        "";

      form.titulo.value = ocorrencia.title || "";
      form.descricao.value = ocorrencia.description || "";
      form.status.value = ocorrencia.status || "aberta";
      form.bloco.value = bloco;
      form.apartamento.value = apto;
      form.dataset.id = ocorrencia.id;
    } else {
      form.reset();
      form.removeAttribute("data-id");
    }
  }

  // ======== Tela de Histórico ========
  async function carregarHistorico() {
    content.innerHTML = telasOcorrencias["Histórico de ocorrências"];
    const tbody = content.querySelector("#tabelaOcorrenciasBody");
    if (!tbody) return;

    const selectBloco = content.querySelector("#filtroBlocoOcorrencia");
    const selectApto = content.querySelector("#filtroApartamentoOcorrencia");

    if (selectBloco && selectApto) {
      const blocos = await carregarBlocosOcorrencia();
      selectBloco.innerHTML =
        `<option value="">Filtrar por bloco</option>` +
        blocos.map(b => `<option value="${b}">${b}</option>`).join("");

      selectBloco.addEventListener("change", async () => {
        const blocoSel = selectBloco.value;
        const aptos = await carregarApartamentosOcorrencia(blocoSel);
        selectApto.innerHTML =
          `<option value="">Filtrar por apartamento</option>` +
          aptos.map(a => `<option value="${a.number}">${a.number}</option>`).join("");
        selectApto.disabled = !blocoSel;
      });
      selectApto.disabled = true;
    }

    const ocorrencias = await listarOcorrencias();

    tbody.innerHTML = ocorrencias
      .map((o) => {
        const bloco =
          o.apartment_block || o.reported_by?.apartment?.block || "-";
        const apto =
          o.apartment_number || o.reported_by?.apartment?.number || "-";
        const data = o.date_reported
          ? new Date(o.date_reported).toLocaleDateString("pt-BR")
          : "-";

        return `
          <tr>
            <td>${o.title || "-"}</td>
            <td>${o.status || "-"}</td>
            <td>${bloco}</td>
            <td>${apto}</td>
            <td>${data}</td>
            <td>
              <button class="btn-editar-ocorrencia" data-id="${o.id}">Editar</button>
              <button class="btn-excluir-ocorrencia" data-id="${o.id}">Excluir</button>
            </td>
          </tr>
        `;
      })
      .join("");

    attachOcorrenciasTableListener();
  }

  // ======== Eventos da Tabela ========
  function attachOcorrenciasTableListener() {
    const tbody = content.querySelector("#tabelaOcorrenciasBody");
    if (!tbody) return;

    if (ocorrenciasTbodyListener) {
      try {
        tbody.removeEventListener("click", ocorrenciasTbodyListener);
      } catch {}
      ocorrenciasTbodyListener = null;
    }

    ocorrenciasTbodyListener = async function (e) {
      const btnEditar = e.target.closest(".btn-editar-ocorrencia");
      const btnExcluir = e.target.closest(".btn-excluir-ocorrencia");

      if (btnEditar) {
        e.stopPropagation();
        const id = btnEditar.dataset.id;
        const ocorrencias = await listarOcorrencias();
        const ocorrencia = ocorrencias.find((o) => o.id == id);
        if (ocorrencia) carregarCadastro(ocorrencia);
        return;
      }

      if (btnExcluir) {
        e.stopPropagation();
        const id = btnExcluir.dataset.id;
        if (confirm("Deseja excluir esta ocorrência?")) {
          await deletarOcorrencia(id);
          await carregarHistorico();
        }
        return;
      }
    };

    tbody.addEventListener("click", ocorrenciasTbodyListener);
  }

  // ======== Evento de Envio do Formulário ========
  content.addEventListener("submit", async (e) => {
    if (!e.target.classList.contains("form-cadastro-ocorrencia")) return;
    e.preventDefault();

    const form = e.target;
    const dados = {
      titulo: form.titulo.value.trim(),
      descricao: form.descricao.value.trim(),
      status: form.status.value.trim(),
      bloco: form.bloco.value.trim(),
      apartamento: form.apartamento.value.trim()
    };

    try {
      if (form.dataset.id) {
        await atualizarOcorrencia(form.dataset.id, dados);
        alert("Ocorrência atualizada com sucesso!");
      } else {
        await criarOcorrencia(dados);
        alert("Ocorrência cadastrada com sucesso!");
      }

      form.reset();
    } catch (err) {
      console.error("Erro ao salvar ocorrência:", err);
      alert("Não foi possível salvar a ocorrência. Verifique e tente novamente.");
    }
  });

  // ======== Navegação do Menu ========
  const menu = document.querySelector("#menuOcorrencias");
  if (menu) {
    menu.addEventListener("click", (e) => {
      if (!e.target.classList.contains("subitem")) return;
      const item = e.target.textContent.trim();

      if (item === "Registrar ocorrência") carregarCadastro();
      if (item === "Histórico de ocorrências") carregarHistorico();
    });
  }
});
