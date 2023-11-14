<template>
  <div class="search-box">
    <el-form :inline="true" :model="searchForm">
      <el-form-item label="用户邮箱：" prop="userEmail">
        <el-input
          v-model="searchForm.userEmail"
          placeholder="请输入用户邮箱"
          style="width: 160px"
        ></el-input>
      </el-form-item>
      <el-form-item label="用户等级：" prop="levelId">
        <el-select v-model="searchForm.levelId">
          <el-option
            v-for="(item, index) in levelOptions"
            :key="index"
            :label="`${item.levelName}-${item.packageName}`"
            :value="item.levelId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户状态：" prop="state">
        <el-select v-model="searchForm.state" style="width: 160px">
          <el-option :value="true" label="启用"></el-option>
          <el-option :value="false" label="禁用"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search" :loading="isLoading"
          >查询</el-button
        >
        <el-button type="info" @click="reset" :loading="isLoading"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
  </div>
  <div class="table-box">
    <el-table
      ref="multipleTableRef"
      :data="tableData"
      height="calc(100vh - 310px)"
      style="width: 100%; border: none"
      :header-cell-style="setHeaderCellStyle"
      border
    >
      <el-table-column
        label="用户名"
        prop="userName"
        min-width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        label="用户邮箱"
        prop="userEmail"
        show-overflow-tooltip
        min-width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        label="用户等级"
        prop="levelId"
        min-width="100"
        align="center"
      >
        <template #default="scope">
          <span>
            {{
              levelOptions.find((item) => item.levelId == scope.row.levelId) &&
              levelOptions.find((item) => item.levelId == scope.row.levelId)
                .levelName
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="用户状态"
        prop="state"
        min-width="100"
        align="center"
      >
        <template #default="scope">
          <el-switch
            v-has="'user_status'"
            :value="scope.row.state"
            @change="switchState(scope.row.state, scope.row.userId)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="注册时间"
        prop="createTime"
        width="200"
        align="center"
      ></el-table-column>
      <el-table-column
        label="最后登录时间"
        prop="lastLoginTime"
        width="200"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" width="160" align="center">
        <template #default="scope">
          <el-button type="primay" text @click="openDetail(scope.row.userId)"
            >详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      v-model:current-page="pageObj.currentPage"
      v-model:page-size="pageObj.pageSize"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageObj.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
  <!--------------------------用户详情弹窗开始------------------------------ -->
  <el-dialog
    v-model="dialogFormVisible"
    :before-close="handleClose"
    title="查看会员信息"
    width="30%"
    top="20vh"
  >
    <el-form
      :model="viewForm"
      ref="viewFormRef"
      label-width="100px"
      label-position="right"
      style="width: 95%"
    >
      <el-form-item label="用户名">
        <span>{{ viewForm.userName }}</span>
      </el-form-item>
      <el-form-item label="邮箱">
        <span>{{ viewForm.userEmail }}</span>
      </el-form-item>
      <el-form-item label="手机号">
        <span>{{ viewForm.mobile }}</span>
      </el-form-item>
      <el-form-item label="用户状态">
        <span>{{ viewForm.state ? "启用" : "禁用" }}</span>
      </el-form-item>
      <el-form-item label="会员等级">
        <span>{{
          levelOptions.find((item) => item.levelId == viewForm.levelId) &&
          levelOptions.find((item) => item.levelId == viewForm.levelId)
            .levelName
        }}</span>
      </el-form-item>
      <el-form-item label="会员截至日期">
        <span>{{ viewForm.validDate }}</span>
      </el-form-item>
      <el-form-item label="账户余额">
        <span>{{ viewForm.remainMoney }}</span>
      </el-form-item>
      <el-form-item label="注册时间">
        <span>{{ viewForm.createTime }}</span>
      </el-form-item>
      <el-form-item label="最后登录时间">
        <span>{{ viewForm.lastLoginTime }}</span>
      </el-form-item>
    </el-form>
    <template #footer> </template>
  </el-dialog>
  <!--------------------------用户详情弹窗结束--------------------------------->
</template>

<script setup>
import { reactive, onMounted, ref, getCurrentInstance, computed } from "vue";
import api from "@/api/member/user.js";
import moment from "moment";
import { ElMessage, ElMessageBox } from "element-plus";
let { proxy } = getCurrentInstance();
import { useStore } from "vuex";
const store = useStore();
let isLoading = computed(() => store.getters.isLoading);
onMounted(() => {
  getUserList();
  getLevelList();
});

const searchForm = reactive({
  levelId: "",
  userEmail: "",
  levelId: "",
  state: "",
});
let tableData = ref([]);

const setHeaderCellStyle = ({ row, column, rowIndex, columnIndex }) => {
  return {
    backgroundColor: "#8052d6",
    fontSize: "18px",
    color: "#ffffff",
    fontWeight: "bold",
    borderRight: "solid 1px #b5c4f4",
    borderBottom: "solid 1px #b5c4f4",
  };
};
const pageObj = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
});
const handleSizeChange = (val) => {
  pageObj.pageSize = val;
  getUserList();
};
const handleCurrentChange = (val) => {
  pageObj.currentPage = val;
  getUserList();
};
const getUserList = async () => {
  const query = {
    levelId: searchForm.levelId,
    userEmail: searchForm.userEmail,
    state: searchForm.state,
    currentPage: pageObj.currentPage,
    pageSize: pageObj.pageSize,
  };
  store.commit("system/SET_ISLOADING", true);
  let { list, page } = await api.getUserList(query);
  store.commit("system/SET_ISLOADING", false);
  pageObj.total = page.total;
  tableData.value = list;
  tableData.value.forEach((item) => {
    item.createTime = moment(new Date(item.createTime)).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    item.lastLoginTime = moment(new Date(item.lastLoginTime)).format(
      "YYYY-MM-DD HH:mm:ss"
    );
  });
};
const search = () => {
  pageObj.currentPage = 1;
  pageObj.pageSize = 10;
  pageObj.total = 0;
  getUserList();
};
const reset = () => {
  searchForm.levelId = "";
  searchForm.userEmail = "";
  searchForm.state = "";
  search();
};
let dialogFormVisible = ref(false);
let viewForm = reactive({
  userId: "",
  userName: "",
  userEmail: "",
  mobile: "",
  state: "",
  levelId: "",
  validDate: "",
  remainMoney: "",
  createTime: "",
  lastLoginTime: "",
});

