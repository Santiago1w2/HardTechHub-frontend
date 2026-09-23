import { test, after } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const ts = require('typescript')
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const temporary = await mkdtemp(join(tmpdir(), 'hardtech-api-test-'))
after(() => rm(temporary, { recursive: true, force: true }))
const modules = [
  'api/axios',
  'api/errors',
  'services/catalogService',
  'services/inventoryService',
  'utils/orders',
  'services/ordersService',
  'services/analyticsServices',
  'services/compatibilityService',
  'utils/productForm',
  'utils/compatibility',
  'utils/pagination',
  'components/common/Pagination',
  'components/common/ConfirmDialog',
  'components/admin/ProductForm',
  'components/admin/InventoryForm',
  'components/admin/AnalyticsDataTable',
  'components/common/States',
]
for (const name of modules) {
  const extension = name.startsWith('components/') ? 'tsx' : 'ts'
  const source = await readFile(
    join(root, 'src', `${name}.${extension}`),
    'utf8',
  )
  let code = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText
  code = code
    .replaceAll('import.meta.env', '({ DEV: true, VITE_CATALOG_API_URL: "http://catalog.test", VITE_ORDER_API_URL: "http://orders.test", VITE_INVENTORY_API_URL: "http://inventory.test", VITE_ANALYTICS_API_URL: "http://analytics.test", VITE_COMPATIBILITY_API_URL: "http://compatibility.test" })')
    .replace(
      /from ['"]axios['"]/g,
      `from '${pathToFileURL(require.resolve('axios')).href}'`,
    )
    .replace(/from (['"])(\.\.?\/[^'"]+)\1/g, 'from $1$2.mjs$1')
  for (const dependency of [
    'react',
    'react/jsx-runtime',
    'react-router-dom',
    'lucide-react',
  ]) {
    code = code
      .replaceAll(
        `from "${dependency}"`,
        `from '${pathToFileURL(require.resolve(dependency)).href}'`,
      )
      .replaceAll(
        `from '${dependency}'`,
        `from '${pathToFileURL(require.resolve(dependency)).href}'`,
      )
  }
  const target = join(temporary, `${name}.mjs`)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, code)
}
const load = (name) =>
  import(pathToFileURL(join(temporary, `${name}.mjs`)).href)
const api = await load('api/axios')
const catalog = await load('services/catalogService')
const orders = await load('services/ordersService')
const analytics = await load('services/analyticsServices')
const errors = await load('api/errors')

function mock(client, data) {
  const calls = []
  client.defaults.adapter = async (config) => {
    calls.push(config)
    return { data, status: 200, statusText: 'OK', headers: {}, config }
  }
  return calls
}



test('orders reject empty or nonpositive quantities before HTTP', async () => {
  const calls = mock(api.orderApi, { order_id: 1 })
  for (const items of [
    [],
    [{ product_id: 1, quantity: 0 }],
    [{ product_id: 1, quantity: -1 }],
    [{ product_id: 1, quantity: 1.5 }],
  ]) {
    await assert.rejects(orders.createOrder({ items }, 'request-1'))
  }
  assert.equal(calls.length, 0)
  const payload = { items: [{ product_id: 1, quantity: 2 }] }
  await orders.createOrder(payload, 'request-1')
  assert.deepEqual(JSON.parse(calls[0].data), payload)
  assert.equal(calls[0].headers.get('Idempotency-Key'), 'request-1')
  await orders.getAllOrders()
  assert.equal(calls[1].url, '/api/orders')
})

test('catalog uses correct verbs and propagates query cancellation', async () => {
  const calls = mock(api.catalogApi, [])
  const controller = new AbortController()
  await catalog.getProducts(controller.signal)
  assert.equal(calls[0].signal, controller.signal)
  await catalog.updateProduct(2, {
    name: 'CPU',
    description: '',
    price: 10,
    specs: {},
    image_url: '',
    is_active: true,
  })
  assert.equal(calls[1].method, 'put')
  assert.equal(calls[1].url, '/api/products/2')
  await catalog.deleteProduct(2)
  assert.equal(calls[2].method, 'delete')
})

test('analytics endpoints and FastAPI validation errors', async () => {
  const calls = mock(api.analyticsApi, {})
  await analytics.getEventCount()
  await analytics.getTopProducts()
  assert.deepEqual(
    calls.map((call) => call.url),
    ['/api/analytics/events/count', '/api/analytics/top-products'],
  )
  assert.equal(
    errors.getApiErrorMessage({
      isAxiosError: true,
      response: { data: { detail: [{ msg: 'Email inválido' }] } },
    }),
    'Email inválido',
  )
})

const compatibility = await load('services/compatibilityService')
const productForm = await load('utils/productForm')
const componentMapping = await load('utils/compatibility')
const axios = require('axios')


test('admin order list, detail and status use the real contracts', async () => {
  const calls = mock(api.orderApi, { order_id: 7, status: 'SHIPPED' })
  await orders.getAllOrders()
  await orders.getOrder(7)
  assert.deepEqual(await orders.updateOrderStatus(7, 'SHIPPED'), {
    order_id: 7,
    status: 'SHIPPED',
  })
  assert.deepEqual(
    calls.map((call) => [call.method, call.url]),
    [
      ['get', '/api/orders'],
      ['get', '/api/orders/7'],
      ['patch', '/api/orders/7/status'],
    ],
  )
  assert.deepEqual(JSON.parse(calls[2].data), { status: 'SHIPPED' })
})

test('compatibility submits typed selections and returns the backend decision unchanged', async () => {
  const response = { compatible: false, messages: ['Sockets diferentes'] }
  const calls = mock(api.compatibilityApi, response)
  const payload = {
    components: [
      { type: 'cpu', product_id: 1 },
      { type: 'motherboard', product_id: 2 },
    ],
  }
  assert.deepEqual(await compatibility.postCompatibility(payload), response)
  assert.equal(calls[0].method, 'post')
  assert.equal(calls[0].url, '/api/compatibility/check')
  assert.deepEqual(JSON.parse(calls[0].data), payload)
  for (const components of [
    [],
    [{ type: 'cpu', product_id: 0 }],
    [{ type: 'storage', product_id: 1 }],
    [
      { type: 'cpu', product_id: 1 },
      { type: 'cpu', product_id: 2 },
    ],
  ])
    await assert.rejects(compatibility.postCompatibility({ components }))
  assert.equal(calls.length, 1)
  assert.equal(
    componentMapping.componentTypeForCategory('Motherboard'),
    'motherboard',
  )
  assert.equal(componentMapping.componentTypeForCategory('Storage'), undefined)
})


test('product edits send only changed supported fields and preserve optional values', async () => {
  const product = {
    id: 1,
    name: 'CPU',
    sku: 'SKU',
    price: '100.00',
    description: null,
    image_url: null,
    specs: { socket: 'AM5' },
    is_active: true,
    category: 'CPU',
    brand: 'AMD',
  }
  const values = productForm.productFormValues(product)
  assert.deepEqual(productForm.buildProductUpdate(values, product), {})
  assert.deepEqual(
    productForm.buildProductUpdate({ ...values, price: '120.50' }, product),
    { price: 120.5 },
  )
  const calls = mock(api.catalogApi, { updated: true })
  await catalog.updateProduct(
    1,
    productForm.buildProductUpdate({ ...values, price: '120.50' }, product),
  )
  assert.deepEqual(JSON.parse(calls[0].data), { price: 120.5 })
  for (const invalid of [
    { specs: '[]' },
    { specs: 'null' },
    { specs: '{' },
    { price: '-1' },
    { price: '2.333' },
    { name: ' ' },
  ]) {
    assert.throws(() =>
      productForm.buildProductUpdate({ ...values, ...invalid }, product),
    )
  }
  assert.throws(() => productForm.buildCreateProduct(values))
  const create = productForm.buildCreateProduct({
    ...values,
    category_id: '6',
    brand_id: '9',
  })
  assert.equal(create.category_id, 6)
  assert.equal(create.brand_id, 9)
  assert.equal('is_active' in create, false)
  assert.equal('description' in create, false)
})



test('service failures use readable messages without leaking internal HTTP errors', () => {
  for (const status of [401, 403, 404, 500, 503]) {
    const result = errors.getApiErrorMessage({
      isAxiosError: true,
      response: {
        status,
        data: { detail: 'Request failed with status code ' + status },
      },
    })
    assert.doesNotMatch(result, /AxiosError|Request failed|HTTP|500|503/)
  }
})


test('catalog options load real IDs and preserve them when creating a product', async () => {
  const calls = mock(api.catalogApi, [{ id: 51, name: 'CPU' }])
  const categories = await catalog.getCategories()
  await catalog.getBrands()
  assert.deepEqual(
    calls.map((call) => call.url),
    ['/api/categories', '/api/brands'],
  )
  const values = productForm.productFormValues()
  const payload = productForm.buildCreateProduct({
    ...values,
    category_id: String(categories[0].id),
    brand_id: '27',
    sku: 'REAL-IDS',
    name: 'CPU',
    price: '120',
  })
  await catalog.createProduct(payload)
  assert.equal(JSON.parse(calls[2].data).category_id, 51)
  assert.equal(JSON.parse(calls[2].data).brand_id, 27)
})

test('admin products use the catalog client with server filters and cancellation', async () => {
  const response = {
    items: [{ id: 7, is_active: false }],
    page: 2,
    limit: 10,
    total: 11,
  }
  const calls = mock(api.catalogApi, response)
  const signal = new AbortController().signal
  const filters = { page: 2, limit: 10, status: 'inactive', q: 'CPU & GPU' }
  assert.deepEqual(await catalog.getAdminProducts(filters, signal), response)
  assert.equal(calls[0].url, '/api/admin/products')
  assert.equal(calls[0].method, 'get')
  assert.equal(calls[0].signal, signal)
  assert.deepEqual(calls[0].params, filters)
})

test('admin orders send pagination, state, ID and inclusive dates', async () => {
  const response = { items: [], page: 3, limit: 20, total: 45 }
  const calls = mock(api.orderApi, response)
  const filters = {
    page: 3,
    limit: 20,
    status: 'PAID',
    order_id: 22,
    date_from: '2026-01-01',
    date_to: '2026-01-31',
  }
  const signal = new AbortController().signal
  assert.deepEqual(await orders.getAdminOrders(filters, signal), response)
  assert.equal(calls[0].url, '/api/admin/orders')
  assert.equal(calls[0].method, 'get')
  assert.deepEqual(calls[0].params, filters)
  assert.equal(calls[0].signal, signal)
})

test('pagination preserves filters and new searches reset to the first page', async () => {
  const pagination = await load('utils/pagination')
  assert.deepEqual(
    pagination.readPagination(new URLSearchParams('page=-1&limit=999')),
    { page: 1, limit: 20 },
  )
  assert.deepEqual(
    pagination.readPagination(new URLSearchParams('page=2&limit=50')),
    { page: 2, limit: 50 },
  )
  const current = new URLSearchParams('status=inactive&q=CPU&page=2&limit=20')
  const next = pagination.paginationParams(current, 3, 20)
  assert.equal(next.get('status'), 'inactive')
  assert.equal(next.get('q'), 'CPU')
  assert.equal(next.get('page'), '3')
  assert.equal(current.get('page'), '2')
  const filtered = pagination.filterParams(
    { q: '  AMD  ', status: 'active' },
    50,
  )
  assert.equal(filtered.get('page'), '1')
  assert.equal(filtered.get('limit'), '50')
  assert.equal(filtered.get('q'), 'AMD')
})

test('product form renders category and brand names with their actual IDs', async () => {
  const React = require('react')
  const { renderToString } = require('react-dom/server')
  const { MemoryRouter } = require('react-router-dom')
  const { ProductForm } = await load('components/admin/ProductForm')
  const html = renderToString(
    React.createElement(
      MemoryRouter,
      null,
      React.createElement(ProductForm, {
        loading: false,
        onSave: async () => {},
        categories: [{ id: 51, name: 'CPU' }],
        brands: [{ id: 27, name: 'AMD' }],
      }),
    ),
  )
  assert.match(html, /<option value="51">CPU<\/option>/)
  assert.match(html, /<option value="27">AMD<\/option>/)
  assert.doesNotMatch(html, /Categoría \(ID\)|Marca \(ID\)/)
})

test('pagination renders totals and disables unavailable page navigation', async () => {
  const React = require('react')
  const { renderToString } = require('react-dom/server')
  const { Pagination } = await load('components/common/Pagination')
  const html = renderToString(
    React.createElement(Pagination, {
      page: 1,
      limit: 20,
      total: 0,
      loading: false,
      onChange: () => {},
    }),
  )
  assert.match(html, /0 resultados/)
  assert.match(html, /<button[^>]*disabled=""[^>]*>Anterior<\/button>/)
  assert.match(html, /<button[^>]*disabled=""[^>]*>Siguiente<\/button>/)
})
test('analytics keeps sales, views, categories, trends and movements contracts separate', async () => {
 const cases = [
  ['getSummary', '/summary', {orders: 2, sales: 1, revenue: '35.00'}, undefined],
  ['getTopProducts', '/top-products', {top_products: [{product_id: 2, product_name:'CPU', units:3, revenue:'35.00'}]}, undefined],
  ['getTopCategories', '/top-categories', {categories: [{category:'CPU',units:3,revenue:'35.00'}]}, 'categories'],
  ['getTrends', '/trends', {trends:[{day:'2026-09-23',sales:1,revenue:'35.00'}]}, 'trends'],
  ['getInventoryMovements', '/inventory-movements', {movements:[{movement_type:'SALE',movements:1,units:3}]}, 'movements'],
  ['getTopViews', '/top-views', {top_products:[{product_id:2,views:4}]}, undefined],
 ]
 for (const [fn,path,body,field] of cases) {
  const calls=mock(api.analyticsApi,body)
  assert.deepEqual(await analytics[fn](),field ? body[field] : body)
  assert.equal(calls[0].url,'/api/analytics'+path)
 }
 const calls=mock(api.analyticsApi,{records:10,key:'snapshot',refreshed_at:'2026-09-23T12:00:00Z'})
 await analytics.refreshAnalytics()
 assert.equal(calls[0].method,'post')
 assert.equal(calls[0].url,'/api/analytics/refresh')
 assert.equal(calls[0].timeout,120000)
})
test('inventory distinguishes absent stock from service failure', async () => {
 const inventory=await load('services/inventoryService')
 const body={product_id:2,stock:10,reserved_stock:3,available_stock:7,reorder_point:2,updated_at:'2026-09-23'}
 const calls=mock(api.inventoryApi,body)
 assert.deepEqual(await inventory.getInventory(2),body)
 assert.equal(calls[0].url,'/inventory/2')
 for(const status of [404,503]){
  api.inventoryApi.defaults.adapter=async ()=>{throw new axios.AxiosError('failure',undefined,undefined,undefined,{status,data:{},headers:{},config:{}})}
  if(status===404) assert.equal(await inventory.getInventory(2),null)
  else await assert.rejects(inventory.getInventory(2))
 }
})
test('pending reservations expose their order and use the dedicated retry endpoint', async () => {
 const calls=mock(api.orderApi,{order_id:8,status:'PENDING',total_amount:'35.00'})
 await orders.retryOrder(8)
 assert.equal(calls[0].url,'/api/orders/8/retry')
 assert.equal(calls[0].method,'post')
 const failure={isAxiosError:true,response:{status:503,data:{detail:{order_id:8,message:'Reservation pending; retry this order'}}}}
 assert.equal(errors.getErrorOrderId(failure),8)
 assert.match(errors.getApiErrorMessage(failure),/reserva.*pendiente/)
 assert.equal(errors.getErrorOrderId(new Error('offline')),null)
})
test('order transitions do not offer unsupported operations', async () => {
 const {orderTransitions}=await load('utils/orders')
 assert.deepEqual(orderTransitions.RESERVING,['CANCELLED'])
 assert.deepEqual(orderTransitions.PENDING,['PAID','CANCELLED'])
 assert.deepEqual(orderTransitions.PAID,['SHIPPED'])
 assert.deepEqual(orderTransitions.SHIPPED,[])
 assert.deepEqual(orderTransitions.CANCELLED,[])
})

test('inventory list uses offset and limit and preserves cancellation', async () => {
 const inventory=await load('services/inventoryService')
 const rows=[{product_id:42,stock:20,reserved_stock:3,available_stock:17,reorder_point:4,updated_at:null}]
 const calls=mock(api.inventoryApi,rows)
 const controller=new AbortController()
 assert.deepEqual(await inventory.getInventoryList(21,20,controller.signal),rows)
 assert.equal(calls[0].url,'/inventory')
 assert.deepEqual(calls[0].params,{limit:21,offset:20})
 assert.equal(calls[0].signal,controller.signal)
})
test('inventory creation and stock replacement send only supported fields', async () => {
 const inventory=await load('services/inventoryService')
 const response={product_id:42,stock:20,reserved_stock:3,available_stock:17,reorder_point:4,updated_at:null}
 const calls=mock(api.inventoryApi,response)
 const payload={product_id:42,stock:20,reorder_point:4,reserved_stock:999}
 assert.deepEqual(await inventory.createInventory(payload),response)
 assert.equal(calls[0].method,'post')
 assert.equal(calls[0].url,'/inventory')
 assert.deepEqual(JSON.parse(calls[0].data),{product_id:42,stock:20,reorder_point:4})
 await inventory.updateInventory(42,payload)
 assert.equal(calls[1].method,'put')
 assert.equal(calls[1].url,'/inventory/42')
 assert.deepEqual(JSON.parse(calls[1].data),{stock:20,reorder_point:4})
})
test('inventory rejects invalid IDs and stock integers before HTTP', async () => {
 const inventory=await load('services/inventoryService')
 const calls=mock(api.inventoryApi,{})
 for(const product_id of [0,-1,1.5,Number.MAX_SAFE_INTEGER+1]){
  await assert.rejects(inventory.createInventory({product_id,stock:0,reorder_point:0}))
 }
 for(const stock of [-1,1.5,2147483648,NaN,Infinity]){
  await assert.rejects(inventory.updateInventory(1,{stock,reorder_point:0}))
 }
 for(const reorder_point of [-1,0.5,2147483648]){
  await assert.rejects(inventory.createInventory({product_id:1,stock:0,reorder_point}))
 }
 assert.equal(calls.length,0)
 await inventory.createInventory({product_id:1,stock:0,reorder_point:0})
 assert.equal(calls.length,1)
})
test('inventory conflict messages distinguish duplicate records from reservations', () => {
 const message=detail=>errors.getApiErrorMessage({isAxiosError:true,response:{status:409,data:{detail}}})
 assert.match(message('Inventory already exists'),/ya tiene inventario/)
 assert.match(message('Cannot reduce stock below reservations'),/unidades reservadas/)
})
test('new analytical views preserve actual columns, totals and cancellation', async () => {
 const controller=new AbortController()
 for(const [method,path,key] of [
  ['getProductCatalogAnalytics','product-catalog','products'],
  ['getCategoryBrandSummary','category-brand-summary','summary'],
 ]){
  const body={ [key]:[{category:'CPU',brand:'Example',external_column:'3.50',nullable_value:null}],total:1 }
  const calls=mock(api.analyticsApi,body)
  assert.deepEqual(await analytics[method](controller.signal),body)
  assert.equal(calls[0].url,'/api/analytics/'+path)
  assert.equal(calls[0].signal,controller.signal)
 }
})
test('inventory forms reuse controls and prevent editing reserved stock or product identity', async () => {
 const React=require('react')
 const {renderToString}=require('react-dom/server')
 const {MemoryRouter}=require('react-router-dom')
 const {InventoryForm}=await load('components/admin/InventoryForm')
 const item={product_id:42,stock:20,reserved_stock:3,available_stock:17,reorder_point:4,updated_at:null}
 const html=renderToString(React.createElement(MemoryRouter,null,
  React.createElement(InventoryForm,{item,products:[],loading:false,onSave:async()=>{}})))
 assert.match(html,/management-card management-form/)
 assert.match(html,/readOnly=""/)
 assert.match(html,/min="3"/)
 assert.match(html,/Reservado:.*3/)
 assert.doesNotMatch(html,/name="reserved_stock"/)
})
test('analytical table renders only returned columns and supports empty and null data', async () => {
 const React=require('react')
 const {renderToString}=require('react-dom/server')
 const {AnalyticsDataTable}=await load('components/admin/AnalyticsDataTable')
 const html=renderToString(React.createElement(AnalyticsDataTable,{
  rows:[{category:'CPU',brand:'<script>unsafe</script>',source_value:'12.50',missing_value:null}],total:1,label:'Catalog view'}))
 assert.match(html,/source value/)
 assert.match(html,/12.50/)
 assert.match(html,/—/)
 assert.match(html,/&lt;script&gt;/)
 assert.doesNotMatch(html,/<script>/)
 assert.match(html,/table-scroll/)
 const empty=renderToString(React.createElement(AnalyticsDataTable,{rows:[],total:0,label:'Empty view'}))
 assert.match(empty,/No hay datos registrados/)
})
