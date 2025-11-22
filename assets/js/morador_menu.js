// 🔹 Área de conteúdo principal
const content = document.querySelector(".content");

// 🔹 Mapas de telas de cada módulo do morador
const telas = {
  meusdados: typeof telasMoradorDados !== "undefined" ? telasMoradorDados : {},
  veiculos: typeof telasMoradorVeiculos !== "undefined" ? telasMoradorVeiculos : {},
  areas: typeof telasMoradorAreas !== "undefined" ? telasMoradorAreas : {},
  entregas: typeof telasMoradorEntregas !== "undefined" ? telasMoradorEntregas : {},
  documentos: typeof telasMoradorDocumentos !== "undefined" ? telasMoradorDocumentos : {},
  comunicados: typeof telasMoradorComunicados !== "undefined" ? telasMoradorComunicados : {},
  mensagens: typeof telasMoradorMensagens !== "undefined" ? telasMoradorMensagens : {},
};

// 🔹 Função para renderizar a tela
function mostrarTela(nome) {
  for (let categoria in telas) {
    if (telas[categoria][nome]) {
      content.innerHTML = telas[categoria][nome];
      return;
    }
  }

  content.innerHTML = `
    <div class="content-top">
      <h1>Tela não encontrada</h1>
    </div>
  `;
}

// Tudo que mexe no DOM espera o DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  // 🔹 Controla abertura dos menus laterais (apenas 1 aberto)
  const toggles = Array.from(document.querySelectorAll(".menu-item > input[type='checkbox']"));

  toggles.forEach(toggle => {
    toggle.addEventListener("change", () => {
      // só se estiver abrindo (checked === true) desmarca os outros
      if (toggle.checked) {
        toggles.forEach(t => {
          if (t !== toggle) t.checked = false;
        });
      }
    });
  });

  // 🔹 Eventos de clique em todos os subitems
  const subitems = Array.from(document.querySelectorAll(".subitem"));
  subitems.forEach(item => {
    item.addEventListener("click", () => {
      const tela = item.textContent.trim();

      // Remove a classe 'active' de todos os itens
      document.querySelectorAll(".subitem").forEach(i => i.classList.remove("active"));

      // Adiciona a classe 'active' apenas ao item clicado
      item.classList.add("active");

      // MOSTRA A TELA
      mostrarTela(tela);
    });
  });
});
