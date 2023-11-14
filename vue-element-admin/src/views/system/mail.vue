<template>
  <div class="nav-title">
    <div style="display: flex">
      <svg-icon iconName="icon-youxiang" className="mail-icon"></svg-icon>
      <div class="right-title">
        <span>邮件</span>
        <span>配置邮件设置</span>
      </div>
    </div>
    <el-button
      type="primary"
      style="height: 42px"
      icon="Plus"
      size="large"
      @click="openMail"
      >创建</el-button
    >
  </div>
  <div class="card-box">
    <el-card
      shadow="hover"
      class="card"
      v-for="(item, index) in mailData"
      :key="index"
    >
      <template #header>
        <div class="header-title">
          <span>{{ item.smtpName }}</span>
          <el-switch
            inline-prompt
            active-text="启用"
            inactive-text="关闭"
            v-model="item.isOnline"
            @change="enableEmail(item)"
            :active-value="true"
            :inactive-value="false"
          />
        </div>
      </template>
      <div class="content">
        <div class="row-text">
          <span>发件邮箱:</span>
          <span>{{ item.sendName }}</span>
        </div>
        <div class="row-text">
          <span>SMTP主机:</span>
          <span>{{ item.smtpHost }}</span>
        </div>
        <div class="row-text">
          <span>SMTP端口:</span>
          <span>{{ item.smtpPort }}</span>
        </div>
        <div class="row-text">
          <span>开启SSL:</span>
          <span>{{ item.enableSSL ? "是" : "否" }}</span>
        </div>
        <div class="row-text">
          <span>用户名:</span>
          <span>{{ item.userName }}</span>
        </div>
        <div class="row-text">
          <span>SMTP密码:</span>
          <span style="margin-right: 5px">{{
            item.show ? item.passWord : "******"
          }}</span>
          <svg-icon
            iconName="icon-yanjing"
            className="eye-icon"
            v-if="item.show"
            @click="item.show = false"
          ></svg-icon>
          <svg-icon
            iconName="icon-eyes-closed"
            className="eye-icon"
            v-else
            @click="item.show = true"
          ></svg-icon>
        </div>
        <div class="action-btn">
          <el-button type="primary" link @click="openEdit(item)"
            >smtp配置</el-button
          >
          <el-divider direction="vertical" />
          <el-button type="success" link @click="openConnect(item)"
            >测试邮件</el-button
          >
          <el-divider direction="vertical" />
          <el-button type="danger" link @click="deleteSmtp(item)"
            >删除</el-button
          >
        </div>
      </div>
    </el-card>
  </div>
  <!----------------------------------创建邮箱配置开始------------------------>
  <el-dialog
    v-model="dialogFormVisible"
    :before-close="handleClose"
    :title="dialogTitle"
    width="35%"
    top="20vh"
  >
    <el-form
      :model="addForm"
      ref="addFormRef"
      label-width="100px"
      label-position="right"
      style="width: 95%"
      :rules="addFormRules"
    >
      <el-form-item label="SMTP名称" prop="smtpName">
        <el-input v-model="addForm.smtpName" placeholder="请输入SMTP名称" />
      </el-form-item>
      <el-form-item label="发件邮箱" prop="sendName">
        <el-input v-model="addForm.sendName" placeholder="请输入发件邮箱" />
      </el-form-item>
      <el-form-item label="SMTP主机" prop="smtpHost">
        <el-input v-model="addForm.smtpHost" placeholder="请输入SMTP主机" />
      </el-form-item>
      <el-form-item label="SMTP端口" prop="smtpPort">
        <el-input v-model="addForm.smtpPort" placeholder="请输入SMTP端口" />
      </el-form-item>
      <el-form-item label="开启SSL" prop="enableSSL">
        <el-switch
          inline-prompt
          active-text="启用"
          inactive-text="关闭"
          v-model="addForm.enableSSL"
          :active-value="true"
          :inactive-value="false"
        />
      </el-form-item>
      <el-form-item label="用户名" prop="userName">
        <el-input
          v-model="addForm.userName"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="passWord">
        <el-input
          v-model="addForm.passWord"
          placeholder="请输入密码"
          type="password"
        ></el-input>
      </el-form-item>
      <el-form-item label="发信模板" prop="textModel">
        <el-input
          :rows="5"
          v-model="addForm.textModel"
          type="textarea"
          placeholder="请输入发信模板"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose" type="info">取消</el-button>
        <el-button
          :loading="isLoading"
          type="primary"
          style="margin-left: 20px"
          @click="submitMail(addFormRef)"
        >
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>

  <!---------------------------------创建邮箱配置弹窗结束----------------------->
  <!--------------------------------测试邮箱弹窗开始---------------------------->
  <el-dialog
    v-model="connectDialogVisible"
    :before-close="handleConnectClose"
    :title="dialogConnectTitle"
    width="30%"
    top="20vh"
  >
    <el-form
      :model="connectForm"
      ref="connectFormRef"
      label-width="100px"
      label-position="right"
      style="width: 95%"
      :rules="connectFormRules"
    >
      <el-form-item label="测试邮箱" prop="email">
        <el-input v-model="connectForm.email" placeholder="请输入收件人邮箱" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          :loading="isLoading"
          icon="Promotion"
          type="primary"
          style="margin-left: 20px"
          @click="sendEmail(connectFormRef)"
        >
          发送测试邮件
        </el-button>
      </span>
    </template>
  </el-dialog>
  <!--------------------------------测试邮箱弹窗结束---------------------------->
