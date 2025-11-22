// ------------------------
// telasVeiculos.js
// ------------------------
const telasVeiculos = {
  "Cadastro de veículos de moradores": `
    <div class="content-top">
      <h1>Cadastro de Veículos</h1>
      <p class="lead">Preencha os dados abaixo para registrar um veículo.</p>

      <form class="form-cadastro-veiculo">
        <div class="form-group-veiculo">
          <label>Placa</label>
          <input type="text" name="placa" placeholder="ABC-1234" required>
        </div>

        <div class="form-group-veiculo">
          <label>Modelo</label>
          <input type="text" name="modelo" placeholder="Ex: Corolla" required>
        </div>

        <div class="form-group-veiculo">
          <label>Cor</label>
          <input type="text" name="cor" placeholder="Ex: Preto" required>
        </div>

        <div class="form-group-veiculo">
          <label>Bloco</label>
          <!-- Será substituído dinamicamente por um select -->
          <input type="text" name="bloco" placeholder="Selecione o bloco" required>
        </div>

        <div class="form-group-veiculo">
          <label>Apartamento</label>
          <!-- Será substituído dinamicamente por um select -->
          <input type="number" name="apartamento" placeholder="Selecione o apartamento" required>
        </div>

        <div class="form-actions-veiculo">
          <button type="submit" class="btn-salvar-veiculo">Salvar</button>
          <button type="reset" class="btn-cancelar-veiculo">Cancelar</button>
        </div>
      </form>
    </div>
  `,

  "Histórico de veículos": `
    <div class="content-top">
      <h1>Histórico de Veículos</h1>
      <p class="lead">Lista de veículos registrados no condomínio.</p>

      <div class="historico-container-veiculo">
        <div class="historico-filtros-veiculo">
          <select id="filtroBlocoVeiculo">
            <option value="">Filtrar por bloco</option>
          </select>
          <select id="filtroApartamentoVeiculo">
            <option value="">Filtrar por apartamento</option>
          </select>
          <input type="text" id="filtroPlacaVeiculo" placeholder="Placa">
          <input type="text" id="filtroModeloVeiculo" placeholder="Modelo">
          <input type="text" id="filtroCorVeiculo" placeholder="Cor">
          <button class="btn-buscar-veiculo" id="btnBuscarVeiculos"><i class="fa fa-search"></i> Buscar</button>
          <button class="btn-limpar-veiculo" id="btnLimparVeiculos">Limpar</button>
        </div>

        <div class="historico-tabela-veiculo">
          <table class="tabela-historico-veiculo">
            <thead>
              <tr>
                <th>Placa</th>
                <th>Modelo</th>
                <th>Cor</th>
                <th>Bloco</th>
                <th>Apartamento</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody class="tabela-historico-veiculo-body">
              <!-- Linhas serão inseridas dinamicamente -->
            </tbody>
          </table>
        </div>

        <div class="loading-veiculos" style="display:none;text-align:center;padding:20px;">
          Carregando veículos...
        </div>
      </div>
    </div>
  `
};
