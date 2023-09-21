const router = require('koa-router')()
router.prefix('/menu')
const util = require('../../utils/util.js')
const { CODE, fail, success } = util
const { addMenu, editMenu, deleteMenu, getMenu } = require('../../logic/menu')

router.post('/operate', async (ctx) => {
    await addMenu(ctx)
})

router.put('/operate', async (ctx) => {
    await editMenu(ctx)
})

router.delete('/remove/:id', async (ctx) => {
    await deleteMenu(ctx)
})

router.get('/list', async (ctx) => {
    await getMenu(ctx)
})


module.exports = router
