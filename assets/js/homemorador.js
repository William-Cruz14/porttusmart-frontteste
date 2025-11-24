document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    alert("Sessão expirada. Faça login novamente.");
    window.location.href = "../pages/login.html";
    return;
  }

  try {
    // 1️⃣ Pega os dados do morador
    let response = await fetch("https://api.porttusmart.tech/api/v1/users/persons/me/", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Erro ao buscar dados do morador");

    let data = await response.json();
    if (Array.isArray(data)) data = data[0];
    //console.log("👤 Dados do morador:", data);

    // 2️⃣ Atualiza o nome do morador
    const greeting = document.getElementById("moradorNome");
    if (greeting) greeting.textContent = `Olá, ${data.name || "Morador"}`;

    // 3️⃣ Pega o código do condomínio — CORREÇÃO AQUI
    const condoCode = data?.apartment?.condominium;
    const condominioEl = document.getElementById("condominioNome");

    if (condoCode && condominioEl) {
      // 4️⃣ Busca todos os condomínios
      const condoResponse = await fetch("https://api.porttusmart.tech/api/v1/core/condominiums/", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!condoResponse.ok) throw new Error("Erro ao buscar condomínios");

      const condoList = await condoResponse.json();

      // 5️⃣ Encontra o condomínio certo
      const condoData = condoList.results.find(c => c.code_condominium === condoCode);

      if (condoData) {
        condominioEl.textContent = condoData.name || "Condomínio não definido";
      } else {
        condominioEl.textContent = "Condomínio não encontrado";
      }
    }

  } catch (error) {
    console.error("Erro ao carregar informações:", error);
    alert("Erro ao carregar informações. Tente novamente mais tarde.");
  }
});
