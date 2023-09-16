const router = require('koa-router')()
router.prefix('/users')

const { handleLogin, getUserList } = require('../../logic/user')

router.post('/login', async (ctx) => {
    await handleLogin(ctx)
})

router.get('/list', async (ctx) => {
    await getUserList(ctx)
})

module.exports = router
