const router = require('koa-router')()
router.prefix('/users')
const util = require('../../utils/util.js')
const { CODE, fail, success } = util
const User = require('../../db/models/userSchema.js')
const { handleLogin, getUserList } = require('../../logic/user')

router.post('/login', async (ctx) => {
    await handleLogin(ctx)
})

router.get('/list', async (ctx) => {
    await getUserList(ctx)
})

module.exports = router
