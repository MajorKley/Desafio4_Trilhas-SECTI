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

async function carregarDenuncias() {
  const user = localStorage.getItem("ecodenunciaUser");
  const userData = JSON.parse(user);
  const userId = userData.userId;

  if (!userId) {
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await axios.get(`${window.APP_CONFIG.API_URL}/api/denuncia/buscarPorUsuario/${userId}`);
    const denuncias = response.data.map(d => ({
      ...d,
      id: d.id_denuncia,
      fotos: d.fotos,
      // Converter status
      status: d.status === "RESOLVIDO" ? "Resolvido" : "Pendente",
      endereco: "Carregando..." // Será preenchido pela geocodificação
    }));

    await processarGeocodificacao(denuncias);
    renderizarDenuncias(denuncias);
  } catch (error) {
    console.error("Erro detalhado:", error.response?.data || error.message);
    alert("Erro ao carregar denúncias");
  }
}

async function processarGeocodificacao(denuncias) {
  const geocoder = new google.maps.Geocoder();

  for (const denuncia of denuncias) {
    if (denuncia.latitude && denuncia.longitude) {
      try {
        const response = await new Promise((resolve, reject) => {
          geocoder.geocode(
              { location: { lat: denuncia.latitude, lng: denuncia.longitude } },
              (results, status) => status === "OK" ? resolve(results) : reject(status)
          );
        });

        denuncia.endereco = response[0]?.formatted_address || "Endereço não encontrado";
      } catch {
        denuncia.endereco = "Erro ao geocodificar";
      }
    } else {
      denuncia.endereco = "Coordenadas não disponíveis";
    }
  }
}

function renderizarDenuncias(denuncias) {
  const pendentesContainer = document.querySelector(".denuncias-pendentes");
  const resolvidasContainer = document.querySelector(".denuncias-resolvidas");

  // Limpar containers
  pendentesContainer.innerHTML = "";
  resolvidasContainer.innerHTML = "";

  // Separar denúncias
  const pendentes = denuncias.filter(d => d.status === "Pendente");
  const resolvidas = denuncias.filter(d => d.status === "Resolvido");

  // Renderizar pendentes
  if (pendentes.length === 0) {
    pendentesContainer.innerHTML = "<p class='sem-denuncias'>Não há denúncias pendentes.</p>";
  } else {
    pendentes.forEach(denuncia => {
      pendentesContainer.appendChild(criarCardDenuncia(denuncia, false));
    });
  }

  // Renderizar resolvidas
  if (resolvidas.length === 0) {
    resolvidasContainer.innerHTML = "<p class='sem-denuncias'>Não há denúncias resolvidas.</p>";
  } else {
    resolvidas.forEach(denuncia => {
      resolvidasContainer.appendChild(criarCardDenuncia(denuncia, true));
    });
  }

  // Atualizar mapa se necessário
  if (document.getElementById("map-view").style.display === "block") {
    carregarDenunciasNoMapa();
  }
}

