

const env=import.meta.env.MODE  || 'production'

const EnvConfig={
    development:{
        baseApi:'/api',
        mockApi:'/mockapi'
    },
    test:{
        baseApi:'/',
        mockApi:'/'
    },
    production:{
        baseApi:'/',
        mockApi:'/'
    }
}

export default{
     env,
     mock:false,
     namespace:'manager',
     ...EnvConfig[env]
}