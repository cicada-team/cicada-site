const path = require('path')
const Koa = require('koa')
const fs = require('fs')
const serve = require('koa-static')
const send = require('koa-send')

const app = new Koa()
app.outputErrors = true

function loadEntry(src) {
  return new Promise((resolve, reject) => {
    fs.readFile(src, { encoding: 'utf8' }, (err, data) => {
      if (err) return reject(err)
      resolve(data)
    })
  })
}
// app.use(serve('public'))
app.use(serve('site/public'))

app.use(async (ctx) => {
  // const entry = await loadEntry(path.resolve(__dirname, 'index.html'))
  // await next()
  // ctx.body = entry
  await send(ctx, '/site/public/index.html')
})


app.listen(3000)
console.log('listen on http://127.0.0.1:3000')

