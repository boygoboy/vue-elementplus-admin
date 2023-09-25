const Menu = require('../../db/models/menuSchema.js')
const util = require('../../utils/util.js')
const {
    CODE,
    fail,
    success,
    getMenuTree
} = util
const log4j = require('../../utils/log4j.js')

const addMenu = async (ctx) => {
    try {
        const {
            sortNo,
            menuType,
            menuName,
            menuCode,
            path,
            icon,
            component,
            menuState,
            parentId,
            apiPath
        } = ctx.request.body
        if (menuType == 1) {
            const filterMenu = await Menu.findOne({
                path
            });
            if (filterMenu) {
                return ctx.body = fail('菜单路径已存在', CODE.PARAM_ERROR)
            }
            if (!menuName || !path || !parentId || !menuState || !sortNo) {
                return ctx.body = fail('请求参数错误', CODE.PARAM_ERROR)
            }
        } else if (menuType == 2) {
            if (!menuName || !menuCode || !parentId || !apiPath || !sortNo) {
                return ctx.body = fail('请求参数错误', CODE.PARAM_ERROR)
            }
            const filterMenu = await Menu.findOne({
                menuCode
            });
            if (filterMenu) {
                return ctx.body = fail('菜单编码已存在', CODE.PARAM_ERROR)
            }
        }

        await new Menu({
            sortNo,
            menuType,
            menuName,
            menuCode,
            path,
            icon,
            component,
            menuState,
            parentId,
            apiPath
        }).save()
        ctx.body = success()
    } catch (error) {
        ctx.body = fail('服务器内部错误', CODE.SERVICE_ERROR)
    }

}

const editMenu = async (ctx) => {
    try {
        const {
            sortNo,
            menuType,
            menuName,
            menuCode,
            path,
            icon,
            component,
            menuState,
            parentId,
            _id,
            apiPath
        } = ctx.request.body
        if (menuType == 1) {
            const filterMenu = await Menu.findOne({
                path
            });
            if (filterMenu && _id != filterMenu._id) {
                return ctx.body = fail('菜单路径已存在', CODE.PARAM_ERROR)
            }
            if (!menuName || !path || !parentId || !menuState || !_id || !sortNo) {
                ctx.body = fail('请求参数错误', CODE.PARAM_ERROR)
            }
        } else if (menuType == 2) {
            if (!menuName || !menuCode || !parentId || _id || !apiPath || !sortNo) {
                ctx.body = fail('请求参数错误', CODE.PARAM_ERROR)
            }
            const filterMenu = await Menu.findOne({
                menuCode
            });
            if (filterMenu && filterMenu._id != _id) {
                return ctx.body = fail('菜单编码已存在', CODE.PARAM_ERROR)
            }
        }
        const updateTime = new Date()
        await Menu.findByIdAndUpdate(_id, {
            sortNo,
            menuType,
            menuName,
            menuCode,
            path,
            apiPath,
            icon,
            component,
            menuState,
            parentId,
            updateTime
        })
        ctx.body = success()
    } catch (error) {
        ctx.body = fail('服务器内部错误', CODE.SERVICE_ERROR)
    }

}

const deleteMenu = async (ctx) => {
    try {
        const {
            id
        } = ctx.params
        if (!ctx.params.id) {
            ctx.body = fail('请求参数错误', CODE.PARAM_ERROR)
        }
        await Menu.findByIdAndRemove(id)
        await Menu.deleteMany({
            parentId: {
                $all: [id]
            }
        })
        ctx.body = success()
    } catch (error) {
        ctx.body = fail('服务器内部错误', CODE.SERVICE_ERROR)
    }
}

const getMenu = async (ctx) => {
    try {
        const {
            menuName,
            menuState
        } = ctx.request.query
        const params = {}
        if (menuName) {
            params.menuName = menuName
        }
        if (menuState) {
            params.menuState = menuState
        }
        let menuList = await Menu.find(params) || []
        let id = null
        if (params.menuName) {
            id = menuList[0].parentId.slice().pop()
        }
        const permissionList = getMenuTree(menuList, id, [])
        ctx.body = success(permissionList)
    } catch (error) {
        ctx.body = fail('服务器内部错误', CODE.SERVICE_ERROR)
    }
}

module.exports = {
    addMenu,
    editMenu,
    deleteMenu,
    getMenu
}