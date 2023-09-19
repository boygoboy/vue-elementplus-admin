const router = require('koa-router')()
router.prefix('/users')
const util = require('../../utils/util.js')
const { CODE, fail, success } = util
const User = require('../../db/models/userSchema.js')
const { handleLogin, getUserList, addUser, editUser, deleteUser, switchState } = require('../../logic/user')

router.post('/login', async (ctx) => {
    await handleLogin(ctx)
})

router.get('/list', async (ctx) => {
    await getUserList(ctx)
})

router.post('/operate', async (ctx) => {
    await addUser(ctx)
})

router.put('/operate', async (ctx) => {
    await editUser(ctx)
})

router.delete('/delete/:ids', async (ctx) => {
    await deleteUser(ctx)
})

router.put('/switchstate', async (ctx) => {
    await switchState(ctx)
})

module.exports = router
