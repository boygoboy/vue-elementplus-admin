import axios from "axios";
import config from "../config";
import { ElMessage } from "element-plus";
import router from "../router";
const TOKEN_INVALID='权限认证失败'
const NETWORK_ERROR='网络请求异常，请稍后重试'

const service=axios.create({
    baseURL:config.baseApi,
    timeout:8000
})

service.interceptors.request.use((req)=>{
    const headers=req.headers;
    if(!headers.Authorization) headers.Authorization='Bear jack'
    return req
})

service.interceptors.response.use((res)=>{
    const {code,msg,data}=res.data
    if(code==200){
      return data
    }else if(code==401){
      ElMessage.error(TOKEN_INVALID)
      //跳转登录
      router.push('/login')
      return Promise.reject(TOKEN_INVALID)
    }else{
       ElMessage.error(NETWORK_ERROR)
       return Promise.reject(msg||NETWORK_ERROR)
    }
})

function request(options){
   options.method=options.method || 'get'
   if(options.method.toLowerCase()=='get'){
    options.params=options.data
   }
   if(config.env=='prod'){
      service.defaults.baseURL=config.baseApi
   }else{
      service.defaults.baseURL=config.mock?config.mockApi:config.baseApi
   }

    return  service(options)
}

['get','post','put','delete','patch'].forEach(item=>{
    request[item]=(url,data,options)=>{
        return request({
            url,
            data,
            method:item,
            ...options
        })
    }
})

export default request