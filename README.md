# 🌱 EcoDenúncia - Lidando com o lixo da cidade

*EcoDenúncia* é uma plataforma digital criada para facilitar a *denúncia de descarte irregular de resíduos sólidos* e *conscientizar a população* sobre práticas sustentáveis de descarte. O sistema foi desenvolvido por bolsistas do projeto *Trilhas (SECTI-MA)* como parte de uma iniciativa educacional e social.

---

## 📌 Problema

O descarte incorreto de resíduos sólidos em áreas urbanas gera sérios impactos ambientais e sociais. Terrenos baldios, margens de rios e vias públicas frequentemente se tornam pontos de acúmulo de lixo. A proposta do EcoDenúncia é combater esse problema com tecnologia, informação e participação cidadã.

---

## 🔧 Funcionalidades

- *📝 Denúncia de descarte irregular*  
  Usuários podem registrar denúncias com dados e localização do ponto.

- *🗺 Visualização de pontos viciados*  
  Mapa interativo com os principais pontos de descarte identificados pela população.

- *🔐 Login e Cadastro*  
  Sistema seguro de autenticação com criptografia e token de acesso.

- *📚 Informações educativas*  
  Conteúdos e dicas para descarte correto, com links confiáveis.

- *📄 Acompanhamento da denúncia* (versão futura)  
  Possibilidade de acompanhar o status e resolver/reabrir denúncias.

---

## 🧠 Metodologia

1. *Pesquisa com a comunidade*  
   Levantamento dos principais problemas via questionário.

2. *Prototipação com Figma*  
   Interface desenvolvida com foco em simplicidade e acessibilidade.

3. *Divisão de tarefas*  
   Organização do time em áreas de front-end, back-end e documentação.

4. *Desenvolvimento modular*  
   Cada camada (frontend, backend, banco) construída separadamente.

5. *Integração final e testes*  
   Conexão entre as partes e testes de funcionalidades.

---

## 🖥 Tecnologias Utilizadas

- *Frontend:* HTML + CSS  
- *Backend:* Java com Spring Boot  
- *Banco de Dados:* PostgreSQL + Neon (banco em nuvem)  
- *Design:* Figma  
- *API Requests:* Axios (JavaScript)

---

## 🧱 Arquitetura do Backend

- *Model:* Entidades do sistema (usuário, denúncia, etc.)  
- *Service:* Regras de negócio e lógica  
- *Controller:* Endpoints REST e comunicação com o front  
- *Segurança:* Spring Security com criptografia e autenticação JWT  
- *Persistência:* Spring Data JPA

---

## 🚀 Como Rodar o Projeto

### Requisitos:
- Ter **Docker** instalado.

### Passos:
1. Clone o repositório:
   ```bash
   git clone https://github.com/GiuliaFreulon/portal-egresso
   cd portal-egresso
   ```

2. Configure as seguintes variáveis de ambiente:
   #### Para o backend:

   ```env
   # Banco de Dados (No projeto foi usado NeonDB - PostgreSQL)
   DATABASE_URL
   DATABASE_USER
   DATABASE_PASSWORD

   # JWT
   JWT_SECRET_KEY (Use um gerador de chaves Base 64)

   # MAIL
   MAIL_USERNAME (use um gmail que tenha acesso a app menos seguros ativado)
   MAIL_PASSWORD
   ```
   
   #### Para o backend:
   
   ```env
   # API
   API_URL (http://localhost:8080)
   GOOGLE_MAPS_API_KEY (Api do google maps)
   ```

    **Nota:** O banco de dados disponibilizado para teste é **público** e pode ser fechado ou modificado a qualquer momento.

4. Inicie o contâiner:
   ```bash
   docker-compose up -d
   ```

---

## 🔮 Próximos Passos

- Criar painel de acompanhamento de denúncias (resposta, status e resolução)
- Integração com órgãos públicos e prefeituras
- Melhorias na acessibilidade e performance

---

## 👥 Equipe de Desenvolvimento

Este projeto foi desenvolvido por *bolsistas do projeto Trilhas – SECTI/MA*, como parte do programa de formação em tecnologia.

---

## 📄 Licença

Este projeto é de uso educacional e social. Uso livre com atribuição.  
(c) 2025 – Projeto Trilhas

## Documentação

https://docs.google.com/document/d/15k7eZOefVF7KFrVAGA7A3kOp0sGOUn3Mb3KLTQlTmwU/edit?usp=sharing
