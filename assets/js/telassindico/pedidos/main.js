// =============================
// ===== MAIN ENTREGAS =====
// =============================
document.addEventListener("DOMContentLoaded", () => {
  const content = document.querySelector(".content");
  let entregasTbodyListener = null;

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

  async function carregarBlocosEntrega() {
    const apartamentos = await getApartamentosDoCondominio();
    return [...new Set(apartamentos.map(a => a.block))];
  }

  async function carregarApartamentosEntrega(bloco) {
    const apartamentos = await getApartamentosDoCondominio();
    return apartamentos.filter(a => a.block === bloco);
  }

  async function prepararSelectsEntrega(form) {
    const selectBloco = form.querySelector("#selectBlocoEntrega");
    const selectApto = form.querySelector("#selectAptoEntrega");
    if (!selectBloco || !selectApto) return;

    const blocos = await carregarBlocosEntrega();
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
      const aptos = await carregarApartamentosEntrega(blocoSel);
      selectApto.innerHTML =
        `<option value="">Selecione o apartamento</option>` +
        aptos.map(a => `<option value="${a.number}">${a.number}</option>`).join("");
      selectApto.disabled = false;
    });
  }

  // ===== CADASTRO ENTREGA =====
  async function carregarCadastro(entrega = null) {
    content.innerHTML = telasEntregas["Cadastro de entregas"];
    const form = content.querySelector(".form-cadastro-entrega");
    if (!form) return;
    await prepararSelectsEntrega(form);

    if (entrega) {
      form.codigo.value = entrega.order_code || "";
      form.bloco.value = entrega.apartment_block || "";
      form.apartamento.value = entrega.apartment_number || "";
      form.dataset.id = entrega.id;
    } else {
      form.reset();
      form.removeAttribute("data-id");
    }
  }

  // ===== HISTÓRICO ENTREGA COM FILTROS =====
  async function carregarHistorico() {
    content.innerHTML = telasEntregas["Histórico de entregas"];
    const tbody = content.querySelector("#tabelaEntregasBody");
    if (!tbody) return;

    const selectBloco = content.querySelector("#filtroBlocoEntrega");
    const selectApto = content.querySelector("#filtroApartamentoEntrega");
    const btnBuscar = content.querySelector("#btnBuscarEntrega");
    const btnLimpar = content.querySelector("#btnLimparEntrega");

    let todasEntregas = await listarEntregas();

    todasEntregas.sort((a, b) => {
      if ((a.owner?.apartment?.block || "") < (b.owner?.apartment?.block || "")) return -1;
      if ((a.owner?.apartment?.block || "") > (b.owner?.apartment?.block || "")) return 1;
      return (a.owner?.apartment?.number || 0) - (b.owner?.apartment?.number || 0);
    });

    // Preenche select de blocos
    const blocos = [...new Set(todasEntregas.map(e => e.owner?.apartment?.block).filter(Boolean))];
    selectBloco.innerHTML = `<option value="">Filtrar por bloco</option>` +
                            blocos.map(b => `<option value="${b}">${b}</option>`).join("");
    selectBloco.addEventListener("change", () => {
      const blocoSel = selectBloco.value;
      const aptos = todasEntregas
        .filter(e => !blocoSel || e.owner?.apartment?.block === blocoSel)
        .map(e => e.owner?.apartment?.number)
        .filter(Boolean);
      const aptosUnicos = [...new Set(aptos)];
      selectApto.innerHTML = `<option value="">Filtrar por apartamento</option>` +
                             aptosUnicos.map(a => `<option value="${a}">${a}</option>`).join("");
      selectApto.disabled = !aptosUnicos.length;
    });

    function preencherTabela(entregas) {
      tbody.innerHTML = entregas.length
        ? entregas.map((e) => {
            const bloco = e.owner?.apartment?.block ?? "-";
            const apartamento = e.owner?.apartment?.number ?? "-";
            return `
              <tr>
                <td>${e.order_code || "-"}</td>
                <td>${e.status || "-"}</td>
                <td>${bloco}</td>
                <td>${apartamento}</td>
                <td>
                  <button class="btn-excluir-entrega" data-id="${e.id}">Excluir</button>
                </td>
              </tr>`;
          }).join("")
        : `<tr><td colspan="5" style="text-align:center;">Nenhuma entrega encontrada</td></tr>`;
    }

    // Botões Buscar e Limpar
    btnBuscar.addEventListener("click", () => {
      const blocoSel = selectBloco.value;
      const aptoSel = selectApto.value;
      const filtradas = todasEntregas.filter(e => {
        const bloco = e.owner?.apartment?.block;
        const apto = e.owner?.apartment?.number;
        return (!blocoSel || bloco === blocoSel) && (!aptoSel || apto == aptoSel);
      });
      preencherTabela(filtradas);
    });

    btnLimpar.addEventListener("click", () => {
      selectBloco.value = "";
      selectApto.value = "";
      selectApto.disabled = true;
      preencherTabela(todasEntregas);
    });

    preencherTabela(todasEntregas);
    attachEntregasTableListener();
  }

  // ===== LISTENER DA TABELA =====
  function attachEntregasTableListener() {
    const tbody = content.querySelector("#tabelaEntregasBody");
    if (!tbody) return;

    if (entregasTbodyListener) {
      try { tbody.removeEventListener("click", entregasTbodyListener); } catch {}
      entregasTbodyListener = null;
    }

    entregasTbodyListener = async function (e) {
      const btnExcluir = e.target.closest(".btn-excluir-entrega");
      if (btnExcluir && tbody.contains(btnExcluir)) {
        e.stopPropagation();
        const id = btnExcluir.dataset.id;
        if (!id) return;

        if (confirm("Deseja excluir esta entrega?")) {
          try {
            await deletarEntrega(id);
            await carregarHistorico();
          } catch (err) {
            console.error(err);
            alert("Não foi possível excluir a entrega. Tente novamente.");
          }
        }
      }
    };

    tbody.addEventListener("click", entregasTbodyListener);
  }

  // ===== SUBMISSÃO DO FORMULÁRIO =====
  content.addEventListener("submit", async (e) => {
    if (!e.target.classList.contains("form-cadastro-entrega")) return;
    e.preventDefault();

    const form = e.target;
    const file = form.assinatura?.files?.[0] || null;

    const dados = {
      codigo: form.codigo?.value.trim() || "",
      bloco: form.bloco?.value.trim() || "",
      apartamento: form.apartamento?.value.trim() || "",
      assinatura: file
    };

    try {
      if (form.dataset.id) {
        alert("Atualização ainda não implementada");
      } else {
        await criarEntrega(dados);
      }
      form.reset();
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar entrega. Verifique e tente novamente.");
    }
  });

  // ===== NAVEGAÇÃO PELO MENU =====
  const menu = document.querySelector("#menuEntregas");
  if (menu) {
    menu.addEventListener("click", (e) => {
      if (!e.target.classList.contains("subitem")) return;
      const item = e.target.textContent.trim();
      if (item === "Cadastro de entregas") carregarCadastro();
      if (item === "Histórico de entregas") carregarHistorico();
    });
  }
});
