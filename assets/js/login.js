// login.js - script de login ajustado
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    // 1) Faz o POST de login para obter tokens
    const response = await fetch("https://api.porttusmart.tech/api/v1/auth/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      // tenta ler mensagem de erro do backend (se houver) para mostrar algo mais útil
      let errMsg = "Falha no login. Verifique suas credenciais.";
      try {
        const errJson = await response.json();
        if (errJson.detail) errMsg = errJson.detail;
        else if (errJson.non_field_errors) errMsg = errJson.non_field_errors.join(", ");
      } catch (_) { /* ignora parsing */ }
      throw new Error(errMsg);
    }

    const data = await response.json();

    // 2) Salva tokens no localStorage (alias e compatibilidade)
    // Guarda conforme já usava + um alias 'token' para conveniência
    if (data.access) localStorage.setItem("access_token", data.access);
    if (data.refresh) localStorage.setItem("refresh_token", data.refresh);
    // alias simples (alguns scripts podem esperar 'token')
    if (data.access) localStorage.setItem("token", data.access);

    // 3) Busca os dados do usuário logado usando o access token
    const meResponse = await fetch("https://api.porttusmart.tech/api/v1/users/persons/me/", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${data.access || localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!meResponse.ok) {
      // Se der erro ao buscar /me/, tenta extrair mensagem e avisa
      let errMsg = "Erro ao obter dados do usuário.";
      try {
        const errJson = await meResponse.json();
        if (errJson.detail) errMsg = errJson.detail;
      } catch (_) {}
      throw new Error(errMsg);
    }

    const userDataRaw = await meResponse.json();
    const user = Array.isArray(userDataRaw) ? userDataRaw[0] : userDataRaw;

    // 4) Salva informações do usuário no localStorage para uso nas telas
    localStorage.setItem("userData", JSON.stringify(user));

    // Salva aliases úteis para acesso rápido
    if (user.condominium) localStorage.setItem("condominium", user.condominium);
    if (user.name) localStorage.setItem("userName", user.name);

    // opcional: salva unidade/apartamento se existir
    if (user.apartment) localStorage.setItem("apartment", user.apartment);

    // 5) Redireciona conforme tipo de usuário
    if (user.user_type === "admin" || user.user_type === "administrator" || user.is_staff) {
      window.location.href = "../pages/homesindico.html";
    } else if (user.user_type === "resident" || user.user_type === "morador") {
      window.location.href = "../pages/homemorador.html";
    } else {
      // se não souber o tipo, redireciona para home do morador por segurança
      console.warn("Tipo de usuário inesperado:", user.user_type);
      window.location.href = "../pages/homemorador.html";
    }

  } catch (error) {
    console.error("Erro no login:", error);
    // mostra a mensagem real quando possível
    alert(error.message || "Usuário ou senha inválidos");
  }
});
