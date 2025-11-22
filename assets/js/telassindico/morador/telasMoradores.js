const telasMoradores = {
  "Cadastro de moradores": `
    <div class="content-top-morador">
      <h1>Cadastro de Moradores</h1>
      <p class="lead">Preencha os dados abaixo para cadastrar um novo morador.</p>

      <form class="form-cadastro-morador">
        <div class="form-group-morador">
          <label>Nome completo</label>
          <input type="text" name="nome" placeholder="Nome completo" required>
        </div>

        <div class="form-group-morador">
          <label>CPF</label>
          <input type="text" name="cpf" placeholder="000.000.000-00" required>
        </div>

        <div class="form-group-morador">
          <label>Email</label>
          <input type="email" name="email" placeholder="exemplo@dominio.com">
        </div>

        <div class="form-group-morador">
          <label>Telefone</label>
          <input type="tel" name="telefone" placeholder="(00) 00000-0000" required>
        </div>

        <div class="form-group-morador">
          <label>Bloco</label>
          <select name="bloco" id="selectBlocoMorador" required>
            <option value="">Selecione o bloco</option>
          </select>
        </div>

        <div class="form-group-morador">
          <label>Apartamento</label>
          <select name="apartamento" id="selectAptoMorador" required>
            <option value="">Selecione um apartamento</option>
          </select>
        </div>

        <div class="form-actions-morador">
          <button type="submit" class="btn-salvar-morador">Salvar</button>
          <button type="reset" class="btn-cancelar-morador">Cancelar</button>
        </div>
      </form>
    </div>
  `,

  "Histórico de moradores": `
    <div class="content-top-morador">
      <h1>Histórico de Moradores</h1>
      <p class="lead">Lista de moradores cadastrados e seu histórico.</p>

      <div class="historico-container-morador">
        <div class="historico-filtros-morador">
          <select name="bloco" id="filtroBlocoMorador">
            <option value="">Filtrar por bloco</option>
          </select>

          <select name="apartamento" id="filtroApartamentoMorador">
            <option value="">Filtrar por apartamento</option>
          </select>

          <input type="text" id="filtroPesquisaMorador" placeholder="Pesquisar...">
          <button class="btn-buscar-morador" id="btnBuscarMorador">Buscar</button>
          <button class="btn-limpar-morador" id="btnLimparMorador">Limpar</button>
        </div>

        <div class="historico-tabela-morador">
          <table class="tabela-historico-morador">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Bloco</th>
                <th>Apartamento</th>
                <th>Contato</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody id="tabelaMoradoresBody"></tbody>
          </table>
        </div>

        <div id="loadingHistoricoMorador" style="display:none;text-align:center;padding:20px;">
          Carregando moradores...
        </div>
      </div>
    </div>
  `
};
