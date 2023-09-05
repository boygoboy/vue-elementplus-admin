
const log4j=require('../utils/log4j.js')
module.exports=async(ctx,next)=>{
    log4j.info(ctx)
    log4j.info('这是token校验路由中间件')
    await next()
}