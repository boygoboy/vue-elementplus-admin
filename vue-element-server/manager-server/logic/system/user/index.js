const User = require('../../../db/models/system/userSchema.js')
const Menu = require('../../../db/models/system/menuSchema.js')
const Role = require('../../../db/models/system/roleSchema.js')
const Counter = require('../../../db/models/system/counterSchema.js')
const emailCode = require('../../../db/models/system/emailSchema.js')
const Level = require('../../../db/models/member/levelSchema.js')
const Card = require('../../../db/models/member/cardSchema.js')
const Smtp = require('../../../db/models/system/smtpSchema.js')
const util = require('../../../utils/util.js')
const nodemailer = require("nodemailer"); // 邮件发送模块
const smtpTransport = require("nodemailer-smtp-transport");
const moment = require('moment')
const {
  CODE,
  fail,
  success,
  getMenuTree
} = util
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const log4j = require('../../../utils/log4j.js')
const handleLogin = async (ctx) => {
  try {
    const {
      username,
      password
    } = ctx.request.body
    if (!username || !password) {
      return ctx.body = fail('请求参数错误', CODE.PARAM_ERROR)
    }
    log4j.info(md5(password))
    const res = await User.findOne({
      userName: username,
      userPwd: md5(password)
    })
    if (res && !res.state) {
      return ctx.body = fail('账号已被禁用', CODE.AUTH_ERROR);
    }
    if (res) {
      const data = res._doc
      let token = jwt.sign({
        data
      }, process.env.TOKEN_SECRET, {
        expiresIn: 60 * 60 * 24
      });
      data.token = token
      // 更新用户登录时间
      await User.findOneAndUpdate({
        userId: data.userId
      }, {
        lastLoginTime: moment().format('YYYY-MM-DD HH:mm:ss')
      })
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
    state: true,
    ...params
  })
  await user.save();
}

const getUserList = async (ctx) => {
  try {
    const {
      userName,
      userEmail,
      state
    } = ctx.request.query;
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
    const {
      page,
      skipIndex
    } = util.pager(ctx.request.query)
    const query = User.find({
      ...params,
      role: {
        $ne: 99
      }
    }, {
      _id: 0,
      userPwd: 0
    })
    const list = await query.skip(skipIndex).limit(page.pageSize)
    const total = await User.countDocuments({
      ...params,
      role: {
        $ne: 99
      }
    })
    ctx.body = success({
      page: {
        ...page,
        total
      },
      list
    })
  } catch (error) {
    ctx.body = fail('服务器内部错误', CODE.SERVICE_ERROR)
  }
}

const addUser = async (ctx) => {
  try {
    const {
      userName,
      userEmail,
      mobile,
      roleList,
      userPwd
    } = ctx.request.body
    if (!userName || !userEmail || !mobile || !roleList || !userPwd) {
      return ctx.body = fail('请求参数错误', CODE.PARAM_ERROR)
    }
    const filterUser = await User.findOne({
      $or: [{
        userName
      }, {
        userEmail
      }, {
        mobile
      }]
    })
    if (filterUser) {
      return ctx.body = fail('用户名、邮箱或者手机号已存在', CODE.BUSINESS_ERROR)
    }
    const findId = await Counter.findOne({
      id: 'userId'
    })
    if (!findId) {
      await Counter.create({
        "id": "userId",
        "sequence_value": 1
      })
    }
    const count = await Counter.findOneAndUpdate({
      id: 'userId'
    }, {
      $inc: {
        sequence_value: 1
      }
    }, {
      new: true
    })
    const user = await new User({
      userId: count.sequence_value,
      userName,
      userPwd: md5(userPwd),
      userEmail,
      mobile,
      roleList,
      role: 1,
      state: true
    })
    user.save()
    ctx.body = success()
  } catch (error) {
    ctx.body = fail('服务器内部错误', CODE.SERVICE_ERROR)
  }
}

