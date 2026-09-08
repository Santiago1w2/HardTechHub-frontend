# HardTech Hub — Contexto del frontend para continuar el diseño

Fecha de revisión: 6 de septiembre de 2026.

## 1. Objetivo de este documento

Este documento permite a otra IA continuar la construcción visual del frontend sin rehacer la conexión con los microservicios. Describe el estado real del código, los contratos disponibles, las decisiones implementadas y las tareas pendientes.

**El frontend ya tiene la capa de API, servicios, tipos, contextos y hooks. La interfaz comercial todavía no está construida: `App.tsx` conserva la pantalla inicial de Vite.**

El usuario desea encargarse de consumir esta lógica dentro de las páginas y ahora solicita contexto para iniciar el diseño. Este documento no representa una aprobación de un estilo visual concreto ni de nuevas funcionalidades de backend.

Prioridad de fuentes: código actual > este documento > ejemplos antiguos de la conversación. Releer los archivos antes de modificarlos si el proyecto ha cambiado.

## 2. Producto y alcance funcional

HardTech Hub es una tienda de componentes de computadora. El backend disponible permite registro, autenticación, consulta de perfil, catálogo, pedidos y métricas de eventos simulados.

Idioma de interfaz propuesto: español. Moneda usada por la utilidad existente: PEN, formato `es-PE`.

Flujo comercial que puede diseñarse con la base existente:

1. Explorar productos y sus especificaciones.
2. Registrarse e iniciar sesión.
3. Añadir productos al carrito y ajustar cantidades.
4. Confirmar un pedido autenticado.
5. Consultar los pedidos propios y sus detalles.
6. Opcionalmente construir interfaces administrativas y de analítica usando los hooks disponibles.

No presentar una confirmación de pedido como un pago cobrado: no existe una pasarela de pago.

## 3. Ubicación y stack

Frontend:

```text
C:\Users\smora\OneDrive\Escritorio\Cloud_Computing\proyecto_parcial\front-end
```

Backend hermano:

```text
C:\Users\smora\OneDrive\Escritorio\Cloud_Computing\proyecto_parcial\backend\HardTechHub
```

Versiones declaradas en `package.json` (rangos, no afirmación de versiones resueltas):

| Dependencia | Versión declarada | Uso |
|---|---|---|
| React / React DOM | `^19.2.8` | Componentes y contextos |
| TypeScript | `~6.0.2` | Código de aplicación TS/TSX |
| Vite | `^8.2.2` | Desarrollo y build |
| Axios | `^1.20.0` | HTTP |
| Tailwind CSS | `^4.3.3` | Instalado, aún no conectado al flujo CSS |
| `@tailwindcss/vite` | `^4.3.3` | Instalado, aún no registrado en Vite |
| ESLint | `^10.0.1` para `@eslint/js`, `^10.9.0` para ESLint | Validación de código |

No están instalados React Router, TanStack Query, Redux, Zustand, librerías de formularios ni un kit de componentes. No asumir que pueden importarse sin agregarlos.

El proyecto usa módulos ES (`type: module`). TypeScript tiene comprobaciones de imports/variables sin uso y `verbatimModuleSyntax`; usar `import type` cuando corresponda. No se declara `strict: true` en `tsconfig.app.json`.

## 4. Estructura actual

```text
front-end/
├── .env
├── .env.example
├── package.json
├── package-lock.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js
├── index.html
├── README.md                    # README inicial de React/Vite
├── INTEGRATION.md               # Guía breve de consumo
├── FRONTEND_CONTEXT.md          # Este informe
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── tests/
│   └── integration.test.mjs
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── App.css
    ├── index.css
    ├── vite-env.d.ts
    ├── assets/
    │   ├── hero.png
    │   ├── react.svg
    │   └── vite.svg
    ├── api/
    │   ├── axios.ts
    │   └── errors.ts
    ├── types/
    │   └── type.ts
    ├── services/
    │   ├── authService.ts
    │   ├── catalogService.ts
    │   ├── ordersService.ts
    │   └── analyticsServices.ts
    ├── contexts/
    │   ├── AuthContext.ts
    │   ├── AuthProvider.tsx
    │   ├── CartContext.ts
    │   └── CartProvider.tsx
    ├── providers/
    │   └── AppProviders.tsx
    ├── hooks/
    │   ├── index.ts
    │   ├── useAuth.ts
    │   ├── useCart.ts
    │   ├── useQuery.ts
    │   ├── useMutation.ts
    │   ├── useProducts.ts
    │   ├── useProduct.ts
    │   ├── useOrders.ts
    │   ├── useOrder.ts
    │   ├── useCreateOrder.ts
    │   ├── useUpdateOrderStatus.ts
    │   ├── useCreateProduct.ts
    │   ├── useUpdateProduct.ts
    │   ├── useDeleteProduct.ts
    │   └── useAnalytics.ts
    └── utils/
        └── formatPrice.ts
```

