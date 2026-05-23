# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # dev server on :3000 (proxies /api to localhost:8000)
pnpm build        # static site generation → .output/public/
pnpm preview      # preview the generated output
```

No linter is configured. Formatting uses Prettier — config in `.prettierrc.json` (no semis, single quotes, trailing commas, import sorting via `prettier-plugin-organize-imports`).

## Architecture

**Stack:** Nuxt 4 (SPA, `ssr: false`), Vue 3, Vuetify 4, vee-validate + Zod for forms, @nuxtjs/i18n, @vueuse/nuxt. All code lives under `app/` (Nuxt 4 convention).

**API layer** (`app/composables/useApi.ts`): A single `useApi()` composable wraps `$fetch.create` with JWT bearer token injection. All typed API methods live here. The backend is a FastAPI server; in dev, Nitro proxies `/api` → `localhost:8000`. In production, nginx serves the static files and must itself proxy `/api`.

**Auth** (`app/composables/useAuth.ts`, `app/plugins/auth.ts`): Token stored in an `auth_token` cookie (7-day, `sameSite: strict`, `secure` in prod). `useState` shares the token ref across all `useAuth()` callers. The `auth` plugin runs on startup to validate the token via `GET /api/v1/me` and hydrate the user state, or clears the token on failure. Two route middlewares gate pages: `auth` (redirect to login if unauthenticated) and `guest` (redirect home if already logged in).

**Registration is invite-only** — the register form requires an `inviteToken` field sent to the server.

**Game flow:**
1. `/` — home; list hosted/joined games, create or join.
2. `/game/[gameId]/setup` — lobby; host sees player list and a Start button. All connected players see live updates via WebSocket.
3. `/game/[gameId]` — active game board.
4. `/join/[code]` — join-by-code redirect page.

**WebSocket** (`app/composables/useGameConnection.ts`): Connects to `wss://.../api/v1/game/{gameId}/ws?token=...`. Auto-reconnects with infinite retries. Sends a `ping`/`ping_result` heartbeat every 15 s to measure latency. Handles message types: `players`, `game_state`, `game_start`, `error`, `pong`. Starting the game sends `{ type: "game_start" }`.

**Hex grid** (`app/components/game/HexGrid.vue`, `app/utils/hexlib/`): Implements a flat-top hexagonal grid using cube coordinates (q, r, s). The grid is rendered as CSS columns of hex cells that auto-scale to fill the available container. `PanZoomCanvas.vue` wraps the board with mouse-wheel zoom and two-finger pinch-to-zoom + drag-to-pan (right-click drag or touch drag).

**i18n:** All user-visible strings go through `useI18n()` / the `t()` helper. Locale file: `i18n/locales/en.json`. Only English is currently configured.

**Forms:** vee-validate with `@vee-validate/zod` adapter. Schemas defined in `app/schemas/`.

**Vuetify theme:** Custom `warmDark` theme. Global defaults disable elevation and ripple.

## Deployment

CI (`build-workflow.yml`) builds a Docker image on every push to `main` and pushes it to `ghcr.io`. The image runs nginx serving `.output/public/`; nginx config must proxy `/api` to the backend.
