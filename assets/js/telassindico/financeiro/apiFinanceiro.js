// ==========================================================
// apiFinanceiro.js (com suporte a arquivo)
// ==========================================================
const API_URL_FINANCEIRO = "https://api.porttusmart.tech/api/v1/core/finances/";

// Criar lançamento financeiro
async function criarLancamentoFinanceiro(dados) {
  const token = localStorage.getItem("access_token");
  const condominio = JSON.parse(localStorage.getItem("condominioSelecionado"));

  if (!condominio?.code_condominium) {
    alert("Selecione um condomínio antes de cadastrar o lançamento.");
    throw new Error("Condomínio não selecionado.");
  }

  const formData = new FormData();
  formData.append("value", dados.valor);
  formData.append("description", dados.descricao);
  if (dados.documento) formData.append("document", dados.documento);
  formData.append("code_condominium", condominio.code_condominium);

  try {
    const res = await fetch(API_URL_FINANCEIRO, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}` // não definir Content-Type, o fetch define automaticamente para multipart/form-data
      },
      body: formData
    });

    if (!res.ok) throw new Error(await res.text());
    alert("Lançamento financeiro cadastrado com sucesso!");
    return await res.json();
  } catch (err) {
    alert("Erro ao cadastrar lançamento: " + err.message);
    console.error(err);
    throw err;
  }
}

// Atualizar lançamento financeiro
async function atualizarLancamentoFinanceiro(id, dados) {
  const token = localStorage.getItem("access_token");
  const condominio = JSON.parse(localStorage.getItem("condominioSelecionado"));

  const formData = new FormData();
  formData.append("value", dados.valor);
  formData.append("description", dados.descricao);
  if (dados.documento) formData.append("document", dados.documento);
  formData.append("code_condominium", condominio.code_condominium);

  try {
    const res = await fetch(`${API_URL_FINANCEIRO}${id}/`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (!res.ok) throw new Error(await res.text());
    alert("Lançamento financeiro atualizado com sucesso!");
  } catch (err) {
    alert("Erro ao atualizar lançamento: " + err.message);
    console.error(err);
    throw err;
  }
}

// Listar lançamentos financeiros
async function listarLancamentosFinanceiros() {
  const token = localStorage.getItem("access_token");
  const condominio = JSON.parse(localStorage.getItem("condominioSelecionado"));

  try {
    const res = await fetch(API_URL_FINANCEIRO, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Erro ao buscar lançamentos");

    const data = await res.json();
    const lancamentos = data.results || data;

    if (condominio?.code_condominium) {
      return lancamentos.filter(
        (l) => l.condominium?.code_condominium === condominio.code_condominium
      );
    }

    return lancamentos;
  } catch (err) {
    console.error("Erro ao listar lançamentos:", err);
    return [];
  }
}

// Deletar lançamento financeiro
async function deletarLancamentoFinanceiro(id) {
  const token = localStorage.getItem("access_token");

  try {
    const res = await fetch(`${API_URL_FINANCEIRO}${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error(await res.text());
    alert("Lançamento financeiro excluído com sucesso!");
  } catch (err) {
    alert("Erro ao excluir lançamento: " + err.message);
    console.error(err);
  }
}
