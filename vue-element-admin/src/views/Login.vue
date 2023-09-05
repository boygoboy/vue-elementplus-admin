<template>
  <div class="login-box">
    <div class="login-form">
     <h1 class="title">后台通用管理系统</h1>
    <el-form ref="refForm" :model="loginForm" :rules="formRules">
     <el-form-item prop="username">
    <el-input v-model="loginForm.username" 
    type="text" clearable
    :prefix-icon="UserFilled"></el-input>
     </el-form-item>
     <el-form-item prop="password">
    <el-input v-model="loginForm.password" clearable
    type="password" :prefix-icon="Lock"
    ></el-input>
     </el-form-item>
         <el-form-item>
        <div class="action-btn">
       <el-button type="primary" @click="handleLogin(refForm)" style="width:50%;margin-right:10px;">登录</el-button>
       <el-button style="width:50%;margin-left:10px;">注册</el-button>
        </div>
    </el-form-item>
    </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { UserFilled,Lock } from '@element-plus/icons-vue'
import api from '@/api/login'

const store=useStore()
const router=useRouter()

const formRules={
    username:[{required:true,message:'请输入用户名',trigger:'blur'}],
    password:[{required:true,message:'请输入密码',trigger:'blur'}]
}
const refForm=ref()

const loginForm=reactive({
      username:'',
      password:''
})

const handleLogin=(formRef)=>{
  formRef.validate(async(valid)=>{
    if(valid){
    let res= await api.handleLogin(loginForm)
     console.log(res)
     store.commit('saveUserInfo',res)
     router.push('/home')
    }
  })
}

</script>

<style lang="scss" scoped>
.login-box{
 height: 100vh;
 width: 100vw;
 overflow: hidden;
 .login-form{
     .title{
     margin-bottom: 30px;
     font-size: 28px;
     text-align: center;
 }
   margin: 300px auto;
    width: 500px;
    padding: 30px 50px;
    background-color: #fff;
    box-shadow: 0px 0px 10px 3px #cdc9cb4d;
 }
}
</style>
<style scoped>
.action-btn{
    display: flex;
    justify-content: center;
    width: 100%;
}
</style>