Respetar los nombres existentes: `types/type.ts`, `ordersService.ts` y `analyticsServices.ts`. No crear archivos duplicados con nombres parecidos.

## 5. Separación de responsabilidades

```text
Página / componente visual
        ↓
Hook público
        ↓
Contexto compartido (Auth/Cart) o servicio HTTP
        ↓
Instancia Axios del microservicio
        ↓
API del backend
```

- `api/axios.ts`: instancias, URL base, timeout y header de autenticación.
- `services/`: métodos HTTP tipados, sin estado visual.
- `types/type.ts`: contratos TS compartidos; no valida JSON en runtime.
- `contexts/`: estado compartido de sesión y carrito.
- `hooks/`: consultas y acciones con estados de carga/error.
- Páginas: diseño, formularios, navegación y presentación de estados.

No hace falta un contexto por microservicio. Productos, pedidos y métricas se consultan mediante hooks; no tienen caché global.

## 6. Conexión a microservicios

| Instancia Axios | Servicio | Puerto | Prefijo HTTP |
|---|---|---:|---|
| `identityApi` | Python/FastAPI + DynamoDB | 8001 | `/api/auth` |
| `catalogApi` | TypeScript/Fastify + PostgreSQL | 8002 | `/api/products` |
| `orderApi` | Python/FastAPI + MySQL | 8003 | `/api/orders` |
| `analyticsApi` | Python/FastAPI + S3 | 8005 | `/api/analytics` |

No existe el prefijo `/api/v1`. Compatibility, anunciado para el puerto 8004, no tiene código disponible en el backend revisado y no tiene integración frontend.

Variables actuales de desarrollo:

```dotenv
VITE_IDENTITY_API_URL=http://localhost:8001
VITE_CATALOG_API_URL=http://localhost:8002
VITE_ORDER_API_URL=http://localhost:8003
VITE_ANALYTICS_API_URL=http://localhost:8005
```

En desarrollo Axios usa `baseURL: '/'`. `vite.config.ts` enruta cada prefijo al host indicado por su variable, con fallback al puerto local correspondiente. Las rutas se conservan, no se reescriben.

Esto evita llamadas entre orígenes desde el navegador durante `npm run dev`. El backend revisado no configura CORS. No reemplazar las bases relativas de desarrollo por llamadas directas a los puertos sin resolver CORS.

En producción Axios usa la URL configurada, o `/` si está vacía. Se necesita uno de estos esquemas:

- URLs públicas HTTPS por servicio y CORS configurado en backend.
- Un reverse proxy del mismo origen que enrute `/api/...`, con variables vacías.

El proxy de desarrollo no constituye un proxy de producción. No publicar un build con URLs localhost para usuarios remotos. Las variables `VITE_*` son públicas; no guardar secretos en ellas.

Axios tiene timeout de 10 segundos. No usa cookies ni `withCredentials`. `setAccessToken(token)` asigna `Authorization: Bearer TOKEN` a las cuatro instancias; `null` elimina el header.

## 7. Autenticación: comportamiento real

`main.tsx` ya envuelve `App` en `AppProviders`, dentro de `StrictMode`. No duplicar providers al construir páginas.

Jerarquía:

```text
StrictMode
└── AppProviders
    └── AuthProvider
        └── SessionCart
            └── CartProvider (key = user_id o guest)
                └── App
```

`useAuth()` devuelve:

```ts
{
  user: UserProfile | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  login(credentials: AuthRequest): Promise<UserProfile>
  register(credentials: AuthRequest): Promise<RegisterResponse>
  logout(): void
}
```

Login llama al endpoint de autenticación, configura el token y obtiene `/api/auth/me`. Solo después expone `user`. El método del hook devuelve el perfil; la función `login` del servicio devuelve el token. No confundirlos.

