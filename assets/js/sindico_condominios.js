document.addEventListener("DOMContentLoaded", async () => {
  const lista = document.getElementById("listaCondominios");

  try {
    const token = localStorage.getItem("access_token");

    const response = await fetch("https://api.porttusmart.tech/api/v1/core/condominiums/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const msg = await response.text();
      throw new Error(`Erro ao buscar condomínios: ${msg}`);
    }

    const data = await response.json();
    const condominios = data.results;

    if (!condominios || condominios.length === 0) {
      lista.innerHTML = "<p>Nenhum condomínio encontrado.</p>";
      return;
    }

    lista.innerHTML = ""; // limpa o texto "Carregando..."

    // Cria um item para cada condomínio retornado
    condominios.forEach((cond) => {
      const item = document.createElement("div");
      item.classList.add("item");
      item.textContent = cond.name;
      item.dataset.id = cond.id;

      // Ao clicar, salva o condomínio selecionado
      item.addEventListener("click", () => {
        // Remove destaque anterior
        document.querySelectorAll(".menu-fixed .item").forEach(i => i.classList.remove("active"));
        item.classList.add("active");

        // Salva o condomínio selecionado no localStorage
        localStorage.setItem("condominioSelecionado", JSON.stringify({
          id: cond.id,
          name: cond.name,
          code_condominium: cond.code_condominium
        }));
      });

      lista.appendChild(item);
    });

    // Opcional: se já tiver um condomínio salvo, marca ele como ativo
    const condSalvo = JSON.parse(localStorage.getItem("condominioSelecionado"));
    if (condSalvo) {
      const ativo = Array.from(lista.children).find(i => i.dataset.id == condSalvo.id);
      if (ativo) ativo.classList.add("active");
    }

  } catch (error) {
    console.error("❌ Erro:", error);
    lista.innerHTML = "<p style='color:red;'>Erro ao carregar lista de condomínios.</p>";
  }
});
