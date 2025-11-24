// =============================
// ===== API ENTREGAS =====
// =============================
const API_URL_ENTREGAS = "https://api.porttusmart.tech/api/v1/core/orders/";

async function criarEntrega(dados) {
  const token = localStorage.getItem("access_token");
  const condominio = JSON.parse(localStorage.getItem("condominioSelecionado"));

  if (!condominio?.code_condominium) {
    throw new Error("Condomínio não selecionado.");
  }

  const formData = new FormData();
  formData.append("order_code", dados.codigo);
  formData.append("status", "recebido");
  formData.append("code_condominium", condominio.code_condominium);
  formData.append("number_apartment", Number(dados.apartamento));
  formData.append("block_apartment", dados.bloco);

  if (dados.assinatura) {
    formData.append("signature_image", dados.assinatura);
  }

  const res = await fetch(API_URL_ENTREGAS, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg);
  }

  alert("Entrega cadastrada com sucesso!");
  return await res.json();
}

async function listarEntregas() {
  const token = localStorage.getItem("access_token");
  const condominio = JSON.parse(localStorage.getItem("condominioSelecionado"));

  if (!condominio?.code_condominium) {
    throw new Error("Condomínio não selecionado.");
  }

  const res = await fetch(API_URL_ENTREGAS, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) throw new Error("Erro ao buscar entregas");

  const data = await res.json();

  const entregasFiltradas = (data.results || data).filter(
    (e) => e.condominium?.code_condominium === condominio.code_condominium
  );

  // Ordena por bloco e número do apartamento
  return entregasFiltradas.sort((a, b) => {
    if (a.block_apartment < b.block_apartment) return -1;
    if (a.block_apartment > b.block_apartment) return 1;
    return a.number_apartment - b.number_apartment;
  });
}

async function deletarEntrega(id) {
  const token = localStorage.getItem("access_token");

  const res = await fetch(`${API_URL_ENTREGAS}${id}/`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) throw new Error(await res.text());
}
