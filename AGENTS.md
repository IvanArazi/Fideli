# Repository Guidelines

## Visión General del Proyecto
Plataforma de fidelización para comercios gastronómicos (stack MERN). Los usuarios se registran, acumulan puntos y canjean premios; las marcas gestionan sus premios/categorías; el admin supervisa y modera. Backend REST con JWT, MongoDB/Mongoose y subida de imágenes con Multer a `Server/uploads`; estáticos desde `Server/public`. Frontend en React + Vite con rutas para usuario, marca y admin.

## Project Structure & Module Organization
- `Client/`: React (Vite) app. Key folders: `src/components`, `src/pages`, `src/styles`, `src/context`, `public/`, `vite.config.js`.
- `Server/`: Express + Mongoose API. Key folders: `routes/*.js`, `controllers/*Controller.js`, `models/*Model.js`, `middlewares/*.js`, `public/`, `uploads/`, `index.js`.
- Static assets: served from `Server/public` and `Server/uploads`.

## Roles y Flujos Clave
- Usuario: registro/login, explorar marcas/premios, sumar puntos, canjear, ver historial y favoritos.
- Marca: login/registro, CRUD de premios y categorías, análisis básico (componentes en `Client/src/components/*`).
- Admin: gestión de usuarios/marcas/categorías y reportes (vistas en `Client/src/pages/AdminApp.jsx`).

## Build, Test, and Development Commands
- Backend: `cd Server && npm i && npm start` (Nodemon en `index.js`).
- Frontend dev: `cd Client && npm i && npm run dev` (Vite).
- Frontend build: `cd Client && npm run build` → `Client/dist`.
- Lint (client): `cd Client && npm run lint`.

## Coding Style & Naming Conventions
- JavaScript/JSX con ESM (`"type": "module"`). Indentación 2 espacios.
- React: componentes/páginas en PascalCase; hooks/utilidades en camelCase.
- Server: patrones `xRouter.js`, `xController.js`, `xModel.js`; middlewares `authX.js`, `uploadX.js`.

## Testing Guidelines
- Sin test runner aún. Sugerido: Vitest/RTL (client) y Jest/Supertest (server).
- Por ahora: pasar lint y validar manualmente login, canje e imágenes.

## Modelos (MongoDB/Mongoose) y Endpoints
- user: `name,lastName,email(unique),password,uniqueNumber,role`. Endpoints: `GET/POST /api/users`, `POST /api/users/auth`.
- brand: `name,email,password,phone,description,addresses[],locations[],manager,category[],status,role,profileImage`. Endpoints: `GET /api/brands`, filtros (`/pending|/approved|/rejected`), `GET /categoryId/:id`, `POST /` (con imagen), `POST /auth`, `GET /:id`.
- category: `name,image`. Endpoints: `GET /api/categories`, `POST /` (admin + upload), `DELETE /:id` (admin).
- award: `name,brand,description,requiredPoints,image`. Endpoints: `GET /api/awards`, `GET /brand/:brand`, `GET /:id`, `POST /` (brand + upload), `PUT/DELETE /:id` (brand).
- point: `points,userId,brandId`. Endpoints: `GET /api/points` + `GET /user/:id`, `GET /brand/:id`, `GET /user/:user/brand/:brand`, `POST /acumulate` (brand).
- redemption: `userId,awardId,brandId,status,code,createdAt`. Endpoints: `GET /api/redemptions` (+ `/pending` y `/used`), `GET /user/:userId`, `GET /brand/:brandId`, `POST /` (user), `POST /validation` (brand).
- history: `userId,awardId,brandId,createdAt`. Endpoints: `GET /api/histories`, `GET /user/:userId`, `GET /brand/:brandId`.
- favorite: `userId,brandId,createdAt`. Endpoints: `GET /api/favorites`, `GET /user` (user), `GET /brand` (brand), `POST /` (user), `DELETE /:id` (user).
- event: `brandId,title,description,startDate,hours,endDate,location,createdAt`. Endpoints: `GET /api/events`, `GET /brand/:brandId`, `GET /:id`, `POST /` (brand).
- counter: `name,seq` — uso interno para secuencias; sin endpoints públicos.

## Commit & Pull Request Guidelines
- Prefer Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`). Git history is mixed; standardize going forward.
- PRs must include: clear description, linked issue (if any), run steps, screenshots for UI changes, and notes on env/config changes.

## Security & Configuration Tips
- Create `Server/.env` (not committed): `PORT`, `MONGODB_URI`, `SECRET_KEY`.
- Configure CORS appropriately for production in `Server/index.js`.
- Avoid committing large media; consider git-ignoring `Server/uploads/`.
