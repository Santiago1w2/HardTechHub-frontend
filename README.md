# HardTech Hub — Frontend

React, TypeScript, Vite, Axios y React Router. La interfaz consume los cinco microservicios actuales de `microservicios/services-HardTechHub`. No tiene autenticación: ese backend no ofrece cuentas ni inicio de sesión.

## Ejecutar

```powershell
npm install
# Solo si todavía no tienes .env:
Copy-Item .env.example .env
npm run dev
```

Configura las cinco URLs antes de iniciar Vite o compilar:

| Variable | Servicio | Puerto habitual |
| --- | --- | --- |
| VITE_CATALOG_API_URL | Catalog | 8002 |
| VITE_ORDER_API_URL | Order | 8003 |
| VITE_COMPATIBILITY_API_URL | Compatibility | 8004 |
| VITE_ANALYTICS_API_URL | Analytics | 8005 |
| VITE_INVENTORY_API_URL | Inventory | 8006 |

Son URLs base, sin `/api`. Los ejemplos locales están en [.env.example](.env.example).
En AWS deben ser direcciones alcanzables desde el navegador, normalmente dominios HTTPS o un reverse proxy. Los nombres internos de Docker no son direcciones de navegador.
Las variables Vite son públicas: no colocar credenciales AWS ni contraseñas.

En desarrollo el proxy de Vite utiliza estas URLs. En producción Axios usa las URLs incorporadas durante `npm run build`; cambiar el entorno requiere recompilar. Una variable ausente genera un error explícito. Para mismo origen configura su URL absoluta y enruta las APIs mediante el alojamiento. El proxy de desarrollo no se incluye en `dist`.

El backend debe permitir el origen del frontend mediante CORS (incluido el encabezado `Idempotency-Key` para pedidos). Una página HTTPS necesita APIs HTTPS. El alojamiento debe devolver `index.html` para las rutas de React. No se modificó infraestructura.

## Pantallas

| Ruta | Función real |
| --- | --- |
| / | Productos y categorías del catálogo |
| /productos | Búsqueda, filtros, ordenación y paginación local |
| /productos/:id | Producto, especificaciones y disponibilidad |
| /carrito, /checkout | Selección y creación de pedido |
| /pedidos, /pedidos/:id | Listado paginado, detalle y estados |
| /compatibilidad | Comprobación de componentes mediante su API |
| /analitica | Dashboard de consultas Athena |
| /admin | Resumen de gestión |
| /admin/productos | CRUD, filtros y paginación del servidor |
| /admin/productos/nuevo, /admin/productos/:id/editar | Formularios con marcas/categorías reales |
| /admin/pedidos, /admin/pedidos/:id | Gestión de pedidos |
| /admin/analitica | El mismo dashboard de Analítica |
| /ayuda | Explicación del funcionamiento real |

`/admin` conserva el nombre de ruta existente; no implica autorización ni roles. Las operaciones son públicas, igual que el backend actual.

El carrito se mantiene en memoria y se vacía al recargar. Crear un pedido envía solamente productos y cantidades; el servidor valida precios y reserva stock. La clave de idempotencia se conserva al reintentar la misma selección mientras el checkout está montado. Ante una reserva pendiente con ID se ofrece consultar el pedido y reintentar su reserva. Registrar o marcar un pedido como pagado no ejecuta una pasarela de pago.

Analítica muestra únicamente respuestas reales. Sus consultas usan S3, Glue y Athena a través del microservicio; el navegador no accede directamente a AWS. “Actualizar datos” ejecuta la exportación real y “Consultar” vuelve a consultar las métricas. Un error AWS no se convierte en métricas de cero.

## Verificar

```powershell
npm test
npm run lint
npm run build
npm run preview
# Comprobación HTTP contra las URLs de tu .env:
node --env-file=.env scripts/check-live.mjs
# Con Vite en ejecución:
$env:FRONTEND_URL='http://localhost:5173'
node scripts/verify-frontend.mjs
```

Las pruebas unitarias usan adaptadores de Axios exclusivamente en tests; la aplicación no contiene datos simulados. El script HTTP informa por separado si Analytics no está disponible. No sustituye una prueba visual en navegador.

Consulta [INTEGRACION.md](INTEGRACION.md) para contratos, consultas Athena y resultados de esta revisión.
