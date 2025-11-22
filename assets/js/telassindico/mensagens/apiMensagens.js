// ==========================================================
// apiMensagens.js
// ==========================================================
const API_URL_MENSAGENS = "https://api.porttusmart.tech/api/v1/core/communications/";

// Criar (enviar) mensagem
async function criarMensagem(dados) {
  const token = localStorage.getItem("access_token");
  const condominio = JSON.parse(localStorage.getItem("condominioSelecionado"));

  if (!token) {
    alert("Sessão expirada. Faça login novamente.");
    return;
  }

  if (!condominio?.code_condominium) {
    alert("Selecione um condomínio antes de enviar a mensagem.");
    return;
  }

  const payload = {
    title: dados.titulo || "Sem título",
    message: dados.mensagem,
    number_apartment: dados.apartamento ? Number(dados.apartamento) : null,
    block_apartment: dados.bloco || null,
    code_condominium: condominio.code_condominium,
    communication_type: "message" // ✅ Campo obrigatório
  };

  console.log("📦 Payload enviado ao backend (mensagem):", payload);

  try {
    const res = await fetch(API_URL_MENSAGENS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errMsg = await res.text();
      throw new Error(errMsg || "Erro ao enviar mensagem.");
    }

    const data = await res.json();
    alert("Mensagem enviada com sucesso!");
    return data;
  } catch (err) {
    alert("Erro ao enviar mensagem: " + err.message);
    console.error("❌ Erro ao enviar mensagem:", err);
    return null;
  }
}

// Listar mensagens
async function listarMensagens() {
  const token = localStorage.getItem("access_token");

  if (!token) {
    alert("Sessão expirada. Faça login novamente.");
    return [];
  }

  try {
    const res = await fetch(API_URL_MENSAGENS, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      const errMsg = await res.text();
      throw new Error(errMsg || "Erro ao buscar mensagens.");
    }

    const data = await res.json();
    const todas = data.results || data;

    // ✅ Filtra apenas comunicações do tipo "message"
    const mensagensFiltradas = todas.filter(
      (m) => m.communication_type === "message"
    );

    console.log("📬 Mensagens recebidas (filtradas):", mensagensFiltradas);
    return mensagensFiltradas;
  } catch (err) {
    console.error("❌ Erro ao listar mensagens:", err);
    return [];
  }
}
