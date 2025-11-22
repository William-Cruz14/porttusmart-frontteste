// ==========================================================
// telasComunicados.js
// ==========================================================
const telasComunicados = {
  "Novo comunicado": `
    <div class="content-top-comunicados">
      <h1>Novo Comunicado</h1>
      <p class="lead-comunicados">Crie um novo comunicado para o condomínio.</p>

      <form class="form-cadastro-comunicados">
        <div class="form-group-comunicados">
          <label>Título</label>
          <input type="text" name="titulo" placeholder="Título do comunicado" required>
        </div>

        <div class="form-group-comunicados">
          <label>Mensagem</label>
          <textarea name="mensagem" placeholder="Digite a mensagem" rows="4" required></textarea>
        </div>

        <div class="form-group-comunicados endereco-group-comunicados">
          <div>
            <label>Bloco</label>
            <select name="bloco" id="selectBlocoComunicado" required>
              <option value="">Selecione o bloco</option>
            </select>
          </div>
          <div>
            <label>Apartamento</label>
            <select name="apartamento" id="selectApartamentoComunicado" required>
              <option value="">Selecione o apartamento</option>
            </select>
          </div>
        </div>

        <div class="form-actions-comunicados">
          <button type="submit" class="btn-salvar-comunicados">Enviar</button>
          <button type="reset" class="btn-cancelar-comunicados">Cancelar</button>
        </div>
      </form>
    </div>
  `,


  "Histórico de comunicados": `
    <div class="content-top-comunicados">
      <h1>Histórico de Comunicados</h1>
      <p class="lead-comunicados">Lista de comunicados enviados.</p>

      <div class="historico-container-comunicados">
        <div class="historico-filtros-comunicados">
          <input type="text" id="filtroPesquisaComunicados" placeholder="Pesquisar...">
          <button id="btnBuscarComunicados" class="btn-buscar-comunicados">Buscar</button>
          <button id="btnLimparComunicados" class="btn-limpar-comunicados">Limpar</button>
        </div>

        <div class="historico-tabela-comunicados">
          <table class="tabela-historico-comunicados">
            <thead>
              <tr>
                <th>Título</th>
                <th>Mensagem</th>
                <th>Bloco</th>
                <th>Apartamento</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody id="tabelaComunicadosBody"></tbody>
          </table>
        </div>

        <div id="loadingComunicados" style="display:none;text-align:center;padding:20px;">
          Carregando comunicados...
        </div>
      </div>
    </div>
  `,

  "Cadastro de documentos": `
    <div class="content-top-comunicados">
      <h1>Cadastro de Documentos</h1>
      <p class="lead-comunicados">Envie novos documentos do condomínio (ex: regulamentos, atas, circulares).</p>

      <form class="form-cadastro-documento-comunicados" enctype="multipart/form-data">
        <div class="form-group-comunicados">
          <label>Título</label>
          <input type="text" name="title" placeholder="Título do documento" required>
        </div>

        <div class="form-group-comunicados">
          <label>Conteúdo</label>
          <textarea name="content" placeholder="Descrição ou conteúdo do documento" rows="4" required></textarea>
        </div>

        <div class="form-group-comunicados">
          <label>Arquivo</label>
          <input type="file" name="file_complement" accept=".pdf,.doc,.docx,.jpg,.png" required>
        </div>

        <div class="form-actions-comunicados">
          <button type="submit" class="btn-salvar-comunicados">Enviar Documento</button>
          <button type="reset" class="btn-cancelar-comunicados">Cancelar</button>
        </div>
      </form>
    </div>
  `,

  "Documentos do condomínio": `
    <div class="content-top-comunicados">
      <h1>Documentos do Condomínio</h1>
      <p class="lead-comunicados">Lista de documentos disponíveis para consulta.</p>

      <div class="historico-container-comunicados">
        <div class="historico-filtros-comunicados">
          <input type="text" id="filtroPesquisaDocumentosComunicados" placeholder="Pesquisar...">
          <button id="btnBuscarDocumentosComunicados" class="btn-buscar-comunicados">Buscar</button>
          <button id="btnLimparDocumentosComunicados" class="btn-limpar-comunicados">Limpar</button>
        </div>

        <div class="historico-tabela-comunicados">
          <table class="tabela-historico-comunicados">
            <thead>
              <tr>
                <th>Título</th>
                <th>Descrição</th>
                <th>Arquivo</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody id="tabelaDocumentosComunicadosBody"></tbody>
          </table>
        </div>

        <div id="loadingDocumentosComunicados" style="display:none;text-align:center;padding:20px;">
          Carregando documentos...
        </div>
      </div>
    </div>
  `
};
