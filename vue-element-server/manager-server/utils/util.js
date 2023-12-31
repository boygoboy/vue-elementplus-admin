const log4js = require('./log4j.js')

const CODE = {
  SUCCESS: 200,
  PARAM_ERROR: 10001, //参数错误
  USER_ACCOUNT_ERROR: 20001, //账号或密码错误
  USER_LOGIN_ERROR: 30001, //用户未登录
  BUSINESS_ERROR: 40001, // 业务请求失败
  AUTH_ERROR: 401, //认证失败或TOKEN过期
  SERVICE_ERROR: 500, //服务器内部错误
  LEVEL_ERROR: 60001, //用户等级错误
}

const handleTreeSort = (data) => {
  data.sort((a, b) => {
    return a.sortNo - b.sortNo
  })
  data.forEach(item => {
    if (item.children) {
      handleTreeSort(item.children)
    }
  })
}

const getMenuTree = (rootlist, id, list) => {
  rootlist.forEach(item => {
    if (String(item.parentId.slice().pop()) == String(id)) {
      list.push(item._doc)
    }
  })
  list.map(item => {
    item.children = []
    getMenuTree(rootlist, item._id, item.children)
    if (item.children.length == 0) {
      delete item.children
    } else if (item.children.length > 0 && item.children[0].menuType == 2) {
      item.action = item.children
    }
  })
  handleTreeSort(list)
  return list
}





module.exports = {

  pager({
    currentPage = 1,
    pageSize = 10
  }) {
    currentPage *= 1
    pageSize *= 1
    const skipIndex = (currentPage - 1) * pageSize
    return {
      page: {
        currentPage,
        pageSize
      },
      skipIndex
    }
  },
  success(data = '', msg = '', code = CODE.SUCCESS) {
    return {
      code,
      data,
      msg
    }
  },
  fail(msg = '', code = CODE.BUSINESS_ERROR) {
    log4js.debug(msg)
    return {
      code,
      msg
    }
  },
  CODE,
  getMenuTree
}