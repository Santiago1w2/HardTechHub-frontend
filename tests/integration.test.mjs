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
  'api/axios', 'api/errors', 'services/authService', 'services/catalogService',
  'services/ordersService', 'services/analyticsServices',
]
for (const name of modules) {
  const source = await readFile(join(root, 'src', `${name}.ts`), 'utf8')
  let code = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  }).outputText
  code = code.replaceAll('import.meta.env', '({ DEV: true })')
    .replace(/from ['"]axios['"]/g, `from '${pathToFileURL(require.resolve('axios')).href}'`)
    .replace(/from (['"])(\.\.?\/[^'"]+)\1/g, 'from $1$2.mjs$1')
  const target = join(temporary, `${name}.mjs`)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, code)
}
const load = name => import(pathToFileURL(join(temporary, `${name}.mjs`)).href)
const api = await load('api/axios')
const auth = await load('services/authService')
const catalog = await load('services/catalogService')
const orders = await load('services/ordersService')
const analytics = await load('services/analyticsServices')
const errors = await load('api/errors')

function mock(client, data) {
  const calls = []
  client.defaults.adapter = async config => {
    calls.push(config)
    return { data, status: 200, statusText: 'OK', headers: {}, config }
  }
  return calls
}

test('JWT headers are applied and removed for every service', () => {
  api.setAccessToken('example')
  for (const client of [api.identityApi, api.catalogApi, api.orderApi, api.analyticsApi]) {
    assert.equal(client.defaults.headers.common.Authorization, 'Bearer example')
    assert.equal(client.defaults.baseURL, '/')
  }
  api.setAccessToken(null)
  assert.equal(api.identityApi.defaults.headers.common.Authorization, undefined)
})

test('login contract and explicit profile request', async () => {
  const calls = mock(api.identityApi, { access_token: 'token', token_type: 'bearer' })
  assert.equal((await auth.login({ email: 'test@example.com', password: 'password' })).access_token, 'token')
  assert.equal(calls[0].url, '/api/auth/login')
  assert.equal(JSON.parse(calls[0].data).email, 'test@example.com')
  await auth.getProfile()
  assert.equal(calls[1].url, '/api/auth/me')
})

test('orders reject empty or nonpositive quantities before HTTP', async () => {
  const calls = mock(api.orderApi, { order_id: 1 })
  for (const items of [[], [{ product_id: 1, quantity: 0 }], [{ product_id: 1, quantity: -1 }], [{ product_id: 1, quantity: 1.5 }]]) {
    await assert.rejects(orders.createOrder({ user_id: 'user', items }))
  }
  assert.equal(calls.length, 0)
  const payload = { user_id: 'user', items: [{ product_id: 1, quantity: 2 }] }
  await orders.createOrder(payload)
  assert.deepEqual(JSON.parse(calls[0].data), payload)
  await orders.getMyOrders('user/name')
  assert.equal(calls[1].url, '/api/orders/user/user%2Fname')
})

test('catalog uses correct verbs and propagates query cancellation', async () => {
  const calls = mock(api.catalogApi, [])
  const controller = new AbortController()
  await catalog.getProducts(controller.signal)
  assert.equal(calls[0].signal, controller.signal)
  await catalog.updateProduct(2, { name: 'CPU', description: '', price: 10, specs: {}, image_url: '', is_active: true })
  assert.equal(calls[1].method, 'put')
  assert.equal(calls[1].url, '/api/products/2')
  await catalog.deleteProduct(2)
  assert.equal(calls[2].method, 'delete')
})

test('analytics endpoints and FastAPI validation errors', async () => {
  const calls = mock(api.analyticsApi, {})
  await analytics.getEventCount()
  await analytics.getTopProducts()
  assert.deepEqual(calls.map(call => call.url), ['/api/analytics/events/count', '/api/analytics/top-products'])
  assert.equal(errors.getApiErrorMessage({ isAxiosError: true, response: { data: { detail: [{ msg: 'Email inválido' }] } } }), 'Email inválido')
})