const editUser = async (ctx) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      mobile,
      roleList,
      userPwd
    } = ctx.request.body
    if (!userId || !userName || !userEmail || !mobile || !roleList || !userPwd) {
      return ctx.body = fail('请求参数错误', CODE.PARAM_ERROR)
    }
    const filterUser = await User.findOne({
      userId
    })
    if (!filterUser) {
      return ctx.body = fail('用户不存在', CODE.BUSINESS_ERROR)
    } else {
      if (filterUser.role == 0) {
        return ctx.body = fail('超级管理员不允许修改', CODE.BUSINESS_ERROR)
      }
    }
    const query = {
      $or: [{
        userName
      }, {
        userEmail
      }, {
        mobile
      }]
    };
    const users = await User.findOne(query);
    if (users.userId != userId) {
      return ctx.body = fail('用户名、邮箱或者手机号已存在', CODE.BUSINESS_ERROR)
    }
    const oneUser = await User.findOneAndUpdate({
      userId
    }, {
      userPwd: md5(userPwd),
      userName,
      userEmail,
      mobile,
      roleList
    })
    if (oneUser) {
      return ctx.body = success()
    } else {
      return ctx.body = fail('编辑用户失败', CODE.BUSINESS_ERROR)
    }
  } catch (error) {
    ctx.body = fail('服务器内部错误', CODE.SERVICE_ERROR)
  }
}

const deleteUser = async (ctx) => {
  try {
    const userIds = ctx.params.ids.split(',')
    if (userIds.length == 0) {
      return ctx.body = fail('请求参数错误', CODE.PARAM_ERROR)
    }
    const filterUser = await User.findOne({
      role: 0
    })
    if (filterUser) {
      if (userIds.includes(filterUser.userId + '')) {
        return ctx.body = fail('超级管理员不允许删除', CODE.BUSINESS_ERROR)
      } else {
        const result = await User.deleteMany({
          userId: {
            $in: userIds
          }
        })
        return ctx.body = success('', `成功删除${result.deletedCount}条数据`)
      }
    }
  } catch (error) {
    ctx.body = fail('服务器内部错误', CODE.SERVICE_ERROR)
  }
}

const switchState = async (ctx) => {
  try {
    const {
      userId,
      state
    } = ctx.request.body
    const actionUserId = ctx.request.userInfo.userId
    if (userId == actionUserId) {
      return ctx.body = fail('不能禁用自己', CODE.BUSINESS_ERROR)
    }
    if (userId != 0) {
      if (!userId || state === undefined || state === '') {
        return ctx.body = fail('请求参数错误', CODE.PARAM_ERROR)
      }
    }
    const filterUser = await User.findOne({
      role: 0
    })
    if (filterUser) {
      if (userId == filterUser.userId) {
        return ctx.body = fail('超级管理员不允许修改', CODE.BUSINESS_ERROR)
      }
      await User.findOneAndUpdate({
        userId
      }, {
        state
      })
      ctx.body = success()
    }
  } catch (error) {
    ctx.body = fail('服务器内部错误', CODE.SERVICE_ERROR)
  }
}

const getPermissionList = async (ctx) => {
  try {
    const {
      role,
      roleList
    } = ctx.request.userInfo
    let menuList = await getMenuList(role, roleList)
    let actionList = getAction(JSON.parse(JSON.stringify(menuList)))
    ctx.body = success({
      menuList,
      actionList
    })
  } catch (error) {
    console.log(error)
    ctx.body = fail('服务器内部错误', CODE.SERVICE_ERROR)
  }
}

async function getMenuList(userRole, roleKeys) {
  let rootList = []
  if (userRole == 0) {
    rootList = await Menu.find({}) || []
  } else {
    let roleList = await Role.find({
      roleId: {
        $in: roleKeys
      }
    })
    let permissionList = []
    roleList.map(role => {
      let {
        checkedKeys,
        halfCheckedKeys
      } = role.permissionList
      permissionList = permissionList.concat([...checkedKeys, ...halfCheckedKeys])
    })
    permissionList = [...new Set(permissionList)]
    rootList = await Menu.find({
      _id: {
        $in: permissionList
      }
    })
  }
  return getMenuTree(rootList, null, [])
}

