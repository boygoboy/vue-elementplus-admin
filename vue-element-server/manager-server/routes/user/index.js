const router = require('koa-router')()
router.prefix('/users')
const { handleLogin, getUserList, addUser, editUser, deleteUser, switchState } = require('../../logic/user')

router.post('/login', async (ctx) => {
    await handleLogin(ctx)
})

router.get('/list', async (ctx) => {
    await getUserList(ctx)
})

router.post('/add', async (ctx) => {
    await addUser(ctx)
})

router.put('/edit', async (ctx) => {
    await editUser(ctx)
})

router.delete('/delete/:ids', async (ctx) => {
    await deleteUser(ctx)
})

router.put('/switchstate', async (ctx) => {
    await switchState(ctx)
})

module.exports = router