Registro no inicia sesión. Después de registrarse, navegar al login o llamar al login explícitamente desde un flujo definido.

Logout limpia usuario y headers; no existe logout remoto. El provider bloquea operaciones de autenticación simultáneas y evita aplicar resultados de un login invalidado por logout.

Un interceptor cierra sesión al recibir 401 de `/api/auth/me`. No hay temporizador que cierre automáticamente la sesión al vencer el JWT, ni refresh token, ni recuperación de sesión al recargar.

La sesión y el token viven en memoria. No se usa localStorage, sessionStorage ni cookies. El JWT del backend vence por defecto a los 60 minutos.

Los métodos asíncronos propagan errores: capturar la promesa en el handler. El hook expone `error` para presentarlo; si es necesario cubrir cualquier rechazo del handler, usar también `getApiErrorMessage`.

## 8. Carrito: comportamiento real y efecto sobre el diseño

`useCart()` devuelve:

```ts
{
  items: CartItem[]
  totalItems: number
  subtotal: number
  addItem(product: Product, quantity?: number): void
  removeItem(productId: number): void
  updateQuantity(productId: number, quantity: number): void
  clearCart(): void
  toOrderItems(): OrderItemRequest[]
}
```

- Cantidad por defecto al añadir: 1.
- Añadir un producto existente suma unidades y reemplaza el snapshot del producto por el recibido.
- `totalItems` suma unidades, no líneas distintas.
- `updateQuantity` exige entero positivo. Para quitar el producto usar `removeItem`; no enviar cero.
- `subtotal` suma precios en centavos y vuelve a unidades monetarias. No incluye IGV ni envío.
- `toOrderItems()` devuelve solo `{ product_id, quantity }` para el backend.
- El carrito no persiste tras recargar y no tiene endpoint propio.

**El carrito se reinicia cuando cambia la identidad**, también al iniciar sesión como invitado. `CartProvider` usa una key dependiente del usuario y contiene a `App`; el cambio de key remonta también la aplicación descendiente. Esto puede reiniciar estado local de formularios/páginas y afecta al diseño del flujo de compra.

Para el comportamiento actual, pedir login antes de llenar el carrito es una opción coherente. Si el diseño requiere conservar el carrito invitado al iniciar sesión, hará falta modificar esa política de forma explícita: no asumir que ya existe una fusión de carritos.

## 9. Hooks públicos y contratos exactos

Importar desde `src/hooks/index.ts` mediante una ruta relativa adecuada, por ejemplo `../hooks` desde `src/pages`.

| Hook | Argumentos | Datos/acción |
|---|---|---|
| `useAuth()` | Ninguno | Contrato de sesión descrito arriba |
| `useCart()` | Ninguno | Contrato de carrito descrito arriba |
| `useProducts()` | Ninguno | `products: Product[]` |
| `useProduct(id?)` | ID numérico | `product: ProductDetail \| null` |
| `useOrders()` | **Ninguno** | `orders: Order[]` del usuario autenticado |
| `useOrder(id?)` | ID numérico | `order: OrderDetail \| null` |
| `useCreateOrder()` | Ninguno | `submitOrder(items): Promise<CreateOrderResponse>` |
| `useUpdateOrderStatus()` | Ninguno | `updateStatus(id, status)` |
| `useCreateProduct()` | Ninguno | `submitProduct(payload)` |
| `useUpdateProduct()` | Ninguno | `updateProduct(id, payload)` |
| `useDeleteProduct()` | Ninguno | `deleteProduct(id)` |
| `useAnalytics()` | Ninguno | `eventCount`, `topProducts` |

Todos los hooks de consulta añaden `loading`, `error` y `refetch()`. Todos los hooks de mutación añaden `loading` y `error`. `refetch()` solicita una nueva carga mediante estado, no devuelve una promesa con los datos.

`useOrders()` obtiene el usuario del contexto; no recibe `userId` aunque ejemplos antiguos de la conversación sí lo propusieran. Espera a tener usuario y devuelve arreglo vacío si no lo hay.

`useCreateOrder()` obtiene `user_id` del contexto. La página entrega un arreglo de ítems, no un objeto con `user_id`. Rechaza la acción si no hay sesión.

`useOrder(id).order` es un objeto con `{ order, items }`. Por ejemplo, el total está en `result.order.order.total_amount` si `result` es el retorno del hook. Conviene renombrar al desestructurar: `const { order: detail } = useOrder(id)`.