</template>

<script setup>
import { reactive, onMounted, ref, getCurrentInstance, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { ElMessageBox } from "element-plus";
import api from "@/api/system/mail.js";
let { proxy } = getCurrentInstance();
const store = useStore();
let isLoading = computed(() => store.getters.isLoading);
const getSmtpList = async () => {
  store.commit("system/SET_ISLOADING", true);
  mailData.value = [];
  //获取列表
  mailData.value = await api.getSmtp();
  store.commit("system/SET_ISLOADING", false);
};
onMounted(() => {
  getSmtpList();
});

let dialogFormVisible = ref(false);
let dialogTitle = ref("");
let addForm = reactive({
  smtpId: "",
  smtpName: "",
  sendName: "",
  smtpHost: "",
  smtpPort: "",
  enableSSL: false,
  userName: "",
  passWord: "",
  textModel: "",
  isOnline: false,
});
const addFormRules = reactive({
  smtpName: [{ required: true, message: "请输入SMTP名称", trigger: "blur" }],
  sendName: [
    { required: true, message: "请输入发件邮箱", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
  ],
  smtpHost: [{ required: true, message: "请输入SMTP主机", trigger: "blur" }],
  smtpPort: [{ required: true, message: "请输入SMTP端口", trigger: "blur" }],
  userName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  passWord: [{ required: true, message: "请输入密码", trigger: "blur" }],
  textModel: [{ required: true, message: "请输入发信模板", trigger: "blur" }],
});
const openMail = () => {
  dialogFormVisible.value = true;
  dialogTitle.value = "创建邮箱配置";
};
const handleClose = () => {
  proxy.$refs.addFormRef.resetFields();
  dialogFormVisible.value = false;
  dialogTitle.value = "";
  addForm = reactive({
    smtpId: "",
    smtpName: "",
    sendName: "",
    smtpHost: "",
    smtpPort: "",
    enableSSL: false,
    isOnline: false,
    userName: "",
    passWord: "",
    textModel: "",
  });
};
const addFormRef = ref();
const submitMail = (addFormRef) => {
  addFormRef.validate(async (valid) => {
    if (valid) {
      store.commit("system/SET_ISLOADING", true);
      const data = {
        smtpName: addForm.smtpName,
        sendName: addForm.sendName,
        smtpHost: addForm.smtpHost,
        smtpPort: addForm.smtpPort,
        enableSSL: addForm.enableSSL,
        userName: addForm.userName,
        passWord: addForm.passWord,
        textModel: addForm.textModel,
      };
      if (addForm.smtpId) {
        data.smtpId = addForm.smtpId;
        await api.editSmtp(data);
        ElMessage.success({
          message: "编辑SMTP配置成功",
        });
        await getSmtpList();
        handleClose();
      } else {
        await api.addSmtp(data);
        ElMessage.success({
          message: "添加SMTP配置成功",
        });
        await getSmtpList();
        handleClose();
      }
      store.commit("system/SET_ISLOADING", false);
    }
  });
};
let mailData = ref([]);
const enableEmail = async (item) => {
  store.commit("system/SET_ISLOADING", true);
  //切换状态
  const data = {
    smtpId: item.smtpId,
    isOnline: item.isOnline,
  };
  await api.enableSmtp(data);
  store.commit("system/SET_ISLOADING", false);
  ElMessage.success({
    message: "切换状态成功",
  });
  await getSmtpList();
};
const openEdit = (item) => {
  dialogFormVisible.value = true;
  dialogTitle.value = "编辑邮箱配置";
  addForm = reactive({
    smtpId: item.smtpId,
    smtpName: item.smtpName,
    sendName: item.sendName,
    smtpHost: item.smtpHost,
    smtpPort: item.smtpPort,
    enableSSL: item.enableSSL,
    userName: item.userName,
    passWord: item.passWord,
    textModel: item.textModel,
  });
};

const connectFormRef = ref();
const openConnect = (item) => {
  connectDialogVisible.value = true;
  dialogConnectTitle.value = "测试邮箱";
  connectForm = reactive({
    smtpId: item.smtpId,
    email: "",
  });
};
let connectDialogVisible = ref(false);
let dialogConnectTitle = ref("测试邮箱");
let connectForm = reactive({
  smtpId: "",
  email: "",
});
const connectFormRules = reactive({
  email: [
    { required: true, message: "请输入收件人邮箱", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
  ],
});
const handleConnectClose = () => {
  proxy.$refs.connectFormRef.resetFields();
  connectDialogVisible.value = false;
  connectForm = reactive({
    smtpId: "",
    email: "",
  });
};
const sendEmail = (connectRef) => {
  connectRef.validate(async (valid) => {
    if (valid) {
      store.commit("system/SET_ISLOADING", true);
      //发送邮件
      const data = {
        email: connectForm.email,
        smtpId: connectForm.smtpId,
      };
      await api.testSmtp(data);
      store.commit("system/SET_ISLOADING", false);
      ElMessage.success({
        message: "发送测试邮件成功",
      });
      handleConnectClose();
    }
  });
};

const deleteSmtp = (item) => {
  ElMessageBox.confirm("此操作会删除该SMTP配置, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    store.commit("system/SET_ISLOADING", true);
    await api.deleteSmtp(item.smtpId);
    store.commit("system/SET_ISLOADING", false);
    ElMessage.success({
      message: "删除SMTP配置成功",
    });
    await getSmtpList();
  });
};
</script>

<style lang="scss" scoped>
.nav-title {
  width: 100%;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: solid 1px #eef0f3;
  .right-title {
    display: flex;
    flex-direction: column;
    margin-left: 20px;
    justify-content: space-around;
    span:nth-child(1) {
      font-size: 26px;
      font-weight: 500;
      color: #5d34b6;
    }
    span:nth-child(2) {
      font-size: 14px;
      color: #8785b7;
    }
  }
}
.card-box {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 20px;
  margin: 0 40px;
  .card {
    width: 30%;
    margin-right: 20px;
    margin-bottom: 20px;
    min-width: 300px;
    .header-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #ffffff;
      font-weight: 500;
      font-size: 16px;
    }
    &::v-deep .el-card__header {
      padding: 12px 12px;
      background: #1c0054;
    }
    .content {
      display: flex;
      flex-wrap: wrap;
      .row-text {
        width: 100%;
        display: flex;
        flex-wrap: nowrap;
        margin-bottom: 15px;
        opacity: 0.9;
        font-size: 14px;
        span:nth-child(1) {
          width: 80px;
          display: inline-block;
          text-align: right;
          margin-right: 10px;
          white-space: nowrap;
        }
      }
      .action-btn {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
<style scoped>
.mail-icon {
  font-size: 60px;
}
.eye-icon {
  font-size: 18px;
  cursor: pointer;
}
</style>