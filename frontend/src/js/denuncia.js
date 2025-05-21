document.addEventListener("DOMContentLoaded", function () {
  if (!isLoggedIn()) {
    window.location.href = "login.html";
    return;
  }

  setupForm();

  setupImagePreview();
});

function isLoggedIn() {
  const user = localStorage.getItem("ecodenunciaUser");
  if (user) {
    const userData = JSON.parse(user);
    return userData.loggedIn === true;
  }
  return false;
}

let map;
let marker;
let geocoder;

function initMap() {
  console.log("Inicializando mapa...");
  const initialPosition = { lat: -2.5391, lng: -44.2829 };

  geocoder = new google.maps.Geocoder();

  map = new google.maps.Map(document.getElementById("map"), {
    center: initialPosition,
    zoom: 13,
    mapTypeControl: true,
    streetViewControl: false,
    fullscreenControl: true,
    scrollwheel: false, 
    gestureHandling: "cooperative", 
  });

  marker = new google.maps.Marker({
    position: initialPosition,
    map: map,
    draggable: true,
    animation: google.maps.Animation.DROP,
    title: "Arraste para o local da denúncia",
  });

  document.getElementById("latitude").value = initialPosition.lat;
  document.getElementById("longitude").value = initialPosition.lng;

  getAddressFromLatLng(initialPosition);

  map.addListener("click", (e) => {
    marker.setPosition(e.latLng);
    getAddressFromLatLng(e.latLng.toJSON());
  });

  marker.addListener("dragend", () => {
    const position = marker.getPosition().toJSON();
    getAddressFromLatLng(position);
  });

  const btnUsarLocalizacao = document.getElementById("btn-usar-localizacao");
  if (btnUsarLocalizacao) {
    btnUsarLocalizacao.addEventListener("click", useCurrentLocation);
    console.log("Botão de localização configurado");
  } else {
    console.error("Botão de localização não encontrado");
  }
}

function useCurrentLocation() {
  console.log("Obtendo localização atual...");
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        console.log("Localização obtida:", currentLocation);

        map.setCenter(currentLocation);
        marker.setPosition(currentLocation);

        // atualiza os campos de latitude e longitude
        document.getElementById("latitude").value = currentLocation.lat;
        document.getElementById("longitude").value = currentLocation.lng;

        getAddressFromLatLng(currentLocation);
      },
      (error) => {
        console.error("Erro ao obter localização:", error);
        let errorMessage = "Não foi possível obter sua localização atual.";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Você negou a permissão de localização.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Informações de localização indisponíveis.";
            break;
          case error.TIMEOUT:
            errorMessage = "Tempo esgotado ao obter localização.";
            break;
        }

        alert(errorMessage);
      }
    );
  } else {
    alert("Seu navegador não suporta geolocalização.");
  }
}

function getAddressFromLatLng(location) {
  console.log("Obtendo endereço para coordenadas:", location);
  geocoder.geocode({ location: location }, (results, status) => {
    if (status === "OK" && results && results[0]) {
      const address = results[0].formatted_address;
      console.log("Endereço obtido:", address);

      const enderecoElement = document.getElementById("selected-address");
      if (enderecoElement) {
        enderecoElement.textContent = address;
      }

      let enderecoInput = document.getElementById("endereco");
      if (!enderecoInput) {
        enderecoInput = document.createElement("input");
        enderecoInput.type = "hidden";
        enderecoInput.id = "endereco";
        enderecoInput.name = "endereco";
        document.getElementById("denuncia-form").appendChild(enderecoInput);
      }
      enderecoInput.value = address;

      let cidadeInput = document.getElementById("cidade");
      if (!cidadeInput) {
        cidadeInput = document.createElement("input");
        cidadeInput.type = "hidden";
        cidadeInput.id = "cidade";
        cidadeInput.name = "cidade";
        document.getElementById("denuncia-form").appendChild(cidadeInput);
      }

      // tenta extrair a cidade do endereço
      const addressParts = address.split(",");
      if (addressParts.length >= 2) {
        const possibleCity =
          addressParts[addressParts.length - 3]?.trim() ||
          addressParts[addressParts.length - 2]?.trim();

        cidadeInput.value = possibleCity || "";
      }

      document.getElementById("latitude").value = location.lat;
      document.getElementById("longitude").value = location.lng;
    } else {
      console.error("Erro na geocodificação:", status);

      const enderecoElement = document.getElementById("selected-address");
      if (enderecoElement) {
        enderecoElement.textContent = "Endereço não encontrado";
      }

      let enderecoInput = document.getElementById("endereco");
      if (!enderecoInput) {
        enderecoInput = document.createElement("input");
        enderecoInput.type = "hidden";
        enderecoInput.id = "endereco";
        enderecoInput.name = "endereco";
        document.getElementById("denuncia-form").appendChild(enderecoInput);
      }
      enderecoInput.value = "Endereço não encontrado";

      document.getElementById("latitude").value = location.lat;
      document.getElementById("longitude").value = location.lng;
    }
  });
}

