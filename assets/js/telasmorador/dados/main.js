// ==========================================================
// mainMoradorDados.js
// ==========================================================
document.addEventListener("DOMContentLoaded", () => {
  const content = document.querySelector(".content");

  function carregarTelaAtualizarCadastro() {
    content.innerHTML = telasMoradorDados["Atualizar Cadastro"];
    const form = content.querySelector(".form-cadastro-dados");
    if (!form) return;

    form.addEventListener("submit", async function handleSubmit(e) {
      e.preventDefault();

      const dados = {
        nome: document.getElementById("nome").value.trim(),
        cpf: document.getElementById("cpf").value.trim(),
        telefone: document.getElementById("telefone").value.trim()
      };

      try {
        await atualizarDadosUsuario(dados);
        alert("Dados atualizados com sucesso!");
        form.reset(); // Limpa o formulário após envio
      } catch (err) {
        console.error("Erro ao atualizar dados:", err);
        alert("Não foi possível salvar as alterações.");
      }
    }, { once: true });
  }

  // Navegação do menu
  const menu = document.querySelector("#menuDados");
  if (menu) {
    menu.addEventListener("click", (e) => {
      if (!e.target.classList.contains("subitem")) return;
      const item = e.target.textContent.trim();
      if (item === "Atualizar Cadastro") carregarTelaAtualizarCadastro();
    });
  }
});
