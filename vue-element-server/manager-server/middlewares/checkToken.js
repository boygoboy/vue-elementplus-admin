const util = require('../utils/util.js');
const jwt = require('jsonwebtoken');
const User = require('../db/models/system/userSchema.js')
const Menu = require('../db/models/system/menuSchema.js')
const Role = require('../db/models/system/roleSchema.js')
const Level = require('../db/models/member/levelSchema.js');
const { error } = require('../utils/log4j.js');
const moment = require('moment')

const excludeRoutes = ['/api/system/users/login', '/api/system/users/emailcode',
  '/api/system/users/register'
];

const getApiPath = async (roleKeys) => {
  let roleList = await Role.find({
    roleId: {
      $in: roleKeys
    }
  })
  let checkedKeysArry = []
  roleList.map(role => {
    let {
      checkedKeys
    } = role.permissionList
    checkedKeysArry = checkedKeysArry.concat(checkedKeys)
  })
  checkedKeysArry = [...new Set(checkedKeysArry)]
  let menuList = await Menu.find({
    _id: {
      $in: checkedKeysArry
    }
  })
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

  let token = ctx.request.header.authorization.replace('Bearer ', '');
  if (!token) {
    ctx.body = util.fail('Token 认证失败', util.CODE.AUTH_ERROR);
    return;
  }

  try {
    const data = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
          console.log('err', err)
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
    ctx.request.userInfo = data.data;
    if (!data.data.state) {
      return ctx.body = util.fail('账号已被禁用', util.CODE.AUTH_ERROR);
    }
    const filterUser = await User.findOne({
      userId: data.data.userId
    })
    if (filterUser) {
      if (!filterUser.state) {
        return ctx.body = util.fail('账号已被禁用', util.CODE.AUTH_ERROR);
      }
    }
    //如果为普通用户role=99需要校验套餐是否过期
    if (data.data.role == 99) {
      const {
        validDate,
        userId,
        levelId,
        levelWeight
      } = data.data
      const filterUser = await User.findOne({ userId })
      if (!filterUser) {
        return ctx.body = util.fail('用户不存在', util.CODE.AUTH_ERROR);
      }
      if (filterUser.levelWeight < levelWeight) {
        let retryUserInfo = filterUser._doc
        token = jwt.sign({
          data: retryUserInfo
        }, process.env.TOKEN_SECRET, {
          expiresIn: 60 * 60 * 24
        });
        retryUserInfo.token = token
        return ctx.body = {
          ...util.fail('套餐已失效', util.CODE.LEVEL_ERROR),
          userInfo: retryUserInfo
        }
      }
      let expireTime = new Date(validDate).getTime()
      let nowTime = new Date().getTime()
      if (expireTime < nowTime) {
        //将该用户套餐降级为free套餐
        const filterLevel = await Level.findOne({
          levelName: 'free'
        })
        if (!filterLevel) {
          //将过期用户禁用
          await User.findOneAndUpdate({ userId }, { state: false })
        } else {
          //将用户降级为free套餐
          let isFree = levelId == filterLevel.levelId ? true : false
          console.log(isFree)
          await User.findOneAndUpdate({ userId }, {
            roleList: [filterLevel.linkroleId],
            levelId: filterLevel.levelId,
            levelWeight: filterLevel.levelWeight,
            packagePrice: filterLevel.packagePrice,
            validDate: isFree ? validDate : moment().add(filterLevel.packageDuration, 'days').format('YYYY-MM-DD HH:mm:ss')
          })
          let retryUserInfo = filterUser._doc
          token = jwt.sign({
            data: retryUserInfo
          }, process.env.TOKEN_SECRET, {
            expiresIn: 60 * 60 * 24
          });
          retryUserInfo.token = token
          return ctx.body = {
            ...util.fail(`${isFree == true ? '免费套餐已到期请升级为会员' : '套餐失效已变为免费套餐，请重载页面'}`, isFree != true ? util.CODE.LEVEL_ERROR : util.CODE.AUTH_ERROR),
            userInfo: retryUserInfo
          }
        }
      }
    }
    // 校验接口权限
    if (data.data.role != 0) {
      const {
        roleList
      } = data.data
      const {
        path
      } = ctx.request
      console.log('roleList', roleList)
      let apiPath = await getApiPath(roleList)
      console.log('path', path)
      console.log('apiPath', apiPath)
      apiPath.forEach(item => {
        item = item.split(':')[0]
      })
      console.log('apiPath', apiPath)
      let whiteList = ['/api/system/users/getPermissionList', '/api/system/users/exchangemember']
      if (!apiPath.includes(path) && !whiteList.includes(path)) {
        return ctx.body = util.fail('没有权限', util.CODE.AUTH_ERROR);
      }
    }


    await next();
  } catch (err) {
    console.log(error)
    ctx.body = util.fail('Token 认证失败', util.CODE.AUTH_ERROR);
  }
};