# Integración del frontend

La interfaz existente se conserva. `main.tsx` instala AuthProvider y CartProvider.
No hace falta instalar dependencias adicionales. Ejecuta `npm run dev` con los
microservicios 8001, 8002, 8003 y 8005 levantados. Vite dirige `/api/auth`,
`/api/products`, `/api/orders` y `/api/analytics` al servicio correspondiente usando
las URLs del `.env`. Reinicia Vite si cambias esas URLs.

## Hooks disponibles

Importa desde `src/hooks` (ajusta la ruta relativa en cada página).

| Hook | Resultado |
|---|---|
| useAuth() | user, isAuthenticated, login(credentials), register(credentials), logout(), loading, error |
| useCart() | items, totalItems, subtotal, addItem(product, quantity?), removeItem(id), updateQuantity(id, quantity), clearCart(), toOrderItems() |
| useProducts() | products, loading, error, refetch() |
| useProduct(id?) | product, loading, error, refetch() |
| useOrders() | orders del usuario autenticado, loading, error, refetch() |
| useOrder(id?) | order (objeto con order e items), loading, error, refetch() |
| useCreateOrder() | submitOrder(items), loading, error |
| useUpdateOrderStatus() | updateStatus(id, status), loading, error |
| useCreateProduct() | submitProduct(payload), loading, error |
| useUpdateProduct() | updateProduct(id, payload), loading, error |
| useDeleteProduct() | deleteProduct(id), loading, error |
| useAnalytics() | eventCount, topProducts, loading, error, refetch() |

## Sesión y carrito

Usa siempre login/logout de useAuth, no authService directamente. Login obtiene
el token, configura Axios y carga el perfil. Registro no inicia sesión.
El token y el carrito viven en memoria: se pierden al recargar. El carrito se
reinicia al cambiar de usuario, incluido el paso de invitado a usuario. Un 401
en `/api/auth/me` limpia la sesión. No hay refresh token ni logout remoto.

## Compra desde un componente

```tsx
const { items, toOrderItems, clearCart } = useCart()
const { submitOrder, loading, error } = useCreateOrder()

async function handleConfirm() {
  try {
    const result = await submitOrder(toOrderItems())
    clearCart()
    // Navegar a result.order_id desde tu página.
    console.log(result.order_id)
  } catch {
    // El hook expone error para mostrarlo en la página.
  }
}
```

Las mutaciones se ejecutan solo al llamar a su acción, rechazan llamadas
simultáneas dentro de la misma instancia del hook y propagan errores: captura
la promesa en el handler. Tras crear/editar/eliminar, llama a refetch() del listado
que deba actualizarse. No hay caché global. Las consultas cancelan peticiones
anteriores al cambiar de ID o desmontarse. useOrders espera una sesión activa.
No envíes importes al crear pedidos; el backend calcula precios, IGV y envío.
PUT de productos requiere todos los campos de UpdateProductRequest.

## Producción y límites del backend

El proxy solo existe en `npm run dev`. En producción configura las variables
VITE_* con URLs públicas HTTPS y CORS en el backend, o déjalas vacías para usar
un reverse proxy del mismo origen que enrute `/api/...`. No uses localhost en
un despliegue público. No incluyas secretos en variables VITE_*.

Solo Identity verifica el JWT actualmente. Ocultar botones en el frontend no
protege catálogo ni pedidos: falta autorización en el backend. Analytics devuelve
eventos simulados. Compatibility no tiene código disponible, por eso no se incluye.
No existen endpoints de marcas, categorías, stock ni pagos. Los roles devueltos
por Identity sirven para la interfaz, pero requieren validación en el servidor.
