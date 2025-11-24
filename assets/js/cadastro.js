document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".login-form");
  
    if (!form) return;

    const accessToken = localStorage.getItem('access_token'); 
    const storedUserJson = localStorage.getItem('google_user_data');

    if (accessToken && storedUserJson) {
        try {
            const googleUser = JSON.parse(storedUserJson);
            //console.log("Preenchendo formulário com dados do Google:", googleUser);

            // 1. Preenche o NOME (Chave: "name")
            if (googleUser.name && form.nome) {
                form.nome.value = googleUser.name;
            }

            // 2. Preenche o EMAIL e BLOQUEIA (Chave: "email")
            // Importante: O backend valida se o email do token bate com o do form.
            if (googleUser.email && form.email) {
                form.email.value = googleUser.email;
                form.email.readOnly = true; // Bloqueia digitação
                form.email.style.backgroundColor = "#e9ecef"; // Visual cinza
                form.email.style.cursor = "not-allowed";
                
                // Adiciona um aviso visual para o usuário saber por que não pode mudar
                const emailHint = document.createElement("small");
                emailHint.style.color = "#666";
                emailHint.innerText = "E-mail vinculado à sua conta Google.";
                form.email.parentNode.appendChild(emailHint);
            }

        } catch (e) {
            console.error("Erro ao ler dados do localStorage:", e);
        }
    }

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
            name: form.nome.value.trim(),
            email: form.email.value.trim(), // Vai enviar o email do Google (bloqueado)
            cpf: form.cpf.value.trim(),
            password: form.senha.value.trim(), // Backend vai ignorar se for update sem senha, mas enviamos
            telephone: form.telefone.value.trim(),
            user_type: "resident",
            number_apartment: parseInt(form.apartamento.value.trim()) || null,
            block_apartment: form.bloco.value.trim(),
            code_condominium: form.codigoCondominio.value.trim(),
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
    
          if (response.ok) {
            
            // SUCESSO: Limpa tudo e redireciona para LOGIN
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('google_user_data');
            
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
          const errorData = await response.json();
          console.error("Erro:", errorData);
          let msg = errorData.detail || JSON.stringify(errorData);
          alert("❌ Erro ao salvar dados: " + msg);
          grecaptcha.reset();
        }

      } catch (error) {
        console.error("🚨 Erro de rede:", error);
        alert("Erro de conexão com o servidor. Verifique sua internet.");
      }
    });
});