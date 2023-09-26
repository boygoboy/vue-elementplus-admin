const util = require('../utils/util.js');
const jwt = require('jsonwebtoken');
const User = require('../db/models/system/userSchema.js')
const Menu = require('../db/models/system/menuSchema.js')
const Role = require('../db/models/system/roleSchema.js')

const excludeRoutes = ['/api/system/users/login'];

const getApiPath = async (roleKeys) => {
  let roleList = await Role.find({ roleId: { $in: roleKeys } })
  let checkedKeysArry = []
  roleList.map(role => {
    let { checkedKeys } = role.permissionList
    checkedKeysArry = checkedKeysArry.concat(checkedKeys)
  })
  checkedKeysArry = [...new Set(checkedKeysArry)]
  let menuList = await Menu.find({ _id: { $in: checkedKeysArry } })
  let apiPath = []
  menuList.map(menu => {
    if (menu.menuType == 2) {
      apiPath = apiPath.concat(menu.apiPath)
    }
  })
  apiPath = [...new Set(apiPath)]
  return apiPath
}


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

    ctx.request.userInfo = data.data;
    if (!data.data.state) {
      return ctx.body = util.fail('账号已被禁用', util.CODE.AUTH_ERROR);
    }
    const filterUser = await User.findOne({ userId: data.data.userId })
    if (filterUser) {
      if (!filterUser.state) {
        return ctx.body = util.fail('账号已被禁用', util.CODE.AUTH_ERROR);
      }
    }

    // 校验接口权限
    if (data.data.role != 0) {
      const { roleList } = data.data
      const { path } = ctx.request
      console.log('roleList', roleList)
      let apiPath = await getApiPath(roleList)
      console.log('path', path)
      console.log('apiPath', apiPath)
      apiPath.forEach(item => {
        item = item.split(':')[0]
      })
      if (!apiPath.includes(path)) {
        return ctx.body = util.fail('没有权限', util.CODE.AUTH_ERROR);
      }
    }


    await next();
  } catch (err) {
    ctx.body = util.fail('Token 认证失败', util.CODE.AUTH_ERROR);
  }
};
