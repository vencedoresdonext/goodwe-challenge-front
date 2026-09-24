<div align="center">

# GoodWe ChargeGrid — Front-end

Painel web para donos de carregadores de veículos elétricos: usinas, carregadores, sessões de recarga e transações.

</div>

---

## Tecnologias e Runtimes

- [Stack](#stack)
- [Início rápido](#início-rápido)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Funcionalidades](#funcionalidades)
- [Integração com a API](#integração-com-a-api)
- [Scripts](#scripts)
- [CI/CD](#cicd)
- [Estrutura](#estrutura)
- [Deploy](#deploy)
- [Documentação complementar](#documentação-complementar)

---

## Pré-requisitos

| Camada       | Tecnologia                                        |
| ------------ | ------------------------------------------------- |
| Runtime      | Node.js 24.16 · pnpm                              |
| Interface    | React 19 · TypeScript 6                           |
| Build / dev  | Vite 8 (code splitting por tela)                  |
| Rotas        | React Router 7                                    |
| HTTP         | Axios (interceptors de auth e renovação de token) |
| Estilos      | CSS Modules + design tokens em CSS variables      |
| Ícones       | lucide-react                                      |
| Qualidade    | ESLint (typescript-eslint + react-hooks)          |

Nenhuma biblioteca de estado ou de UI externa: o estado de servidor fica nos hooks `useRequest` / `usePolling` e a sessão no `AuthProvider`.

---

## Início rápido

**Pré-requisitos:** Node 24.16+ e pnpm. Com [asdf](https://asdf-vm.com), `asdf install` lê o `.tool-versions`.

```bash
# 1. Dependências
pnpm install

# 2. Variáveis de ambiente
cp .env.example .env

# 3. Suba a API (no repositório do back)
#    pnpm infra:up && pnpm prisma:migrate:deploy && pnpm prisma:seed && pnpm start:dev

# 4. Front em modo dev
pnpm dev
```

| Recurso        | URL                                   |
| -------------- | ------------------------------------- |
| Front          | http://localhost:5173                 |
| API (padrão)   | http://localhost:3000/api             |
| Swagger da API | http://localhost:3000/api/swagger     |

Crie uma conta em **/cadastro** — o cadastro web já atribui a role WEB exigida pelas rotas do painel.

---

## Variáveis de ambiente

Todas documentadas no [`.env.example`](./.env.example) e lidas **somente** por `src/config/env.ts`, que aplica valores padrão e tipagem.

| Variável                     | Padrão                       | Descrição                                               |
| ---------------------------- | ---------------------------- | ------------------------------------------------------- |
| `VITE_APP_NAME`              | `GoodWe ChargeGrid`          | Nome exibido no título da aba                           |
| `VITE_APP_ENV`               | `development`                | Ambiente (`development`, `staging`, `production`)       |
| `VITE_API_URL`               | `http://localhost:3000/api`  | URL base da API **com** o prefixo `/api`                |
| `VITE_API_TIMEOUT`           | `10000`                      | Timeout das requisições (ms)                            |
| `VITE_SESSION_POLL_INTERVAL` | `5000`                       | Intervalo de atualização de uma sessão em andamento (ms) |

> O back usa `API_PREFIX=api`, então a URL precisa terminar em `/api` — inclusive no Render: `https://goodwe-challenge-service.onrender.com/api`.
> Variáveis `VITE_*` são embutidas no bundle no momento do build: não coloque segredos nelas.

---

## Funcionalidades

| Tela            | Rota do front       | O que faz                                                                                   |
| --------------- | ------------------- | ------------------------------------------------------------------------------------------- |
| Login           | `/login`            | Entra com email **ou** telefone; volta para a página que o usuário tentou abrir             |
| Cadastro        | `/cadastro`         | Cria conta web com validação igual à do back (senha forte, telefone `+55…`)                  |
| Usinas          | `/usinas`           | Estações com carregadores do usuário: consumo × demanda contratada, geração solar, ocupação |
| Detalhe da usina| `/usinas/:id`       | Indicadores de energia, carregadores e status; iniciar recarga; cartão de recebimento. Atualiza a cada 15 s |
| Sessões         | `/sessoes`          | Histórico paginado de recargas, exportação CSV                                              |
| Detalhe da sessão | `/sessoes/:id`    | Energia, valor e duração ao vivo (polling); encerrar escolhendo cartão ou PIX               |
| Transações      | `/transacoes`       | Pagamentos gerados pelas sessões, paginado, exportação CSV                                  |
| Configuração    | `/configuracao`     | Editar nome e telefone, dados da conta, status da API, sair                                 |

Rotas antigas (`/places`, `/register`, `/templates`) redirecionam para as novas.

---

## Integração com a API

Todas as rotas **web** e **públicas** do back estão integradas. O mapa completo, rota a rota, está em [`docs/API_INTEGRATION.md`](./docs/API_INTEGRATION.md). Pontos principais:

- **Endpoints centralizados** em `src/lib/http/endpoints.ts` — nenhuma URL fica espalhada pelas telas.
- **Envelope de resposta:** o back responde `{ message, data }` e hoje chega com envelope duplo (`{ data: { data } }`); `unwrapEnvelope` trata os dois formatos.
- **Autenticação:** tokens em `localStorage`; o `Authorization: Bearer` é injetado pelo interceptor.
- **Renovação de token:** feita de forma **proativa** (60 s antes de o access token expirar) e com *single-flight* (várias requisições simultâneas disparam um único refresh). Se não for possível renovar, a sessão é encerrada e o usuário volta ao login com aviso.
- **Erros normalizados** em `ApiError` (status + mensagem pronta para a UI), com mensagens em português para falhas de rede, timeout, 401, 403, 404, 409 e 429.
- **Rotas `app/*` não são usadas:** elas validam o JWT com outro segredo (`JWT_APP_SECRET`) e respondem 401 para tokens do login web.

---

## Scripts

| Script           | Descrição                                        |
| ---------------- | ------------------------------------------------ |
| `pnpm dev`       | Servidor de desenvolvimento com HMR              |
| `pnpm build`     | Typecheck + build de produção em `dist/`         |
| `pnpm preview`   | Serve o build de produção localmente             |
| `pnpm typecheck` | `tsc -b` sem gerar arquivos                      |
| `pnpm lint`      | ESLint                                           |
| `pnpm lint:fix`  | ESLint com correção automática                   |
| `pnpm check`     | Typecheck + lint (use antes de abrir PR)         |

---

## CI/CD

Pipeline em `azure-pipelines.yml`:

```
CI ─── pnpm install --frozen-lockfile → pnpm build (typecheck + vite) → artefato dist/
Mirror ─ push para o GitHub (somente main)
```

Variáveis do Mirror vêm do grupo **GitHub-Sync-Vars** (`GITHUB_PAT`, `GITHUB_USER`, `GITHUB_REPO_FRONTEND`).
Como o build roda `tsc -b`, erros de tipo quebram o pipeline.

---

## Estrutura

Organizada por **módulos de domínio**, espelhando `src/modules` do back. Convenções detalhadas em [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).

```text
src/
├── app/                    # Composição da aplicação
│   ├── layout/             # AppLayout + Sidebar
│   ├── pages/              # Páginas sem domínio (404)
│   ├── providers/          # Toast + Auth
│   └── router/             # AppRouter, paths, guards (PrivateRoute / PublicOnlyRoute)
├── assets/                 # Imagens importadas pelo código
├── config/                 # env.ts: variáveis de ambiente tipadas
├── lib/
│   └── http/               # Cliente axios, endpoints, envelope, erros, JWT, token storage
├── modules/                # Um módulo por domínio do back
│   ├── auth/               # login, cadastro, AuthProvider, useAuth
│   ├── users/              # perfil (Configuração)
│   ├── stations/           # usinas, carregadores, cartão de recebimento
│   ├── charging-sessions/  # sessões: listar, detalhar, iniciar, encerrar
│   ├── payment/            # transações
│   └── health/             # status da API
├── shared/                 # Reutilizável e sem regra de negócio
│   ├── components/         # Button, TextField, Modal, DataTable, Badge, Toast…
│   ├── constants/          # enums espelhados do back + rótulos
│   ├── hooks/              # useRequest, usePolling, usePagination, useDocumentTitle
│   ├── styles/             # global.css com os design tokens
│   └── utils/              # formatação (R$, kW, datas), validadores, CSV
└── main.tsx
```

Cada módulo segue o mesmo formato:

```text
modules/<dominio>/
├── api/          # funções que chamam a API (uma por rota)
├── components/   # componentes do domínio
├── pages/        # telas (carregadas sob demanda)
├── types.ts      # DTOs espelhados do back
└── index.ts      # API pública do módulo
```

---

## Como Executar o Projeto Localmente

O build é estático (`dist/`). Como o app usa `BrowserRouter`, o servidor precisa devolver `index.html` para qualquer rota desconhecida:

- **Render (Static Site):** Redirects/Rewrites → `/*` → `/index.html` (Rewrite).
- **Vercel:** `vercel.json` com `{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }`.
- **Nginx:** `try_files $uri /index.html;`

Defina `VITE_API_URL` nas variáveis de build do provedor.

---

## Estrutura de Pastas

- [`docs/API_INTEGRATION.md`](./docs/API_INTEGRATION.md) — rotas do back × funções e telas do front, formatos e pendências do back-end.
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — camadas, convenções e como adicionar uma nova rota ou tela.
