FROM node:24-trixie AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=true
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm --filter=./packages/cardagon-web run build

FROM nginx:1-trixie

COPY ./nginx/nginx.conf /etc/nginx
COPY --from=build /app/packages/cardagon-web/dist /usr/share/nginx/html

EXPOSE 8000

ENTRYPOINT ["nginx", "-g", "daemon off;"]
