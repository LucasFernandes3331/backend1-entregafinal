# Backend E-commerce - Node.js + Express + Docker

Entrega final del proyecto con pruebas funcionales, Docker y documentación completa.

---

## 🔥 Resumen del proyecto

Este proyecto es un backend de e-commerce construido con Node.js, Express y MongoDB. Está organizado en capas para facilitar la lectura, el mantenimiento y las pruebas.

Componentes clave:
- Rutas (`src/rutas/`)
- Controladores (`src/controllers/`)
- Managers de negocio (`src/managers/`)
- Repositorios de datos (`src/repositories/`)
- Modelos Mongoose (`src/models/`)
- Pruebas funcionales con Jest + Supertest
- Dockerfile optimizado para producción
- Configuración de despliegue y documentación lista

---

## 🚀 Comandos principales

Instalar dependencias:
```bash
npm install
```

Ejecutar tests:
```bash
npm test
```

Ejecutar tests con cobertura:
```bash
npm run test:coverage
```

Iniciar en desarrollo:
```bash
npm run dev
```

---

## 🧱 Estructura del proyecto

```
backend1-pre-entrega-main/
├─ Dockerfile
├─ docker-compose.yml
├─ .dockerignore
├─ jest.config.js
├─ package.json
├─ package-lock.json
├─ .env.example
├─ README.md
├─ __tests__/
│  ├─ auth.test.js
│  ├─ products.test.js
│  ├─ carts.test.js
│  ├─ sessions.test.js
│  ├─ users.test.js
│  ├─ tickets.test.js
│  └─ adoption.test.js
└─ src/
   ├─ app.js
   ├─ servidor.js
   ├─ config/
   │  └─ passport.js
   ├─ rutas/
   │  ├─ products-rutas.js
   │  ├─ carts-rutas.js
   │  ├─ auth-rutas.js
   │  ├─ sessions-rutas.js
   │  ├─ users-rutas.js
   │  ├─ tickets-rutas.js
   │  └─ adoption-rutas.js
   ├─ controllers/
   │  ├─ productController.js
   │  ├─ cartController.js
   │  ├─ userController.js
   │  └─ adoptionController.js
   ├─ managers/
   │  ├─ ProductManager.js
   │  ├─ CartManager.js
   │  ├─ UserManager.js
   │  └─ AdoptionManager.js
   ├─ repositories/
   │  ├─ ProductRepository.js
   │  ├─ CartRepository.js
   │  ├─ UserRepository.js
   │  └─ TicketRepository.js
   ├─ services/
   │  ├─ EmailService.js
   │  └─ PurchaseService.js
   ├─ models/
   │  ├─ Product.js
   │  ├─ Cart.js
   │  ├─ User.js
   │  └─ Ticket.js
   ├─ dtos/
   │  └─ UserDTO.js
   └─ views/
      ├─ home.handlebars
      ├─ productDetail.handlebars
      ├─ cartDetail.handlebars
      └─ realtimeproducts.handlebars
```

---

## 📄 Descripción de archivos y carpetas

- `src/app.js`: configura la aplicación Express, handlebars, middlewares y monta los routers.
- `src/servidor.js`: inicia el servidor HTTP y `socket.io`.
- `src/config/passport.js`: configura las estrategias de autenticación local y JWT.
- `src/middleware/authMiddleware.js`: middlewares para proteger rutas y validar roles.
- `src/rutas/`: define endpoints de la API.
- `src/controllers/`: procesa solicitudes y delega la lógica a managers/repositories.
- `src/managers/`: contiene la lógica de negocio.
- `src/repositories/`: acceso a datos con Mongoose.
- `src/models/`: esquemas de datos.
- `src/services/`: servicios auxiliares como envío de email y proceso de compra.
- `__tests__/`: pruebas funcionales con mocks para aislar dependencias.
- `Dockerfile`: build optimizado multi-stage.
- `docker-compose.yml`: orquesta servicios para desarrollo.
- `jest.config.js`: configuración de pruebas y cobertura.
- `.env.example`: variables de entorno necesarias.

---

## 🧪 Pruebas funcionales

Las pruebas cubren los endpoints principales y validaciones de la API, incluyendo el router de adopción (`adoption.router.js`).

Ejecutar todas las pruebas:
```bash
npm test
```

Cobertura de tests:
```bash
npm run test:coverage
```

---

## 🐳 Docker

### Construir la imagen
```bash
docker build -t lucasfernandes7/backend-3-fernandes:latest .
```

### Ejecutar el contenedor
```bash
docker run --rm -p 3000:3000 lucasfernandes7/backend-3-fernandes:latest
```

### Docker Hub
```bash
docker login
docker push lucasfernandes7/backend-3-fernandes:latest
```

Imagen publicada:
- `lucasfernandes7/backend-3-fernandes:latest`

---

## 🌐 Endpoints principales

### Productos
- `GET /api/products`
- `GET /api/products/:pid`
- `POST /api/products`
- `PUT /api/products/:pid`
- `DELETE /api/products/:pid`

### Carrito
- `POST /api/carts`
- `GET /api/carts/:cid`
- `POST /api/carts/:cid/products/:pid`
- `DELETE /api/carts/:cid/products/:pid`
- `DELETE /api/carts/:cid`

### Autenticación
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `GET /api/auth/reset-password/:token`
- `POST /api/auth/reset-password/:token`
- `GET /api/sessions/current`

### Usuarios
- `GET /api/users`
- `GET /api/users/:id`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

### Tickets
- `GET /api/tickets`
- `GET /api/tickets/:id`
- `GET /api/tickets/user/my-tickets`
- `POST /api/tickets/checkout`

### Adopciones
- `GET /api/adoption`
- `GET /api/adoption/:id`
- `POST /api/adoption`
- `PUT /api/adoption/:id`
- `DELETE /api/adoption/:id`

---

## ⚙️ Variables de entorno

Copia `.env.example` a `.env` y ajusta los valores:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/coder-fernandes
JWT_SECRET=tu-secret-key
NODE_ENV=development
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_app_password
SMTP_FROM=noreply@ecommerce.com
```

---

## ✅ Ejecución paso a paso

1. Clona el repositorio.
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Ejecuta los tests:
   ```bash
   npm test
   ```
4. Construye la imagen Docker:
   ```bash
   docker build -t lucasfernandes7/backend-3-fernandes:latest .
   ```
5. Ejecuta el contenedor:
   ```bash
   docker run --rm -p 3000:3000 lucasfernandes7/backend-3-fernandes:latest
   ```
6. Prueba el endpoint:
   ```bash
   curl http://localhost:3000/api/products
   ```

---

## 📌 Notas finales

- La imagen Docker ya está publicada en Docker Hub.
- El proyecto está listo para ejecutarse localmente y desplegarse con Docker.
- Si actualizas el repositorio de GitHub, reemplaza las URLs de ejemplo por la URL real.

---

## 📄 Licencia

MIT

