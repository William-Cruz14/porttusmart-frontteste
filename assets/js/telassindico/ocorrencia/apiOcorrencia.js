// ==========================================================
// apiOcorrencias.js
// ==========================================================
const API_URL_OCORRENCIAS = "https://api.porttusmart.tech/api/v1/core/occurrences/";

// Criar ocorrência
async function criarOcorrencia(dados) {
  const token = localStorage.getItem("access_token");
  const condominio = JSON.parse(localStorage.getItem("condominioSelecionado"));

  if (!condominio?.code_condominium) {
    throw new Error("Condomínio não selecionado.");
  }

  const payload = {
    title: dados.titulo,
    description: dados.descricao,
    status: dados.status || "aberta",
    number_apartment: dados.apartamento ? Number(dados.apartamento) : null,
    block_apartment: dados.bloco || null,
    code_condominium: condominio.code_condominium
  };

  const res = await fetch(API_URL_OCORRENCIAS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error(await res.text());

  return await res.json();
}

// Listar ocorrências
async function listarOcorrencias() {
  const token = localStorage.getItem("access_token");
  const condominio = JSON.parse(localStorage.getItem("condominioSelecionado"));

  const res = await fetch(API_URL_OCORRENCIAS, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) throw new Error("Erro ao buscar ocorrências");

  const data = await res.json();
  const ocorrencias = data.results || data;

  // 🔍 Filtra apenas ocorrências do condomínio selecionado
  if (condominio?.code_condominium) {
    return ocorrencias.filter(
      (o) => o.condominium?.code_condominium === condominio.code_condominium
    );
  }

  return ocorrencias;
}

// Atualizar ocorrência
async function atualizarOcorrencia(id, dados) {
  const token = localStorage.getItem("access_token");
  const condominio = JSON.parse(localStorage.getItem("condominioSelecionado"));

  if (!condominio?.code_condominium) {
    throw new Error("Condomínio não selecionado.");
  }

  const payload = {
    title: dados.titulo,
    description: dados.descricao,
    status: dados.status || "aberta",
    number_apartment: dados.apartamento ? Number(dados.apartamento) : null,
    block_apartment: dados.bloco || null,
    code_condominium: condominio.code_condominium
  };

  const res = await fetch(`${API_URL_OCORRENCIAS}${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error(await res.text());
}

// Deletar ocorrência
async function deletarOcorrencia(id) {
  const token = localStorage.getItem("access_token");

  const res = await fetch(`${API_URL_OCORRENCIAS}${id}/`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) throw new Error(await res.text());
}