`useAnalytics()` hace las dos consultas en paralelo y devuelve `eventCount: EventCountResponse | null` y `topProducts: Array<{ product_id: string; views: number }>`. Si una falla, la consulta combinada queda en error.

### Infraestructura interna de hooks

`useQuery` es un hook propio, no TanStack Query. Ejecuta GET al montar/cambiar dependencias, cancela peticiones anteriores con AbortController e ignora respuestas canceladas. No hay caché compartida, polling, retries ni invalidación automática. Durante una recarga no expone los datos anteriores.

`useMutation` ejecuta solo al llamar su acción. Bloquea llamadas simultáneas de la misma instancia del hook, conserva un mensaje de error y vuelve a lanzar el error. No impide duplicados entre instancias distintas ni proporciona idempotencia en el servidor. No cancela la operación remota al desmontar.

Tras crear, actualizar o eliminar, llamar a `refetch()` del listado afectado o navegar a una pantalla que consulte datos nuevos.

## 10. Tipos de datos

Todos están en `src/types/type.ts`.

| Tipo | Campos relevantes |
|---|---|
| `AuthRequest` | email, password |
| `RegisterResponse` | message, user_id |
| `LoginResponse` | access_token, token_type |
| `UserProfile` | user_id, email, roles[], preferences, created_at nullable |
| `Product` | id, sku, name, description nullable, price string, specs, image_url nullable, category, brand |
| `ProductDetail` | Product + is_active, created_at |
| `CartItem` | product, quantity |
| `OrderItemRequest` | product_id, quantity |
| `CreateOrderRequest` | user_id, items[] |
| `CreateOrderResponse` | order_id, status, total_amount string |
| `Order` | id, user_id, status, subtotal, tax, shipping_cost, total_amount, created_at, updated_at |
| `OrderItem` | id, order_id, product_id, product_sku, product_name, quantity, unit_price, subtotal |
| `OrderDetail` | order, items[] |
| `UpdateOrderStatusResponse` | order_id, status |
| `EventCountResponse` | total_events, by_type, prefix |
| `TopProductsResponse` | top_products[] con product_id string y views number |
| `CreateProductRequest` | category_id, brand_id, sku, name, price number, specs; description/image_url opcionales |
| `CreateProductResponse` | id, sku, name, price string |
| `UpdateProductRequest` | name, description, price number, specs, image_url, is_active; todos obligatorios |

`Money = string | number`. `OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'CANCELLED'`.

`specs` y `preferences` son `Record<string, unknown>`. Comprobar el tipo antes de renderizar un valor como ReactNode. No asumir que todas las categorías tienen socket, RAM o potencia.

Usar `formatPrice` desde `src/utils/formatPrice.ts`; admite Money y formatea PEN. Fechas son strings del backend, no objetos Date. No hay utilidad de fecha compartida todavía.

## 11. Inventario HTTP disponible

| Servicio | Método y ruta | Servicio frontend |
|---|---|---|
| Identity | POST `/api/auth/register` | register(payload) |
| Identity | POST `/api/auth/login` | login(payload), llamada interna del provider |
| Identity | GET `/api/auth/me` | getProfile(signal?) |
| Catalog | GET `/api/products` | getProducts(signal?) |
| Catalog | GET `/api/products/{id}` | getProduct(id, signal?) |
| Catalog | POST `/api/products` | createProduct(payload) |
| Catalog | PUT `/api/products/{id}` | updateProduct(id, payload) |
| Catalog | DELETE `/api/products/{id}` | deleteProduct(id) |
| Orders | POST `/api/orders` | createOrder(payload) |
| Orders | GET `/api/orders/user/{user_id}` | getMyOrders(userId, signal?) |
| Orders | GET `/api/orders/{id}` | getOrder(id, signal?) |
| Orders | PATCH `/api/orders/{id}/status` | updateOrderStatus(id, status) |
| Analytics | GET `/api/analytics/events/count` | getEventCount(signal?) |
| Analytics | GET `/api/analytics/top-products` | getTopProducts(signal?) |

Las APIs también tienen `/health`. Los FastAPI exponen `/docs` y `/openapi.json`; Catalog configura `/docs`, pero la documentación generada debe comprobarse porque Swagger se registra después de las rutas.

### Catálogo