function criarCardDenuncia(denuncia, resolvida) {
  // Ajuste na formatação da data (assumindo que a API envia ISO string)
  const dataArray = denuncia.data;
  const data = new Date(dataArray[0], dataArray[1] - 1, dataArray[2]);
  const dataFormatada = `${data.getDate().toString().padStart(2, "0")}/${(data.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${data.getFullYear().toString().slice(2)}`;

  const card = document.createElement("div");
  card.className = `denuncia-card ${resolvida ? "resolvida" : "pendente"}`;
  card.dataset.id = denuncia.id;

  // Gerar miniaturas das fotos
  const fotosHTML = denuncia.fotos ? Object.entries(denuncia.fotos)
      .filter(([key]) => key.startsWith('foto'))
      .map(([_, value]) => `
      <img src="data:image/jpeg;base64,${value}" alt="Foto da denúncia" class="denuncia-thumb">
    `).join('') : '';

  card.innerHTML = `
    <div class="card-content">
      <div class="card-info">
        <h3 class="local-nome">${denuncia.endereco || "Local não identificado"}</h3>
        <p class="tipo-denuncia">${denuncia.titulo || "Sem título"}</p>
        <p class="data-hora">${dataFormatada}</p>
        ${fotosHTML ? `<div class="denuncia-thumbs">${fotosHTML}</div>` : ''}
      </div>
      <div class="card-status">
        ${resolvida ? `
          <span class="status-indicator resolvido">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Resolvido
          </span>` :
      `<span class="status-indicator">Pendente</span>`}
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

  document.querySelector('.modal-close').addEventListener('click', () => {
    modal.style.display = 'none';
    // Mantém os elementos no DOM
  });

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

async function visualizarDenuncia(id) {
  try {
    const response = await axios.get(`${window.APP_CONFIG.API_URL}/api/denuncia/buscarPorId/${id}`);
    const denuncia = response.data;

    if (!denuncia) {
      alert("Denúncia não encontrada!");
      return;
    }

    // Converter estrutura do JSON recebido
    const denunciaAdaptada = {
      id: denuncia.id_denuncia,
      titulo: denuncia.titulo,
      descricao: denuncia.descricao,
      latitude: denuncia.latitude,
      longitude: denuncia.longitude,
      status: denuncia.status === "RESOLVIDO" ? "Resolvido" : "Pendente",
      data: new Date(denuncia.data[0], denuncia.data[1] - 1, denuncia.data[2]),
      fotos: denuncia.fotos || null
    };

    const modal = document.getElementById('denuncia-modal');

    // Garantir que o modal existe
    if (!modal) {
      console.error('Modal não encontrado');
      return;
    }

    // Obter elementos DENTRO do modal
    const fotoContainer = modal.querySelector('#modal-foto-container');
    let fotosContent = modal.querySelector('.info-value');

    // Reset seguro
    if (fotosContent) {
      fotosContent.innerHTML = '';
    } else {
      console.warn('Container de fotos não encontrado, criando novo...');
      const newContent = document.createElement('div');
      newContent.className = 'info-value';
      fotoContainer.appendChild(newContent);
      fotosContent = newContent;
    }

    // Listar todas as fotos disponíveis
    if (denunciaAdaptada.fotos) {
      // Converter o objeto de fotos em array e filtrar entradas válidas
      const fotosArray = Object.entries(denunciaAdaptada.fotos)
          .filter(([key, value]) => key.startsWith('foto') && value)
          .map(([_, value]) => value);

      if (fotosArray.length > 0) {
        fotoContainer.style.display = "block";
        fotosArray.forEach((foto, index) => {
          const imgWrapper = document.createElement('div');
          imgWrapper.className = 'foto-wrapper';
          imgWrapper.innerHTML = `
            <img src="data:image/jpeg;base64,${foto}" 
                 alt="Foto ${index + 1} da denúncia" 
                 class="modal-foto"
                 onclick="ampliarFoto(this)">
            <span class="foto-indicator">Foto ${index + 1}</span>
          `;
          fotosContent.appendChild(imgWrapper);
        });
      }
    }

    // Atualizar conteúdo do modal
    document.getElementById("modal-tipo").textContent = denunciaAdaptada.titulo;
    document.getElementById("modal-descricao").textContent = denunciaAdaptada.descricao;
    document.getElementById("modal-coordenadas").textContent =
        `${denunciaAdaptada.latitude?.toFixed(6)}, ${denunciaAdaptada.longitude?.toFixed(6)}`;

    // Geocodificação em tempo real para o endereço
    if (denunciaAdaptada.latitude && denunciaAdaptada.longitude) {
      document.getElementById("modal-endereco").textContent = "Buscando endereço...";

      new google.maps.Geocoder().geocode(
          { location: { lat: denunciaAdaptada.latitude, lng: denunciaAdaptada.longitude } },
          (results, status) => {
            document.getElementById("modal-endereco").textContent =
                status === "OK" ? results[0]?.formatted_address : "Endereço não encontrado";
          }
      );
    } else {
      document.getElementById("modal-endereco").textContent = "Coordenadas não disponíveis";
    }

    // Atualizar status
    const statusElement = document.getElementById("modal-status");
    statusElement.textContent = denunciaAdaptada.status;
    statusElement.className = `info-value ${denunciaAdaptada.status === "Resolvido" ? "text-green-600" : "text-red-600"}`;

    // Atualizar data
    document.getElementById("modal-data").textContent = denunciaAdaptada.data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Atualizar fotos no modal
    const fotosContainer = document.getElementById("modal-foto-container");
    fotosContainer.innerHTML = ''; // Limpar fotos antigas

    if (denunciaAdaptada.fotos) {
      Object.entries(denunciaAdaptada.fotos).forEach(([key, value]) => {
        if (key.startsWith('foto') && value) {
          const img = document.createElement('img');
          img.src = `data:image/jpeg;base64,${value}`;
          img.className = 'modal-foto';
          fotosContainer.appendChild(img);
        }
      });
      fotosContainer.style.display = "block";
    } else {
      fotosContainer.style.display = "none";
    }

    // Configurar botão de alternância
    const alternarStatusBtn = document.getElementById("modal-alternar-status");
    alternarStatusBtn.textContent = denunciaAdaptada.status === "Resolvido"
        ? "Marcar como Pendente"
        : "Marcar como Resolvido";

    alternarStatusBtn.className = denunciaAdaptada.status === "Resolvido"
        ? "btn btn-accent"
        : "btn btn-primary";

    modal.style.display = "block";

  } catch (error) {
    console.error("Erro ao visualizar denúncia:", error.response?.data || error.message);
    alert("Erro ao carregar detalhes da denúncia");
  }
}

window.ampliarFoto = function(imgElement) {
  const overlay = document.createElement('div');
  overlay.className = 'foto-overlay';
  overlay.onclick = (e) => {
    if (e.target === overlay) overlay.remove();
  };

  const imgAmpliada = document.createElement('img');
  imgAmpliada.src = imgElement.src;
  imgAmpliada.className = 'foto-ampliada';

  const btnFechar = document.createElement('button');
  btnFechar.className = 'btn-fechar';
  btnFechar.innerHTML = '×';
  btnFechar.onclick = () => overlay.remove();

  overlay.appendChild(imgAmpliada);
  overlay.appendChild(btnFechar);
  document.body.appendChild(overlay);
};

async function alternarStatusDenuncia(id) {
  try {
    // Buscar denúncia atual primeiro
    const response = await axios.get(`${window.APP_CONFIG.API_URL}/api/denuncia/buscarPorId/${id}`);
    const denunciaAtual = response.data;

    const novoStatus = denunciaAtual.status === "RESOLVIDO" ? "ENVIADO" : "RESOLVIDO";

    await axios.put(`${window.APP_CONFIG.API_URL}/api/denuncia/${id}`, {
      status: novoStatus
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    carregarDenuncias();
    if (mapInitialized) carregarDenunciasNoMapa();

  } catch (error) {
    console.error("Erro na alternância:", error.response?.data || error.message);
    alert("Erro ao atualizar status");
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

async function carregarDenunciasNoMapa() {
  try {
    const response = await axios.get(`${window.APP_CONFIG.API_URL}/api/denuncia/listarTodos`);
    const denuncias = response.data;

    markers.forEach(marker => marker.setMap(null));
    markers = [];
    const bounds = new google.maps.LatLngBounds();

    for (const denuncia of denuncias) {
      // Verificar e converter coordenadas
      const lat = parseFloat(denuncia.latitude);
      const lng = parseFloat(denuncia.longitude);

      if (isNaN(lat) || isNaN(lng)) {
        console.warn('Coordenadas inválidas:', denuncia.id_denuncia);
        continue;
      }

      const position = { lat, lng };

      // Criar marcador
      const marker = new google.maps.Marker({
        position,
        map: denunciasMap,
        title: denuncia.titulo,
        icon: {
          url: denuncia.status === "RESOLVIDO"
              ? "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
              : "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
          scaledSize: new google.maps.Size(32, 32)
        }
      });

      // InfoWindow com geocodificação
      const infoWindow = new google.maps.InfoWindow({
        content: `
    <div class="map-infowindow">
      <h3>${denuncia.titulo}</h3>
      <p><strong>Status:</strong> ${denuncia.status === "RESOLVIDO" ? "Resolvido" : "Pendente"}</p>
      ${denuncia.descricao ? `<p>${denuncia.descricao.substring(0, 50)}...</p>` : ''}
      <button onclick="visualizarDenuncia('${denuncia.id_denuncia}')">
        Ver detalhes
      </button>
    </div>
  `
      });

      marker.addListener('click', () => infoWindow.open(denunciasMap, marker));
      markers.push(marker);
      bounds.extend(position);
    }

    if (markers.length > 0) {
      denunciasMap.fitBounds(bounds);
    } else {
      denunciasMap.setCenter({ lat: -2.5391, lng: -44.2829 }); // Centro padrão
      denunciasMap.setZoom(12);
    }

  } catch (error) {
    console.error('Erro no mapa:', error);
    alert('Erro ao carregar denúncias no mapa');
  }
}
