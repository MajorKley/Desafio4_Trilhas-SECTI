document.addEventListener("DOMContentLoaded", () => {
  if (!isLoggedIn()) {
    window.location.href = "login.html";
    return;
  }

  adicionarDenunciasExemplo();

  carregarDenuncias();

  setupEventListeners();

  setupModal();
});

function isLoggedIn() {
  const user = localStorage.getItem("ecodenunciaUser");
  if (user) {
    const userData = JSON.parse(user);
    return userData.loggedIn === true;
  }
  return false;
}


function adicionarDenunciasExemplo() {
  // verifica se já existem denúncias
  const denunciasExistentes = JSON.parse(
    localStorage.getItem("ecodenunciaDenuncias") || "[]"
  );

  // se já existirem denúncias, não adicionar exemplos
  if (denunciasExistentes.length > 0) {
    return;
  }


  const denunciasExemplo = [
    {
      id: "exemplo-1",
      tipo: "Descarte irregular de lixo",
      descricao:
        "Entulho de construção descartado em terreno baldio, atraindo insetos e roedores.",
      endereco: "Rua das Flores, 123 - Centro",
      cidade: "São Luís",
      data: new Date(2024, 3, 25, 10, 30).toISOString(),
      status: "Pendente",
      foto: null,
    },
    {
      id: "exemplo-2",
      tipo: "Descarte irregular de lixo",
      descricao:
        "Entulho de construção descartado em terreno baldio, atraindo insetos e roedores.",
      endereco: "Rua das Flores, 123 - Cohama",
      cidade: "São Luís",
      data: new Date(2024, 3, 22, 14, 45).toISOString(),
      status: "Pendente",
      foto: null,
    },
    {
      id: "exemplo-3",
      tipo: "Descarte irregular de lixo",
      descricao:
        "Entulho de construção descartado em terreno baldio, atraindo insetos e roedores.",
      endereco: "Rua das Flores, 123 - Cohajap",
      cidade: "São Luís",
      data: new Date(2024, 3, 18, 9, 15).toISOString(),
      status: "Resolvido",
      foto: null,
    },
    {
      id: "exemplo-4",
      tipo: "Descarte irregular de lixo",
      descricao:
        "Entulho de construção descartado em terreno baldio, atraindo insetos e roedores.",
      endereco: "Rua das Flores, 123 - Maiobão",
      cidade: "São Luís",
      data: new Date(2024, 3, 15, 23, 20).toISOString(),
      status: "Resolvido",
      foto: null,
    },
    {
      id: "exemplo-5",
      tipo: "Descarte irregular de lixo",
      descricao:
        "Entulho de construção descartado em terreno baldio, atraindo insetos e roedores.",
      endereco: "Rua das Palmeiras, 321 - Avenida dos Holandeses",
      cidade: "São Luís",
      data: new Date(2024, 3, 10, 16, 10).toISOString(),
      status: "Pendente",
      foto: null,
    },
    {
      id: "exemplo-6",
      tipo: "Descarte irregular de lixo",
      descricao:
        "Entulho de construção descartado em terreno baldio, atraindo insetos e roedores.",
      endereco: "Rua das Flores, 123 - Tirirical",
      cidade: "São Luís",
      data: new Date(2024, 3, 5, 11, 45).toISOString(),
      status: "Resolvido",
      foto: null,
    },
  ];

  // salva no localStorage
  localStorage.setItem(
    "ecodenunciaDenuncias",
    JSON.stringify(denunciasExemplo)
  );
}

function carregarDenuncias() {
  const denuncias = JSON.parse(
    localStorage.getItem("ecodenunciaDenuncias") || "[]"
  );
  const denunciasPendentes = document.querySelector(".denuncias-pendentes");
  const denunciasResolvidas = document.querySelector(".denuncias-resolvidas");

  // limpar conteúdo atual
  denunciasPendentes.innerHTML = "";
  denunciasResolvidas.innerHTML = "";

  if (denuncias.length === 0) {
    denunciasPendentes.innerHTML =
      "<p class='sem-denuncias'>Você ainda não possui denúncias registradas.</p>";
    return;
  }

  // filtra as denúncias por status
  const pendentes = denuncias.filter((d) => d.status !== "Resolvido");
  const resolvidas = denuncias.filter((d) => d.status === "Resolvido");

  // renderiza as denúncias pendentes
  if (pendentes.length === 0) {
    denunciasPendentes.innerHTML =
      "<p class='sem-denuncias'>Não há denúncias pendentes.</p>";
  } else {
    pendentes.forEach((denuncia) => {
      denunciasPendentes.appendChild(criarCardDenuncia(denuncia, false));
    });
  }

  // renderiza as denúncias resolvidas
  if (resolvidas.length === 0) {
    denunciasResolvidas.innerHTML =
      "<p class='sem-denuncias'>Não há denúncias resolvidas.</p>";
  } else {
    resolvidas.forEach((denuncia) => {
      denunciasResolvidas.appendChild(criarCardDenuncia(denuncia, true));
    });
  }
}

