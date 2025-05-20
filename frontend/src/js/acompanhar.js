document.addEventListener("DOMContentLoaded", () => {
  if (!isLoggedIn()) {
    window.location.href = "login.html";
    return;
  }

  adicionarDenunciasExemplo();

  carregarDenuncias();

  setupEventListeners();

  setupModal();

  setupMapView();
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
  const denunciasExistentes = JSON.parse(
    localStorage.getItem("ecodenunciaDenuncias") || "[]"
  );

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
      latitude: -2.5391,
      longitude: -44.2829,
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
      latitude: -2.53,
      longitude: -44.27,
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
      latitude: -2.545,
      longitude: -44.26,
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
      latitude: -2.55,
      longitude: -44.29,
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
      latitude: -2.52,
      longitude: -44.265,
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
      latitude: -2.535,
      longitude: -44.275,
      data: new Date(2024, 3, 5, 11, 45).toISOString(),
      status: "Resolvido",
      foto: null,
    },
  ];

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
  card.dataset.id = denuncia.id; 

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
    if (
      e.target.classList.contains("status-indicator") ||
      e.target.closest(".status-indicator")
    ) {
      const card = e.target.closest(".denuncia-card");
      if (card) {
        alternarStatusDenuncia(card.dataset.id);
      }
    }
  });
}

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
  const denuncia = denuncias.find((d) => d.id === id); 

  if (!denuncia) {
    alert("Denúncia não encontrada!");
    return;
  }

  const modal = document.getElementById("denuncia-modal");
  modal.dataset.denunciaId = denuncia.id;

  document.getElementById("modal-tipo").textContent =
    denuncia.tipo || "Não especificado";
  document.getElementById("modal-endereco").textContent =
    denuncia.endereco || "Não especificado";
  document.getElementById("modal-cidade").textContent =
    denuncia.cidade || "Não especificada";

  const statusElement = document.getElementById("modal-status");
  statusElement.textContent = denuncia.status || "Pendente";
  statusElement.className = `info-value ${
    denuncia.status === "Resolvido" ? "text-green-600" : "text-red-600"
  }`;

  document.getElementById("modal-data").textContent = new Date(
    denuncia.data
  ).toLocaleString();
  document.getElementById("modal-descricao").textContent =
    denuncia.descricao || "Sem descrição";

  // adiciona coordenadas ao modal
  if (document.getElementById("modal-coordenadas")) {
    if (denuncia.latitude && denuncia.longitude) {
      document.getElementById("modal-coordenadas").textContent = `${parseFloat(
        denuncia.latitude
      ).toFixed(6)}, ${parseFloat(denuncia.longitude).toFixed(6)}`;
    } else {
      document.getElementById("modal-coordenadas").textContent =
        "Não disponível";
    }
  }

  // verificação de existência de foto
  const fotoContainer = document.getElementById("modal-foto-container");
  if (denuncia.foto) {
    document.getElementById("modal-foto").src = denuncia.foto;
    fotoContainer.style.display = "block";
  } else {
    fotoContainer.style.display = "none";
  }


  const alternarStatusBtn = document.getElementById("modal-alternar-status");
  alternarStatusBtn.textContent =
    denuncia.status === "Resolvido"
      ? "Marcar como Pendente"
      : "Marcar como Resolvido";

 
  alternarStatusBtn.className =
    denuncia.status === "Resolvido"
      ? "btn btn-accent" 
      : "btn btn-primary"; 

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

 
  const card = document.querySelector(`.denuncia-card[data-id="${id}"]`);
  if (card) {
    if (denuncias[index].status === "Resolvido") {
      card.classList.remove("pendente");
      card.classList.add("resolvida");

      const resolvidasContainer = document.querySelector(
        ".denuncias-resolvidas"
      );
      if (resolvidasContainer) {
        resolvidasContainer.appendChild(card);
      }
    } else {
      card.classList.remove("resolvida");
      card.classList.add("pendente");

      const pendentesContainer = document.querySelector(".denuncias-pendentes");
      if (pendentesContainer) {
        pendentesContainer.appendChild(card);
      }
    }

    const statusIndicator = card.querySelector(".status-indicator");
    if (statusIndicator) {
      if (denuncias[index].status === "Resolvido") {
        statusIndicator.classList.add("resolvido");
        statusIndicator.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Resolvido
        `;
      } else {
        statusIndicator.classList.remove("resolvido");
        statusIndicator.textContent = "Pendente";
      }
    }
  }

  carregarDenuncias();

  if (typeof denunciasMap !== "undefined" && denunciasMap !== null) {
    carregarDenunciasNoMapa();
  }
}

// ===== CÓDIGO DO MAPA =====

let denunciasMap;
let markers = [];
let mapInitialized = false;

function setupMapView() {
  const viewListBtn = document.getElementById("view-list");
  const viewMapBtn = document.getElementById("view-map");

  if (!viewListBtn || !viewMapBtn) return;

  viewListBtn.addEventListener("click", function () {
    this.classList.add("active");
    viewMapBtn.classList.remove("active");
    document.getElementById("list-view").style.display = "block";
    document.getElementById("map-view").style.display = "none";
  });

  viewMapBtn.addEventListener("click", function () {
    this.classList.add("active");
    viewListBtn.classList.remove("active");
    document.getElementById("list-view").style.display = "none";
    document.getElementById("map-view").style.display = "block";

    if (!mapInitialized) {
      initMap();
    }
  });
}

function initMap() {
  if (document.getElementById("map-view").style.display === "none") {
    return;
  }

  mapInitialized = true;

  // utilizando as coordenadas iniciais como são luís
  const initialPosition = { lat: -2.5391, lng: -44.2829 };


  denunciasMap = new google.maps.Map(document.getElementById("denuncias-map"), {
    center: initialPosition,
    zoom: 12,
    mapTypeControl: true,
    streetViewControl: false,
    fullscreenControl: true,
  });

  carregarDenunciasNoMapa();
}

function carregarDenunciasNoMapa() {
  const denuncias = JSON.parse(
    localStorage.getItem("ecodenunciaDenuncias") || "[]"
  );

  if (denuncias.length === 0) {
    alert("Não há denúncias para exibir no mapa.");
    return;
  }

  markers.forEach((marker) => marker.setMap(null));
  markers = [];
  
  const bounds = new google.maps.LatLngBounds();

  denuncias.forEach((denuncia) => {
    if (!denuncia.latitude || !denuncia.longitude) {
      denuncia.latitude = -2.5391 + (Math.random() * 0.05 - 0.025);
      denuncia.longitude = -44.2829 + (Math.random() * 0.05 - 0.025);
    }

    const position = {
      lat: parseFloat(denuncia.latitude),
      lng: parseFloat(denuncia.longitude),
    };

    const marker = new google.maps.Marker({
      position: position,
      map: denunciasMap,
      title: denuncia.tipo,
      icon: {
        url:
          denuncia.status == "Resolvido"
            ? "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
            : "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
      },
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="padding: 0.625rem; max-width: 12.5rem;">
          <h3 style="margin: 0 0 0.3125rem; color: ${
            denuncia.status === "Resolvido" ? "#14592a" : "#d93c4a"
          }; font-size: 1rem;">${denuncia.tipo}</h3>
          <p style="margin: 0 0 0.3125rem; font-size: 0.875rem;">${
            denuncia.endereco
          }</p>
          <p style="margin: 0; color: #666; font-size: 0.75rem;">Status: ${
            denuncia.status
          }</p>
          <button onclick="visualizarDenuncia('${
            denuncia.id
          }')" style="margin-top: 0.3125rem; padding: 0.3125rem 0.625rem; background-color: #c0b40a; border: none; border-radius: 0.3125rem; cursor: pointer; font-size: 0.75rem;">Visualizar</button>
        </div>
      `,
    });

    marker.addListener("click", () => {
      infoWindow.open(denunciasMap, marker);
    });

    markers.push(marker);

    bounds.extend(position);
  });

  if (markers.length > 0) {
    denunciasMap.fitBounds(bounds);
  }
}
