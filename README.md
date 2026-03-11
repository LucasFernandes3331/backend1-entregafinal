# E-commerce Backend - Node.js + Express

Servidor backend robusto y profesional para un e-commerce con autenticación JWT, autorización por roles, gestión de compras y recuperación de contraseña.

## 🚀 Características

- **Autenticación segura** con JWT y bcrypt
- **Autorización basada en roles** (admin, user)
- **Patrón Repository/DAO** para acceso a datos
- **DTOs** para transferencia segura de datos
- **Sistema de compra completo** con tickets y validación de stock
- **Recuperación de contraseña** con tokens que expiran en 1 hora
- **Email automatizado** para confirmaciones de compra y recuperación
- **Actualización en tiempo real** de productos con Socket.io
- **MongoDB** como base de datos persistente

## 📋 Requisitos

- Node.js v14+
- MongoDB local o remoto
- NPM o Yarn

## 📦 Instalación

```bash
git clone <repositorio>
cd backend1-pre-entrega-main
npm install
```

## ⚙️ Configuración

Crear archivo `.env` basado en `.env.example`:

```env
JWT_SECRET=tu_clave_secreta_fuerte
MONGODB_URI=mongodb://localhost:27017/coder-fernandes
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000

# Email (Gmail u otro servicio)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_contraseña_aplicacion
SMTP_FROM=noreply@ecommerce.com
```

## 🚀 Uso

```bash
npm run dev    # Desarrollo con nodemon
npm start      # Producción
```

Servidor disponible en `http://localhost:3000`

## 📁 Estructura

```
src/
├── config/          # Configuración de Passport
├── controllers/     # Lógica de negocio
├── dtos/           # Data Transfer Objects
├── managers/       # Managers (compatibilidad)
├── middleware/     # Autenticación y autorización
├── models/         # Esquemas Mongoose
├── repositories/   # Patrón Repository/DAO
├── services/       # Servicios de negocio (Email, Compras)
├── rutas/         # Endpoints API
├── views/         # Plantillas Handlebars
├── app.js         # Configuración Express
└── servidor.js    # Servidor HTTP
```

## 🔑 Endpoints Principales

### Autenticación (`/api/auth`)
- `POST /register` - Registrar usuario (retorna cart_id)
- `POST /login` - Login (solo cookie)
- `POST /logout` - Logout
- `POST /forgot-password` - Solicitar reset
- `GET /reset-password/:token` - Validar token
- `POST /reset-password/:token` - Restablecer contraseña

### Productos (`/api/products`)
- `GET /` - Listar productos (con paginación, filtros y sort)
- `GET /:pid` - Detalles del producto
- `POST /` - Crear (solo admin)
- `PUT /:pid` - Actualizar (solo admin)
- `DELETE /:pid` - Eliminar (solo admin)

### Carritos (`/api/carts`)
- `POST /` - Crear carrito
- `GET /:cid` - Ver carrito
- `POST /:cid/products/:pid` - Agregar producto (solo usuarios)
- `DELETE /:cid/products/:pid` - Remover producto (solo usuarios)
- `DELETE /:cid` - Vaciar carrito (solo usuarios)

### Compra (`/api/tickets`)
- `POST /checkout` - Procesar compra (solo usuarios)
- `GET /` - Ver todos los tickets (solo admin)
- `GET /:id` - Ver ticket (admin o propietario)
- `GET /user/my-tickets` - Mis tickets

### Sesiones (`/api/sessions`)
- `GET /current` - Datos del usuario autenticado (DTO)

### Usuarios (`/api/users`)
- `GET /` - Listar usuarios (solo admin)
- `GET /:id` - Detalles de usuario
- `PUT /:id` - Actualizar usuario
- `DELETE /:id` - Eliminar usuario (solo admin)

## 🔐 Roles y Permisos

| Acción | User | Admin |
|--------|------|-------|
| Ver productos | ✅ | ✅ |
| Crear producto | ❌ | ✅ |
| Actualizar producto | ❌ | ✅ |
| Eliminar producto | ❌ | ✅ |
| Agregar al carrito | ✅ | ❌ |
| Realizar compra | ✅ | ❌ |
| Ver sus tickets | ✅ | ✅ |
| Ver todos los tickets | ❌ | ✅ |

## 🧠 Patrones Implementados

### Repository Pattern
Separación clara entre lógica de acceso a datos (repositories) y lógica de negocio (services).

### DTO (Data Transfer Object)
Los datos sensibles del usuario se transfieren mediante DTOs que exponen solo información necesaria.

### Services
`PurchaseService` y `EmailService` centralizan la lógica de negocio compleja.

### Middleware de Autorización
Middleware reutilizable para validar roles y proteger endpoints.

## 📧 Sistema de Email

Implementado con Nodemailer. Soporta:
- **Recuperación de contraseña**: enlace con expiración de 1 hora
- **Confirmación de compra**: datos del ticket por email

## 💳 Lógica de Compra

1. Usuario inicia checkout desde su carrito
2. Sistema valida stock de cada producto
3. Productos con stock suficiente se procesan y stock se decrementa
4. Se genera un **Ticket** con código único
5. Carrito se limpia automáticamente
6. Email de confirmación se envía
7. Ticket puede ser consultado por usuario o admin

## 🛡️ Seguridad

- Contraseñas encriptadas con bcrypt
- Tokens JWT con expiración
- Cookies HttpOnly para tokens
- Validaciones en todos los endpoints
- Middleware de autenticación obligatorio
- Protección contra re-uso de contraseña anterior

## 📝 Notas de Desarrollo

- Los managers se mantienen para compatibilidad
- Controllers usan managers, services usan repositories
- La migración completa a repositories puede hacerse gradualmente
- Socket.io sigue activo para actualizaciones en tiempo real

