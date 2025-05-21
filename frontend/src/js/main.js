const API_BASE_URL = "eco-denuncia.up.railway.app";

const SecurityConstants = {
  HEADER_NAME: "Authorization",
};

document.addEventListener("DOMContentLoaded", () => {
  updateLoginStatus();

  if (verificarUsuarioJaLogado()) {
    return;
  }

  if (document.querySelector(".login-page")) {
    setupLoginForms();
  }
});

function toggleMenu() {
  var menu = document.querySelector(".menu");
  menu.classList.toggle("active");
}

function checkLoginBeforeRedirect(event) {
  if (isLoggedIn() && event.target.classList.contains("btn-secondary")) {
    return true;
  }

  if (!isLoggedIn()) {
    event.preventDefault();
    window.location.href = "pages/login.html";
    return false;
  }
  return true;
}

function setupLoginForms() {
  const loginTab = document.getElementById("login-tab");
  const registerTab = document.getElementById("register-tab");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const switchToRegister = document.getElementById("switch-to-register");
  const switchToLogin = document.getElementById("switch-to-login");

  console.log("Login Form:", loginForm);
  console.log("Register Form:", registerForm);

  loginForm.style.display = "block";
  registerForm.style.display = "none";

  loginTab.addEventListener("click", () => {
    loginTab.classList.add("active");
    registerTab.classList.remove("active");
    loginForm.style.display = "block";
    registerForm.style.display = "none";
  });

  registerTab.addEventListener("click", () => {
    registerTab.classList.add("active");
    loginTab.classList.remove("active");
    registerForm.style.display = "block";
    loginForm.style.display = "none";
  });

  switchToRegister.addEventListener("click", (e) => {
    e.preventDefault();
    registerTab.click();
    console.log("Alternando para o formulário de cadastro");
  });

  switchToLogin.addEventListener("click", (e) => {
    e.preventDefault();
    loginTab.click();
    console.log("Alternando para o formulário de login");
  });

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Formulário de login submetido");
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    if (!email || !password) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    axios
      .post(
        `${API_BASE_URL}/login`,
        {
          email: email,
          senha: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        const token =
          response.headers[SecurityConstants.HEADER_NAME.toLowerCase()];
        const userData = response.data.user;

        // Armazenar token e dados do usuário
        localStorage.setItem(
          "ecodenunciaUser",
          JSON.stringify({
            email: userData.email,
            role: userData.role,
            loggedIn: true,
            token: token,
          })
        );

        alert("Login realizado com sucesso!");
        window.location.href = "../index.html";
      })
      .catch((error) => {
        if (error.response) {
          // Erros do servidor
          switch (error.response.status) {
            case 401:
              alert("Credenciais inválidas");
              break;
            default:
              alert("Erro no login: " + error.response.data);
          }
        } else {
          alert("Erro de conexão com o servidor");
        }
      });
  });

  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById(
      "register-confirm-password"
    ).value;

    // Validações
    if (!nome || !email || !password || !confirmPassword) {
      alert("Preencha todos os campos!");
      return;
    }

    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    axios
      .post(
        `${API_BASE_URL}/api/usuario/salvar`,
        {
          nome: nome,
          email: email,
          senha: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        alert("Cadastro realizado! Faça login.");
        loginTab.click(); // Redireciona para a aba de login
      })
      .catch((error) => {
        if (error.response) {
          alert("Erro: " + error.response.data); // Exibe a mensagem do backend
        } else {
          alert("Erro de conexão");
        }
      });
  });
}

function isLoggedIn() {
  const user = localStorage.getItem("ecodenunciaUser");
  if (user) {
    const userData = JSON.parse(user);
    return userData.loggedIn === true;
  }
  return false;
}

function logout() {
  localStorage.removeItem("ecodenunciaUser");
  alert("Logout realizado com sucesso!");
  window.location.href = "../src/index.html";
}

function updateLoginStatus() {
  const loginLink = document.getElementById("login-link");
  const logoutLink = document.getElementById("logout-link");

  if (!loginLink || !logoutLink) return;

  if (isLoggedIn()) {
    loginLink.style.display = "none";
    logoutLink.style.display = "inline";

    const userData = JSON.parse(localStorage.getItem("ecodenunciaUser"));
    logoutLink.textContent = `LOGOUT (${userData.email})`;
  } else {
    loginLink.style.display = "inline";
    logoutLink.style.display = "none";
  }
}

function verificarUsuarioJaLogado() {
  if (window.location.href.includes("login.html") && isLoggedIn()) {
    alert("Você já está logado! Redirecionando para a página inicial.");
    window.location.href = "../index.html";
    return true;
  }
  return false;
}
