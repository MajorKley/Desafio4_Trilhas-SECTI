document.addEventListener("DOMContentLoaded", () => {

  if (!isLoggedIn()) {
    window.location.href = "login.html";
    return;
  }

 
  setupDenunciaForm();
});


function isLoggedIn() {
  const user = localStorage.getItem("ecodenunciaUser");
  if (user) {
    const userData = JSON.parse(user);
    return userData.loggedIn === true;
  }
  return false;
}

function setupDenunciaForm() {
  const form = document.getElementById("denuncia-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // obtém os valores do formulário
    const tipo = document.getElementById("tipo-denuncia").value;
    const descricao = document.getElementById("descricao").value;
    const endereco = document.getElementById("endereco").value;
    const cidade = document.getElementById("cidade").value;
    const fotoInput = document.getElementById("foto");

    // validação básica
    if (!tipo || !descricao || !endereco || !cidade) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // cria objeto de denúncia com ID único
    const novaDenuncia = {
      id: `denuncia-${Date.now()}`, // gera o ID com base no timestamp
      tipo: getTipoTexto(tipo),
      descricao,
      endereco,
      cidade,
      data: new Date().toISOString(),
      status: "Pendente",
      foto: null, // upload da foto n está sendo processado (ainda)
    };

    // salva no localStorage
    const denuncias = JSON.parse(
      localStorage.getItem("ecodenunciaDenuncias") || "[]"
    );
    denuncias.push(novaDenuncia);
    localStorage.setItem("ecodenunciaDenuncias", JSON.stringify(denuncias));

    alert("Denúncia enviada com sucesso!");

    window.location.href = "acompanhar.html";
  });
}

// converte o valor do select para texto
function getTipoTexto(valor) {
  const tipos = {
    lixo: "Descarte irregular de lixo",
    esgoto: "Esgoto a céu abert por causa do acúmulo de lixo",
    outro: "Outro",
  };

  return tipos[valor] || valor;
}
