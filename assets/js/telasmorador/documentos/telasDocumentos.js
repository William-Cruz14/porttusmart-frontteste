// ==========================================================
// telasMoradorDocumentos.js
// ==========================================================
const telasMoradorDocumentos = {
  "Documentos do condomínio": `
    <div class="content-top-documentos">
      <h1>Documentos do Condomínio</h1>
      <p class="lead">Lista de documentos oficiais do condomínio.</p>

      <div class="documentos-tabela-wrapper">
        <table class="documentos-tabela">
          <thead>
            <tr>
              <th>Título</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody class="documentos-tbody">
            <!-- Linhas dinâmicas -->
          </tbody>
        </table>
      </div>

      <div class="loading-documentos" style="display:none;text-align:center;padding:20px;">
        Carregando documentos...
      </div>
    </div>
  `
};
