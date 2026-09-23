import fs from 'node:fs'
import path from 'node:path'
const frontend=process.env.FRONTEND_URL
if (!frontend) throw new Error('Configura FRONTEND_URL')
for(const route of ['/','/productos','/pedidos','/analitica','/admin/productos','/api/products','/api/admin/orders?page=1&limit=10','/inventory/1','/api/analytics/summary']){
 const response=await fetch(new URL(route,frontend),{signal:AbortSignal.timeout(65000)})
 console.log(route,response.status,response.headers.get('content-type'))
 if(![200,404,503].includes(response.status)) process.exitCode=1
}
const files=fs.readdirSync('src',{recursive:true}).filter(f=>/\.(ts|tsx)$/.test(f)).map(f=>path.resolve('src',f))
const reached=new Set()
function walk(file){
 if(reached.has(file))return
 reached.add(file)
 const source=fs.readFileSync(file,'utf8')
 for(const match of source.matchAll(/(?:from\s*|import\s*)['"](\.\.?\/[^'"]+)['"]/g)){
  const base=path.resolve(path.dirname(file),match[1])
  const target=[base,base+'.ts',base+'.tsx',path.join(base,'index.ts')].find(f=>files.includes(f))
  if(target)walk(target)
 }
}
walk(path.resolve('src/main.tsx'))
console.log('Módulos sin referencias:',files.filter(f=>!reached.has(f)&&!f.endsWith('.d.ts')).map(f=>path.relative('.',f)))
