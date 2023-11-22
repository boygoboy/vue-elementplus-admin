import axios from "axios";
import config from "../config";
import {
    ElMessage, ElMessageBox
} from "element-plus";
import router from "../router";
import storage from './storage.js'
import {
    store
} from '../store/index.js'
import user from "../store/modules/user.js";
const TOKEN_INVALID = '权限认证失败'
const NETWORK_ERROR = '网络请求异常，请稍后重试'
const LEVEL_ERROR = '套餐已失效'

const service = axios.create({
    baseURL: config.baseApi,
    timeout: 8000
})

service.interceptors.request.use((req) => {
    const headers = req.headers;
    const {
        token = ""
    } = storage.getItem('userInfo') || store.state.user.userInfo || {}
    if (!headers.Authorization) headers.Authorization = 'Bearer ' + token
    return req
})

service.interceptors.response.use((res) => {
    const {
        code,
        msg,
        data,
        userInfo
    } = res.data
    if (code == 200) {
        return data
    } else if (code == 401) {
        store.commit('system/SET_ISLOADING', false)
        ElMessage.error(msg || TOKEN_INVALID)
        //跳转登录
        setTimeout(() => {
            router.push('/login')
        }, 1500)
        setTimeout(() => {
            location.reload()
        }, 1800)
        return Promise.reject(TOKEN_INVALID)
    } else if (code == 60001) {
        //套餐被降级重新更新userInfo
        store.commit("user/SAVE_USER_INFO", userInfo);
        ElMessageBox.alert(
            `<div>${msg}</div>`,
            '套餐失效',
            {
                dangerouslyUseHTMLString: true,
                'show-close': false,
                center: true,
                'show-cancel-button': false,
                callback: async () => {
                    await store.dispatch("user/loadRouterList");
                    location.reload()
                }
            }
        )
        return Promise.reject(LEVEL_ERROR)
    } else {
        store.commit('system/SET_ISLOADING', false)
        ElMessage.error(msg || NETWORK_ERROR)
        return Promise.reject(msg || NETWORK_ERROR)
    }
}, (error) => {
    store.commit('system/SET_ISLOADING', false)
    // 对响应错误做点什么
    if (error.response && error.response.status === 404) {
        ElMessage.error('HTTP 404, 资源未找到');
    }
    // 注意：你还可以根据 `error.response.status` 处理其他错误状态码
    return Promise.reject(error);
})

function request(options) {
    options.method = options.method || 'get'
    if (options.method.toLowerCase() == 'get') {
        // options.params=options.data
    }
    if (config.env == 'production') {
        service.defaults.baseURL = config.baseApi
    } else {
        service.defaults.baseURL = config.mock ? config.mockApi : config.baseApi
    }

    return service(options)
}

['get', 'post', 'put', 'delete', 'patch'].forEach(item => {
    request[item] = (url, data, options) => {
        return request({
            url,
            data,
            method: item,
            ...options
        })
    }
})

export default request