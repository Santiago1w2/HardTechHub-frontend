# HardTech Hub — Frontend

Frontend de una tienda de componentes y productos de tecnología. Permite explorar el catálogo, crear una cuenta, iniciar sesión, agregar productos al carrito y registrar pedidos para consultar su estado.

La aplicación muestra la interfaz y se comunica con los servicios del backend para obtener productos, autenticar usuarios y guardar pedidos.

## Tecnologías

- **React y TypeScript:** construcción de las pantallas y definición de los datos que utiliza la aplicación.
- **Vite:** servidor de desarrollo y generación de la versión de producción.
- **React Router:** navegación entre páginas sin recargar toda la aplicación.
- **Axios:** peticiones HTTP al backend.
- **CSS y Tailwind CSS:** estilos de la interfaz.
- **Lucide React:** iconos.

## Cómo ejecutar el proyecto

Necesitas Node.js y npm instalados, además de los servicios del backend para utilizar las funciones que consultan o guardan datos.

1. Abre una terminal en la carpeta `front-end` e instala las dependencias:

   ```bash
   npm install
   ```

2. Crea un archivo `.env` copiando `.env.example`. En PowerShell puedes usar este comando si todavía no tienes un `.env`:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Revisa las direcciones del backend en `.env`:

   ```dotenv
   VITE_IDENTITY_API_URL=http://localhost:8001
   VITE_CATALOG_API_URL=http://localhost:8002
   VITE_ORDER_API_URL=http://localhost:8003
   VITE_ANALYTICS_API_URL=http://localhost:8005
   ```

4. Inicia los servicios del backend según las instrucciones de sus proyectos y ejecuta el frontend:

   ```bash
   npm run build
   ```

5. Abre la dirección que indique Vite en la terminal, normalmente `http://localhost:5173`.

Si modificas `.env`, reinicia el servidor de desarrollo para aplicar los cambios.

## Pantallas y rutas

| Ruta | Para qué sirve | Requiere sesión |
| --- | --- | --- |
| `/` | Inicio con promociones, categorías y productos destacados. | No |
| `/productos` | Catálogo con búsqueda, filtros y ordenamiento. | No |
| `/productos/:id` | Detalle de un producto y opciones para agregarlo al carrito. | No, pero agregar requiere sesión |
| `/carrito` | Productos seleccionados, cantidades y resumen del importe. | No para abrir la página |
| `/login` | Inicio de sesión. | No |
| `/registro` | Creación de una cuenta. | No |
| `/checkout` | Revisión y confirmación del pedido. | Sí |
| `/pedidos` | Lista de pedidos del usuario. | Sí |
| `/pedidos/:id` | Detalle y estado de un pedido. | Sí |
| `/perfil` | Datos de la cuenta y cierre de sesión. | Sí |
| `/ayuda` | Información de ayuda para el usuario. | No |

`:id` representa el identificador del producto o pedido. Las rutas se definen en `src/App.tsx`; `RequireAuth` controla el acceso a las páginas que necesitan sesión.

## Cómo funciona

### Catálogo

Los productos se obtienen del servicio de catálogo. El usuario puede buscar y filtrar por categoría, marca y rango de precio, además de ordenar por precio o nombre. Los filtros se guardan en la URL y se aplican en el frontend sobre los productos recibidos.

### Registro e inicio de sesión

Los formularios envían el correo y la contraseña al servicio de identidad. Al iniciar sesión, el frontend recibe un token, lo incluye en las peticiones como `Authorization: Bearer ...` y consulta el perfil del usuario.

`AuthProvider` comparte la información de la sesión con las distintas pantallas. El perfil permite consultar los datos de la cuenta y cerrar sesión; sus datos son de solo lectura.

### Carrito y pedidos

1. El usuario inicia sesión y agrega productos desde el catálogo o el detalle. Si intenta agregarlos sin sesión, se le dirige al login.
2. En el carrito puede modificar cantidades o eliminar productos. El subtotal se calcula a partir de los precios y las cantidades.
3. En `/checkout` revisa la selección y confirma el pedido.
4. El frontend envía al backend el identificador del usuario y los productos con sus cantidades.
5. Si el registro es exitoso, se vacía el carrito y se abre el detalle del pedido creado.
6. El usuario puede consultar sus pedidos desde `/pedidos`.

