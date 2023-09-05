const router = require('koa-router')()
router.prefix('/users')

const {handleLogin} =require('../../logic/user')

router.post('/login', async(ctx)=>{
 await handleLogin(ctx)
})

module.exports = router