El listado devuelve un arreglo directo de productos activos. No hay paginación, filtros, búsqueda, ordenamiento remoto ni endpoints de categorías/marcas. Se puede filtrar localmente el listado cargado para una primera interfaz, indicándolo como comportamiento frontend.

El detalle puede devolver un producto inactivo. Deshabilitar su compra en la interfaz si `is_active` es falso, sin asumir que el backend ya lo rechaza.

PUT sobrescribe todos sus campos. En formularios de edición convertir descripción e imagen nulas a strings y precio a number. No permite modificar SKU, categoría o marca.

DELETE es baja lógica y devuelve `{ deleted: true }`, incluso si no encuentra el ID. El listado normal no permite recuperar productos desactivados.

Crear productos exige IDs existentes de categoría/marca, pero los GET de productos devuelven nombres y no esos IDs. Para un administrador completo falta resolver cómo obtener esas opciones; no inventar endpoints ni asumir IDs universales.

### Pedidos

El cliente manda IDs y cantidades. El servidor consulta catálogo, toma los precios actuales y guarda SKU/nombre/precio como snapshot histórico.

```text
subtotal = suma de precios × cantidades
IGV = subtotal × 18%, redondeado a dos decimales
envío = 25.00
total = subtotal + IGV + envío
```

En checkout, cualquier cálculo local es estimativo; el resultado del servidor es definitivo. No usar el precio actual del catálogo para recalcular un pedido histórico.

Crear devuelve `{ order_id, status: 'PENDING', total_amount }`. No implica pago. El backend acepta cualquiera de los cuatro estados sin imponer una máquina de transiciones.

El servicio frontend ya rechaza pedidos vacíos y cantidades/IDs no enteros positivos antes de HTTP. El backend aún necesita sus propias validaciones.

### Analítica

El ingestor genera eventos aleatorios en S3, JSON raw y Parquet procesado. Analytics lee JSON y calcula conteos/top cinco vistas. Las métricas no representan navegación real de esta web.

No hay endpoint para enviar eventos desde el navegador. No inventar `POST /events`. Los IDs de top-products son strings; cruzarlos con catálogo para nombre/imagen si se necesita. No hay filtros de fecha implementados.

## 12. Datos semilla útiles para el diseño

En una base limpia se esperan estos productos; consultar la API en vez de depender de IDs fijos:

| ID esperado | Producto | Precio PEN | Especificaciones de ejemplo |
|---:|---|---:|---|
| 1 | AMD Ryzen 7 7700X | 1499.90 | socket AM5, 8 núcleos, 16 hilos |
| 2 | ASUS Prime B650 | 899.90 | socket AM5, DDR5, chipset B650 |
| 3 | NVIDIA GeForce RTX 4070 Ti | 3299.90 | 12 GB VRAM, fuente recomendada 700 W |
| 4 | Corsair Vengeance DDR5 32GB | 549.90 | DDR5, 6000 MHz, 2 módulos |
| 5 | Corsair RM850x 850W | 449.90 | 850 W, 80+ Gold, modular |

Las imágenes semilla apuntan a `example.com`. Crear un fallback para imagen ausente/rota; no asumir que existen fotografías comerciales funcionales en assets.

El README backend documenta `demo@hardtech.com` / `password123`; no se ha verificado ese login contra un backend corriendo. El usuario semilla es `usr_demo_001`. Los nuevos IDs de usuario se generan a partir del segmento del email anterior a @, con riesgo de colisión entre dominios.

## 13. Estado visual real

No hay páginas de negocio, router, navbar comercial, footer comercial, rutas protegidas, formularios de login, checkout ni dashboard implementados.

`App.tsx` sigue mostrando el contador, logos React/Vite y enlaces del starter. `App.css` contiene el layout de esa pantalla. `index.css` incluye variables de color y estilos globales del starter, entre ellos un `#root` de 1126 px, texto centrado, bordes y color scheme claro/oscuro según el sistema. Esos estilos no constituyen una identidad visual aprobada.

Tailwind está instalado, pero no aparece el plugin en `vite.config.ts` ni un import de Tailwind en el CSS. Si se elige Tailwind, completar la configuración sin eliminar el proxy ni el plugin React. También se puede diseñar con CSS existente/refactorizado.

Assets actuales: `hero.png`, `react.svg`, `vite.svg`, `public/icons.svg`, `public/favicon.svg`; son recursos del starter. No hay logo HardTech Hub ni biblioteca de imágenes de producto creada.

