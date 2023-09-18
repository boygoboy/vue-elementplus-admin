const util = require('../utils/util.js');
const jwt = require('jsonwebtoken');

const excludeRoutes = ['/api/users/login'];

module.exports = async (ctx, next) => {
  if (excludeRoutes.includes(ctx.request.path)) {
    return await next(); // 如果请求路径在排除列表中，直接传递给下一个中间件
  }

  let token = ctx.request.header.authorization?.replace('Bearer ', '');

  if (!token) {
    ctx.body = util.fail('Token 认证失败', util.CODE.AUTH_ERROR);
    return;
  }

  try {
    const data = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });

    ctx.request.userInfo = data;
    await next();
  } catch (err) {
    ctx.body = util.fail('Token 认证失败', util.CODE.AUTH_ERROR);
  }
};
