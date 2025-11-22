// ==========================================================
// telasComunicados.js
// ==========================================================
const telasMoradorComunicados = {
  "Meus Comunicados": `
    <div class="content-top-comunicados">
      <h1>Comunicados</h1>
      <p class="lead">Comunicados gerais do condomínio.</p>

      <div class="comunicados-tabela-container">
        <table class="tabela-comunicados">
          <thead>
            <tr>
              <th>Título</th>
              <th>Mensagem</th>
              <th>Bloco</th>
              <th>Apartamento</th>
            </tr>
          </thead>
          <tbody class="tabela-comunicados-body">
            <!-- Linhas inseridas via JS -->
          </tbody>
        </table>
      </div>

      <div class="loading-comunicados" style="display:none;text-align:center;padding:20px;">
        Carregando comunicados...
      </div>
    </div>
  `
};
