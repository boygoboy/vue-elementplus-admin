const router = require('koa-router')()
router.prefix('/system/users')
const {
    handleLogin,
    getUserList,
    addUser,
    editUser,
    deleteUser,
    switchState,
    getPermissionList
} = require('../../../logic/system/user')

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

router.get('/getPermissionList', async (ctx) => {
    await getPermissionList(ctx)
})

module.exports = router