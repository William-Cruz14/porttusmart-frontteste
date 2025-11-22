// ------------------------
// mainVeiculos.js
// ------------------------
document.addEventListener("DOMContentLoaded", () => {
  const content = document.querySelector(".content");
  let veiculoEditando = null;
  let veiculosTbodyListener = null;

  // ----- Funções auxiliares -----
  async function getApartamentosDoCondominio() {
    const cond = JSON.parse(localStorage.getItem("condominioSelecionado"));
    if (!cond) return [];

    try {
      const resposta = await listarApartamentos(); // lista todos os apartamentos
      const todos = resposta?.results || [];
      return todos.filter(a => a.condominium === cond.code_condominium);
    } catch (err) {
      console.error("Erro ao carregar apartamentos:", err);
      return [];
    }
  }

  async function carregarBlocos() {
    const apartamentos = await getApartamentosDoCondominio();
    return [...new Set(apartamentos.map(a => a.block))];
  }

  async function carregarApartamentosPorBloco(bloco) {
    const apartamentos = await getApartamentosDoCondominio();
    return apartamentos.filter(a => a.block === bloco);
  }

  // ----- Renderização Cadastro -----
  async function carregarCadastro(veiculo = null) {
    content.innerHTML = telasVeiculos["Cadastro de veículos de moradores"];
    const form = content.querySelector(".form-cadastro-veiculo");
    if (!form) return;

    // Carregar blocos no select
    const selectBloco = document.createElement("select");
    selectBloco.name = "bloco";
    const blocos = await carregarBlocos();
    selectBloco.innerHTML =
      `<option value="">Selecione o bloco</option>` +
      blocos.map(b => `<option value="${b}">${b}</option>`).join("");

    const blocoInput = form.querySelector("input[name=bloco]");
    blocoInput.replaceWith(selectBloco);

    const selectApto = document.createElement("select");
    selectApto.name = "apartamento";
    selectApto.innerHTML = `<option value="">Selecione um apartamento</option>`;
    const aptoInput = form.querySelector("input[name=apartamento]");
    aptoInput.replaceWith(selectApto);

    // Quando muda o bloco, carrega apartamentos
    selectBloco.addEventListener("change", async () => {
      const aptos = await carregarApartamentosPorBloco(selectBloco.value);
      selectApto.innerHTML =
        `<option value="">Selecione um apartamento</option>` +
        aptos.map(a => `<option value="${a.number}">${a.number}</option>`).join("");
    });

    if (veiculo) {
      selectBloco.value = veiculo.owner?.apartment?.block || veiculo.apartment_details?.block || "";
      const aptos = await carregarApartamentosPorBloco(selectBloco.value);
      selectApto.innerHTML =
        `<option value="">Selecione um apartamento</option>` +
        aptos.map(a => `<option value="${a.number}">${a.number}</option>`).join("");
      selectApto.value = veiculo.owner?.apartment?.number || veiculo.apartment_details?.number || "";

      form.placa.value = veiculo.plate || "";
      form.modelo.value = veiculo.model || "";
      form.cor.value = veiculo.color || "";
      form.dataset.id = veiculo.id;

      const btnSalvar = form.querySelector(".btn-salvar-veiculo");
      if (btnSalvar) btnSalvar.textContent = "Atualizar";
    } else {
      const btnSalvar = form.querySelector(".btn-salvar-veiculo");
      if (btnSalvar) btnSalvar.textContent = "Salvar";
      delete form.dataset.id;
    }
  }

  // ----- Renderização Histórico -----
  async function carregarHistorico() {
    content.innerHTML = telasVeiculos["Histórico de veículos"];
    const tbody = content.querySelector(".tabela-historico-veiculo-body");
    if (!tbody) return;

    const veiculos = await listarVeiculos();
    const cond = JSON.parse(localStorage.getItem("condominioSelecionado"));

    // Filtrar por condomínio
    const veiculosFiltrados = veiculos.filter(v =>
      v.condominium?.code_condominium === cond?.code_condominium
    );

    tbody.innerHTML = veiculosFiltrados.length
      ? veiculosFiltrados.map(v => {
          const bloco = v.owner?.apartment?.block || v.apartment_details?.block || "-";
          const apto = v.owner?.apartment?.number || v.apartment_details?.number || "-";

          return `
            <tr>
              <td>${v.plate || "-"}</td>
              <td>${v.model || "-"}</td>
              <td>${v.color || "-"}</td>
              <td>${bloco}</td>
              <td>${apto}</td>
              <td>
                <button class="btn-editar-veiculo" data-id="${v.id}">Editar</button>
                <button class="btn-excluir-veiculo" data-id="${v.id}">Excluir</button>
              </td>
            </tr>
          `;
        }).join("")
      : `<tr><td colspan="6">Nenhum veículo encontrado.</td></tr>`;

    attachVeiculosTableListener();
  }

  // ----- Listener da Tabela -----
  function attachVeiculosTableListener() {
    const tbody = content.querySelector(".tabela-historico-veiculo-body");
    if (!tbody) return;

    if (veiculosTbodyListener) {
      try { tbody.removeEventListener("click", veiculosTbodyListener); } catch {}
      veiculosTbodyListener = null;
    }

    veiculosTbodyListener = async function (e) {
      const btnExcluir = e.target.closest(".btn-excluir-veiculo");
      if (btnExcluir && tbody.contains(btnExcluir)) {
        e.stopPropagation();
        const id = btnExcluir.dataset.id;
        if (!id) return;
        if (confirm("Deseja excluir este veículo?")) {
          try { await deletarVeiculo(id); } catch (err) { console.error(err); }
          finally { await carregarHistorico(); }
        }
        return;
      }

      const btnEditar = e.target.closest(".btn-editar-veiculo");
      if (btnEditar && tbody.contains(btnEditar)) {
        e.stopPropagation();
        const id = btnEditar.dataset.id;
        if (!id) return;
        const veiculos = await listarVeiculos();
        const veiculo = veiculos.find(v => String(v.id) === String(id));
        if (veiculo) {
          veiculoEditando = id;
          await carregarCadastro(veiculo);
        }
        return;
      }
    };

    tbody.addEventListener("click", veiculosTbodyListener);
  }

  // ----- Submissão do Formulário -----
  content.addEventListener("submit", async (e) => {
    const form = e.target;
    if (!form.classList.contains("form-cadastro-veiculo")) return;
    e.preventDefault();

    const dados = {
      placa: form.placa?.value.trim() || "",
      modelo: form.modelo?.value.trim() || "",
      cor: form.cor?.value.trim() || "",
      bloco: form.bloco?.value.trim() || "",
      apartamento: form.apartamento?.value.trim() || "",
    };

    try {
      if (veiculoEditando) {
        await atualizarVeiculo(veiculoEditando, dados);
        veiculoEditando = null;
      } else {
        await criarVeiculo(dados);
      }
    } catch (err) { console.error(err); }
    form.reset();
  });

  // ----- Menu -----
  const menu = document.querySelector("#menuVeiculos");
  if (menu) {
    menu.addEventListener("click", (e) => {
      if (!e.target.classList.contains("subitem")) return;
      const item = e.target.textContent.trim();

      if (item === "Cadastro de veículos de moradores") {
        veiculoEditando = null;
        carregarCadastro();
      }
      if (item === "Histórico de veículos") carregarHistorico();
    });
  }
});
