const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const log4j=require('./utils/log4j.js')
const router=require('koa-router')()

const checkTokenMiddleWare=require('./middlewares/checkToken.js')
const users = require('./routes/user/index.js')
const md5=require('md5')
const {createFirstUser} = require("./logic/user")
createFirstUser({
  userName:process.env.ADMIN_NAME || 'admin',
  userPwd: process.env.ADMIN_PASSWORD?md5(process.env.ADMIN_PASSWORD):md5('123456'),
})

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))
app.use(checkTokenMiddleWare)

// logger
app.use(async (ctx, next) => {
  await next()
  log4j.info('log output')
})

router.prefix("/api")

// routes
router.use(users.routes(),users.allowedMethods())
app.use(router.routes(), router.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
