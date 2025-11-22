// apiSenha.js
async function alterarSenha(data) {
    try {
        const response = await fetch("/api/v1/auth/password/change/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const err = await response.json();
            console.error("Erro ao trocar senha:", err);
            return { ok: false, error: err };
        }

        return { ok: true };
    } catch (error) {
        console.error("Erro fetch:", error);
        return { ok: false, error };
    }
}
