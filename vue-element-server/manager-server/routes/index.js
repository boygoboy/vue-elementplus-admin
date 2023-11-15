const router = require('koa-router')()
const users = require('./system/user/index.js')
const menu = require('./system/menu/index.js')
const role = require('./system/role/index.js')
const member_level = require('./member/level/index.js')
const member_user = require('./member/user/index.js')
const member_card = require('./member/card/index.js')
const smtpemail = require('./system/smtpemail/index.js')
router.use(users.routes(), users.allowedMethods())
router.use(menu.routes(), menu.allowedMethods())
router.use(role.routes(), role.allowedMethods())
router.use(smtpemail.routes(), smtpemail.allowedMethods())
router.use(member_level.routes(), member_level.allowedMethods())
router.use(member_user.routes(), member_user.allowedMethods())
router.use(member_card.routes(), member_card.allowedMethods())


module.exports = router