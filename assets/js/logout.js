// 🟢 Script de logout
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
      e.preventDefault(); // Impede o comportamento padrão do link

      const refreshToken = localStorage.getItem("refresh_token");

      try {
        // 🟢 1. Faz a requisição de logout para o backend
        const response = await fetch("https://api.porttusmart.tech/api/v1/auth/logout/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            refresh: refreshToken, // envia o refresh token no corpo
          }),
        });

        // 🟢 2. Mesmo que o token já tenha expirado, garantimos o logout local
        if (!response.ok) {
          console.warn("Falha no logout remoto, limpando tokens locais...");
        }

        // 🟢 3. Remove os tokens locais e redireciona para a tela de login
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        window.location.href = "../pages/logout.html"; // ajusta o caminho se necessário
      } catch (error) {
        console.error("Erro ao realizar logout:", error);

        // Mesmo em erro de rede, garante limpeza local
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        window.location.href = "../pages/logout.html";
      }
    });
  }
});
