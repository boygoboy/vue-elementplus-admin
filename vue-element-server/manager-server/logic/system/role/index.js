const Role = require('../../../db/models/system/roleSchema.js')
const Counter = require('../../../db/models/system/counterSchema.js')
const util = require('../../../utils/util.js')
const {
  CODE,
  fail,
  success
} = util
const log4j = require('../../../utils/log4j.js')




const getRoleList = async (ctx) => {
  try {
    const {
      roleName
    } = ctx.request.query;
    let params = {}
    if (roleName) {
      params.roleName = roleName
    }
    const {
      page,
      skipIndex
    } = util.pager(ctx.request.query)
    const query = Role.find(params)
    const list = await query.skip(skipIndex).limit(page.pageSize)
    const total = await Role.countDocuments(params)
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

const getAllRoleList = async (ctx) => {
  try {
    const list = await Role.find({}, "roleId roleName")
    ctx.body = success(list)
  } catch (error) {
    ctx.body = fail('服务器内部错误', CODE.SERVICE_ERROR)
  }
}

const addRole = async (ctx) => {
  try {
    const {
      roleName,
      remark
    } = ctx.request.body
    if (!roleName) {
      return ctx.body = fail('请求参数错误', CODE.PARAM_ERROR)
    }
    const filterRole = await Role.findOne({
      roleName
    })
    if (filterRole) {
      return ctx.body = fail('角色名称已存在', CODE.BUSINESS_ERROR)
    }
    const findId = await Counter.findOne({
      id: 'roleId'
    })
    if (!findId) {
      await Counter.create({
        "id": "roleId",
        "sequence_value": 1
      })
    }
    const count = await Counter.findOneAndUpdate({
      id: 'roleId'
    }, {
      $inc: {
        sequence_value: 1
      }
    }, {
      new: true
    })
    const user = await new Role({
      roleId: count.sequence_value,
      roleName,
      remark
    })
    user.save()
    ctx.body = success()
  } catch (error) {
    ctx.body = fail('服务器内部错误', CODE.SERVICE_ERROR)
  }
}



const editRole = async (ctx) => {
  try {
    const {
      roleId,
      roleName,
      remark
    } = ctx.request.body
    if (!roleId || !roleName) {
      return ctx.body = fail('请求参数错误', CODE.PARAM_ERROR)
    }
    const filterRole = await Role.findOne({
      roleId
    })
    if (!filterRole) {
      return ctx.body = fail('角色不存在', CODE.BUSINESS_ERROR)
    }
    const oneRole = await Role.findOneAndUpdate({
      roleId
    }, {
      roleName,
      remark
    })
    if (oneRole) {
      return ctx.body = success()
    } else {
      return ctx.body = fail('编辑角色失败', CODE.BUSINESS_ERROR)
    }
  } catch (error) {
    ctx.body = fail('服务器内部错误', CODE.SERVICE_ERROR)
  }
}

const deleteRole = async (ctx) => {
  try {
    const roleId = ctx.params.id
    if (!roleId) {
      return ctx.body = fail('请求参数错误', CODE.PARAM_ERROR)
    }
    await Role.deleteOne({
      roleId
    })
    return ctx.body = success()
  } catch (error) {
    ctx.body = fail('服务器内部错误', CODE.SERVICE_ERROR)
  }
}

const setRolePermission = async (ctx) => {
  try {
    const {
      roleId,
      permissionList
    } = ctx.request.body
    if (!roleId || !permissionList) {
      return ctx.body = fail('请求参数错误', CODE.PARAM_ERROR)
    }
    const filterRole = await Role.findOne({
      roleId
    })
    if (!filterRole) {
      return ctx.body = fail('角色不存在', CODE.BUSINESS_ERROR)
    }
    await Role.findOneAndUpdate({
      roleId
    }, {
      permissionList
    })
    return ctx.body = success()
  } catch (error) {
    ctx.body = fail('服务器内部错误', CODE.SERVICE_ERROR)
  }
}



module.exports = {
  getRoleList,
  addRole,
  editRole,
  deleteRole,
  setRolePermission,
  getAllRoleList
}