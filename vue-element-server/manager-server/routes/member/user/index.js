const router = require('koa-router')()
router.prefix('/member/users')
const {
    getUserList,
    switchState,
    getUserInfo,
    deleteUser
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

router.delete('/user/:id', async (ctx) => {
    await deleteUser(ctx)
})

module.exports = router