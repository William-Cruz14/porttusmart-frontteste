// ------------------------
// apiVisitante.js
// ------------------------
const API_URL_VISITANTES = "https://api.porttusmart.tech/api/v1/core/visits/";

// Criar visitante
async function criarVisitante(dados) {
  const token = localStorage.getItem("access_token");
  const condominio = JSON.parse(localStorage.getItem("condominioSelecionado"));

  if (!condominio?.code_condominium) {
    alert("Selecione um condomínio antes de cadastrar o visitante.");
    return null;
  }

  const payload = {
    name_visitor: dados.nome,
    cpf_visitor: dados.cpf,
    block_apartment: dados.bloco,
    number_apartment: Number(dados.apartamento),
    code_condominium: condominio.code_condominium,
  };

  try {
    const res = await fetch(API_URL_VISITANTES, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(await res.text());

    alert("Visitante cadastrado com sucesso!");
    return await res.json();
  } catch (err) {
    alert("Erro ao cadastrar visitante: " + err.message);
    console.error(err);
    return null;
  }
}

// Listar visitantes
async function listarVisitantes() {
  const token = localStorage.getItem("access_token");
  try {
    const res = await fetch(API_URL_VISITANTES, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Erro ao buscar visitantes");
    const data = await res.json();
    return data.results || data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

// Atualizar
async function atualizarVisitante(id, dados) {
  const token = localStorage.getItem("access_token");
  const condominio = JSON.parse(localStorage.getItem("condominioSelecionado"));

  const payload = {
    name_visitor: dados.nome,
    cpf_visitor: dados.cpf,
    block_apartment: dados.bloco,
    number_apartment: Number(dados.apartamento),
    code_condominium: condominio.code_condominium,
  };

  try {
    const res = await fetch(`${API_URL_VISITANTES}${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(await res.text());

    alert("Visitante atualizado com sucesso!");
    return true;
  } catch (err) {
    alert("Erro ao atualizar visitante: " + err.message);
    console.error(err);
    return false;
  }
}

// Deletar
async function deletarVisitante(id) {
  const token = localStorage.getItem("access_token");
  try {
    const res = await fetch(`${API_URL_VISITANTES}${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(await res.text());
    alert("Visitante excluído com sucesso!");
  } catch (err) {
    alert("Erro ao excluir visitante: " + err.message);
    console.error(err);
  }
}
