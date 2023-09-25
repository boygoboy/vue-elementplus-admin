<template>
  <div class="login-box">
    <div class="login-form">
      <h1 class="title">LOG IN TO THE SYSTEM</h1>
      <h2 class="sub-title">欢迎来到后台管理系统</h2>
      <el-form ref="refForm" :model="loginForm" :rules="formRules">
        <el-form-item prop="username" class="form-column">
          <template #label>
            <div>用户名/邮箱</div>
          </template>
          <el-input
            class="login-input"
            v-model="loginForm.username"
            type="text"
            clearable
            placeholder="请输入用户名或邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password" class="form-column last-form-column">
          <template #label>
            <div>登录密码</div>
          </template>
          <el-input
            class="login-input"
            v-model="loginForm.password"
            type="password"
            placeholder="请输入登录密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <div class="login-btn-text">
            <span class="forget-text">忘记密码？</span>
            <span class="register-text">注册账号</span>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="action-btn">
            <el-button
              size="large"
              type="primary"
              @click="handleLogin(refForm)"
              style="width: 100%; background: #3c1480; border: none"
              >确认登录</el-button
            >
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { UserFilled, Lock } from "@element-plus/icons-vue";
import api from "@/api/login";

const store = useStore();
const router = useRouter();

const formRules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};
const refForm = ref();

const loginForm = reactive({
  username: "admin",
  password: "123456",
});

const handleLogin = (formRef) => {
  formRef.validate(async (valid) => {
    if (valid) {
      let res = await store.dispatch("user/handleLogin", loginForm);
      if (res) {
        await store.dispatch("user/loadRouterList");
      }
    }
  });
};
</script>

<style lang="scss" scoped>
.login-box {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-image: url("../assets/images/login_background.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-attachment: fixed;
  .login-form {
    .title {
      margin-bottom: 10px;
      font-size: 30px;
      text-align: center;
      color: #b7a4e1;
      font-weight: bold;
      white-space: nowrap;
    }
    .sub-title {
      color: #a593cc;
      font-size: 18px;
      margin-left: 5px;
      margin-bottom: 40px;
    }
    .form-column {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      .login-input {
        ::v-deep .el-input__wrapper {
          background: #130c1a;
          box-shadow: 0 0 0 1px #544f5a;
        }
        ::v-deep .el-input__inner {
          background: #130c1a;
        }
      }
      div {
        color: #747078;
      }
    }
    .login-btn-text {
      display: flex;
      justify-content: space-between;
      width: 100%;
      color: #605c66;
      .forget-text {
        cursor: pointer;
      }
      .register-text {
        cursor: pointer;
      }
    }
    margin: 200px auto;
    margin-right: 150px;
    width: 450px;
    padding: 30px 50px;
  }
}
</style>
<style scoped>
.action-btn {
  display: flex;
  justify-content: center;
  width: 100%;
}
.form-column :deep .el-form-item__content {
  width: 100%;
  margin-bottom: 5px;
}
.last-form-column {
  width: 100%;
  margin-bottom: 0px !important;
}
</style>
