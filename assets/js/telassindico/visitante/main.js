// ------------------------
// mainVisitante.js
// ------------------------
document.addEventListener("DOMContentLoaded", () => {
  const content = document.querySelector(".content");
  let visitantesTbodyListener = null;

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
    const blocos = [...new Set(apartamentos.map(a => a.block))];
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
  async function prepararSelectsVisitante(form) {
    const selectBloco = form.querySelector("#selectBlocoVisitante");
    const selectApto = form.querySelector("#selectAptoVisitante");

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
  // Renderizar Formulário de Cadastro
  // ------------------------------------------------------
  async function carregarCadastro(visitante = null) {
    content.innerHTML = telasVisitantes["Cadastro de visitantes"];

    const form = content.querySelector(".form-cadastro-visitante");
    if (!form) return;

    // Prepara selects
    await prepararSelectsVisitante(form);

    if (visitante) {
      form.nome.value = visitante.visitor?.name || "";
      form.cpf.value = visitante.visitor?.cpf || "";
      form.bloco.value = visitante.apartment?.block || "";

      // se o bloco existe, carrega aptos imediatamente
      if (visitante.apartment?.block) {
        const aptos = await carregarApartamentos(visitante.apartment.block);

        const selectApto = form.querySelector("#selectAptoVisitante");
        selectApto.innerHTML =
          `<option value="">Selecione um apartamento</option>` +
          aptos
            .map(a => `<option value="${a.number}">${a.number}</option>`)
            .join("");

        selectApto.disabled = false;
        form.apartamento.value = visitante.apartment?.number || "";
      }

      form.dataset.id = visitante.id;
    } else {
      form.reset();
      form.removeAttribute("data-id");
    }
  }

  // ------------------------------------------------------
  // Renderizar Histórico
  // ------------------------------------------------------
  async function carregarHistorico() {
    content.innerHTML = telasVisitantes["Controle de entradas e saídas"];
    const tbody = content.querySelector("#visitantesTableBody");
    if (!tbody) return;

    try {
      const visitantes = await listarVisitantes();
      const cond = JSON.parse(localStorage.getItem("condominioSelecionado"));

      const filtrados = (visitantes || []).filter(v => {
        const code =
          v.visitor?.condominium?.code_condominium ||
          v.apartment?.condominium_detail?.code_condominium;
        return code === cond.code_condominium;
      });

      if (!filtrados.length) {
        tbody.innerHTML = `<tr><td colspan="5">Nenhum visitante encontrado.</td></tr>`;
        return;
      }

      tbody.innerHTML = filtrados
        .map(
          v => `
            <tr>
              <td>${v.visitor?.name || "-"}</td>
              <td>${v.apartment?.block || "-"}</td>
              <td>${v.apartment?.number || "-"}</td>
              <td>${v.visitor?.cpf || "-"}</td>
              <td>
                <button class="btn-editar-visitante" data-id="${v.id}">Editar</button>
                <button class="btn-excluir-visitante" data-id="${v.id}">Excluir</button>
              </td>
            </tr>
          `
        )
        .join("");

      attachVisitantesTableListener();
    } catch (err) {
      console.error("Erro ao carregar histórico:", err);
      alert("Erro ao carregar visitantes.");
    }
  }

  // ------------------------------------------------------
  // Listener de Ações da Tabela
  // ------------------------------------------------------
  function attachVisitantesTableListener() {
    const tbody = content.querySelector("#visitantesTableBody");
    if (!tbody) return;

    if (visitantesTbodyListener) {
      tbody.removeEventListener("click", visitantesTbodyListener);
      visitantesTbodyListener = null;
    }

    visitantesTbodyListener = async e => {
      const btnEditar = e.target.closest(".btn-editar-visitante");
      const btnExcluir = e.target.closest(".btn-excluir-visitante");

      if (btnEditar) {
        const id = btnEditar.dataset.id;
        const lista = await listarVisitantes();
        const visitante = lista.find(v => v.id == id);
        if (visitante) carregarCadastro(visitante);
        return;
      }

      if (btnExcluir) {
        const id = btnExcluir.dataset.id;
        if (confirm("Deseja excluir este visitante?")) {
          await deletarVisitante(id);
          await carregarHistorico();
        }
      }
    };

    tbody.addEventListener("click", visitantesTbodyListener);
  }

  // ------------------------------------------------------
  // Envio do Formulário
  // ------------------------------------------------------
  content.addEventListener("submit", async e => {
    if (!e.target.classList.contains("form-cadastro-visitante")) return;
    e.preventDefault();

    const form = e.target;
    const dados = {
      nome: form.nome.value.trim(),
      cpf: form.cpf.value.trim(),
      bloco: form.bloco.value.trim(),
      apartamento: form.apartamento.value.trim(),
    };

    try {
      let sucesso = false;

      if (form.dataset.id) {
        sucesso = await atualizarVisitante(form.dataset.id, dados);
      } else {
        const criado = await criarVisitante(dados);
        sucesso = !!criado;
      }

      form.reset();
    } catch (err) {
      console.error("Erro ao salvar visitante:", err);
      alert("Erro ao salvar visitante.");
    }
  });

  // ------------------------------------------------------
  // Navegação pelo Menu
  // ------------------------------------------------------
  const menu = document.querySelector("#menuVisitantes");
  if (menu) {
    menu.addEventListener("click", e => {
      if (!e.target.classList.contains("subitem")) return;

      const item = e.target.textContent.trim();

      if (item === "Cadastro de visitantes") carregarCadastro();
      if (item === "Controle de entradas e saídas") carregarHistorico();
    });
  }
});
