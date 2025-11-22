// ==========================================================
// ===== TELAS OCORRÊNCIAS =====
// ==========================================================
const telasOcorrencias = {
  "Registrar ocorrência": `
    <div class="content-top-ocorrencia">
      <h1>Registrar Ocorrência</h1>
      <p class="lead">Preencha os dados para registrar uma nova ocorrência.</p>

      <form class="form-cadastro-ocorrencia">
        <div class="form-group-ocorrencia">
          <label>Título</label>
          <input type="text" name="titulo" placeholder="Título da ocorrência" required>
        </div>

        <div class="form-group-ocorrencia">
          <label>Descrição</label>
          <textarea name="descricao" placeholder="Descreva a ocorrência" rows="4" required></textarea>
        </div>

        <div class="form-group-ocorrencia">
          <label>Status</label>
          <select name="status" required>
            <option value="aberta">Aberta</option>
            <option value="em_andamento">Em andamento</option>
            <option value="resolvida">Resolvida</option>
            <option value="fechada">Fechada</option>
          </select>
        </div>

        <div class="form-group-ocorrencia-endereco">
          <div>
            <label>Bloco</label>
            <select name="bloco" id="selectBlocoOcorrencia" required>
              <option value="">Selecione o bloco</option>
            </select>
          </div>
          <div>
            <label>Apartamento</label>
            <select name="apartamento" id="selectAptoOcorrencia" required disabled>
              <option value="">Selecione o apartamento</option>
            </select>
          </div>
        </div>

        <div class="form-actions-ocorrencia">
          <button type="submit" class="btn-salvar-ocorrencia">Registrar</button>
          <button type="reset" class="btn-cancelar-ocorrencia">Cancelar</button>
        </div>
      </form>
    </div>
  `,

  "Histórico de ocorrências": `
    <div class="content-top-ocorrencia">
      <h1>Histórico de Ocorrências</h1>
      <p class="lead">Lista das ocorrências registradas e seu status.</p>

      <div class="historico-container-ocorrencia">
        <div class="historico-filtros-ocorrencia">
          <select id="filtroBlocoOcorrencia">
            <option value="">Filtrar por bloco</option>
          </select>

          <select id="filtroApartamentoOcorrencia" disabled>
            <option value="">Filtrar por apartamento</option>
          </select>

          <input type="text" id="filtroPesquisaOcorrencia" placeholder="Pesquisar...">
          <button class="btn-buscar-ocorrencia" id="btnBuscarOcorrencia">Buscar</button>
          <button class="btn-limpar-ocorrencia" id="btnLimparOcorrencia">Limpar</button>
        </div>

        <div class="historico-tabela-ocorrencia">
          <table class="tabela-historico-ocorrencia">
            <thead>
              <tr>
                <th>Título</th>
                <th>Status</th>
                <th>Bloco</th>
                <th>Apartamento</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody id="tabelaOcorrenciasBody"></tbody>
          </table>
        </div>

        <div id="loadingHistoricoOcorrencia" style="display:none;text-align:center;padding:20px;">
          Carregando ocorrências...
        </div>
      </div>
    </div>
  `
};
