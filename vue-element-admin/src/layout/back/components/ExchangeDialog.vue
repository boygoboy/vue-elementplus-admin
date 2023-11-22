<template>
  <div>
    <el-dialog
      v-model="dialogFormVisible"
      :before-close="handleClose"
      title="会员兑换"
      width="30%"
      top="20vh"
    >
      <el-form
        :model="exchangeForm"
        ref="exchangeFormRef"
        label-width="100px"
        label-position="right"
        style="width: 95%"
        :rules="exchangeFormRules"
      >
        <el-form-item label="兑换码" prop="redeemCode">
          <el-input v-model="exchangeForm.redeemCode"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="info" @click="handleClose">取消</el-button>
          <el-button
            :loading="isLoading"
            type="primary"
            style="margin-left: 20px"
            @click="submitExchange"
          >
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, getCurrentInstance, toRefs } from "vue";
import moment from "moment";
import api from "@/api/system/user.js";
import { ElMessage, ElNotification } from "element-plus";
let { proxy } = getCurrentInstance();
import { useStore } from "vuex";
const store = useStore();
let isLoading = computed(() => store.getters.isLoading);

const props = defineProps({
  dialogFormVisible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["closeDialog"]);

let { dialogFormVisible } = { ...toRefs(props) };
let exchangeForm = reactive({
  redeemCode: "",
});
const exchangeFormRules = {
  redeemCode: [{ required: true, message: "请输入兑换码", trigger: "blur" }],
};
const handleClose = () => {
  emit("closeDialog", false);
  exchangeForm = reactive({
    redeemCode: "",
  });
  proxy.$refs.exchangeFormRef.resetFields();
};
const submitExchange = () => {
  proxy.$refs.exchangeFormRef.validate(async (valid) => {
    if (valid) {
      store.commit("system/SET_ISLOADING", true);
      const data = {
        redeemCode: exchangeForm.redeemCode,
      };
      let {
        cardType,
        carryDays,
        levelName,
        packageName,
        rechargeamount,
        remainMoney,
        validDate,
        userInfo,
      } = await api.exchangeMember(data);

      store.commit("system/SET_ISLOADING", false);
      handleClose();
      if (cardType == "充值卡") {
        ElNotification.success({
          title: `${cardType}兑换成功`,
          dangerouslyUseHTMLString: true,
          message: `<div><span>套餐名称：${packageName}</span></div>
        <div><span>充值金额：${rechargeamount}$</span></div>
        <div><span>剩余金额：${remainMoney + rechargeamount}$</span></div>`,
          duration: 6000,
          showClose: false,
        });
      } else {
        store.commit("user/SAVE_USER_INFO", userInfo);
        await store.dispatch("user/loadRouterList");
        location.reload();
        setTimeout(() => {
          ElNotification.success({
            title: `${levelName}${cardType}兑换成功`,
            dangerouslyUseHTMLString: true,
            message: `<div><span>套餐名称：${packageName}</span></div>
        <div><span>充值金额：${rechargeamount}$</span></div>
        <div><span>剩余金额：${remainMoney + rechargeamount}$</span></div>
        <div><span>结转天数：${carryDays}天</span></div>
        <div><span>有效期至：${moment(validDate).format(
          "YYYY-MM-DD HH:mm:ss"
        )}</span></div>`,
            duration: 6000,
            showClose: false,
          });
        }, 300);
      }
    }
  });
};
</script>

<style lang="scss" scoped></style>
<style scoped></style>
