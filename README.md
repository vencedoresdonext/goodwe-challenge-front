# Goodwe Front-end

Aplicação web desenvolvida como parte do Challenge. Interface responsável pelo consumo das APIs RESTful disponibilizadas pelo serviço back-end em NestJS.

---

## 🛠️ Tecnologias e Runtimes

| Tecnologia | Versão Especificada | Função |
| :--- | :--- | :--- |
| **Node.js** | `24.16.x (Alpine)` | Ambiente de Execução |
| **PNPM** | `11.6.x` | Gerenciador de Pacotes |
| **React + TS** | `18.x` / `5.x` | Lib de Interface + Tipagem |
| **Vite** | `6.x` | Bundler / Server Dev |

---

## ⚙️ Pré-requisitos

Certifique-se de possuir o **Node.js 24.16.x** e o **PNPM 11.6.x** instalados no seu ambiente local.

```bash
node -v # Deve retornar v24.16.x
pnpm -v # Deve retornar 11.6.x
```

---

## 🚀 Como Executar o Projeto Localmente

1. **Clone o repositório:**
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd goodwe-front-app
   ```

2. **Configure as Variáveis de Ambiente:**
   ```bash
   cp .env.example .env
   ```
   *Ajuste o valor de `VITE_API_URL` apontando para o seu NestJS local ou em DEV.*

3. **Instale as dependências:**
   ```bash
   pnpm install
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   pnpm dev
   ```
   Acesse a aplicação em `http://localhost:5173`.

---

## 🌿 Ambientes e Branching

* **`dev`**: Branch de integração diária. Aponta para a API de desenvolvimento/testes.
* **`main`**: Branch de produção/versão estável do TCC.

---

## 📁 Estrutura de Pastas Simplificada

```text
src/
├── assets/          # Imagens e estilos globais
├── components/      # Componentes reutilizáveis
├── services/        # Clientes HTTP (fetch/axios) para o NestJS
├── pages/           # Telas da aplicação
├── App.tsx          # Rotas e layout base
└── main.tsx         # Ponto de entrada
```