let levelOptions = ref([]);
const handleClose = () => {
  dialogFormVisible.value = false;
  viewForm = reactive({
    userId: "",
    userName: "",
    userEmail: "",
    mobile: "",
    state: "",
    levelId: "",
    validDate: "",
    remainMoney: "",
    createTime: "",
    lastLoginTime: "",
  });
};

const switchState = async (state, userId) => {
  const data = {
    userId,
    state: !state,
  };
  await api.switchState(data);
  ElMessage.success("用户状态切换成功");
  getUserList();
};
const getLevelList = async () => {
  levelOptions.value = await api.getLevelList();
};
const openDetail = async (userId) => {
  const query = {
    userId,
  };
  const data = await api.getUserInfo(query);
  console.log(data);
  viewForm = reactive({
    userId: data.userId,
    userName: data.userName,
    userEmail: data.userEmail,
    mobile: data.mobile,
    state: data.state,
    levelId: data.levelId,
    validDate: moment(new Date(data.validDate)).format("YYYY-MM-DD HH:mm:ss"),
    remainMoney: data.remainMoney,
    createTime: moment(new Date(data.createTime)).format("YYYY-MM-DD HH:mm:ss"),
    lastLoginTime: moment(new Date(data.lastLoginTime)).format(
      "YYYY-MM-DD HH:mm:ss"
    ),
  });
  dialogFormVisible.value = true;
};
</script>

<style lang="scss" scoped>
.search-box {
  padding: 20px;
  padding-bottom: 0px;
  border-bottom: solid 1px #eef0f3;
}
.action-btn {
  display: flex;
  padding: 20px;
}
.table-box {
  padding: 20px;
  padding-top: 0px;
  .pagination {
    float: right;
    margin-top: 20px;
    margin-right: 20px;
  }
}
</style>
