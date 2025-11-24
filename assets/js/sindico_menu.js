// 🔹 Área de conteúdo principal
const content = document.querySelector(".content");

// 🔹 Mapas de telas de cada módulo
const telas = {
  moradores: typeof telasMoradores !== "undefined" ? telasMoradores : {},
  visitantes: typeof telasVisitantes !== "undefined" ? telasVisitantes : {},
  veiculos: typeof telasVeiculos !== "undefined" ? telasVeiculos : {},
  entregas: typeof telasEntregas !== "undefined" ? telasEntregas : {},
  areas: typeof telasAreas !== "undefined" ? telasAreas : {},
  financeiro: typeof telasFinanceiro !== "undefined" ? telasFinanceiro : {},
  ocorrencias: typeof telasOcorrencias !== "undefined" ? telasOcorrencias : {},
  comunicados: typeof telasComunicados !== "undefined" ? telasComunicados : {},
  relatorios: typeof telasRelatorios !== "undefined" ? telasRelatorios : {},
  mensagens: typeof telasMensagens !== "undefined" ? telasMensagens : {},
  senhas: typeof telasSenha !== "undefined" ? telasSenha : {},
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
      // se estiver fechando (toggle.checked === false), não faz nada com os outros
    });
  });

  // 🔹 Eventos de clique em todos os subitems
  const subitems = Array.from(document.querySelectorAll(".subitem"));
  subitems.forEach(item => {
    item.addEventListener("click", (e) => {
      const tela = item.textContent.trim();

      // Remove a classe 'active' de todos os itens
      document.querySelectorAll(".subitem").forEach(i => i.classList.remove("active"));

      // Adiciona a classe 'active' apenas ao item clicado
      item.classList.add("active");

      // MOSTRA A TELA — **não fechamos** o menu aqui (comportamento desejado)
      mostrarTela(tela);

      // Observação: se quiser que o foco visual volte pro item pai, ou role a sidebar,
      // dá pra adicionar aqui com item.scrollIntoView() ou similar.
    });
  });
});
