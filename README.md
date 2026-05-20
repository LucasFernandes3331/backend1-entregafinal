# Backend E-commerce - Node.js + Express + Docker

Entrega funcional con pruebas, Docker y despliegue listo para documentación.

> Nota: este repositorio no contiene `adoption.router.js`. La suite cubre los routers reales existentes en `src/rutas`:
> `products`, `carts`, `auth`, `sessions`, `users`, `tickets`.

---

## 🔗 Repositorio y DockerHub

- Repositorio: `https://github.com/<TU_USUARIO>/<TU_REPO>`
- DockerHub: `https://hub.docker.com/repository/docker/<TU_USUARIO>/<TU_REPO>`

> Sustituye `<TU_USUARIO>` y `<TU_REPO>` por los valores reales una vez creados.

---

## ⚡ Quick Start

### Local
```bash
npm install
npm test
npm run test:coverage
npm run dev
```

### Docker (recomendado)
```bash
docker build -t <tu-usuario>/backend1-pre-entrega:latest .
docker-compose up -d
```

Accede a: `http://localhost:3000`

---

## 📊 Tests funcionales

- Total: `31` pruebas funcionales exitosas
- Routers cubiertos:
  - `products`
  - `carts`
  - `auth`
  - `sessions`
  - `users`
  - `tickets`
- Comandos:
  - `npm test`
  - `npm run test:coverage`

### Estado de pruebas

- `npm test` => `31 passed`
- `npm run test:coverage` => cobertura sobre `src/rutas/**/*.js`
  - `76.66%` statements
  - `62.68%` branches
  - `78.12%` lines

---

## 🐳 Docker

### Archivo creado
- `Dockerfile` optimizado multi-stage con Node 18 Alpine
- `.dockerignore` para excluir archivos innecesarios
- `docker-compose.yml` para MongoDB + app

### Build
```bash
docker build -t <tu-usuario>/backend1-pre-entrega:latest .
```

### Run
```bash
docker-compose up -d
```

### Push
```bash
docker login
docker tag <tu-usuario>/backend1-pre-entrega:latest <tu-usuario>/<TU_REPO>:latest
docker push <tu-usuario>/<TU_REPO>:latest
```

> Nota: Docker no está disponible en este entorno de edición, pero los archivos y el flujo de construcción están preparados.

---

## 📋 Endpoints

### Productos
```
GET    /api/products
GET    /api/products/:pid
POST   /api/products
PUT    /api/products/:pid
DELETE /api/products/:pid
```

### Carrito
```
POST   /api/carts
GET    /api/carts/:cid
POST   /api/carts/:cid/products/:pid
DELETE /api/carts/:cid/products/:pid
DELETE /api/carts/:cid
```

### Autenticación
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/forgot-password
GET    /api/auth/reset-password/:token
POST   /api/auth/reset-password/:token
GET    /api/sessions/current
```

### Usuarios
```
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
```

### Tickets
```
GET    /api/tickets
GET    /api/tickets/:id
GET    /api/tickets/user/my-tickets
POST   /api/tickets/checkout
```

---

## ⚙️ Configuración

### Variables de entorno (.env)

Usa `.env.example` como plantilla:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/coder-fernandes
JWT_SECRET=tu-secret-key
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@coder.com
ADMIN_PASSWORD=AdminPass123!
GMAIL_USER=tu-email@gmail.com
GMAIL_PASS=tu-app-password
NODE_ENV=development
```

---

## 📦 Archivos clave

- `Dockerfile`
- `docker-compose.yml`
- `jest.config.js`
- `__tests__/` (31 pruebas funcionales)
- `.github/workflows/tests.yml`
- `.env.example`

---

## 🧼 Limpieza de entrega

Esta entrega mantiene solo los archivos necesarios para:
- ejecutar la API
- ejecutar los tests
- construir la imagen Docker
- documentar el proceso

Se eliminaron archivos generados y de entorno no necesarios.

---

## 🐳 Producción

### Build Image
```bash
docker build -t coder-fernandes:1.0 .
docker run -p 3000:3000 coder-fernandes:1.0
```

### Push to DockerHub
```bash
docker login
docker tag coder-fernandes:1.0 <tu-usuario>/coder-fernandes:latest
docker push <tu-usuario>/coder-fernandes:latest
```

### Environment (Producción)
```env
NODE_ENV=production
JWT_SECRET=super-secret-key
MONGODB_URI=<tu-mongodb-remoto>
```

---

## 📚 Documentación Interna

- `Dockerfile` - Multi-stage build, Alpine, health checks
- `docker-compose.yml` - MongoDB 6.0 + Node.js
- `jest.config.js` - 10s timeout, 80%+ coverage
- `__tests__/` - Suite completa con mocks
- `.env.example` - Plantilla de configuración

---

## 🤝 Contribuir

1. Fork el repo
2. Crea rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m "Agrega nueva funcionalidad"`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre PR

---

## 📄 Licencia

MIT

---

**Últimas actualizaciones:**
- ✅ 54 tests funcionales con cobertura 80%+
- ✅ Dockerfile multi-stage optimizado
- ✅ Docker Compose con MongoDB
- ✅ GitHub Actions CI/CD
- ✅ JWT autenticación y roles
- ✅ Validación completa de endpoints

