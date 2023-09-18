const User = require('../../db/models/userSchema.js')
const util = require('../../utils/util.js')
const { CODE, fail, success } = util
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const log4j = require('../../utils/log4j.js')
const handleLogin = async (ctx) => {
  try {
    const { username, password } = ctx.request.body
    if (!username || !password) {
      return ctx.body = fail('请求参数错误', CODE.PARAM_ERROR)
    }
    log4j.info(md5(password))
    const res = await User.findOne({
      userName: username,
      userPwd: md5(password)
    })
    if (res) {
      const data = res._doc
      let token = jwt.sign({
        data
      }, process.env.TOKEN_SECRET, {
        expiresIn: 60 * 60 * 24
      });
      data.token = token
      ctx.body = success(data)
    } else {
      ctx.body = fail('账号或者密码错误', CODE.USER_ACCOUNT_ERROR)
    }
  } catch (error) {
    ctx.body = fail('服务器内部错误', CODE.SERVICE_ERROR)
  }


}

const createFirstUser = async (params) => {
  const result = await User.findOne({
    username: process.env.ADMIN_NAME || "admin"
  })
  if (result) {
    return
  }
  const user = await new User({
    userId: 0,
    role: 0,
    ...params
  })
  await user.save();
}

const getUserList = async (ctx) => {
  try {
    const { userName, userEmail, state } = ctx.request.query;
    let params = {}
    if (userName) {
      params.userName = userName
    }
    if (userEmail) {
      params.userEmail = userEmail
    }
    if (state) {
      params.state = state
    }
    const { page, skipIndex } = util.pager(ctx.request.query)
    const query = User.find(params, { _id: 0, userPwd: 0 })
    const list = await query.skip(skipIndex).limit(page.pageSize)
    const total = await User.countDocuments(params)
    console.log(list)
    ctx.body = success({
      page: {
        ...page, total
      },
      list
    })
  } catch (error) {
    ctx.body = fail('服务器内部错误', CODE.SERVICE_ERROR)
  }
}

module.exports = {
  handleLogin, createFirstUser, getUserList
}