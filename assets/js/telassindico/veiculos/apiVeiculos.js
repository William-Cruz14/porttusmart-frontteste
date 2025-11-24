// ------------------------
// apiVeiculos.js
// ------------------------
const API_URL_VEICULOS = "https://api.porttusmart.tech/api/v1/core/vehicles/";

async function criarVeiculo(dados) {
  const token = localStorage.getItem("access_token");
  const condominio = JSON.parse(localStorage.getItem("condominioSelecionado"));

  if (!condominio?.code_condominium) {
    alert("Selecione um condomínio antes de cadastrar o veículo.");
    return false;
  }

  const payload = {
    plate: dados.placa,
    model: dados.modelo,
    color: dados.cor,
    code_condominium: condominio.code_condominium,
    number_apartment: Number(dados.apartamento),
    block_apartment: dados.bloco
  };

  try {
    const res = await fetch(API_URL_VEICULOS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error(await res.text());
    alert("Veículo cadastrado com sucesso!");
    return true;
  } catch (err) {
    alert("Erro ao cadastrar veículo: " + err.message);
    console.error(err);
    return false;
  }
}

async function listarVeiculos() {
  const token = localStorage.getItem("access_token");
  const condominio = JSON.parse(localStorage.getItem("condominioSelecionado"));
  if (!condominio?.code_condominium) return [];

  try {
    const res = await fetch(API_URL_VEICULOS, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Erro ao buscar veículos");
    const data = await res.json();
    let veiculos = data.results || data;

    // Filtro do condomínio
    veiculos = veiculos.filter(
      (v) => v.condominium?.code_condominium === condominio.code_condominium
    );

    // Ordenação bloco + número
    veiculos.sort((a, b) => {
      const blocoA = a.owner?.apartment?.block || "";
      const blocoB = b.owner?.apartment?.block || "";

      if (blocoA < blocoB) return -1;
      if (blocoA > blocoB) return 1;

      const numA = a.owner?.apartment?.number || 0;
      const numB = b.owner?.apartment?.number || 0;

      return numA - numB;
    });

    return veiculos;

  } catch (err) {
    console.error(err);
    return [];
  }
}


async function atualizarVeiculo(id, dados) {
  const token = localStorage.getItem("access_token");
  const condominio = JSON.parse(localStorage.getItem("condominioSelecionado"));

  if (!condominio?.code_condominium) {
    alert("Selecione um condomínio antes de atualizar o veículo.");
    return false;
  }

  const payload = {
    plate: dados.placa,
    model: dados.modelo,
    color: dados.cor,
    code_condominium: condominio.code_condominium,
    number_apartment: Number(dados.apartamento),
    block_apartment: dados.bloco
  };

  try {
    const res = await fetch(`${API_URL_VEICULOS}${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error(await res.text());
    alert("Veículo atualizado com sucesso!");
    return true;
  } catch (err) {
    alert("Erro ao atualizar veículo: " + err.message);
    console.error(err);
    return false;
  }
}

async function deletarVeiculo(id) {
  const token = localStorage.getItem("access_token");
  try {
    const res = await fetch(`${API_URL_VEICULOS}${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error(await res.text());
    alert("Veículo excluído com sucesso!");
  } catch (err) {
    alert("Erro ao excluir veículo: " + err.message);
    console.error(err);
  }
}
