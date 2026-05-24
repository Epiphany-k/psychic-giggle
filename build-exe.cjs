// 构建步骤：先 npm run build，再 node build-exe.cjs
const { readFileSync, writeFileSync } = require('fs')

const html = readFileSync('dist/index.html', 'utf-8')
const css = readFileSync('dist/assets/index.css', 'utf-8')
const js = readFileSync('dist/assets/index.js', 'utf-8')
const manifest = readFileSync('dist/manifest.json', 'utf-8')
const sw = readFileSync('dist/sw.js', 'utf-8')
const icon = readFileSync('dist/icon.svg', 'utf-8')

const code = `const { createServer } = require('http')
const { exec } = require('child_process')

const PORT = 5173

const HTML = ${JSON.stringify(html)}
const CSS = ${JSON.stringify(css)}
const JS = ${JSON.stringify(js)}
const MANIFEST = ${JSON.stringify(manifest)}
const SW = ${JSON.stringify(sw)}
const ICON = ${JSON.stringify(icon)}

const server = createServer((req, res) => {
  if (req.url === '/shutdown') {
    res.writeHead(200)
    res.end('ok')
    console.log('浏览器已关闭，正在停止服务...')
    server.close()
    process.exit(0)
    return
  }

  const path = new URL(req.url, 'http://localhost').pathname

  if (path === '/assets/index.css') {
    res.writeHead(200, { 'Content-Type': 'text/css; charset=utf-8' })
    res.end(CSS)
    return
  }
  if (path === '/assets/index.js') {
    res.writeHead(200, { 'Content-Type': 'application/javascript' })
    res.end(JS)
    return
  }
  if (path === '/manifest.json') {
    res.writeHead(200, { 'Content-Type': 'application/manifest+json' })
    res.end(MANIFEST)
    return
  }
  if (path === '/sw.js') {
    res.writeHead(200, { 'Content-Type': 'application/javascript' })
    res.end(SW)
    return
  }
  if (path === '/icon.svg') {
    res.writeHead(200, { 'Content-Type': 'image/svg+xml' })
    res.end(ICON)
    return
  }

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
  res.end(HTML)
})

server.listen(PORT, () => {
  const url = \`http://localhost:\${PORT}\`
  exec(\`start \${url}\`)
  console.log(\`舒尔特表已启动: \${url}\`)
  console.log('关闭浏览器页面即可自动结束服务')
})
`

writeFileSync('serve-embed.cjs', code)
console.log('已生成 serve-embed.cjs')
console.log('接下来运行: npx pkg serve-embed.cjs -t node18-win-x64 -o 舒尔特表.exe')
