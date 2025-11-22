// mainSenha.js
document.addEventListener("DOMContentLoaded", () => {

  const content = document.querySelector(".content");

  function carregarAlterarSenha() {
    content.innerHTML = telasSenha["Alterar Senha"];

    const form = content.querySelector(".form-alterar-senha");
    const msgOk = content.querySelector(".senha-msg");
    const msgErro = content.querySelector(".senha-erro");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      msgOk.style.display = "none";
      msgErro.style.display = "none";

      const data = {
        new_password1: form.new_password1.value,
        new_password2: form.new_password2.value
      };

      const result = await alterarSenha(data);

      if (result.ok) {
        form.reset();
        msgOk.style.display = "block";
      } else {
        msgErro.innerText = "Erro: " + (JSON.stringify(result.error) || "");
        msgErro.style.display = "block";
      }
    });
  }

  // Clicar no menu superior "Alterar Senha"
  const menuBtn = document.querySelector("#menuDropdown a:nth-child(2)");
  menuBtn.addEventListener("click", (e) => {
    e.preventDefault();
    carregarAlterarSenha();
  });

});
