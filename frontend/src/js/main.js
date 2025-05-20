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

    const users = JSON.parse(localStorage.getItem("ecodenunciaUsers") || "[]");
    const user = users.find((u) => u.email === email);

    if (!user) {
      alert(
        "Usuário não encontrado. Por favor, verifique seu e-mail ou cadastre-se."
      );
      return;
    }

    if (user.password !== password) {
      alert("Senha incorreta. Por favor, tente novamente.");
      return;
    }


    localStorage.setItem(
      "ecodenunciaUser",
      JSON.stringify({
        email,
        loggedIn: true,
        userId: user.id,
      })
    );

    alert("Login realizado com sucesso!");

    window.location.href = "../index.html";
  });

  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Formulário de cadastro submetido");
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById(
      "register-confirm-password"
    ).value;
    const terms = document.getElementById("terms").checked;

  
    if (!email || !password || !confirmPassword) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    // regex p validar o formato do e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Por favor, insira um e-mail válido.");
      return;
    }

    if (password !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (!terms) {
      alert("Você precisa aceitar os termos de uso.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("ecodenunciaUsers") || "[]");
    if (users.some((user) => user.email === email)) {
      alert(
        "Este e-mail já está cadastrado. Por favor, use outro e-mail ou faça login."
      );
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem("ecodenunciaUsers", JSON.stringify(users));

    // login automático
    localStorage.setItem(
      "ecodenunciaUser",
      JSON.stringify({
        email,
        loggedIn: true,
        userId: newUser.id,
      })
    );

    alert("Cadastro realizado com sucesso! Você está logado agora.");

    window.location.href = "../index.html";
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
  window.location.href = "../index.html";
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
