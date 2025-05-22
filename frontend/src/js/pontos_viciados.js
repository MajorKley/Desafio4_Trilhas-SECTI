let map;
let markers = [];
let searchCircle;
let infoWindow;
let currentSearchCenter;
let currentSearchRadius;


async function initMap() {
  const initialPosition = { lat: -2.5391, lng: -44.2829 };
  
  const mapOptions = {
    center: initialPosition,
    zoom: 13,
    mapTypeControl: true,
    streetViewControl: false,
    fullscreenControl: true,
  };
  

  map = new google.maps.Map(document.getElementById("map"), mapOptions);

  infoWindow = new google.maps.InfoWindow();
  
  await carregarPontosDenuncia();
  
  carregarPontosViciados();
  
  configurarBuscaEndereco();

  adicionarCirculoBusca(initialPosition);
}

async function carregarPontosDenuncia() {
  const geocoder = new google.maps.Geocoder();
  try {
    const response = await axios.get(`${window.APP_CONFIG.API_URL}/api/denuncia/listarTodos`);
    const denuncias = response.data;

    for (const denuncia of denuncias) {
      const autor = await axios.get(`${window.APP_CONFIG.API_URL}/api/usuario/buscarNomePorDenunciaId/${denuncia.id_denuncia}`);
      if (!denuncia.latitude || !denuncia.longitude) continue;

      const position = {
        lat: denuncia.latitude,
        lng: denuncia.longitude
      };

      // 3. Definir ícones por status
      const icon = {
        url: denuncia.status === "RESOLVIDO"
            ? "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
            : "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
        scaledSize: new google.maps.Size(32, 32)
      };

      const marker = new google.maps.Marker({
        position: position,
        map: map,
        title: denuncia.titulo,
        icon: icon,
        category: denuncia.status === "RESOLVIDO" ? "resolved" : "pending"
      });

      // 4. Configurar conteúdo do popup
      geocoder.geocode({ location: position }, (results, status) => {
        let endereco = "Endereço não encontrado";

        if (status === "OK" && results[0]) {
          endereco = results[0].formatted_address;
          marker.setTitle(endereco);
        }

        marker.addListener("click", () => {
          const content = `
          <div style="padding: 10px; max-width: 300px;">
            <h3 style="margin: 0 0 5px; color: ${denuncia.status === "RESOLVIDO" ? "#51cf66" : "#ff6b6b"};">${denuncia.titulo}</h3>
            <p style="margin: 0 0 5px;"><strong>Data:</strong> ${new Date(denuncia.data).toLocaleDateString()}</p>
            ${!denuncia.anonimo ? `<p style="margin: 0 0 5px;"><strong>Autor:</strong> ${autor.data}</p>` : ''}
            <p style="margin: 0 0 5px;"><strong>Local:</strong> ${endereco}</p>
            <p style="margin: 0 0 5px;"><strong>Descrição:</strong> ${denuncia.descricao}</p>
            ${denuncia.fotos && denuncia.fotos.length > 0 ?
              '<div style="margin-top: 10px;">' +
              denuncia.fotos.map(foto =>
                  `<img src="${foto}" style="width: 100%; margin-bottom: 5px;" alt="Foto da denúncia">`
              ).join('') +
              '</div>' : ''}
          </div>
        `;

          infoWindow.setContent(content);
          infoWindow.open(map, marker);
        });
      });

      markers.push(marker);
    }

  } catch (error) {
    console.error("Erro ao carregar denúncias:", error);
    alert("Erro ao carregar dados do servidor");
  }
}

function carregarPontosViciados() {
  const pontosViciados = [
    { lat: -2.5291, lng: -44.2729, descricao: "Descarte irregular frequente de entulhos" },
    { lat: -2.5491, lng: -44.2929, descricao: "Acúmulo de lixo doméstico" },
    { lat: -2.5391, lng: -44.3029, descricao: "Descarte de resíduos de construção" },
    { lat: -2.5191, lng: -44.2629, descricao: "Lixo eletrônico e materiais tóxicos" },
    { lat: -2.5591, lng: -44.2529, descricao: "Descarte irregular recorrente" }
  ];
  
  const geocoder = new google.maps.Geocoder();
  
  pontosViciados.forEach(ponto => {
    const position = {
      lat: ponto.lat,
      lng: ponto.lng
    };
    
    const icon = {
      url: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
      scaledSize: new google.maps.Size(32, 32)
    };
    
    const marker = new google.maps.Marker({
      position: position,
      map: map,
      title: "Carregando endereço...",
      icon: icon,
      category: "hotspot"
    });
    
    geocoder.geocode({ location: position }, (results, status) => {
      let endereco = "Endereço não encontrado";
      
      if (status === "OK" && results[0]) {
        endereco = results[0].formatted_address;
        marker.setTitle(endereco);
      }
      
      marker.addListener("click", () => {
        const content = `
          <div style="padding: 10px; max-width: 300px;">
            <h3 style="margin: 0 0 5px; color: #fcc419;">Ponto de Descarte Irregular</h3>
            <p style="margin: 0 0 5px;"><strong>Endereço:</strong> ${endereco}</p>
            <p style="margin: 0;">${ponto.descricao}</p>
          </div>
        `;
        
        infoWindow.setContent(content);
        infoWindow.open(map, marker);
      });
    });
    markers.push(marker);
  });
}

