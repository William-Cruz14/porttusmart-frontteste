async function listarApartamentos() {
  const token = localStorage.getItem("access_token");

  let url = "https://api.porttusmart.tech/api/v1/core/apartments/";
  let results = [];

  try {
    while (url) {
      const res = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        console.error("Erro ao carregar apartamentos:", res.status);
        return { results: [] };
      }

      const data = await res.json();

      if (data.results) {
        results = results.concat(data.results);
      }

      url = data.next
        ? data.next.replace("http://", "https://")
        : null;
    }

    return { results };
  } catch (err) {
    console.error("Erro ao buscar apartamentos:", err);
    return { results: [] };
  }
}
