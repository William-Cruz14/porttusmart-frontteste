// ------------------------
// apiReservas.js
// ------------------------
const API_URL_RESERVAS = "https://api.porttusmart.tech/api/v1/core/reservations/";

// ======================================================
// CRIAR RESERVA (AJUSTADO)
// ======================================================
async function criarReserva(dados) {
  const token = localStorage.getItem("access_token");

  const start_time = `${dados.data}T${dados.horaInicio}:00-03:00`;
  const end_time = `${dados.data}T${dados.horaFim}:00-03:00`;

  const payload = {
    space: dados.space,
    start_time,
    end_time,
  };

  console.log("📌 Payload (CRIAÇÃO):", JSON.stringify(payload, null, 2));

  const res = await fetch(API_URL_RESERVAS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const responseText = await res.text();
  console.log("📌 Resposta API (CRIAÇÃO):", responseText);

  if (!res.ok) throw new Error(responseText);

  return JSON.parse(responseText);
}

// ======================================================
// LISTAR RESERVAS (MANTIDO)
// ======================================================
async function listarReservas() {
  const token = localStorage.getItem("access_token");
  const morador = JSON.parse(localStorage.getItem("moradorInfo"));

  const res = await fetch(API_URL_RESERVAS, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Erro ao buscar reservas");

  const data = await res.json();
  const reservas = data.results || data;

  // Filtra apenas as reservas do apartamento do morador
  return reservas.filter(r => {
    const bloco = r.resident?.apartment?.block || r.apartment_block;
    const apto = r.resident?.apartment?.number || r.apartment_number;
    return bloco == morador.block && Number(apto) === Number(morador.apartment);
  });
}

// ======================================================
// DELETAR RESERVA (MANTIDO)
// ======================================================
async function deletarReserva(id) {
  const token = localStorage.getItem("access_token");

  const res = await fetch(`${API_URL_RESERVAS}${id}/`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  const responseText = await res.text();
  console.log("📌 Resposta API (DELETE):", responseText);

  if (!res.ok) throw new Error(responseText);
}

// ======================================================
// ATUALIZAR RESERVA (AJUSTADO)
// ======================================================
async function atualizarReserva(id, dados) {
  const token = localStorage.getItem("access_token");

  const start_time = `${dados.data}T${dados.horaInicio}:00-03:00`;
  const end_time = `${dados.data}T${dados.horaFim}:00-03:00`;

  const payload = {
    space: dados.space,
    start_time,
    end_time,
  };

  console.log("📌 Payload (ATUALIZAÇÃO):", JSON.stringify(payload, null, 2));

  const res = await fetch(`${API_URL_RESERVAS}${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const responseText = await res.text();
  console.log("📌 Resposta API (ATUALIZAÇÃO):", responseText);

  if (!res.ok) throw new Error(responseText);
}
