// mainSenha.js
document.addEventListener("DOMContentLoaded", () => {

  const content = document.querySelector(".content");

  function carregarAlterarSenha() {
    content.innerHTML = telasSenha["Alterar Senha"];

    const form = content.querySelector(".form-trocar-senha");
    const msg = content.querySelector("#msgTrocaSenha");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      msg.style.display = "none";
      msg.innerText = "";

      const data = {
        new_password1: form.new_password1.value,
        new_password2: form.new_password2.value
      };

      try {
        const result = await alterarSenha(data); // Sua função de backend

        if (result.ok) {
          form.reset();
          msg.style.color = "green";
          msg.innerText = "Senha alterada com sucesso!";
          msg.style.display = "block";
        } else {
          msg.style.color = "red";
          msg.innerText = "Erro: " + (JSON.stringify(result.error) || "Erro desconhecido");
          msg.style.display = "block";
        }
      } catch (error) {
        msg.style.color = "red";
        msg.innerText = "Erro: " + error.message;
        msg.style.display = "block";
      }
    });
  }

  // Seleciona o link "Alterar Senha" corretamente
  const menuBtn = document.querySelector("#menuDropdown a:first-child");
  menuBtn.addEventListener("click", (e) => {
    e.preventDefault();
    carregarAlterarSenha();
  });

});
