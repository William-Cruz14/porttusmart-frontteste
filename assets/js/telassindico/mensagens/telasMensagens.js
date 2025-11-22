// ==========================================================
// telasMensagens.js
// ==========================================================
const telasMensagens = {
  "Caixa de mensagens": `
    <div class="content-top-mensagem">
      <h1>Caixa de Mensagens</h1>
      <p class="lead">Mensagens e reclamações recebidas dos moradores.</p>

      <div class="historico-container-mensagem">
        <!-- Filtros -->
        <div class="historico-filtros-mensagem">
          <select name="bloco" id="filtroBlocoMensagem">
            <option value="">Filtrar por bloco</option>
            <option value="A">Bloco A</option>
            <option value="B">Bloco B</option>
          </select>

          <select name="apartamento" id="filtroApartamentoMensagem">
            <option value="">Filtrar por apartamento</option>
            <option value="101">101</option>
            <option value="102">102</option>
          </select>

          <input type="text" id="filtroPesquisaMensagem" placeholder="Pesquisar por título ou morador...">

          <button class="btn-buscar-mensagem" id="btnBuscarMensagem">
            <i class="fa fa-search"></i> Buscar
          </button>
          <button class="btn-limpar-mensagem" id="btnLimparMensagem">
            Limpar
          </button>
        </div>

        <!-- Tabela -->
        <div class="historico-tabela-mensagem">
          <table class="tabela-historico-mensagem">
            <thead>
              <tr>
                <th>Título</th>
                <th>Morador</th>
                <th>Bloco</th>
                <th>Apartamento</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody id="tabelaMensagensBody">
              <!-- Linhas de mensagens serão inseridas dinamicamente -->
            </tbody>
          </table>
        </div>

        <div id="loadingHistoricoMensagem" style="display:none;text-align:center;padding:20px;">
          Carregando mensagens...
        </div>
      </div>
    </div>

    <!-- ========================================================== -->
    <!-- ====== MODAL DE RESPOSTA ================================= -->
    <!-- ========================================================== -->
    <div id="modalResponderMensagem" class="modal-mensagem" style="display:none;">
      <div class="modal-conteudo-mensagem">
        <h2>Responder Mensagem</h2>
        <p class="modal-info-mensagem">
          Para: <span id="destinatarioMensagem">Morador</span> 
          (<span id="destinatarioBloco">Bloco</span> - <span id="destinatarioApartamento">Apartamento</span>)
        </p>

        <textarea id="campoRespostaMensagem" placeholder="Digite sua resposta..." rows="6"></textarea>

        <div class="modal-botoes-mensagem">
          <button class="btn-enviar-mensagem" id="btnEnviarRespostaMensagem">Enviar</button>
          <button class="btn-cancelar-mensagem" id="fecharModalMensagem">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- ========================================================== -->
    <!-- ====== MODAL DE VISUALIZAÇÃO ============================== -->
    <!-- ========================================================== -->
    <div id="modalVisualizarMensagem" class="modal-mensagem" style="display:none;">
      <div class="modal-conteudo-mensagem">
        <h2>Visualizar Mensagem</h2>
        <p><strong>Morador:</strong> <span id="visualizarRemetente">-</span></p>
        <p><strong>Bloco:</strong> <span id="visualizarBloco">-</span></p>
        <p><strong>Apartamento:</strong> <span id="visualizarApartamento">-</span></p>
        <p><strong>Título:</strong> <span id="visualizarTitulo">-</span></p>
        <p><strong>Data:</strong> <span id="visualizarData">-</span></p>
        <div id="visualizarCorpo" class="visualizar-corpo-mensagem">
          Nenhum conteúdo disponível.
        </div>

        <div class="modal-botoes-mensagem">
          <button class="btn-cancelar-mensagem" id="fecharModalVisualizar">Fechar</button>
        </div>
      </div>
    </div>
  `
};
