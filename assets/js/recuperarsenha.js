document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".login-form");
  const message = document.createElement("p");
  message.classList.add("message");
  form.insertAdjacentElement("afterend", message);

  let step = 1; // 1=email, 2=verificação, 3=alterar senha
  let emailValue = "";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (step === 1) {
      // Etapa 1: capturar o e-mail e mostrar os próximos campos
      emailValue = document.querySelector("#email").value.trim();

      if (!emailValue) {
        message.textContent = "Por favor, insira o e-mail.";
        return;
      }

      form.innerHTML = `
        <input type="email" id="email" value="${emailValue}" disabled>
        <input type="text" id="cpf" placeholder="Digite seu CPF">
        <input type="text" id="condominio" placeholder="Código do condomínio">
        <button type="submit">Confirmar dados</button>
      `;
      message.textContent = "Digite seu CPF e o código do condomínio.";
      step = 2;
      return;
    }

    if (step === 2) {
      // Etapa 2: validar CPF e código via backend
      const cpf = document.querySelector("#cpf").value.trim();
      const code_condominium = document.querySelector("#condominio").value.trim();

      if (!cpf || !code_condominium) {
        message.textContent = "Preencha todos os campos.";
        return;
      }

      try {
        const response = await fetch("https://condomineo-production.up.railway.app/api/v1/auth/verify-user/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailValue, cpf, code_condominium })
        });

        if (!response.ok) {
          message.textContent = "Dados não encontrados. Verifique as informações.";
          return;
        }

        // Usuário verificado → mostrar campos de senha
        form.innerHTML = `
          <input type="password" id="new_password1" placeholder="Nova senha">
          <input type="password" id="new_password2" placeholder="Confirme a nova senha">
          <button type="submit">Alterar senha</button>
        `;
        message.textContent = "Usuário verificado! Agora crie uma nova senha.";
        step = 3;

      } catch (error) {
        console.error(error);
        message.textContent = "Erro ao verificar usuário. Tente novamente.";
      }
      return;
    }

    if (step === 3) {
      // Etapa 3: trocar senha
      const new_password1 = document.querySelector("#new_password1").value;
      const new_password2 = document.querySelector("#new_password2").value;

      if (!new_password1 || !new_password2) {
        message.textContent = "Preencha os dois campos de senha.";
        return;
      }

      if (new_password1 !== new_password2) {
        message.textContent = "As senhas não coincidem.";
        return;
      }

      try {
        const response = await fetch("https://condomineo-production.up.railway.app/api/v1/auth/password/change/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ new_password1, new_password2 })
        });

        if (!response.ok) {
          message.textContent = "Erro ao alterar senha. Tente novamente.";
          return;
        }

        message.textContent = "Senha alterada com sucesso!";
        form.innerHTML = `<button onclick="window.location.href='../index.html'">Voltar ao login</button>`;
      } catch (error) {
        console.error(error);
        message.textContent = "Erro na conexão. Tente novamente mais tarde.";
      }
    }
  });
});