`index.html` todavía tiene `lang="en"` y título `front-end`. Actualizar idioma, título, favicon y metadatos como parte del diseño.

No hay una paleta, tipografía, referencia visual o sistema de componentes aprobado por el usuario. La siguiente IA debe proponer o solicitar una dirección visual sin presentar una preferencia inventada como decisión previa.

## 14. Plan sugerido para construir la interfaz

Estas son propuestas de organización y rutas; no existen aún:

| Página propuesta | Ruta sugerida | Integración |
|---|---|---|
| Inicio | `/` | useProducts para destacados reales |
| Catálogo | `/productos` | useProducts + filtros locales |
| Producto | `/productos/:id` | useProduct + useCart |
| Login | `/login` | useAuth.login |
| Registro | `/registro` | useAuth.register |
| Carrito | `/carrito` | useCart |
| Confirmación de pedido | `/checkout` | useAuth + useCart + useCreateOrder |
| Mis pedidos | `/pedidos` | useOrders() |
| Detalle de pedido | `/pedidos/:id` | useOrder |
| Perfil | `/perfil` | useAuth.user, solo lectura |
| Administración de catálogo | `/admin/productos` | Hooks de mutación y listado; opciones de marcas/categorías pendientes |
| Analítica | `/admin/analitica` | useAnalytics, etiquetar datos simulados |

Componentes reutilizables sugeridos: layout, header con sesión y contador, footer, tarjeta de producto, precio, badge de categoría/estado, tabla de especificaciones, selector de cantidad, resumen de pedido, campos de formulario, alerta de error, skeleton y estado vacío.

Proteger visualmente las páginas de cuenta/checkout y mostrar mensajes de sesión. Roles pueden guiar navegación administrativa, pero no son una barrera de seguridad del servidor. No hay router instalado ni guard implementado.

Para estados de pedido se pueden usar etiquetas: PENDING → Pendiente, PAID → Pagado, SHIPPED → Enviado, CANCELLED → Cancelado. Mantener los valores originales al llamar al backend.

Construir diseño responsive, foco visible, labels asociados, controles accesibles y estados de carga/vacío/error. Mostrar feedback de acciones y evitar dobles envíos. No agregar botones que aparenten operar pagos, stock o compatibilidad inexistentes.

## 15. Ejemplos de consumo para páginas

Ejemplo de tarjeta/listado funcional, deliberadamente sin diseño:

```tsx
import { useProducts, useCart } from '../hooks'
import { formatPrice } from '../utils/formatPrice'

export function CatalogPage() {
  const { products, loading, error, refetch } = useProducts()
  const { addItem } = useCart()

  if (loading) return <p role="status">Cargando productos…</p>
  if (error) return <div role="alert">{error}<button onClick={refetch}>Reintentar</button></div>
  if (!products.length) return <p>No hay productos disponibles.</p>

  return <div>{products.map(product => (
    <article key={product.id}>
      <h2>{product.name}</h2>
      <p>{formatPrice(product.price)}</p>
      <button onClick={() => addItem(product)}>Añadir al carrito</button>
    </article>
  ))}</div>
}
```

Checkout: código para usar dentro de un componente, no a nivel de módulo:

```tsx
const { isAuthenticated } = useAuth()
const { items, toOrderItems, clearCart } = useCart()
const { submitOrder, loading, error } = useCreateOrder()

async function handleConfirm() {
  if (!isAuthenticated || !items.length || loading) return
  try {
    const result = await submitOrder(toOrderItems())
    clearCart() // Únicamente después del éxito.
    // Navegar al detalle usando result.order_id con el router elegido.
  } catch {
    // Mostrar error del hook en la interfaz; no borrar el carrito.
  }
}
```

En el ejemplo de checkout, usar `result` y `error` en la implementación final para cumplir las reglas de variables sin uso. No pegar fragmentos incompletos como componentes terminados.

## 16. Límites y pendientes que no debe ocultar el diseño

