// =============================
// ===== TELAS ENTREGAS =====
// =============================
const telasEntregas = {
  "Cadastro de entregas": `
    <div class="content-top">
      <h1>Cadastro de Entregas</h1>
      <p class="lead">Registre novas entregas recebidas na portaria.</p>

      <form class="form-cadastro-entrega">
        <div class="form-group-entrega">
          <label>Código da entrega</label>
          <input type="text" name="codigo" placeholder="Ex: PED12345" required>
        </div>

        <div class="form-group-entrega">
          <label>Bloco</label>
          <select name="bloco" id="selectBlocoEntrega">
            <option value="">Selecione o bloco</option>
          </select>
        </div>

        <div class="form-group-entrega">
          <label>Apartamento</label>
          <select name="apartamento" id="selectAptoEntrega" disabled>
            <option value="">Selecione o apartamento</option>
          </select>
        </div>

        <div class="form-group-entrega">
          <label>Foto ou Assinatura</label>
          <input type="file" name="assinatura" accept="image/*">
          <small>Selecione uma imagem (assinatura ou comprovante)</small>
        </div>

        <div class="form-actions-entrega">
          <button type="submit" class="btn-salvar-entrega">Salvar</button>
          <button type="reset" class="btn-cancelar-entrega">Cancelar</button>
        </div>
      </form>
    </div>
  `,

  "Histórico de entregas": `
    <div class="content-top">
      <h1>Histórico de Entregas</h1>
      <p class="lead">Acompanhe as entregas registradas no condomínio.</p>

      <div class="historico-container-entrega">
        <div class="historico-filtros-entrega" style="margin-bottom:15px;">
          <select id="filtroBlocoEntrega">
            <option value="">Filtrar por bloco</option>
          </select>

          <select id="filtroApartamentoEntrega" disabled>
            <option value="">Filtrar por apartamento</option>
          </select>

          <input type="text" placeholder="Pesquisar..." id="searchInputEntrega">
          <button class="btn-buscar-entrega" id="btnBuscarEntrega">Buscar</button>
          <button class="btn-limpar-entrega" id="btnLimparEntrega">Limpar</button>
        </div>

        <div class="historico-tabela-entrega">
          <table class="tabela-historico-entrega">
            <thead>
              <tr>
                <th>Código</th>
                <th>Status</th>
                <th>Bloco</th>
                <th>Apartamento</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody id="tabelaEntregasBody">
              <!-- Linhas preenchidas dinamicamente -->
            </tbody>
          </table>
        </div>

        <div id="loadingEntregas" style="display:none;text-align:center;padding:20px;">
          Carregando entregas...
        </div>
      </div>
    </div>
  `
};