**Confirmar un pedido solo lo registra: no realiza ningún cobro ni incluye una pasarela de pago.**

La sesión y el carrito se mantienen en memoria: se reinician al recargar la aplicación. El carrito también se reinicia al cambiar de usuario o cerrar sesión.

### Carga y errores

Mientras se consultan datos, las pantallas muestran indicadores de carga. También hay mensajes para listas vacías y errores, con opción de reintentar donde corresponde. Los hooks `useQuery` y `useMutation` reúnen la lógica de consulta y envío de datos para reutilizarla.

## Organización del código

```text
src/
├── api/          Clientes Axios, token y mensajes de error del backend.
├── assets/       Imágenes utilizadas por la interfaz.
├── components/   Piezas reutilizables: cabecera, tarjetas, filtros y carrito.
├── contexts/     Estado compartido de autenticación y carrito.
├── data/         Información local de las categorías.
├── hooks/        Lógica reutilizable para productos, sesión y pedidos.
├── pages/        Pantallas de la aplicación.
├── providers/    Composición de los proveedores de sesión y carrito.
├── services/     Funciones que llaman a los endpoints del backend.
├── types/        Tipos de productos, usuarios, pedidos y respuestas.
├── utils/        Utilidades de filtros, fechas y formato de precios.
├── App.tsx       Definición de las rutas.
├── main.tsx      Inicio de React, navegación y proveedores.
├── App.css       Estilos de la aplicación.
└── index.css     Estilos globales.
```

`public/` contiene recursos públicos, como los iconos. `tests/` contiene las pruebas de integración de la capa de servicios con respuestas simuladas.

Una consulta sigue este recorrido: **página → hook → servicio → cliente Axios → backend**. Por ejemplo, `CatalogPage` usa `useProducts`, que llama a `catalogService` para obtener los productos y mostrarlos mediante los componentes del catálogo.

## Conexión con el backend

| Servicio | Variable de configuración | Prefijo de las peticiones |
| --- | --- | --- |
| Identidad | `VITE_IDENTITY_API_URL` | `/api/auth` |
| Catálogo | `VITE_CATALOG_API_URL` | `/api/products` |
| Pedidos | `VITE_ORDER_API_URL` | `/api/orders` |
| Analítica | `VITE_ANALYTICS_API_URL` | `/api/analytics` |

En desarrollo, las peticiones pasan por el servidor de Vite, que las redirige al servicio correspondiente mediante el proxy de `vite.config.ts`. En producción, Axios utiliza directamente las direcciones configuradas en las variables `VITE_*`; si una está vacía, utiliza el mismo origen del frontend.

Las variables se incorporan al compilar. Para producción, configura las direcciones antes de ejecutar `npm run build`. Si el backend está en otro origen, debe permitir las peticiones del frontend mediante CORS. El alojamiento también debe servir `index.html` al abrir rutas como `/productos/1`, porque la navegación usa `BrowserRouter`.

Además de las funciones visibles de la tienda, existen servicios y hooks para crear, editar y eliminar productos, actualizar estados de pedidos y consultar analítica. Actualmente no tienen pantallas de administración conectadas a las rutas de la aplicación.

## Comandos disponibles

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo. |
| `npm run build` | Comprueba TypeScript y genera la aplicación en `dist/`. |
| `npm run preview` | Permite revisar localmente la compilación generada. Ejecuta primero `npm run build`. |
| `npm run lint` | Revisa el código con ESLint. |
| `npm test` | Ejecuta las pruebas de servicios con peticiones simuladas, sin necesitar el backend. |

## Dónde hacer cambios

- **Cambiar una pantalla:** busca su archivo en `src/pages/`.
- **Modificar elementos compartidos:** revisa `src/components/`.
- **Agregar una ruta:** edita `src/App.tsx`.
- **Cambiar una llamada al backend:** revisa `src/services/` y los tipos en `src/types/type.ts`.
- **Modificar sesión o carrito:** revisa `src/contexts/`.
- **Cambiar la apariencia:** revisa `src/App.css`, `src/index.css` y los estilos usados por los componentes.
