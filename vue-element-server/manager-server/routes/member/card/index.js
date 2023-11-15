const router = require('koa-router')()
router.prefix('/member/card')
const {
    getList,
    addCard,
    batchCard,
    deleteCards
} = require('../../../logic/member/card/index.js')

router.get('/list', async (ctx) => {
    await getList(ctx)
})

router.post('/onecard', async (ctx) => {
    await addCard(ctx)
})

router.post('/batchcard', async (ctx) => {
    await batchCard(ctx)
})

router.delete('/removecard/:ids', async (ctx) => {
    await deleteCards(ctx)
})


module.exports = router