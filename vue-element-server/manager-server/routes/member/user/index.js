const router = require('koa-router')()
router.prefix('/member/users')
const {
    getUserList,
    switchState,
    getUserInfo
} = require('../../../logic/member/user')

router.get('/list', async (ctx) => {
    await getUserList(ctx)
})

router.put('/switchstate', async (ctx) => {
    await switchState(ctx)
})

router.get('/info', async (ctx) => {
    await getUserInfo(ctx)
})

module.exports = router