function getAction(list) {
  let actionList = []
  const deep = (arr) => {
    while (arr.length) {
      let item = arr.pop()
      if (item.action) {
        item.action.map(action => {
          actionList.push(action.menuCode)
        })
      }
      if (item.children && !item.action) {
        deep(item.children)
      }
    }
  }
  deep(list)
  return actionList
}



const registerUser = async (ctx) => {
  try {
    const {
      userName,
      userPwd,
      userEmail,
      mobile,
      code
    } = ctx.request.body
    if (!userName || !userEmail || !mobile || !userPwd || !code) {
      return ctx.body = fail('请求参数错误', CODE.PARAM_ERROR)
    }
    const filteremmailCode = await emailCode.findOne({
      userEmail
    })
    if (!filteremmailCode) {
      return ctx.body = fail('验证码错误', CODE.PARAM_ERROR)
    } else {
      if (filteremmailCode.code != code) {
        return ctx.body = fail('验证码错误', CODE.PARAM_ERROR)
      }
    }
    const filterUser = await User.findOne({
      $or: [{
        userName
      }, {
        userEmail
      }, {
        mobile
      }]
    })
    if (filterUser) {
      return ctx.body = fail('用户名、邮箱或者手机号已存在', CODE.BUSINESS_ERROR)
    }
    const findId = await Counter.findOne({
      id: 'userId'
    })
    if (!findId) {
      await Counter.create({
        "id": "userId",
        "sequence_value": 1
      })
    }
    const count = await Counter.findOneAndUpdate({
      id: 'userId'
    }, {
      $inc: {
        sequence_value: 1
      }
    }, {
      new: true
    })

    const filterLevel = await Level.findOne({
      levelName: 'free'
    })
    if (!filterLevel) {
      return ctx.body = fail('系统维护已停止注册', CODE.BUSINESS_ERROR)
    }
    const user = await new User({
      userId: count.sequence_value,
      userName,
      userPwd: md5(userPwd),
      userEmail,
      mobile,
      roleList: [filterLevel.linkroleId],
      role: 99,
      state: true,
      levelId: filterLevel.levelId,
      levelWeight: filterLevel.levelWeight,
      packagePrice: filterLevel.packagePrice,
      validDate: moment().add(filterLevel.packageDuration, 'days').format('YYYY-MM-DD HH:mm:ss'),
      remainMoney: filterLevel.resourceList.packageMoney
    })
    user.save()
    ctx.body = success()
  } catch (error) {
    ctx.body = fail('服务器内部错误', CODE.SERVICE_ERROR)
  }
}


