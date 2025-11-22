// ------------------------
// telaVisitante.js
// ------------------------
const telasVisitantes = {
  "Cadastro de visitantes": `
    <div class="content-top">
      <h1>Cadastro de Visitantes</h1>
      <p class="lead">Preencha os dados abaixo para cadastrar um novo visitante.</p>

      <form class="form-cadastro-visitante">
        <div class="form-group-visitante">
          <label>Nome completo</label>
          <input type="text" name="nome" placeholder="Nome completo" required>
        </div>

        <div class="form-group-visitante">
          <label>CPF</label>
          <input type="text" name="cpf" placeholder="000.000.000-00" required>
        </div>

        <div class="form-group-visitante">
          <label>Bloco</label>
          <select name="bloco" id="selectBlocoVisitante" required>
            <option value="">Selecione o bloco</option>
          </select>
        </div>

        <div class="form-group-visitante">
          <label>Apartamento</label>
          <select name="apartamento" id="selectAptoVisitante" required>
            <option value="">Selecione o apartamento</option>
          </select>
        </div>

        <div class="form-actions-visitante">
          <button type="submit" class="btn-salvar-visitante">Salvar</button>
          <button type="reset" class="btn-cancelar-visitante">Cancelar</button>
        </div>
      </form>
    </div>
  `,

  "Controle de entradas e saídas": `
    <div class="content-top">
      <h1>Controle de Entradas e Saídas</h1>
      <p class="lead">Lista de visitantes cadastrados e controle de acessos.</p>

      <div class="historico-container-visitante">
        <div class="historico-filtros-visitante">
          <select id="filtroBlocoVisitante">
            <option value="">Filtrar por bloco</option>
          </select>

          <select id="filtroApartamentoVisitante">
            <option value="">Filtrar por apartamento</option>
          </select>

          <input type="text" placeholder="Pesquisar..." id="searchInputVisitante">
          <button class="btn-buscar-visitante" id="btnBuscarVisitante">Buscar</button>
          <button class="btn-limpar-visitante" id="btnLimparVisitante">Limpar</button>
        </div>

        <div class="historico-tabela-visitante">
          <table class="tabela-historico-visitante">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Bloco</th>
                <th>Apartamento</th>
                <th>CPF</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody id="visitantesTableBody"></tbody>
          </table>
        </div>
      </div>
    </div>
  `
};
