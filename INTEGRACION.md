# Auditoría frontend ↔ microservicios

Revisión del código real de `microservicios/services-HardTechHub`, no de versiones antiguas de otras carpetas. Solo se modificó el frontend.

## Funcionalidad, microservicio y endpoint

| Funcionalidad | Microservicio | Endpoint | Estado |
| --- | --- | --- | --- |
| Catálogo | Catalog | GET /api/products | Integrado; HTTP local 200 |
| Detalle | Catalog | GET /api/products/{id} | Integrado; HTTP local 200 |
| Categorías y marcas | Catalog | GET /api/categories, GET /api/brands | Integrado; HTTP local 200 |
| Gestión paginada | Catalog | GET /api/admin/products | Integrado; HTTP local 200 |
| Crear producto | Catalog | POST /api/products | Conservado; contrato probado |
| Editar/reactivar | Catalog | PUT /api/products/{id} | Conservado; contrato probado |
| Desactivar | Catalog | DELETE /api/products/{id} | Conservado; contrato probado |
| Disponibilidad | Inventory | GET /inventory/{product_id} | Añadido; 404 real se muestra como sin registro |
| Crear pedido | Order | POST /api/orders | Corregido: solo items, con Idempotency-Key |
| Pedidos recientes | Order | GET /api/orders | Integrado; HTTP local 200; máximo 50 en resumen |
| Historial paginado | Order | GET /api/admin/orders | Integrado; HTTP local 200 |
| Detalle de pedido | Order | GET /api/orders/{id} | Conservado sin restricción por propietario |
| Cambiar estado | Order | PATCH /api/orders/{id}/status | Solo transiciones permitidas |
| Reintentar reserva | Order | POST /api/orders/{id}/retry | Añadido para RESERVING |
| Compatibilidad | Compatibility | POST /api/compatibility/check | Conservado; HTTP local 200 |
| Dashboard | Analytics | GET /api/analytics/* (detalle debajo) | Implementado; AWS local devuelve 503 |
| Publicar datos analíticos | Analytics | POST /api/analytics/refresh | Integrado; no ejecutado contra AWS |
| Login, registro y perfil | No existe servicio actual | No existe endpoint | Eliminados |

El frontend no llama reserve/release/confirm directamente: Order coordina esas operaciones con Inventory. No consulta bases de datos.

## Contratos y correcciones

- No existe Identity en el stack actual. El login anterior dependía de un servicio retirado. Se eliminaron páginas, formularios, contexto, guardas, roles, JWT, interceptores de sesión, tipos, navegación y pruebas exclusivas de esa implementación.
- Pedidos no contienen propietario. Se retiraron el filtro y la columna de usuario y la llamada antigua de pedidos por usuario.
- Estados: RESERVING → CANCELLED; PENDING → PAID o CANCELLED; PAID → SHIPPED. SHIPPED y CANCELLED son terminales. RESERVING también permite el endpoint de reintento.
- POST de pedido transmite `{items:[{product_id,quantity}]}`. Los importes definitivos proceden del backend. Los errores con order_id permiten abrir el pedido pendiente.
- Catalog conserva sus filtros y paginación. Los selectores CRUD usan IDs de categorías y marcas devueltos por sus endpoints. PUT no ofrece cambiar SKU, categoría ni marca.
- Las categorías visibles de la tienda proceden de productos reales; el mapa local solo aporta nombres e iconos.
- Compatibility transmite `{components:[{type,product_id}]}`, con cpu/motherboard/ram/gpu/psu. Se conserva su respuesta `compatible/messages`, sin inventar reglas adicionales.
- Inventory muestra stock disponible recibido de la API. Un 404 y un fallo de conexión son estados distintos.
- Los errores son visibles, con carga, listas vacías y reintento. Las consultas analíticas fallan de forma independiente.

## Dashboard basado en las consultas Athena actuales

Fuente: `analytics-service/app/main.py`, consultas sobre `business_snapshot`; exportación en `app/pipeline.py`. No se modifica SQL desde el frontend.

| Sección | Endpoint bajo /api/analytics | Consulta / significado |
| --- | --- | --- |
| Resumen | GET /summary | orders: eventos ORDER; sales: ORDER PAID/SHIPPED; revenue: suma total_amount de esos pedidos; units_sold: quantity de ORDER_ITEM vendidos; products_sold: IDs distintos vendidos |
| Productos más vendidos | GET /top-products | Agrupa ORDER_ITEM PAID/SHIPPED por product_id; nombre, suma quantity y subtotal; cinco primeros por unidades |
| Categorías | GET /top-categories | Agrupa esos artículos vendidos por category; unidades e ingresos |
| Ventas por día | GET /trends | Agrupa ORDER PAID/SHIPPED por fecha de created_at; ventas e ingresos |
| Movimientos | GET /inventory-movements | Agrupa INVENTORY_MOVEMENT por movement_type; cantidad de movimientos y suma quantity |
| Eventos | GET /events/count | Cuenta eventos por event_type y su total |
| Productos más vistos | GET /top-views | Cuenta PRODUCT_VIEW por product_id; cinco primeros |
| Actualizar datos | POST /refresh | Exporta datos operacionales y eventos a S3; devuelve records/key/refreshed_at |

Las métricas de productos vendidos ya no se interpretan como vistas. Los ingresos de artículos suman subtotal; el resumen de ingresos suma total_amount del pedido, por lo que no tienen que coincidir si existen impuestos/envío. La tendencia usa fecha de creación, no una fecha de pago inventada. No se calculan porcentajes de crecimiento ni métricas de cuentas que el servicio no entrega.

Los datos se reflejarán cuando AWS tenga bucket/snapshot, catálogo Glue, Athena y permisos correctamente configurados para Analytics. Ninguna credencial AWS pertenece al frontend. Si no hay datos, se muestran respuestas vacías; si hay error, se muestra error. No hay valores simulados de respaldo.

## Configuración

Las cinco variables VITE y los requisitos de AWS/CORS/HTTPS están documentados en README. Se corrigió la URL de Analytics del .env local de 8004 a 8005 y se añadió Inventory 8006; se mantuvo el host existente del usuario.

No se modificaron microservicios, Docker, CloudFormation, redes ni bases. El frontend en producción necesita acceso HTTP a las APIs; una IP privada de EC2 solo sirve si el navegador tiene conectividad hacia esa red.

## Verificación realizada

- 17 pruebas automatizadas de contratos, validaciones, paginación, formularios, transiciones, reserva pendiente y disponibilidad: aprobadas.
- TypeScript y build Vite: aprobados.
- ESLint: aprobado.
- Vite iniciado en 127.0.0.1:5175 con variables temporales apuntando a los servicios locales existentes, sin sobrescribir el host remoto del .env.
- HTTP de páginas principales: 200. Esto verifica entrega de HTML, no renderizado visual.
- Proxy real: catálogo y pedidos 200; Inventory 404 para el producto consultado; Analytics 503.
- API real: catálogo/listados/categorías/marcas y Compatibility 200.
- Las siete consultas analíticas devolvieron 503: validación de métricas exitosas en AWS pendiente.
- No se crearon ni modificaron productos, pedidos ni stock para esta comprobación de lectura.
- El navegador integrado no tiene navegadores disponibles. Quedan pendientes consola de navegador, revisión visual/responsive y recorridos interactivos completos.
- No se cambió ni desplegó infraestructura AWS.

Los adaptadores simulados están exclusivamente en pruebas unitarias. Los scripts scripts/check-live.mjs y scripts/verify-frontend.mjs permiten repetir las comprobaciones HTTP; no son pruebas visuales.

## Archivos de esta intervención

Creación: hooks/useInventory.ts, services/inventoryService.ts, utils/orders.ts; scripts/check-live.mjs y scripts/verify-frontend.mjs.

Eliminación: pages/LoginPage.tsx, pages/RegisterPage.tsx, pages/ProfilePage.tsx; components/common/AuthForm.tsx, RequireAuth.tsx y RequireAdmin.tsx; contexts/AuthContext.ts y AuthProvider.tsx; hooks/useAuth.ts y useOrders.ts; services/authService.ts; utils/auth.ts y permissions.ts. Algunos ya eran archivos sin seguimiento de cambios anteriores.

Modificación: App.tsx, App.css, api/axios.ts, api/errors.ts, types/type.ts, vite-env.d.ts, providers/AppProviders.tsx; hooks/index.ts, useProductPurchase.ts, useCreateOrder.ts, useAdminOrders.ts, useAdminOrderPage.ts, useAdminProducts.ts, useAnalytics.ts; services/ordersService.ts y analyticsServices.ts; componentes Header, Footer, CategoryNav, Hero, CategoryGrid, ProductFilters, OrderStatusBadge y OrderStatusEditor; páginas Home, Help, Cart, Checkout, Orders, OrderDetail, Product, AdminOrders, AdminDashboard y AdminAnalytics; vite.config.ts, .env/.env.example, tests/integration.test.mjs, README.md y este documento.

Se conservaron cambios previos válidos en los formularios, CRUD, paginación, compatibilidad y estilos. El estado Git puede incluir otros archivos modificados antes de esta intervención.
