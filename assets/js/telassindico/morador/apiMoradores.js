// ==========================================================
// apiMoradores.js
// ==========================================================
const API_URL_MORADORES = "https://api.porttusmart.tech/api/v1/core/residents/";

// Criar morador
async function criarMorador(dados) {
  const token = localStorage.getItem("access_token");
  const condominio = JSON.parse(localStorage.getItem("condominioSelecionado"));

  if (!condominio?.code_condominium) {
    alert("Selecione um condomínio antes de cadastrar o morador.");
    throw new Error("Condomínio não selecionado.");
  }

  const payload = {
    name: dados.nome,
    cpf: dados.cpf,
    phone: dados.telefone,
    code_condominium: condominio.code_condominium,
    number_apartment: dados.apartamento ? Number(dados.apartamento) : null,
    block_apartment: dados.bloco || null,
    email: dados.email?.trim() || null
  };

  console.log("📦 Payload enviado ao backend (morador):", payload);

  try {
    const res = await fetch(API_URL_MORADORES, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error(await res.text());
    alert("Morador cadastrado com sucesso!");
    return await res.json();
  } catch (err) {
    alert("Erro ao cadastrar morador: " + err.message);
    console.error(err);
    throw err;
  }
}

// ==========================================================
// LISTAR MORADORES (todas páginas + ordenação)
// ==========================================================
async function listarMoradores() {
  const token = localStorage.getItem("access_token");
  const condominio = JSON.parse(localStorage.getItem("condominioSelecionado"));

  let url = API_URL_MORADORES;
  let todosMoradores = [];

  try {
    while (url) {
      url = url.replace("http://", "https://");

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Erro ao buscar moradores");

      const data = await res.json();

      todosMoradores = todosMoradores.concat(data.results || []);

      url = data.next ? data.next.replace("http://", "https://") : null;
    }

    // Filtra pelo condomínio selecionado
    if (condominio?.code_condominium) {
      todosMoradores = todosMoradores.filter((m) => {
        const code =
          m.condominium?.code_condominium ||
          m.apartment_details?.condominium_detail?.code_condominium;
        return code === condominio.code_condominium;
      });
    }

    // ==========================================================
    // 🔥 ORDENAR POR BLOCO (ALFABÉTICO) E APARTAMENTO (NUMÉRICO)
    // ==========================================================
    todosMoradores.sort((a, b) => {
      const blocoA =
        (a.block_apartment ||
          a.apartment?.block ||
          a.apartment_details?.block ||
          "").toString().toUpperCase();

      const blocoB =
        (b.block_apartment ||
          b.apartment?.block ||
          b.apartment_details?.block ||
          "").toString().toUpperCase();

      const blocoCompare = blocoA.localeCompare(blocoB, "pt-BR", {
        numeric: true,
        sensitivity: "base"
      });
      if (blocoCompare !== 0) return blocoCompare;

      const aptA =
        Number(a.number_apartment ||
        a.apartment?.number ||
        a.apartment_details?.number ||
        0);

      const aptB =
        Number(b.number_apartment ||
        b.apartment?.number ||
        b.apartment_details?.number ||
        0);

      return aptA - aptB;
    });

    return todosMoradores;
  } catch (err) {
    console.error("Erro ao listar moradores:", err);
    return [];
  }
}

// Atualizar morador
async function atualizarMorador(id, dados) {
  const token = localStorage.getItem("access_token");
  const condominio = JSON.parse(localStorage.getItem("condominioSelecionado"));

  const payload = {
    name: dados.nome,
    cpf: dados.cpf,
    phone: dados.telefone,
    code_condominium: condominio?.code_condominium,
    apartment_number: dados.apartamento ? Number(dados.apartamento) : null,
    apartment_block: dados.bloco || null,
    email: dados.email?.trim() || null
  };

  try {
    const res = await fetch(`${API_URL_MORADORES}${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error(await res.text());
    alert("Morador atualizado com sucesso!");
  } catch (err) {
    alert("Erro ao atualizar morador: " + err.message);
    console.error(err);
    throw err;
  }
}

// Deletar morador
async function deletarMorador(id) {
  const token = localStorage.getItem("access_token");
  try {
    const res = await fetch(`${API_URL_MORADORES}${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error(await res.text());
    alert("Morador excluído com sucesso!");
  } catch (err) {
    alert("Erro ao excluir morador: " + err.message);
    console.error(err);
  }
}