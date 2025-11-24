// apiSenha.js
const API_URL_SENHA = "https://api.porttusmart.tech/api/v1/auth/password/change/";

async function alterarSenha(data) {
    try {
        const response = await fetch(API_URL_SENHA, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            // Tenta ler JSON. Se vier HTML ou texto, evita crash.
            const err = await response.json().catch(async () => {
                const text = await response.text();
                return { error: "Resposta inválida da API", details: text };
            });

            console.error("Erro ao trocar senha:", err);
            return { ok: false, error: err };
        }

        return { ok: true };
    } catch (error) {
        console.error("Erro fetch:", error);
        return { ok: false, error };
    }
}
