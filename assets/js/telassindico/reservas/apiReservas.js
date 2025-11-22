// ------------------------
// apiReservas.js
// ------------------------
const API_URL_RESERVAS = "https://api.porttusmart.tech/api/v1/core/reservations/";

async function criarReserva(dados) {
  const token = localStorage.getItem("access_token");
  const condominio = JSON.parse(localStorage.getItem("condominioSelecionado"));

  if (!condominio?.code_condominium) {
    throw new Error("Condomínio não selecionado.");
  }

  const start_time = `${dados.data}T${dados.horaInicio}:00Z`;
  const end_time = `${dados.data}T${dados.horaFim}:00Z`;

  const payload = {
    space: dados.space,
    block_apartment: dados.apartment_block,
    number_apartment: dados.apartment_code,
    code_condominium: condominio.code_condominium,
    start_time,
    end_time,
  };

  const res = await fetch(API_URL_RESERVAS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg);
  }

  return await res.json();
}

async function listarReservas() {
  const token = localStorage.getItem("access_token");
  const condominio = JSON.parse(localStorage.getItem("condominioSelecionado"));

  const res = await fetch(API_URL_RESERVAS, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Erro ao buscar reservas");

  const data = await res.json();
  const reservas = data.results || data;

  // 🔍 Filtra apenas reservas do condomínio selecionado
  if (condominio?.code_condominium) {
    return reservas.filter(
      (r) => r.condominium?.code_condominium === condominio.code_condominium
    );
  }

  return reservas;
}

async function deletarReserva(id) {
  const token = localStorage.getItem("access_token");

  const res = await fetch(`${API_URL_RESERVAS}${id}/`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error(await res.text());
}

async function atualizarReserva(id, dados) {
  const token = localStorage.getItem("access_token");
  const condominio = JSON.parse(localStorage.getItem("condominioSelecionado"));

  if (!condominio?.code_condominium) {
    throw new Error("Condomínio não selecionado.");
  }

  const start_time = `${dados.data}T${dados.horaInicio}:00Z`;
  const end_time = `${dados.data}T${dados.horaFim}:00Z`;

  const payload = {
    space: dados.space,
    apartment_block: dados.apartment_block,
    apartment_number: dados.apartment_code,
    code_condominium: condominio.code_condominium,
    start_time,
    end_time,
  };

  const res = await fetch(`${API_URL_RESERVAS}${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(await res.text());
}
