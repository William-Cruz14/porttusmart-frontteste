// ==========================================================
// apiComunicados.js
// ==========================================================
const API_URL_COMUNICADOS = "https://api.porttusmart.tech/api/v1/core/communications/";
const API_URL_DOCUMENTOS = "https://api.porttusmart.tech/api/v1/core/notices/";

// Criar comunicado
async function criarComunicado(dados) {
  const token = localStorage.getItem("access_token");
  const condominio = JSON.parse(localStorage.getItem("condominioSelecionado"));

  if (!token) {
    alert("Sessão expirada. Faça login novamente.");
    return null;
  }

  if (!condominio?.code_condominium) {
    alert("Selecione um condomínio antes de cadastrar o comunicado.");
    return null;
  }

  const payload = {
    title: dados.titulo || "Sem título",
    message: dados.mensagem,
    number_apartment: dados.apartamento ? Number(dados.apartamento) : null,
    block_apartment: dados.bloco || null,
    code_condominium: condominio.code_condominium,
    communication_type: "notice"
  };

  try {
    const res = await fetch(API_URL_COMUNICADOS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || "Erro ao enviar comunicado.");
    }

    const result = await res.json();
    alert("✅ Comunicado enviado com sucesso!");
    return result;
  } catch (err) {
    alert("Erro ao enviar comunicado: " + err.message);
    return null;
  }
}

// Listar comunicados filtrando pelo condomínio selecionado
async function listarComunicados() {
  const token = localStorage.getItem("access_token");
  const condominioSelecionado = JSON.parse(localStorage.getItem("condominioSelecionado"))?.code_condominium;

  if (!token) {
    alert("Sessão expirada. Faça login novamente.");
    return [];
  }

  try {
    const res = await fetch(API_URL_COMUNICADOS, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || "Erro ao buscar comunicados.");
    }

    const data = await res.json();
    const todos = data.results || data;

    const comunicadosFiltrados = todos.filter(
      c => c.communication_type === "notice" &&
           c.condominium?.code_condominium === condominioSelecionado
    );

    return comunicadosFiltrados;
  } catch {
    return [];
  }
}

// Deletar comunicado
async function deletarComunicado(id) {
  const token = localStorage.getItem("access_token");
  try {
    const res = await fetch(`${API_URL_COMUNICADOS}${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error(await res.text());
    alert("✅ Comunicado excluído com sucesso!");
  } catch (err) {
    alert("Erro ao excluir comunicado: " + err.message);
  }
}

// Criar documento
async function criarDocumento(formData) {
  const token = localStorage.getItem("access_token");
  const condominio = JSON.parse(localStorage.getItem("condominioSelecionado"));

  if (!condominio?.code_condominium) {
    alert("Selecione um condomínio antes de enviar o documento.");
    return null;
  }

  formData.append("code_condominium", condominio.code_condominium);

  try {
    const res = await fetch(API_URL_DOCUMENTOS, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });

    if (!res.ok) throw new Error(await res.text());
    const result = await res.json();
    alert("✅ Documento enviado com sucesso!");
    return result;
  } catch (err) {
    alert("Erro ao enviar documento: " + err.message);
    return null;
  }
}

// Listar documentos filtrando pelo condomínio
async function listarDocumentos() {
  const token = localStorage.getItem("access_token");
  const condominioSelecionado = JSON.parse(localStorage.getItem("condominioSelecionado"))?.code_condominium;

  if (!token) {
    alert("Sessão expirada. Faça login novamente.");
    return [];
  }

  try {
    const res = await fetch(API_URL_DOCUMENTOS, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Erro ao buscar documentos");

    const data = await res.json();
    const todos = data.results || data;

    const documentosFiltrados = todos.filter(
      d => d.condominium?.code_condominium === condominioSelecionado
    );

    return documentosFiltrados;
  } catch {
    return [];
  }
}

// Deletar documento
async function deletarDocumento(id) {
  const token = localStorage.getItem("access_token");
  try {
    const res = await fetch(`${API_URL_DOCUMENTOS}${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error(await res.text());
    alert("✅ Documento excluído com sucesso!");
  } catch (err) {
    alert("Erro ao excluir documento: " + err.message);
  }
}
