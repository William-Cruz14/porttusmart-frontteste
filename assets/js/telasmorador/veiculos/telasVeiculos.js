// ==========================================================
// telasVeiculos.js
// ==========================================================
const telasMoradorVeiculos = {
  "Meus Veículos": `
    <div class="content-top-veiculos">
      <h1>Meus Veículos</h1>
      <p class="lead">Lista de veículos cadastrados.</p>

      <div class="historico-tabela-veiculos">
        <table class="tabela-historico-veiculos">
          <thead>
            <tr>
              <th>Placa</th>
              <th>Modelo</th>
              <th>Cor</th>
              <th>Bloco</th>
              <th>Apartamento</th>
            </tr>
          </thead>
          <tbody class="tabela-historico-veiculos-body">
            <!-- Linhas serão inseridas dinamicamente -->
          </tbody>
        </table>
      </div>

      <div class="loading-veiculos" style="display:none;text-align:center;padding:20px;">
        Carregando veículos...
      </div>
    </div>
  `
};
