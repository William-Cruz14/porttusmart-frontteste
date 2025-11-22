// ==========================================================
// telasReservas.js
// ==========================================================
const telasMoradorReservas = {
  "Reservar Espaço": `
    <div class="content-top-reserva">
      <h1>Cadastro de Reservas</h1>
      <p class="lead-reserva">Preencha os dados abaixo para reservar um espaço.</p>

      <form class="form-cadastro-reserva">
        <div class="form-group-reserva">
          <label>Espaço</label>
          <select name="space" required>
            <option value="">Selecione...</option>
            <option value="salão_de_festas">Salão de Festas</option>
            <option value="churrasqueira">Churrasqueira</option>
            <option value="piscina">Piscina</option>
            <option value="quadra">Quadra Poliesportiva</option>
            <option value="playground">Playground</option>
            <option value="academia">Academia</option>
          </select>
        </div>

        <div class="form-group-reserva">
          <label>Data da reserva</label>
          <input type="date" name="data_reserva" required>
        </div>

        <div class="form-group-reserva">
          <label>Hora de início</label>
          <input type="time" name="hora_inicio" required>
        </div>

        <div class="form-group-reserva">
          <label>Hora de término</label>
          <input type="time" name="hora_fim" required>
        </div>

        <div class="form-actions-reserva">
          <button type="submit" class="btn-salvar-reserva">Salvar</button>
          <button type="reset" class="btn-cancelar-reserva">Cancelar</button>
        </div>
      </form>
    </div>
  `,

  "Minhas Reservas": `
    <div class="content-top-reserva">
      <h1>Histórico de Reservas</h1>
      <p class="lead-reserva">Visualize todas as reservas registradas.</p>

      <div class="historico-container-reserva">
        <div class="historico-tabela-reserva">
          <table class="tabela-historico-reserva">
            <thead>
              <tr>
                <th>Espaço</th>
                <th>Bloco</th>
                <th>Apartamento</th>
                <th>Início</th>
                <th>Fim</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody id="tabelaReservasBody"></tbody>
          </table>
        </div>
        <div id="loadingReservas" style="display:none;text-align:center;padding:20px;">
          Carregando reservas...
        </div>
      </div>
    </div>
  `
};
