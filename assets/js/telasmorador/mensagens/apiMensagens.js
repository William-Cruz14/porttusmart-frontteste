// ==========================================================
// apiMensagens.js
// ==========================================================
const API_URL_MENSAGENS = "https://api.porttusmart.tech/api/v1/core/communications/";

// Lista apenas mensagens do tipo "message"
async function listarMensagens() {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("Token ausente");

  const res = await fetch(API_URL_MENSAGENS, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) throw new Error(await res.text());

  const data = await res.json();
  const lista = data.results || [];

  // Filtra somente mensagens
  return lista
    .filter(item => item.communication_type === "message")
    .map(item => {
      const recipient = item.recipients?.[0] || {};
      return {
        titulo: item.title || "-",
        mensagem: item.message || "-",
        bloco: recipient.apartment?.block || "-",
        apartamento: recipient.apartment?.number || "-"
      };
    });
}

// Envia mensagem
async function enviarMensagem({ titulo, mensagem }) {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("Token ausente");

  // Pega dados do morador logado
  const morador = JSON.parse(localStorage.getItem("moradorInfo")) || {};

  const payload = {
    title: titulo,
    message: mensagem,
    number_apartment: morador.apartment || 0,
    block_apartment: morador.block || "",
    code_condominium: morador.code_condominium || "",
    communication_type: "message"
  };

  // 🔹 Debug: mostra o payload enviado
  console.log("Payload enviado para o endpoint:", payload);

  const res = await fetch(API_URL_MENSAGENS, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  // 🔹 Debug: mostra a resposta do servidor
  const responseData = await res.json();
  console.log("Resposta do servidor:", responseData);

  if (!res.ok) throw new Error(JSON.stringify(responseData));

  return responseData;
}
