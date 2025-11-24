// telasTrocarSenha.js
const telasSenha = {
  "Alterar Senha": `
    <div class="content-top">
      <h1>Alterar Senha</h1>
      <p class="lead">Digite sua nova senha nos campos abaixo.</p>

      <form class="form-trocar-senha" id="formTrocarSenha">
        
        <div class="form-group-senha">
          <label>Nova senha</label>
          <input type="password" name="new_password1" placeholder="Digite a nova senha" required>
        </div>

        <div class="form-group-senha">
          <label>Confirmar nova senha</label>
          <input type="password" name="new_password2" placeholder="Confirme a nova senha" required>
        </div>

        <div id="msgTrocaSenha" style="display:none; color:green; margin-top:10px;"></div>

        <div class="senha-actions">
          <button type="submit" class="btn-salvar-senha">Salvar</button>
          <button type="reset" class="btn-cancelar-senha">Cancelar</button>
        </div>

      </form>
    </div>
  `
};
