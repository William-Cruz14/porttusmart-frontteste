// ==========================================================
// apiVeiculos.js
// ==========================================================
const API_URL_VEICULOS = "https://api.porttusmart.tech/api/v1/core/vehicles/";

// Lista os veículos do morador
async function listarVeiculos() {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("Token ausente");

  const res = await fetch(API_URL_VEICULOS, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();

  // Retorna apenas os veículos pertencentes ao morador logado
  return data.results || [];
}
