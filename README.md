# SERVIDOR EN NODE.js CON EXPRESS

Proyecto de pre-entrega — Introducción a Backend 1 (Coderhouse)

Descripción
- Servidor con Express y vistas en Handlebars.
- Persistencia con MongoDB (Mongoose).
- Actualización en tiempo real de productos con Socket.io.

Estructura principal

- `src/`
	- `app.js` - configuración de Express, vistas y rutas
	- `servidor.js` - servidor HTTP y configuración de `socket.io`
	- `controllers/` - lógica que orquesta managers (productos, carritos)
	- `managers/` - acceso a datos (Mongoose models)
	- `models/` - esquemas Mongoose (`Product`, `Cart`)
	- `rutas/` - rutas API para `products` y `carts`
	- `views/` - plantillas Handlebars (home, realtimeproducts, productDetail, cartDetail)
- `data/` - JSON de ejemplo (no usado cuando se usa MongoDB)

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

