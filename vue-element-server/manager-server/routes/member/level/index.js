const router = require('koa-router')()
router.prefix('/member/level')
const {
    getList,
    addLevel,
    editLevel,
    deleteLevel,
    changeLevelStatus,
    distrbuteResource
} = require('../../../logic/member/level/index.js')

router.get('/list', async (ctx) => {
    await getList(ctx)
})

router.post('/add', async (ctx) => {
    await addLevel(ctx)
})

router.put('/edit', async (ctx) => {
    await editLevel(ctx)
})

router.delete('/remove/:id', async (ctx) => {
    await deleteLevel(ctx)
})

router.put('/status', async (ctx) => {
    await changeLevelStatus(ctx)
})

router.put('/resource', async (ctx) => {
    await distrbuteResource(ctx)
})


module.exports = router