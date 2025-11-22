// ==========================================================
// telasDados.js
// ==========================================================
const telasMoradorDados = {
  "Atualizar Cadastro": `
    <div class="content-top-dados">
      <h1>Atualizar Cadastro</h1>
      <p class="lead">Você pode atualizar um ou mais campos. Cada campo é opcional.</p>

      <form class="form-cadastro-dados">
        <div class="form-group-dados">
          <label>Nome completo</label>
          <input type="text" id="nome" name="nome" placeholder="Seu nome completo">
        </div>

        <div class="form-group-dados">
          <label>CPF</label>
          <input type="text" id="cpf" name="cpf" placeholder="000.000.000-00">
        </div>

        <div class="form-group-dados">
          <label>Telefone</label>
          <input type="tel" id="telefone" name="telefone" placeholder="(00) 00000-0000">
        </div>

        <div class="form-actions-dados">
          <button type="submit" class="btn-salvar-dados">Salvar</button>
          <button type="reset" class="btn-cancelar-dados">Cancelar</button>
        </div>
      </form>
    </div>
  `
};
