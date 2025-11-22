// ==========================================================
// apiEntregas.js
// ==========================================================
const API_URL_ENTREGAS = "https://api.porttusmart.tech/api/v1/core/orders/";

// Lista apenas as entregas associadas ao morador logado
async function listarEntregas() {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("Token ausente");

  const res = await fetch(API_URL_ENTREGAS, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) throw new Error(await res.text());

  const data = await res.json();
  const lista = data.results || [];

  // Normaliza os dados para facilitar no front
  return lista.map(entrega => ({
    codigo: entrega.order_code || "-",
    status: entrega.status || "-",
    bloco: entrega.owner?.apartment?.block || "-",
    apartamento: entrega.owner?.apartment?.number || "-",
    assinatura: entrega.signature_image || null
  }));
}
