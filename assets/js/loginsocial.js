document.addEventListener("DOMContentLoaded", () => {
    const googleBtn = document.getElementById("googleLoginBtn");

    // IMPORTANTE: Esta URL deve estar cadastrada no Google Cloud Console
    const redirectUri = window.location.origin + "/pages/callback.html";

    // ORIGENS PERMITIDAS (Para segurança do postMessage)
    const allowedOrigins = [
        "http://127.0.0.1:5500",
        "https://www.porttusmart.tech",
        "http://localhost:5500",
        "https://site-condomino-piv.vercel.app",
        "https://d128i9hqy82wx1.cloudfront.net",
        "https://api.porttusmart.tech"
    ];

    // Escuta mensagens do popup
    window.addEventListener('message', function(event) {
        // Verifica se a origem é confiável
        const isAllowed = allowedOrigins.some(origin => event.origin.startsWith(origin));
        
        if (!isAllowed) {
            // Opcional: Descomentar se quiser debug de origens
            // console.warn("Origin não permitido ou diferente:", event.origin);
            return; 
        }

        if (event.data.type === 'OAUTH_CODE') {
            handleOAuthCode(event.data.code);
        } 
        else if (event.data.type === 'OAUTH_ERROR') {
            handleOAuthError(event.data.error);
        }
    });

    // Clique no botão Google
    if (googleBtn) {
        googleBtn.addEventListener("click", () => {
            const clientId = "787742620500-c3f02qa74r35m4b9qaf8ar93o9r6bqu2.apps.googleusercontent.com";
            
            const oauthUrl =
                `https://accounts.google.com/o/oauth2/v2/auth` +
                `?client_id=${clientId}` +
                `&redirect_uri=${encodeURIComponent(redirectUri)}` +
                `&response_type=code` +
                `&scope=openid%20email%20profile` +
                `&access_type=offline` +
                `&prompt=consent`;

            console.log("URL do OAuth:", oauthUrl);

            const popup = window.open(
                oauthUrl,
                "Google Login",
                "width=500,height=600,left=200,top=100"
            );

            if (!popup) alert("Popup bloqueado! Libere popups para este site.");
        });
    }

    // Handle do código OAuth
    async function handleOAuthCode(code) {
        try {

            googleBtn.innerHTML = '<span>Processando...</span>';
            googleBtn.disabled = true;

            //console.log("Código OAuth recebido:", code);

            // Backend simplificado: Não enviamos mais callback_url no JSON, 
            // pois o backend agora resolve isso internamente (fixo ou .env).
            const response = await fetch('https://api.porttusmart.tech/api/v1/auth/google/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: code,
                    callback_url: redirectUri
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                handleLoginSuccess(data);
            } else {
                // Tenta ler erro detalhado
                throw new Error(data.detail || data.non_field_errors || 'Erro ao processar login no servidor');
            }

        } catch (error) {
            console.error('Erro no login:', error);
            handleLoginError(error.message);
        } finally {
            if (googleBtn) {
                googleBtn.innerHTML =
                    '<img src="assets/img/google-icon.png" alt="Google logo"> Entrar com Google';
                googleBtn.disabled = false;
            }
        }
    }

    // Erro do OAuth
    function handleOAuthError(error) {
        let errorMessage = 'Erro no login com Google';
        if (error === 'access_denied') errorMessage = 'Login cancelado pelo usuário';
        if (error === 'invalid_scope') errorMessage = 'Erro de configuração do Google';
        handleLoginError(errorMessage);
    }

    // --- AQUI ESTÁ A LÓGICA AJUSTADA ---
function handleLoginSuccess(data) {

    // 1. Armazenar Tokens (Chaves: "access" e "refresh")
    if (data.access) {
        localStorage.setItem('access_token', data.access);
    }
    if (data.refresh) {
        localStorage.setItem('refresh_token', data.refresh);
    }

    // 2. Armazenar Dados do Usuário (Chave: "user")
    // Precisamos disso para preencher o formulário na próxima tela
    if (data.user) {
        // Salvamos o objeto inteiro como string para ler depois
        localStorage.setItem('google_user_data', JSON.stringify(data.user));
    }

    // 3. Feedback visual
    showMessage('Login Google realizado!', 'success');

    // 4. Lógica de Redirecionamento baseada na flag "is_new_user"
    setTimeout(() => {
        if (data.user && data.user.is_new_user === true) {
            // CENÁRIO 1: Novo usuário ou cadastro incompleto
            console.log("⚠️ Cadastro incompleto (is_new_user: true). Redirecionando para completar...");
            window.location.href = '/pages/cadastrese.html'; // Ajuste o caminho conforme sua pasta
        } else {
            // CENÁRIO 2: Usuário já completo (Login normal)
            console.log("✅ Usuário completo. Indo para Home...");
            window.location.href = '/pages/homemorador.html'; // Ajuste o caminho
        }
    }, 1500);
}

    function handleLoginError(error) {
        showMessage(`Erro: ${error}`, 'error');
    }

    function showMessage(text, type) {
        const existingMessage = document.querySelector('.auth-message');
        if (existingMessage) existingMessage.remove();

        const message = document.createElement('div');
        message.className = `auth-message ${type}`;
        message.textContent = text;
        message.style.cssText = `
            position: fixed; top: 20px; right: 20px;
            padding: 15px 20px; border-radius: 5px;
            color: white; font-weight: bold; z-index: 1000;
            background-color: ${type === 'success' ? '#4CAF50' : '#f44336'};
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;
        document.body.appendChild(message);
        setTimeout(() => message.remove(), 5000);
    }
});