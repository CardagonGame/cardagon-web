FROM node:26-trixie AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=true
RUN npm i -g corepack
COPY . /app
WORKDIR /app

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM nginx:1-trixie

COPY ./nginx/nginx.conf /etc/nginx
COPY --from=build /app/.output/public /usr/share/nginx/html

EXPOSE 8000

ENTRYPOINT ["nginx", "-g", "daemon off;"]