function criarCardDenuncia(denuncia, resolvida) {
  const data = new Date(denuncia.data);
  const dataFormatada = `${data.getDate().toString().padStart(2, "0")}/${(
    data.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${data.getFullYear().toString().slice(2)}`;
  const horaFormatada = `${data.getHours().toString().padStart(2, "0")}:${data
    .getMinutes()
    .toString()
    .padStart(2, "0")}h`;

  const card = document.createElement("div");
  card.className = `denuncia-card ${resolvida ? "resolvida" : "pendente"}`;
  card.dataset.id = denuncia.id; // usa o ID único da denúncia

  card.innerHTML = `
    <div class="card-content">
      <div class="card-info">
        <h3 class="local-nome">${denuncia.endereco || "Nome do Local"}</h3>
        <p class="tipo-denuncia">${denuncia.tipo || "Tipo não especificado"}</p>
        <p class="data-hora"><span>${dataFormatada}</span> • <span>${horaFormatada}</span></p>
      </div>
      <div class="card-status">
        ${
          resolvida
            ? `<span class="status-indicator resolvido">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Resolvido
          </span>`
            : `<span class="status-indicator">Pendente</span>`
        }
      </div>
    </div>
    <div class="card-actions">
      <button class="btn-visualizar">Visualizar</button>
    </div>
  `;

  return card;
}

function setupEventListeners() {
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-denunciar")) {
      const card = e.target.closest(".denuncia-card");
      if (card) {
        window.location.href = "denuncia.html?ref=" + card.dataset.id;
      }
    }

    if (e.target.classList.contains("btn-visualizar")) {
      const card = e.target.closest(".denuncia-card");
      if (card) {
        visualizarDenuncia(card.dataset.id);
      }
    }

    // status resolvido (para alternar)
    if (e.target.classList.contains("status-indicator")) {
      const card = e.target.closest(".denuncia-card");
      if (card) {
        alternarStatusDenuncia(card.dataset.id);
      }
    }
  });
}

// configuração do modal
function setupModal() {
  const modal = document.getElementById("denuncia-modal");
  const closeBtn = document.querySelector(".modal-close");
  const alternarStatusBtn = document.getElementById("modal-alternar-status");


  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });


  // fehca o modal ao clicar fora dele
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // alterna o status ao clicar no botão "Alterar Status"
  alternarStatusBtn.addEventListener("click", () => {
    const denunciaId = modal.dataset.denunciaId;
    if (denunciaId) {
      alternarStatusDenuncia(denunciaId);
      modal.style.display = "none";
    }
  });
}

function visualizarDenuncia(id) {
  const denuncias = JSON.parse(
    localStorage.getItem("ecodenunciaDenuncias") || "[]"
  );
  const denuncia = denuncias.find((d) => d.id === id); // encontra pelo ID 

  if (!denuncia) {
    alert("Denúncia não encontrada!");
    return;
  }

  // preenchimento de dados no modal
  const modal = document.getElementById("denuncia-modal");
  modal.dataset.denunciaId = denuncia.id;

  document.getElementById("modal-tipo").textContent =
    denuncia.tipo || "Não especificado";
  document.getElementById("modal-endereco").textContent =
    denuncia.endereco || "Não especificado";
  document.getElementById("modal-cidade").textContent =
    denuncia.cidade || "Não especificada";
  document.getElementById("modal-status").textContent =
    denuncia.status || "Pendente";
  document.getElementById("modal-data").textContent = new Date(
    denuncia.data
  ).toLocaleString();
  document.getElementById("modal-descricao").textContent =
    denuncia.descricao || "Sem descrição";

  // verificação de existência de foto
  const fotoContainer = document.getElementById("modal-foto-container");
  if (denuncia.foto) {
    document.getElementById("modal-foto").src = denuncia.foto;
    fotoContainer.style.display = "block";
  } else {
    fotoContainer.style.display = "none";
  }

  // atualiza o texto do botão de alternar status
  const alternarStatusBtn = document.getElementById("modal-alternar-status");
  alternarStatusBtn.textContent =
    denuncia.status === "Resolvido"
      ? "Marcar como Pendente"
      : "Marcar como Resolvido";

  modal.style.display = "block";
}

function alternarStatusDenuncia(id) {
  const denuncias = JSON.parse(
    localStorage.getItem("ecodenunciaDenuncias") || "[]"
  );
  const index = denuncias.findIndex((d) => d.id === id); 

  if (index === -1) {
    alert("Denúncia não encontrada!");
    return;
  }

  denuncias[index].status =
    denuncias[index].status === "Resolvido" ? "Pendente" : "Resolvido";

  localStorage.setItem("ecodenunciaDenuncias", JSON.stringify(denuncias));

  carregarDenuncias();
}
