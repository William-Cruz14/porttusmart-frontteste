// ==========================================================
// apiMoradorDados.js
// ==========================================================
const API_URL_ME = "https://api.porttusmart.tech/api/v1/users/persons/me/";
const API_URL_PERSONS = "https://api.porttusmart.tech/api/v1/users/persons/";

// Atualiza os dados do usuário
async function atualizarDadosUsuario(dados) {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("Token ausente");

  // Obter ID do usuário
  const resMe = await fetch(API_URL_ME, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!resMe.ok) throw new Error(await resMe.text());
  const usuarioArray = await resMe.json();      // ⚠️ ajustar: retorna array
  const usuario = usuarioArray[0];             // ⚠️ pega o primeiro elemento

  if (!usuario || !usuario.id) throw new Error("ID do usuário não encontrado");
  const userId = usuario.id;

  // Monta payload apenas com campos preenchidos
  const payload = {};
  if (dados.nome) payload.name = dados.nome;
  if (dados.cpf) payload.cpf = dados.cpf;
  if (dados.telefone) payload.telephone = dados.telefone;

  if (Object.keys(payload).length === 0) {
    alert("Preencha pelo menos um campo para atualizar.");
    return;
  }

  // PATCH para /persons/{id}/
  const resPatch = await fetch(`${API_URL_PERSONS}${userId}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (!resPatch.ok) throw new Error(await resPatch.text());
  return await resPatch.json();
}
