// ==========================================================
// apiComunicados.js
// ==========================================================
const API_URL_COMUNICADOS = "https://api.porttusmart.tech/api/v1/core/communications/";

// Lista somente comunicados (notice)
async function listarComunicados() {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("Token ausente");

  const res = await fetch(API_URL_COMUNICADOS, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) throw new Error(await res.text());

  const data = await res.json();
  const lista = data.results || [];

  // Filtra somente comunicados (notice) e pega bloco/apartamento do primeiro recipient
  return lista
    .filter(item => item.communication_type === "notice")
    .map(item => {
      const recipient = item.recipients?.[0]; // primeiro recipient
      return {
        titulo: item.title || "-",
        mensagem: item.message || "-",
        bloco: recipient?.apartment?.block || "-",
        apartamento: recipient?.apartment?.number || "-"
      };
    });
}