function configurarBuscaEndereco() {
  const searchButton = document.getElementById("search-button");
  const addressInput = document.getElementById("address-input");
  const radiusSelect = document.getElementById("search-radius");
  
  const autocomplete = new google.maps.places.Autocomplete(addressInput);
  
  searchButton.addEventListener("click", realizarBusca);
  
  addressInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      realizarBusca();
    }
  });
  
  radiusSelect.addEventListener("change", () => {
    if (searchCircle && currentSearchCenter) {
      const novoRaio = parseInt(radiusSelect.value);
      currentSearchRadius = novoRaio;
      searchCircle.setRadius(novoRaio);
      
      ajustarZoomParaRaio(novoRaio);
      
      filtrarMarcadoresPorRaio(currentSearchCenter, novoRaio);
      
      atualizarEstatisticas(currentSearchCenter, novoRaio);
    }
  });
  
  function realizarBusca() {
    const address = addressInput.value;
    
    if (!address) return;

    const geocoder = new google.maps.Geocoder();
    
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location;
        currentSearchCenter = location.toJSON();
        
        map.setCenter(location);
        
        const raio = parseInt(radiusSelect.value);
        currentSearchRadius = raio;
        
        adicionarCirculoBusca(currentSearchCenter, raio);
        
        ajustarZoomParaRaio(raio);
        
        filtrarMarcadoresPorRaio(currentSearchCenter, raio);
        
        atualizarEstatisticas(currentSearchCenter, raio);
      } else {
        alert("Não foi possível encontrar o endereço. Por favor, tente novamente.");
      }
    });
  }
  
  function ajustarZoomParaRaio(raio) {
    let zoom = 15;
    
    if (raio >= 5000) zoom = 12;
    else if (raio >= 2000) zoom = 13;
    else if (raio >= 1000) zoom = 14;
    
    map.setZoom(zoom);
  }
}

function adicionarCirculoBusca(center, raio = 1000) {
  if (searchCircle) {
    searchCircle.setMap(null);
  }
  
  searchCircle = new google.maps.Circle({
    strokeColor: "#4dabf7",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#4dabf7",
    fillOpacity: 0.1,
    map: map,
    center: center,
    radius: raio
  });
}

function filtrarMarcadoresPorRaio(center, raio) {

  const centerLatLng = new google.maps.LatLng(center.lat, center.lng);
  
  markers.forEach(marker => {
    const markerLatLng = marker.getPosition();
    const distancia = google.maps.geometry.spherical.computeDistanceBetween(centerLatLng, markerLatLng);
    const dentroDoRaio = distancia <= raio;

    if (dentroDoRaio) {
      marker.setOpacity(1.0);
    } else {
      marker.setOpacity(0.4); 
    }
  });
}

function atualizarEstatisticas(center, raio) {
  const centerLatLng = new google.maps.LatLng(center.lat, center.lng);

  let totalDentroRaio = 0;
  let pendentes = 0;
  let resolvidas = 0;
  let pontosViciados = 0;
  
  markers.forEach(marker => {
    const markerLatLng = marker.getPosition();
    const distancia = google.maps.geometry.spherical.computeDistanceBetween(centerLatLng, markerLatLng);
    
    if (distancia <= raio) {
      totalDentroRaio++;
  
      if (marker.category === "pending") {
        pendentes++;
      } else if (marker.category === "resolved") {
        resolvidas++;
      } else if (marker.category === "hotspot") {
        pontosViciados++;
      }
    }
  });
  
  const statsElement = document.getElementById("search-stats");
  
  if (totalDentroRaio > 0) {
    statsElement.innerHTML = `
      <p><strong>Total de pontos:</strong> ${totalDentroRaio}</p>
      <p><strong>Denúncias pendentes:</strong> ${pendentes}</p>
      <p><strong>Denúncias resolvidas:</strong> ${resolvidas}</p>
      <p><strong>Pontos viciados:</strong> ${pontosViciados}</p>
    `;
  } else {
    statsElement.innerHTML = `
      <p>Nenhum ponto encontrado nesta área.</p>
      <p>Tente aumentar o raio de busca ou pesquisar outro endereço.</p>
    `;
  }
}