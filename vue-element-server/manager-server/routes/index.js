const router = require('koa-router')()
const users = require('./system/user/index.js')
const menu = require('./system/menu/index.js')
const role = require('./system/role/index.js')
const membel_level = require('./member/level/index.js')
router.use(users.routes(), users.allowedMethods())
router.use(menu.routes(), menu.allowedMethods())
router.use(role.routes(), role.allowedMethods())
router.use(membel_level.routes(), membel_level.allowedMethods())

module.exports = router