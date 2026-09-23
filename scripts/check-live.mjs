import assert from 'node:assert/strict'
const config = {
 catalog: process.env.VITE_CATALOG_API_URL,
 orders: process.env.VITE_ORDER_API_URL,
 inventory: process.env.VITE_INVENTORY_API_URL,
 compatibility: process.env.VITE_COMPATIBILITY_API_URL,
 analytics: process.env.VITE_ANALYTICS_API_URL,
}
async function request(service, path, options) {
 assert.ok(config[service], `Falta URL para ${service}`)
 const response = await fetch(new URL(path, config[service]), { ...options, signal: AbortSignal.timeout(65000) })
 const body = await response.json()
 console.log(`${service} ${path}: ${response.status}`)
 return {response, body}
}
const {body: products, response: catalogResponse} = await request('catalog','/api/products')
assert.equal(catalogResponse.status,200); assert.ok(Array.isArray(products))
for (const path of ['/api/categories','/api/brands','/api/admin/products?page=1&limit=10']) {
 assert.equal((await request('catalog',path)).response.status,200)
}
for (const path of ['/api/orders','/api/admin/orders?page=1&limit=10']) {
 assert.equal((await request('orders',path)).response.status,200)
}
assert.equal((await request('inventory','/inventory?limit=21&offset=0')).response.status,200)
if (products.length) {
 const product=products[0]
 assert.equal((await request('catalog',`/api/products/${product.id}`)).response.status,200)
 const inv=await request('inventory',`/inventory/${product.id}`)
 assert.ok([200,404].includes(inv.response.status))
 if(inv.response.ok) assert.equal(inv.body.available_stock,inv.body.stock-inv.body.reserved_stock)
}
const types = {cpu:'cpu',motherboard:'motherboard',ram:'ram',gpu:'gpu',psu:'psu'}
const seen = new Set()
const components = products.flatMap(p => {
 const type=types[p.category.toLowerCase()]
 if(!type || seen.has(type)) return []
 seen.add(type);return [{type,product_id:p.id}]
})
if(components.length) {
 const result=await request('compatibility','/api/compatibility/check',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({components})})
 assert.equal(result.response.status,200)
 assert.equal(typeof result.body.compatible,'boolean'); assert.ok(Array.isArray(result.body.messages))
}
let unavailable=0
const failed=[]
for (const name of ['summary','top-products','top-categories','trends','inventory-movements','events/count','top-views','product-catalog','category-brand-summary']) {
 const result=await request('analytics','/api/analytics/'+name)
 if(result.response.status === 503) { unavailable++; console.log('  Pendiente: configuración/disponibilidad AWS; no se simulan métricas.') }
 else if(result.response.status !== 200) failed.push(name + ': ' + result.response.status)
}
console.log(`Comprobación terminada; consultas Analytics no disponibles: ${unavailable}.`)
assert.deepEqual(failed,[], 'Endpoints Analytics ausentes o con error: ' + failed.join(', '))
