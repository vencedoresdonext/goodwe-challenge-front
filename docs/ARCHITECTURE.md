# Arquitetura do front-end

## Camadas

```
pages  ──►  components  ──►  api (módulo)  ──►  lib/http  ──►  API
  │             │
  └──► shared (componentes, hooks, utils, constants)
```

| Camada            | Responsabilidade                                                    | Pode importar de |
| ----------------- | ------------------------------------------------------------------- | ---------------- |
| `app/`            | Providers, rotas, guards e layout                                   | tudo             |
| `modules/*/pages` | Telas: buscam dados, orquestram componentes, tratam loading/erro    | módulo, outros módulos (via `index.ts`), `shared`, `lib` |
| `modules/*/components` | UI específica do domínio                                       | módulo, `shared`, `lib` |
| `modules/*/api`   | Uma função por rota do back, tipada com os DTOs                     | `lib/http`       |
| `lib/http`        | Cliente HTTP, autenticação, envelope, erros                         | `config`         |
| `shared/`         | Peças genéricas, sem regra de negócio nem chamadas à API            | `shared`, `lib`  |
| `config/`         | Variáveis de ambiente                                               | —                |

Regras:

- Telas e componentes **nunca** chamam `axios`/`fetch` direto — sempre via `modules/<dominio>/api`.
- Nenhuma URL fora de `lib/http/endpoints.ts`; nenhum caminho de tela fora de `app/router/paths.ts`.
- Entre módulos, importe pelo `index.ts` do módulo (ex.: `import { cardsApi } from '../../payment'`).
- `import.meta.env` só em `config/env.ts`.

## Estado

| Tipo                | Onde                                                     |
| ------------------- | -------------------------------------------------------- |
| Sessão / usuário    | `AuthProvider` (`useAuth`)                               |
| Dados do servidor   | `useRequest` na página (loading, erro, `reload`, `setData`) |
| Atualização ao vivo | `usePolling` (pausa com a aba oculta)                    |
| Notificações        | `ToastProvider` (`useToast`)                             |
| Estado de formulário| `useState` local                                         |

`useRequest` ignora respostas de requisições antigas e aceita `reload({ silent: true })` para atualizar sem piscar o loading.

## Autenticação

1. Login/cadastro salvam `accessToken` e `refreshToken` (`lib/http/token-storage.ts`).
2. O `AuthProvider` busca `GET /users/web/me`; enquanto isso, os guards mostram "Restaurando sua sessão…".
3. O interceptor de request renova o token se faltar menos de 60 s para expirar (uma única chamada, mesmo com requisições em paralelo).
4. Um 401 em rota autenticada tenta renovar e repetir a requisição uma vez; se falhar, limpa os tokens e dispara `onUnauthorized`, que leva ao login com aviso de sessão expirada.
5. `PrivateRoute` guarda a URL de origem em `state.from`; após o login o `PublicOnlyRoute` devolve o usuário para ela.

## Estilos

- Tokens (cores, tipografia, espaçamentos, raios) em `shared/styles/global.css` como CSS variables.
- Um `*.module.css` por componente; nada de seletores globais por tag dentro de módulos.
- Identidade GoodWe: grafite `#27262c`, superfícies `#322f37`, vermelho da marca `#fc0000`, Poppins.
- Cores de estado seguem os enums (`Tone` em `shared/constants/enums.ts`); amarelo é reservado para geração solar e alerta de ocupação.
- Layout responsivo: abaixo de 720 px a sidebar vira barra de navegação inferior.
- Foco visível, `prefers-reduced-motion` respeitado, modais com `<dialog>` nativo.

## Como adicionar uma rota do back

1. Adicione o caminho em `src/lib/http/endpoints.ts`.
2. Tipos do DTO em `src/modules/<dominio>/types.ts`.
3. Função em `src/modules/<dominio>/api/<dominio>.api.ts`:
   ```ts
   export const vehiclesApi = {
     list: () => http.get<Vehicle[]>(endpoints.vehicles.list),
   }
   ```
4. Exporte pelo `index.ts` do módulo se outro módulo for usar.
5. Consuma na página com `useRequest(() => vehiclesApi.list(), [])`.

## Como adicionar uma tela

1. Crie `src/modules/<dominio>/pages/<Nome>Page/<Nome>Page.tsx` (+ `.module.css`) com export nomeado.
2. Adicione o caminho em `app/router/paths.ts`.
3. Registre em `app/router/AppRouter.tsx` com `lazy(...)`, dentro de `PrivateRoute` se exigir login.
4. Se for um item de menu, inclua em `NAV_ITEMS` no `app/layout/Sidebar.tsx`.
5. Use `PageHeader`, `LoadingState`, `ErrorState` e `EmptyState` para manter o padrão das telas.
