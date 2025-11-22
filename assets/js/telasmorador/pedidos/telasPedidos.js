// ==========================================================
// telasEntregas.js
// ==========================================================
const telasMoradorEntregas = {
  "Minhas Entregas": `
    <div class="content-top-entregas">
      <h1>Minhas Entregas</h1>
      <p class="lead">Histórico de entregas recebidas.</p>

      <div class="historico-tabela-entregas">
        <table class="tabela-historico-entregas">
          <thead>
            <tr>
              <th>Código</th>
              <th>Status</th>
              <th>Bloco</th>
              <th>Apartamento</th>
              <th>Imagem</th>
            </tr>
          </thead>
          <tbody class="tabela-historico-entregas-body">
            <!-- Linhas serão inseridas dinamicamente -->
          </tbody>
        </table>
      </div>

      <div class="loading-entregas" style="display:none;text-align:center;padding:20px;">
        Carregando entregas...
      </div>
    </div>
  `
};
