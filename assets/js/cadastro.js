document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".login-form");
  
    if (!form) return;
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      // PEGAR TOKEN DO RECAPTCHA
      const recaptchaResponse = grecaptcha.getResponse();
  
      if (!recaptchaResponse) {
        alert("Por favor, confirme que você não é um robô.");
        return;
      }
  
      // Coleta os dados do formulário
      const nome = form.nome.value.trim();
      const cpf = form.cpf.value.trim();
      const telefone = form.telefone.value.trim();
      const email = form.email.value.trim();
      const senha = form.senha.value.trim();
      const codigoCondominio = form.codigoCondominio.value.trim();
      const apartamento = form.apartamento.value.trim();
      const bloco = form.bloco.value.trim();

      let numApt = parseInt(apartamento);
      if (isNaN(numApt)) {
        numApt = null;
      }
      // Monta o JSON conforme o backend espera
      const userData = {
        name: nome,
        email: email,
        cpf: cpf,
        password: senha,
        telephone: telefone,
        user_type: "resident",
        number_apartment: numApt,
        block_apartment: bloco,
        code_condominium: codigoCondominio,
        recaptcha_token: recaptchaResponse 
      };
  
      console.log("📤 Enviando dados para o servidor...");
  
      let url = "https://api.porttusmart.tech/api/v1/users/persons/";
      
      // --- TRATAMENTO DE TOKEN (GOOGLE LOGIN) ---
      const token = localStorage.getItem("access_token");
      const headers = {
        "Content-Type": "application/json"
      };
  
      // Se tiver token, envia no header para vincular ao user criado pelo Google
      if (token) {
          headers["Authorization"] = `Bearer ${token}`;
          console.log("🔑 Token detectado. Enviando requisição autenticada.");
      }
  
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(userData)
        });

        console.log("Payload enviado:", userData);
  
        console.log("📡 Status da resposta:", response.status);
  
        if (response.ok) {
          
          // SUCESSO: Limpa tudo e redireciona para LOGIN
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          
          // Limpa flag de novo usuário
          const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
          if (storedUser.is_new_user) {
             storedUser.is_new_user = false;
             localStorage.setItem('user', JSON.stringify(storedUser));
          }
  
          form.reset();
          grecaptcha.reset();
  
          // AVISO IMPORTANTE DA REGRA DE NEGÓCIO
          alert("✅ Solicitação de cadastro enviada com sucesso!\n\nSeu perfil está em análise pelo síndico. Você receberá um e-mail assim que seu acesso for liberado.");
          
          // Redireciona para o LOGIN
          window.location.href = "../index.html";
          
        } else {
          // Tratamento de Erros
          let errorText = "Erro desconhecido";
          try {
            const errorData = await response.json();
            console.log("🧾 Erro JSON:", errorData);
            
            if (errorData.detail) {
                errorText = errorData.detail;
            } else if (typeof errorData === 'object') {
                // Pega a primeira mensagem de erro
                const firstKey = Object.keys(errorData)[0];
                const msg = Array.isArray(errorData[firstKey]) ? errorData[firstKey][0] : errorData[firstKey];
                errorText = `${firstKey}: ${msg}`;
            } else {
                errorText = JSON.stringify(errorData);
            }
          } catch {
            const textData = await response.text();
            errorText = "Erro interno no servidor ou formato inválido.";
          }
          alert("❌ Não foi possível concluir o cadastro:\n" + errorText);
        }
      } catch (error) {
        console.error("🚨 Erro de rede:", error);
        alert("Erro de conexão com o servidor. Verifique sua internet.");
      }
    });
});