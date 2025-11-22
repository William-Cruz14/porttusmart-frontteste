// ------------------------
// mainReservas.js
// ------------------------
document.addEventListener("DOMContentLoaded", async () => {
  const content = document.querySelector(".content");
  let reservasTbodyListener = null;

  // Garante que os dados do morador já estão carregados
  if (!localStorage.getItem("moradorInfo")) {
    try {
      await pegarDadosMorador();
    } catch (err) {
      console.error("Não foi possível carregar os dados do morador:", err);
      return;
    }
  }

  // Pega os dados do morador logado
  const morador = JSON.parse(localStorage.getItem("moradorInfo")) || {};
  const blocoMorador = morador?.apartment?.block || "-";
  const apartamentoMorador = morador?.apartment?.number || "-";

  // ======== Tela de Cadastro ========
  async function carregarCadastro(reserva = null) {
    content.innerHTML = telasMoradorReservas["Reservar Espaço"];
    const form = content.querySelector(".form-cadastro-reserva");
    if (!form) return;

    if (reserva) {
      form.space.value = reserva.space || "";
      form.data_reserva.value = reserva.start_time
        ? new Date(reserva.start_time).toISOString().split("T")[0]
        : "";
      form.hora_inicio.value = reserva.start_time
        ? new Date(reserva.start_time).toISOString().substring(11, 16)
        : "";
      form.hora_fim.value = reserva.end_time
        ? new Date(reserva.end_time).toISOString().substring(11, 16)
        : "";

      form.dataset.id = reserva.id;
    } else {
      form.reset();
      form.removeAttribute("data-id");
    }
  }

  // ======== Tela de Histórico ========
async function carregarHistorico() {
  content.innerHTML = telasMoradorReservas["Minhas Reservas"];
  const tbody = content.querySelector("#tabelaReservasBody");
  if (!tbody) return;

  let reservas = [];
  try {
    reservas = await listarReservas();
  } catch (err) {
    console.error("Erro ao listar reservas:", err);
    alert("Não foi possível carregar as reservas.");
    return;
  }

  tbody.innerHTML = reservas.map(r => {
    const espaco = r.space || "-";
    const bloco = r.resident?.apartment?.block || "-";
    const apartamento = r.resident?.apartment?.number || "-";
    const dataInicio = r.start_time ? new Date(r.start_time).toLocaleString("pt-BR") : "-";
    const dataFim = r.end_time ? new Date(r.end_time).toLocaleString("pt-BR") : "-";

    return `
      <tr>
        <td>${espaco}</td>
        <td>${bloco}</td>
        <td>${apartamento}</td>
        <td>${dataInicio}</td>
        <td>${dataFim}</td>
        <td>
          <button class="btn-editar-reserva" data-id="${r.id}">Editar</button>
          <button class="btn-excluir-reserva" data-id="${r.id}">Excluir</button>
        </td>
      </tr>
    `;
  }).join("");

  attachReservasTableListener();
}



  // ======== Eventos da Tabela ========
  function attachReservasTableListener() {
    const tbody = content.querySelector("#tabelaReservasBody");
    if (!tbody) return;

    if (reservasTbodyListener) {
      try { tbody.removeEventListener("click", reservasTbodyListener); } catch {}
      reservasTbodyListener = null;
    }

    reservasTbodyListener = async function (e) {
      const btnEditar = e.target.closest(".btn-editar-reserva");
      const btnExcluir = e.target.closest(".btn-excluir-reserva");

      if (btnEditar) {
        e.stopPropagation();
        const id = btnEditar.dataset.id;
        const reservas = await listarReservas();
        const reserva = reservas.find(r => r.id == id);
        if (reserva) carregarCadastro(reserva);
        return;
      }

      if (btnExcluir) {
        e.stopPropagation();
        const id = btnExcluir.dataset.id;
        if (confirm("Deseja excluir esta reserva?")) {
          try {
            await deletarReserva(id);
            await carregarHistorico();
          } catch (err) {
            console.error(err);
            alert("Erro ao excluir reserva. Verifique e tente novamente.");
          }
        }
        return;
      }
    };

    tbody.addEventListener("click", reservasTbodyListener);
  }

  // ======== Evento de Envio do Formulário ========
  content.addEventListener("submit", async (e) => {
    if (!e.target.classList.contains("form-cadastro-reserva")) return;
    e.preventDefault();

    const form = e.target;
    const dados = {
      space: form.space.value.trim(),
      data: form.data_reserva.value,
      horaInicio: form.hora_inicio.value,
      horaFim: form.hora_fim.value,
    };

    try {
      if (form.dataset.id) {
        await atualizarReserva(form.dataset.id, dados);
        alert("Reserva atualizada com sucesso!");
      } else {
        await criarReserva(dados);
        alert("Reserva cadastrada com sucesso!");
      }
      //limpa o form
      form.reset();
    } catch (err) {
      console.error("Erro ao salvar reserva:", err);
      alert("Não foi possível salvar a reserva. Verifique e tente novamente.");
    }
  });

  // ======== Navegação do Menu ========
  const menu = document.querySelector("#menuReservas");
  if (menu) {
    menu.addEventListener("click", (e) => {
      if (!e.target.classList.contains("subitem")) return;
      const item = e.target.textContent.trim();

      if (item === "Reservar Espaço") carregarCadastro();
      if (item === "Minhas Reservas") carregarHistorico();
    });
  }
});
