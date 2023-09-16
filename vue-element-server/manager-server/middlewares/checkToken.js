
const log4j=require('../utils/log4j.js')
const jwt = require('jsonwebtoken');
const excludeRoutes = ['/api/users/login'
];
const util=require('../utils/util.js')
module.exports=async(ctx,next)=>{
    if (excludeRoutes.includes(ctx.request.path)) {
      return await next(); // 如果请求路径在排除列表中，直接传递给下一个中间件
    }
    //获取 token
    let token=ctx.request.header.authorization.replace('Bearer ','')
    //判断
    if (!token) {
      return ctx.body=util.fail('token认证失败',util.CODE.AUTH_ERROR)
    }
    //校验 token
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, data) => {
      //检测 token 是否正确
      if (err) {
        return util.fail('token认证失败',util.CODE.AUTH_ERROR)
      }
      //保存用户的信息
      ctx.request.userInfo = data; // req.session  req.body
      await next()
    });
}