const getemailCode = async (ctx) => {
  try {
    // 查找启用的smtp配置
    const filterSmtp = await Smtp.findOne({
      isOnline: true
    })
    if (!filterSmtp) {
      return ctx.body = fail('未配置邮箱服务', CODE.BUSINESS_ERROR)
    }

    //    初始化邮箱配置
    const transport = nodemailer.createTransport(
      smtpTransport({
        host: filterSmtp.smtpHost, // 服务,这里使用的是163邮箱
        port: filterSmtp.smtpPort, // smtp端口，默认就是此 端口
        secure: true,
        auth: {
          user: filterSmtp.userName, //发件人邮箱，即你的邮箱
          pass: filterSmtp.passWord, // SMTP授权码,需要邮箱设置中获取
        },
      })
    );

    const regEmail =
      /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/; //验证邮箱正则
    // 生成6位随机数
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += parseInt(Math.random() * 10);
    }

    /* 发送验证码 */
    let userEmail = ctx.request.query.userEmail;
    let filterEmail = await User.findOne({
      userEmail
    });
    if (filterEmail) {
      return ctx.body = fail('该邮箱已被注册', CODE.BUSINESS_ERROR)
    }

    if (regEmail.test(userEmail)) {
      try {
        await transport.sendMail({
          from: filterSmtp.sendName, // 发件邮箱
          to: userEmail, // 收件列表
          subject: "验证你的电子邮件", // 标题
          html: `${filterSmtp.textModel.split('${code}')[0]}${code}${filterSmtp.textModel.split('${code}')[1]}`, // html 内容
        });
      } catch (error) {
        transport.close(); // 如果没用，关闭连接池
        return ctx.body = fail('发送失败', CODE.BUSINESS_ERROR)
      }
    } else {
      return ctx.body = fail('邮箱格式错误', CODE.BUSINESS_ERROR)
    }
    await emailCode.deleteMany({
      email: userEmail
    });
    //这一步运行一次就可以注释掉，自增需要有个初始值
    const result = await Counter.findOne({
      id: "emailId"
    })
    if (!result) {
      await Counter.create({
        "id": "emailId",
        "sequence_value": 1
      })
    }
    //处理自增emailId
    const count = await Counter.findOneAndUpdate({
      id: 'emailId'
    }, {
      $inc: {
        sequence_value: 1
      }
    }, {
      new: true
    })
    const _email = await new emailCode({
      emailId: count.sequence_value,
      email: userEmail,
      code
    })
    await _email.save();
    setTimeout(async () => {
      //2分钟后失效，即删除验证码
      await emailCode.deleteMany({
        email: userEmail
      });
    }, 1000 * 60 * 2);
    return ctx.body = success()
  } catch (error) {
    ctx.body = fail('服务器内部错误', CODE.SERVICE_ERROR)
  }
}