1. Solo `/api/auth/me` valida JWT en el backend revisado. Catálogo, pedidos y métricas no implementan autorización. Enviar un token no corrige esto.
2. El backend acepta user_id del cliente y no comprueba pertenencia de pedidos. Las restricciones visuales no protegen los datos.
3. No hay stock, pasarela de pago, dirección de envío, cupones, wishlist, reviews, recuperación de contraseña ni edición de perfil.
4. No hay Compatibility disponible. No construir un resultado de compatibilidad ficticio.
5. No hay carrito persistente ni conservación de carrito invitado tras login.
6. No hay caché o actualización global automática de listados tras mutaciones.
7. No hay refresh token ni cierre de sesión automático basado en exp.
8. No hay endpoints de categorías/marcas, paginación ni búsqueda remota.
9. Analytics no mide acciones reales del frontend.
10. No hay pruebas visuales/E2E ni validación contra backend vivo registrada.

Si se crean fixtures para diseñar sin backend, mantenerlos explícitamente como datos de desarrollo y no reemplazar silenciosamente la integración real ni ocultar errores de conexión con datos falsos.

## 17. Cómo ejecutar y verificar

Desde frontend:

```powershell
npm ci             # Si hay que reinstalar dependencias según el lockfile.
npm run dev
npm run build
npm run lint
npm test
npm run preview    # Inspección del build; no asumir el proxy server de desarrollo.
```

Node observado en la sesión previa: 24.15.0. No se agregó un campo engines al proyecto. El puerto de Vite debe tomarse de la salida del comando; normalmente parte de 5173.

Desde la raíz del backend, con Docker operativo y red hardtech-net creada si falta:

```powershell
docker network inspect hardtech-net
# Si no existe:
docker network create hardtech-net

docker compose up -d --build identity-service catalog-service order-service analytics-service ingestor
docker compose ps
```

Se enumeran los servicios porque el Compose raíz también referencia Compatibility y falta su carpeta. Las dependencias PostgreSQL/MySQL/LocalStack se incluyen por depends_on. No levantar indiscriminadamente los dos Compose del backend a la vez.

Verificación registrada al completar la lógica, antes de este informe:

- `npm run build`: aprobado (TypeScript + Vite).
- `npm run lint`: aprobado.
- `npm test`: cinco pruebas aprobadas.

Las pruebas en `tests/integration.test.mjs` usan node:test, transpilan módulos TS en una carpeta temporal y simulan adapters Axios. Cubren aplicación/eliminación del JWT, login/perfil, validación de cantidades, rutas y verbos del catálogo, propagación de signal, rutas Analytics y errores FastAPI.

No prueban renderizado de contextos, navegación, accesibilidad, comportamiento visual, ni conectividad real a contenedores. Al iniciar el diseño, volver a ejecutar comprobaciones después de cambios relevantes y probar manualmente flujos reales con el backend disponible.

## 18. Criterios de entrega para la siguiente etapa

- Sustituir el starter por una interfaz HardTech Hub coherente y responsive.
- Reutilizar servicios, tipos y hooks existentes.
- Mantener proxy de Vite y providers funcionando.
- Implementar navegación explícita; si se agrega router, configurar fallback de rutas en hosting.
- Cubrir loading, error, vacío, usuario invitado y usuario autenticado.
- Consultar datos reales para catálogo/pedidos cuando el backend esté activo.
- No enviar precio/total al crear pedidos.
- No llamar mutaciones desde effects al montar páginas.
- No prometer funcionalidades ausentes.
- Documentar cualquier cambio en persistencia, carrito o sesión.
- Ejecutar build/lint/tests y verificar el flujo visual que se implemente.

## 19. Instrucción lista para entregar a otra IA

> Trabaja en el frontend de HardTech Hub usando React y TypeScript. Lee FRONTEND_CONTEXT.md y revisa los archivos referenciados antes de editar. Ya existe la integración con cuatro microservicios mediante Axios, servicios, tipos, AuthContext, CartContext y hooks públicos; reutilízala. La pantalla actual es el starter de Vite y la tarea pendiente es construir el diseño y las páginas de negocio. No hay estilo visual aprobado, router instalado ni Tailwind conectado aunque sus paquetes están instalados. Mantén el proxy y los providers. Propón una dirección visual y construye componentes responsive y accesibles con estados de carga, error y vacío. Consume los hooks reales, respeta que el carrito se reinicia al cambiar de identidad y que registro no inicia sesión. No inventes endpoints ni presentes pagos, stock, compatibilidad o métricas reales como funcionalidades disponibles. Distingue propuestas de funciones ya implementadas. Verifica build, lint, pruebas y el comportamiento visual de los flujos que construyas.
