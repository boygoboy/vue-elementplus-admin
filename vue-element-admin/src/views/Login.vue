<template>
  <div class="login-box">
    <transition name="fade" mode="out-in">
      <div class="login-form" v-if="isLogin">
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
              <span class="register-text" @click="openRegister">注册账号</span>
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

      <div class="login-form" style="margin-top: 50px" v-else>
        <h1 class="title">LOG IN TO THE SYSTEM</h1>
        <h2 class="sub-title">欢迎来到后台管理系统</h2>
        <el-form
          ref="refRegisterForm"
          :model="registerForm"
          :rules="registerFormRules"
        >
          <el-form-item prop="userName" class="form-column">
            <template #label>
              <div>用户名</div>
            </template>
            <el-input
              class="login-input"
              v-model="registerForm.userName"
              type="text"
              clearable
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="mobile" class="form-column">
            <template #label>
              <div>手机</div>
            </template>
            <el-input
              class="login-input"
              v-model="registerForm.mobile"
              type="text"
              clearable
              placeholder="请输入手机号"
            ></el-input>
          </el-form-item>
          <el-form-item prop="userEmail" class="form-column">
            <template #label>
              <div>邮箱</div>
            </template>
            <div style="width: 100%; position: relative">
              <el-input
                class="login-input code-input"
                v-model="registerForm.userEmail"
                type="text"
                placeholder="请输入邮箱"
              >
              </el-input>
              <el-button
                type="primary"
                link
                :disabled="waitcodeText == '获取验证码' ? false : true"
                class="code-btn"
                @click="getCode"
                :loading="isLoading"
                >{{ waitcodeText }}</el-button
              >
            </div>
          </el-form-item>
          <el-form-item prop="code" class="form-column">
            <template #label>
              <div>验证码</div>
            </template>
            <el-input
              class="login-input"
              v-model="registerForm.code"
              type="text"
              clearable
              placeholder="请输入验证码"
            ></el-input>
          </el-form-item>
          <el-form-item prop="userPwd" class="form-column">
            <template #label>
              <div>登录密码</div>
            </template>
            <el-input
              class="login-input"
              v-model="registerForm.userPwd"
              type="password"
              placeholder="请输入登录密码"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="repeatPassword"
            class="form-column last-form-column"
          >
            <template #label>
              <div>确认密码</div>
            </template>
            <el-input
              class="login-input"
              v-model="registerForm.repeatPassword"
              type="password"
              placeholder="请输入登录密码"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <div class="login-btn-text">
              <span
                class="register-text"
                @mouseleave="isHover = false"
                @mouseover="hoverReturn"
              >
                <svg-icon
                  iconName="icon-fanhui"
                  className="return-cls"
                  :color="isHover ? '#aa54ff' : ''"
                ></svg-icon>
                <span @click="returnLogin">返回登录</span>
              </span>
            </div>
          </el-form-item>
          <el-form-item>
            <div class="action-btn">
              <el-button
                size="large"
                type="primary"
                @click="handleRegister(refRegisterForm)"
                style="width: 100%; background: #3c1480; border: none"
                >确认注册</el-button
              >
            </div>
          </el-form-item>
        </el-form>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import api from "@/api/login";
const store = useStore();
const router = useRouter();
let isLoading = computed(() => store.getters.isLoading);
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

let isLogin = ref(true);
const openRegister = () => {
  isLogin.value = false;
};
const returnLogin = () => {
  isLogin.value = true;
  reactive({
    userName: "",
    userPwd: "",
    repeatPassword: "",
    userEmail: "",
    mobile: "",
    code: "",
  });
  waitcodeText.value = "获取验证码";
};
let isHover = ref(false);
const hoverReturn = () => {
  isHover.value = true;
};

let registerForm = reactive({
  userName: "",
  userPwd: "",
  repeatPassword: "",
  userEmail: "",
  mobile: "",
  code: "",
});
const checkEmail = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入邮箱"));
  } else {
    const pattern = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    if (!pattern.test(value)) {
      callback(new Error("请输入正确的邮箱"));
    } else {
      callback();
    }
  }
};
const checkMobile = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入手机号"));
  } else {
    const pattern = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!pattern.test(value)) {
      callback(new Error("请输入正确的手机号"));
    } else {
      callback();
    }
  }
};
const checkRepeatPwd = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入确认密码"));
  } else {
    if (value != registerForm.userPwd) {
      callback(new Error("密码不一致"));
    } else {
      callback();
    }
  }
};
const registerFormRules = {
  userName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  userPwd: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      pattern:
        /^([a-zA-Z]+[0-9]+[,._!@#$%^&*]+)|([a-zA-Z]+[,._!@#$%^&*]+[0-9]+)|([0-9]+[,._!@#$%^&*]+[a-zA-Z]+)|([0-9]+[a-zA-Z]+[,._!@#$%^&*]+)|([,._!@#$%^&*]+[a-zA-Z]+[0-9]+)|([,._!@#$%^&*]+[0-9]+[a-zA-Z]+)$/,
      message: "密码必须包含数字，字母和特殊符号",
      trigger: "blur",
    },
  ],
  repeatPassword: [
    { required: true, message: "请再次输入密码", trigger: "blur" },
    { validator: checkRepeatPwd, trigger: "blur" },
  ],
  userEmail: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { validator: checkEmail, trigger: "blur" },
  ],
  mobile: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { validator: checkMobile, trigger: "blur" },
  ],
  code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
};
const refRegisterForm = ref();
const handleRegister = (formRef) => {
  formRef.validate(async (valid) => {
    if (valid) {
      const data = {
        userName: registerForm.userName,
        userPwd: registerForm.userPwd,
        userEmail: registerForm.userEmail,
        mobile: registerForm.mobile,
        code: registerForm.code,
      };
      store.commit("system/SET_ISLOADING", true);
      await api.handleRegister(data);
      store.commit("system/SET_ISLOADING", false);
      isLogin.value = true;
      reactive({
        userName: "",
        userPwd: "",
        repeatPassword: "",
        userEmail: "",
        mobile: "",
        code: "",
      });
      waitcodeText.value = "获取验证码";
      ElMessage.success("注册成功");
    }
  });
};

let waitcodeText = ref("获取验证码");
const getCode = async () => {
  if (!registerForm.userEmail) {
    ElMessage.warning("请输入邮箱");
    return;
  }
  const pattern = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
  if (!pattern.test(registerForm.userEmail)) {
    ElMessage.warning("请输入正确的邮箱");
    return;
  }

  const query = {
    userEmail: registerForm.userEmail,
  };
  store.commit("system/SET_ISLOADING", true);
  await api.getmobileCode(query);
  store.commit("system/SET_ISLOADING", false);
  let time = 120;
  waitcodeText.value = time + "s";
  let timer = setInterval(() => {
    time--;
    waitcodeText.value = time + "s";
    if (time == 0) {
      clearInterval(timer);
      waitcodeText.value = "获取验证码";
    }
  }, 1000);
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
        &:hover {
          color: #aa54ff;
        }
      }
      .register-text {
        cursor: pointer;
        &:hover {
          color: #aa54ff;
        }
        .return-cls {
          margin-right: 5px;
        }
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.code-input /deep/ .el-input__inner {
  padding-right: 80px !important;
}
.code-btn {
  position: absolute;
  right: 10px;
  top: 8px;
}
</style>
