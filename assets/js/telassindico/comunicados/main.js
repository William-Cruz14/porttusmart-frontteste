// ==========================================================
// mainComunicados.js
// ==========================================================
document.addEventListener("DOMContentLoaded", () => {
  const content = document.querySelector(".content");
  let comunicadosTbodyListener = null;

  // ------------------------------------------------------
  // Carregar todos os apartamentos e filtrar pelo condomínio
  // ------------------------------------------------------
  async function getApartamentosDoCondominio() {
    const cond = JSON.parse(localStorage.getItem("condominioSelecionado"));
    if (!cond) return [];

    try {
      const resposta = await listarApartamentos(); // → retorna count, next, results
      const todos = resposta?.results || [];

      // Filtrar pelo condomínio selecionado
      return todos.filter(
        a => a.condominium_detail?.code_condominium === cond.code_condominium
      );
    } catch (err) {
      console.error("Erro ao carregar apartamentos:", err);
      return [];
    }
  }

  // ------------------------------------------------------
  // Carregar blocos válidos
  // ------------------------------------------------------
  async function carregarBlocos() {
    const apartamentos = await getApartamentosDoCondominio();
    const blocos = [...new Set(apartamentos.map(a => a.block))].sort();
    return blocos;
  }

  // ------------------------------------------------------
  // Carregar apartamentos por bloco
  // ------------------------------------------------------
  async function carregarApartamentos(bloco) {
    const apartamentos = await getApartamentosDoCondominio();
    return apartamentos.filter(a => a.block === bloco);
  }

  // ------------------------------------------------------
  // Preencher selects de bloco / apartamento
  // ------------------------------------------------------
  async function prepararSelectsComunicado(form) {
    const selectBloco = form.querySelector("#selectBlocoComunicado");
    const selectApto = form.querySelector("#selectApartamentoComunicado");

    if (!selectBloco || !selectApto) return;

    const blocos = await carregarBlocos();

    selectBloco.innerHTML =
      `<option value="">Selecione o bloco</option>` +
      blocos.map(b => `<option value="${b}">${b}</option>`).join("");

    selectApto.innerHTML = `<option value="">Selecione um apartamento</option>`;
    selectApto.disabled = true;

    // --- Quando muda o bloco
    selectBloco.addEventListener("change", async () => {
      const blocoSel = selectBloco.value;

      if (!blocoSel) {
        selectApto.innerHTML = `<option value="">Selecione um apartamento</option>`;
        selectApto.disabled = true;
        return;
      }

      const aptos = await carregarApartamentos(blocoSel);

      selectApto.innerHTML =
        `<option value="">Selecione um apartamento</option>` +
        aptos.map(a => `<option value="${a.number}">${a.number}</option>`).join("");

      selectApto.disabled = false;
    });
  }

  // ------------------------------------------------------
  // Renderizar Formulário de Novo Comunicado
  // ------------------------------------------------------
  async function carregarCadastroComunicados() {
    content.innerHTML = telasComunicados["Novo comunicado"];

    const form = content.querySelector(".form-cadastro-comunicados");
    if (!form) return;

    await prepararSelectsComunicado(form);

    form.addEventListener("submit", async e => {
      e.preventDefault();

      const dados = {
        titulo: form.titulo.value.trim(),
        mensagem: form.mensagem.value.trim(),
        bloco: form.bloco.value.trim() || form.querySelector("#selectBlocoComunicado").value,
        apartamento: form.apartamento.value.trim() || form.querySelector("#selectApartamentoComunicado").value,
        communication_type: "notice"
      };

      await criarComunicado(dados);

      form.reset();
      await prepararSelectsComunicado(form);
    });
  }

  // ------------------------------------------------------
  // Renderizar Histórico de Comunicados
  // ------------------------------------------------------
  async function carregarHistoricoComunicados() {
    content.innerHTML = telasComunicados["Histórico de comunicados"];
    const tbody = content.querySelector("#tabelaComunicadosBody");
    const loading = content.querySelector("#loadingComunicados");
    if (!tbody) return;

    loading.style.display = "block";

    try {
      const comunicados = await listarComunicados();
      const cond = JSON.parse(localStorage.getItem("condominioSelecionado"));

      const filtrados = (comunicados || []).filter(c => {
        const code =
          c.recipients?.[0]?.apartment?.condominium_detail?.code_condominium;
        return code === cond.code_condominium;
      });

      if (!filtrados.length) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Nenhum comunicado encontrado.</td></tr>`;
        return;
      }

      tbody.innerHTML = filtrados
        .map(c => {
          const bloco = c.recipients?.[0]?.apartment?.block || "-";
          const apartamento = c.recipients?.[0]?.apartment?.number || "-";
          return `
            <tr>
              <td>${c.title || "-"}</td>
              <td>${c.message || "-"}</td>
              <td>${bloco}</td>
              <td>${apartamento}</td>
              <td>
                <button class="btn-excluir-comunicados" data-id="${c.id || ""}">Excluir</button>
              </td>
            </tr>
          `;
        })
        .join("");
    } catch (err) {
      console.error("Erro ao carregar comunicados:", err);
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:red;">Erro ao carregar comunicados.</td></tr>`;
    } finally {
      loading.style.display = "none";
      attachComunicadosTableListener();
    }
  }

  // ------------------------------------------------------
  // Listener de ações da tabela de comunicados
  // ------------------------------------------------------
  function attachComunicadosTableListener() {
    const tbody = content.querySelector("#tabelaComunicadosBody");
    if (!tbody) return;

    if (comunicadosTbodyListener) {
      tbody.removeEventListener("click", comunicadosTbodyListener);
      comunicadosTbodyListener = null;
    }

    comunicadosTbodyListener = async e => {
      const btnExcluir = e.target.closest(".btn-excluir-comunicados");
      if (btnExcluir) {
        const id = btnExcluir.dataset.id;
        if (confirm("Deseja excluir este comunicado?")) {
          await deletarComunicado(id);
          await carregarHistoricoComunicados();
        }
      }
    };

    tbody.addEventListener("click", comunicadosTbodyListener);
  }

  // ------------------------------------------------------
  // Cadastro de Documentos
  // ------------------------------------------------------
  async function carregarCadastroDocumentos() {
    content.innerHTML = telasComunicados["Cadastro de documentos"];
    const form = content.querySelector(".form-cadastro-documento-comunicados");
    if (!form) return;

    form.addEventListener("submit", async e => {
      e.preventDefault();
      const formData = new FormData(form);
      const result = await criarDocumento(formData);
      if (result) await carregarDocumentosCondominio();
    });
  }

  // ------------------------------------------------------
  // Documentos do condomínio
  // ------------------------------------------------------
  async function carregarDocumentosCondominio() {
    content.innerHTML = telasComunicados["Documentos do condomínio"];
    const tbody = content.querySelector("#tabelaDocumentosComunicadosBody");
    const loading = content.querySelector("#loadingDocumentosComunicados");
    if (!tbody) return;

    loading.style.display = "block";

    try {
      const documentos = await listarDocumentos();
      if (!Array.isArray(documentos) || documentos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Nenhum documento encontrado.</td></tr>`;
        return;
      }

      tbody.innerHTML = documentos
        .map(d => {
          const data = d.created_at ? new Date(d.created_at).toLocaleDateString() : "-";
          return `
            <tr>
              <td>${d.title || "-"}</td>
              <td>${d.content || "-"}</td>
              <td>${d.file_complement ? `<a href="${d.file_complement}" target="_blank">📎 Baixar</a>` : "-"}</td>
              <td>${data}</td>
              <td>
                <button class="btn-excluir-documento" data-id="${d.id || ""}">Excluir</button>
              </td>
            </tr>
          `;
        })
        .join("");
    } catch {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:red;">Erro ao carregar documentos.</td></tr>`;
    } finally {
      loading.style.display = "none";
      attachDocumentosTableListener();
    }
  }

  function attachDocumentosTableListener() {
    const tbody = content.querySelector("#tabelaDocumentosComunicadosBody");
    if (!tbody) return;

    tbody.removeEventListener("click", documentosTbodyListener);
    documentosTbodyListener = async e => {
      const btnExcluir = e.target.closest(".btn-excluir-documento");
      if (btnExcluir) {
        const id = btnExcluir.dataset.id;
        if (confirm("Deseja excluir este documento?")) {
          await deletarDocumento(id);
          await carregarDocumentosCondominio();
        }
      }
    };
    tbody.addEventListener("click", documentosTbodyListener);
  }

  // ------------------------------------------------------
  // Navegação pelo Menu
  // ------------------------------------------------------
  const menu = document.querySelector("#menuComunicados");
  if (menu) {
    menu.addEventListener("click", e => {
      if (!e.target.classList.contains("subitem")) return;

      const item = e.target.textContent.trim();

      if (item === "Novo comunicado") carregarCadastroComunicados();
      if (item === "Histórico de comunicados") carregarHistoricoComunicados();
      if (item === "Cadastro de documentos") carregarCadastroDocumentos();
      if (item === "Documentos do condomínio") carregarDocumentosCondominio();
    });
  }
});