function setupForm() {
  const form = document.getElementById("denuncia-form");

  if (!form) {
    console.error("Formulário não encontrado!");
    return;
  }

  console.log("Formulário encontrado, configurando event listener");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Obter dados do usuário logado
    const userData = JSON.parse(localStorage.getItem("ecodenunciaUser"));
    if (!userData || !userData.token) {
      alert("Faça login para enviar denúncias");
      window.location.href = "login.html";
      return;
    }

    // Obter dados do formulário
    const formData = {
      titulo: document.getElementById("tipo-denuncia").value,
      descricao: document.getElementById("descricao").value,
      latitude: parseFloat(document.getElementById("latitude").value),
      longitude: parseFloat(document.getElementById("longitude").value),
      anonimo: document.getElementById("anonimo").checked,
      fotos: []
    };

    // Obter fotos
    const fotoInput = document.getElementById("foto");
    const files = fotoInput.files;

    // Validar número de fotos
    if (files.length > 3) {
      alert("Máximo de 3 fotos permitidas");
      return;
    }

    try {
      // 1. Enviar denúncia
      const denunciaResponse = await axios.post(
          `${API_BASE_URL}/api/usuario/enviarDenuncia/${userData.userId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${userData.token}`,
              'Content-Type': 'application/json'
            }
          }
      );

      const denunciaId = denunciaResponse.data.id;

      // 2. Enviar fotos se houver
      if (files.length > 0) {
        const formDataFotos = new FormData();
        for (let i = 0; i < files.length; i++) {
          formDataFotos.append(`foto${i+1}`, files[i]);
        }

        await axios.post(
            `${API_BASE_URL}/api/fotos/${denunciaId}`,
            formDataFotos,
            {
              headers: {
                Authorization: `Bearer ${userData.token}`,
                'Content-Type': 'multipart/form-data'
              }
            }
        );
      }

      alert("Denúncia enviada com sucesso!");
      window.location.href = "acompanhar.html";
    } catch (error) {
      console.error("Erro:", error);
      alert(`Erro ao enviar denúncia: ${error.response?.data || error.message}`);
    }
  });
}

function setupImagePreview() {
  const fotoInput = document.getElementById("foto");
  if (fotoInput) {
    fotoInput.addEventListener("change", function (event) {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
          const previewImage = document.getElementById("preview-image");
          if (previewImage) {
            previewImage.src = e.target.result;
            document.getElementById("file-preview").style.display = "block";
          }
        };

        reader.readAsDataURL(file);
      }
    });
    console.log("Preview de imagem configurado");
  } else {
    console.warn("Input de foto não encontrado");
  }
}

function previewPhotos(event) {
  const preview = document.getElementById('photo-preview');
  preview.innerHTML = '';
  const files = event.target.files;

  for (let i = 0; i < Math.min(files.length, 3); i++) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.className = 'photo-preview';
      preview.appendChild(img);
    }
    reader.readAsDataURL(files[i]);
  }
}
