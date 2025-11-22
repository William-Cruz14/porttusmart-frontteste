// infoMorador.js
async function pegarDadosMorador() {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Token não encontrado");

    const res = await fetch("https://api.porttusmart.tech/api/v1/users/persons/me/", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error(`Erro ao obter dados do morador: ${res.status}`);

    const data = await res.json();

    // 🔹 Debug completo
    console.log("Dados completos do morador:", data);

    // ✅ Corrigido: pegar o primeiro item do array
    const morador = data[0];

    const moradorInfo = {
      block: morador.apartment?.block || null,
      apartment: morador.apartment?.number || null,
      code_condominium: morador.apartment?.condominium || null,
    };

    console.log("Bloco:", moradorInfo.block);
    console.log("Apartamento:", moradorInfo.apartment);
    console.log("Código do condomínio:", moradorInfo.code_condominium);

    localStorage.setItem("moradorInfo", JSON.stringify(moradorInfo));

    return moradorInfo;
  } catch (err) {
    console.error("Erro ao pegar dados do morador:", err);
  }
}

// Chamada imediata para teste
pegarDadosMorador();
