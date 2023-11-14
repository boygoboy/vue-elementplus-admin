const router = require('koa-router')()
router.prefix('/system/smtpemail')
const {
    addSmtp,
    getSmtp,
    editSmtp,
    enableSmtp,
    deleteSmtp,
    testSmtp
} = require('../../../logic/system/smtpemail')


router.post('/addsmtp', async (ctx) => {
    await addSmtp(ctx)
})

router.put('/editsmtp', async (ctx) => {
    await editSmtp(ctx)
})

router.get('/list', async (ctx) => {
    await getSmtp(ctx)
})

router.put('/enablesmtp', async (ctx) => {
    await enableSmtp(ctx)
})

router.delete('/deletesmtp/:id', async (ctx) => {
    await deleteSmtp(ctx)
})

router.post('/testsmtp', async (ctx) => {
    await testSmtp(ctx)
})


module.exports = router