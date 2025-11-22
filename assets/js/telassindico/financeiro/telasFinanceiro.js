// ==========================================================
// telasFinanceiro.js
// ==========================================================
const telasFinanceiro = {
  "Cadastro de lançamentos": `
    <div class="content-top-lancamento">
      <h1>Cadastro de Lançamentos</h1>
      <p class="lead">Preencha os dados abaixo para cadastrar um novo lançamento.</p>

      <form class="form-cadastro-lancamento">
        <div class="form-group-lancamento">
          <label>Descrição</label>
          <input type="text" name="descricao" placeholder="Ex: Mensalidade condomínio" required>
        </div>

        <div class="form-group-lancamento">
          <label>Valor (R$)</label>
          <input type="number" step="0.01" name="valor" placeholder="0,00" required>
        </div>

        <div class="form-group-lancamento">
          <label>Comprovante / Documento</label>
          <input type="file" name="documento" accept=".pdf,.jpg,.jpeg,.png">
        </div>

        <div class="form-actions-lancamento">
          <button type="submit" class="btn-salvar-lancamento">Salvar</button>
          <button type="reset" class="btn-cancelar-lancamento">Cancelar</button>
        </div>
      </form>
    </div>
  `,

  "Histórico de lançamentos": `
    <div class="content-top-lancamento">
      <h1>Histórico de Lançamentos</h1>
      <p class="lead">Lista de lançamentos cadastrados.</p>

      <div class="historico-container-lancamento">
        <div class="historico-filtros-lancamento">
          <input type="text" id="filtroPesquisaLancamento" placeholder="Pesquisar por descrição...">
          <button class="btn-buscar-lancamento" id="btnBuscarLancamento">Buscar</button>
          <button class="btn-limpar-lancamento" id="btnLimparLancamento">Limpar</button>
        </div>

        <div class="historico-tabela-lancamento">
          <table class="tabela-historico-lancamento">
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Valor (R$)</th>
                <th>Documento</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody id="tabelaLancamentosBody"></tbody>
          </table>
        </div>

        <div id="loadingHistoricoFinanceiro" style="display:none;text-align:center;padding:20px;">
          Carregando lançamentos...
        </div>
      </div>
    </div>
  `
};
