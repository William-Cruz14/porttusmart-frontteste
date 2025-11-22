// ==========================================================
// telasMensagens.js
// ==========================================================
const telasMoradorMensagens = {
  "Enviar Mensagem": `
    <div class="content-top-mensagens">
      <h1>Enviar Mensagem</h1>
      <p class="lead">Envie uma mensagem para o síndico.</p>

      <div class="form-mensagens">
        <label>Título</label>
        <input type="text" id="mensagemTitulo" placeholder="Digite o título" />

        <label>Mensagem</label>
        <textarea id="mensagemConteudo" placeholder="Digite sua mensagem"></textarea>

        <button id="btnEnviarMensagem">Enviar</button>
      </div>

      <div class="feedback-mensagem" style="display:none;color:green;margin-top:10px;"></div>
    </div>
  `,

  "Histórico de Mensagens": `
    <div class="content-top-mensagens">
      <h1>Histórico de Mensagens</h1>
      <p class="lead">Todas as mensagens enviadas e recebidas.</p>

      <div class="historico-tabela-mensagens">
        <table class="tabela-historico-mensagens">
          <thead>
            <tr>
              <th>Título</th>
              <th>Mensagem</th>
              <th>Bloco</th>
              <th>Apartamento</th>
            </tr>
          </thead>
          <tbody class="tabela-historico-mensagens-body">
            <!-- Linhas serão inseridas dinamicamente -->
          </tbody>
        </table>
      </div>

      <div class="loading-mensagens" style="display:none;text-align:center;padding:20px;">
        Carregando mensagens...
      </div>
    </div>
  `
};
