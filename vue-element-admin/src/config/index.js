

const env=import.meta.env.MODE  || 'production'

const EnvConfig={
    development:{
        baseApi:'/api',
        mockApi:'/'
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