const router = require('koa-router')()
router.prefix('/role')
const { getRoleList, addRole, editRole, deleteRole,
    setRolePermission, getAllRoleList } = require('../../logic/role')

router.get('/list', async (ctx) => {
    await getRoleList(ctx)
})

router.post('/add', async (ctx) => {
    await addRole(ctx)
})

router.put('/edit', async (ctx) => {
    await editRole(ctx)
})

router.delete('/delete/:id', async (ctx) => {
    await deleteRole(ctx)
})

router.put('/permissions', async (ctx) => {
    await setRolePermission(ctx)
})

router.get('/alllist', async (ctx) => {
    await getAllRoleList(ctx)
})



module.exports = router
