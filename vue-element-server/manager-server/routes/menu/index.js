const router = require('koa-router')()
router.prefix('/menu')
const { addMenu, editMenu, deleteMenu, getMenu } = require('../../logic/menu')

router.post('/add', async (ctx) => {
    await addMenu(ctx)
})

router.put('/edit', async (ctx) => {
    await editMenu(ctx)
})

router.delete('/remove/:id', async (ctx) => {
    await deleteMenu(ctx)
})

router.get('/list', async (ctx) => {
    await getMenu(ctx)
})


module.exports = router
