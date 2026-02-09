# SERVIDOR EN NODE.js CON EXPRESS + AUTENTICACIÓN

Proyecto de pre-entrega — Introducción a Backend 1 (Coderhouse)

## Descripción
- Servidor con Express y vistas en Handlebars.
- Persistencia con MongoDB (Mongoose).
- Actualización en tiempo real de productos con Socket.io.
- **Sistema completo de Autenticación y Autorización con JWT**
- **Modelo de Usuario con encriptación de contraseña (bcrypt)**
- **Estrategias Passport para Login y Validación**

## Estructura principal

- `src/`
	- `app.js` - configuración de Express, Passport, vistas y rutas
	- `servidor.js` - servidor HTTP y configuración de `socket.io`
	- `config/` - configuración de Passport y estrategias JWT
	- `controllers/` - lógica que orquesta managers (productos, carritos, usuarios)
	- `managers/` - acceso a datos (Mongoose models)
	- `middleware/` - middleware de autenticación
	- `models/` - esquemas Mongoose (`Product`, `Cart`, `User`)
	- `rutas/` - rutas API para productos, carritos, usuarios, autenticación y sesiones
	- `views/` - plantillas Handlebars (home, realtimeproducts, productDetail, cartDetail)
- `data/` - JSON de ejemplo (no usado cuando se usa MongoDB)

## Nuevas Características - Autenticación y Autorización

### Modelo de Usuario
- **first_name**: String (requerido)
- **last_name**: String (requerido)
- **email**: String (requerido, único)
- **age**: Number
- **password**: String (encriptado con bcrypt)
- **cart**: ObjectId referencia a Cart
- **role**: String (por defecto: 'user')

### Endpoints Principales

#### Autenticación (`/api/auth`)
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Login con email y contraseña
- `POST /api/auth/logout` - Cerrar sesión

#### Sesiones (`/api/sessions`)
- `GET /api/sessions/current` - Obtener datos del usuario logueado

#### Usuarios (`/api/users`) 
- `GET /api/users` - Obtener todos los usuarios (admin)
- `GET /api/users/:id` - Obtener usuario por ID
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario (admin)

Vistas principales
- `/` - listado de productos (home)
- `/realtimeproducts` - interfaz con Socket.io para agregar/eliminar productos en tiempo real
- `/products/:pid` - vista de detalle de producto
- `/carts/:cid` - vista del carrito

Cómo correr el proyecto

1. Instalar dependencias:

```bash (o cualquier consola que ejecute node.js / MongoDB)
npm install
```

2. Asegurarse de tener MongoDB corriendo localmente en `mongodb://localhost:27017`.

3. Levantar la app en modo desarrollo (con `nodemon`):

```bash
npm run dev
```

O en modo producción:

```bash
npm start
```

La app escucha en `http://localhost:3000` por defecto.

Notas sobre sockets y vistas
- `src/servidor.js` expone `io` en la app (`app.set('io', io)`), las rutas lo usan para emitir actualizaciones.
- La vista `/realtimeproducts` envía eventos `newProduct` y `deleteProduct` al servidor; el servidor emite `products` actualizado.

Extensiones sugeridas
- Validaciones en servidor y cliente para entradas de productos.
- Paginación completa y filtros para la API de productos.