const exchangeMember = async (ctx) => {
  try {
    const { redeemCode } = ctx.request.body
    const { userInfo } = ctx.request
    if (!redeemCode) {
      return ctx.body = fail('请求参数错误', CODE.PARAM_ERROR)
    }
    //1. 如果是管理员为全权限无需兑换
    if (userInfo.role != 99) {
      return ctx.body = fail('管理员不允许兑换', CODE.BUSINESS_ERROR)
    }
    //2. 查询兑换码是否存在
    const filterCard = await Card.findOne({
      cardNo: redeemCode
    })
    if (!filterCard) {
      return ctx.body = fail('兑换码不存在', CODE.BUSINESS_ERROR)
    }
    //3. 查询兑换码是否过期
    if (moment(filterCard.expirationDate).isBefore(moment())) {
      //兑换码过期更新该兑换码状态
      await Card.findOneAndUpdate({
        cardNo: redeemCode
      }, {
        cardState: '已过期'
      })
      return ctx.body = fail('兑换码已过期', CODE.BUSINESS_ERROR)
    }
    //4. 查询兑换码是否已使用
    if (filterCard.cardState != '未使用') {
      return ctx.body = fail('兑换码已使用', CODE.BUSINESS_ERROR)
    }
    //6.开始执行兑换操作
    const filterLevel = await Level.findOne({
      levelId: filterCard.cardLevel
    })
    if (!filterLevel) {
      return ctx.body = fail('套餐已下架请联系客服', CODE.BUSINESS_ERROR)
    }
    //如果是充值卡充值则不需要判断用户等级
    if (filterCard.cardType == '充值卡') {
      await User.findOneAndUpdate({
        userId: userInfo.userId
      },
        { remainMoney: userInfo.remainMoney + filterLevel.resourceList.packageMoney })
      //更新兑换码状态
      await Card.findOneAndUpdate({
        cardNo: redeemCode
      }, {
        cardState: '已使用'
      })
      return ctx.body = success({
        cardType: filterCard.cardType,
        packageName: filterLevel.packageName,
        rechargeamount: filterLevel.resourceList.packageMoney,
        remainMoney: userInfo.remainMoney
      }, '余额充值成功')
    }
    /*6.1 判断要兑换的套餐等级是否大于当前等级，如果大于等于当前套餐等级则进行兑换
    并且剩余的天数折合成金额添加到用户余额中同时更新用户等级、用户角色、套餐有效期、套餐剩余金额，
    兑换成功后将兑换码状态更新为已使用。
    如果小于当前等级则提示用户不能兑换低于当前等级的套餐。
    */
    if (filterLevel.levelWeight < userInfo.levelId) {
      return ctx.body = fail('不能兑换低于当前等级的套餐', CODE.BUSINESS_ERROR)
    }
    if (filterLevel.levelWeight == userInfo.levelWeight) {
      //更新当前用户信息
      await User.findOneAndUpdate({
        userId: userInfo.userId
      }, {
        levelId: filterLevel.levelId,
        validDate: moment(userInfo.validDate).add(filterLevel.packageDuration, 'days').format('YYYY-MM-DD HH:mm:ss'),
        remainMoney: userInfo.remainMoney + filterLevel.resourceList.packageMoney,
        roleList: [filterLevel.linkroleId],
        levelWeight: filterLevel.levelWeight,
        packagePrice: filterLevel.packagePrice
      })
    } else if (filterLevel.levelWeight > userInfo.levelWeight) {
      //更新当前用户信息
      // 有效期日期
      const expiryDate = moment(userInfo.validDate);
      // 现在时间
      const now = moment();
      // 计算相差的天数
      const diffDays = expiryDate.diff(now, 'days');
      await User.findOneAndUpdate({
        userId: userInfo.userId
      }, {
        levelId: filterLevel.levelId,
        validDate: moment().add(filterLevel.packageDuration + (parseInt((userInfo.packagePrice / filterLevel.packagePrice) * diffDays)), 'days').format('YYYY-MM-DD HH:mm:ss'),
        remainMoney: filterLevel.resourceList.packageMoney + userInfo.remainMoney,
        roleList: [filterLevel.linkroleId],
        levelWeight: filterLevel.levelWeight,
        packagePrice: filterLevel.packagePrice
      })
    }
    //更新兑换码状态
    await Card.findOneAndUpdate({
      cardNo: redeemCode
    }, {
      cardState: '已使用'
    })
    //重新写入token,返回给前端
    const returnUser = await User.findOne({
      userId: userInfo.userId
    })
    let retryUserInfo = returnUser._doc
    token = jwt.sign({
      data: retryUserInfo
    }, process.env.TOKEN_SECRET, {
      expiresIn: 60 * 60 * 24
    });
    retryUserInfo.token = token


    const expiryDate = moment(userInfo.validDate);
    // 现在时间
    const now = moment();
    // 计算相差的天数
    const diffDays = expiryDate.diff(now, 'days');

    ctx.body = success({
      cardType: filterCard.cardType,
      packageName: filterLevel.packageName,
      levelName: filterLevel.levelName,
      validDate: moment(userInfo.validDate).add(filterLevel.packageDuration, 'days').format('YYYY-MM-DD HH:mm:ss'),
      remainMoney: userInfo.remainMoney,
      rechargeamount: filterLevel.resourceList.packageMoney,
      validDate: moment().add(filterLevel.packageDuration + (parseInt((userInfo.packagePrice / filterLevel.packagePrice) * diffDays)), 'days').format('YYYY-MM-DD HH:mm:ss'),
      carryDays: parseInt((userInfo.packagePrice / filterLevel.packagePrice) * diffDays),
      userInfo: retryUserInfo
    }, '会员兑换成功')
  } catch (error) {
    ctx.body = fail('服务器内部错误', CODE.SERVICE_ERROR)
  }
}



module.exports = {
  handleLogin,
  createFirstUser,
  getUserList,
  addUser,
  editUser,
  deleteUser,
  switchState,
  getPermissionList,
  registerUser,
  getemailCode,
  exchangeMember
}