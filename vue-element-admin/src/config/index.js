

const env=import.meta.env.MODE  || 'prod'

const EnvConfig={
    dev:{
        baseApi:'/api',
        mockApi:'/'
    },
    test:{
        baseApi:'/',
        mockApi:'/'
    },
    prod:{
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