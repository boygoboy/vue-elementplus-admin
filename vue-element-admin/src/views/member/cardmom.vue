<template>
  <div class="search-box">
    <el-form :inline="true" :model="searchForm">
      <el-form-item label="卡密编号：" prop="cardNo">
        <el-input
          v-model="searchForm.cardNo"
          placeholder="请输入卡密编号"
          style="width: 160px"
        ></el-input>
      </el-form-item>
      <el-form-item label="卡密等级：" prop="cardLevel">
        <el-select v-model="searchForm.cardLevel" style="width: 140px">
          <el-option
            v-for="(item, index) in levelOptions"
            :key="index"
            :label="`${item.levelName}-${item.packageName}`"
            :value="item.levelId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="卡密类型：" prop="cardType">
        <el-select v-model="searchForm.cardRange" style="width: 130px">
          <el-option value="week" label="周卡"></el-option>
          <el-option value="month" label="月卡"></el-option>
          <el-option value="quarter" label="季卡"></el-option>
          <el-option value="year" label="年卡"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="卡密状态：" prop="cardState">
        <el-select v-model="searchForm.cardState" style="width: 130px">
          <el-option value="未使用" label="未使用"></el-option>
          <el-option value="已使用" label="已使用"></el-option>
          <el-option value="已过期" label="已过期"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="失效日期：" prop="expirationDate">
        <el-date-picker
          v-model="searchForm.expirationDate"
          type="date"
          placeholder="请选择日期"
        />
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
  <div class="action-btn">
    <el-button type="primary" style="margin-right: 10px" @click="openCreate"
      >创建</el-button
    >
    <el-button
      type="primary"
      style="margin-right: 10px"
      @click="openBatchCreate"
      >批量创建</el-button
    >
    <el-button :loading="isLoading" type="info">批量删除</el-button>
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
      <el-table-column type="selection" width="55" />
      <el-table-column
        label="卡密编号"
        prop="cardNo"
        min-width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        label="卡密等级"
        prop="cardLevel"
        min-width="100"
        align="center"
      >
        <template #default="scope">
          <span>
            {{
              levelOptions.find(
                (item) => item.levelId == scope.row.cardLevel
              ) &&
              levelOptions.find((item) => item.levelId == scope.row.cardLevel)
                .levelName
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="卡密类型"
        prop="cardType"
        show-overflow-tooltip
        min-width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        label="卡密状态"
        prop="cardState"
        min-width="100"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="失效日期"
        prop="expirationDate"
        width="200"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" width="160" align="center">
        <template #default="scope">
          <el-button
            type="danger"
            text
            @click="deleteUser(scope.row.userId)"
            v-has="'member_user_delete'"
            >删除</el-button
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
  <!--------------------------卡密创建弹窗开始------------------------------ -->
  <el-dialog
    v-model="dialogFormVisible"
    :before-close="handleClose"
    title="创建会员卡密"
    width="30%"
    top="20vh"
  >
    <el-form
      :model="addForm"
      ref="viewFormRef"
      label-width="100px"
      label-position="right"
      style="width: 95%"
    >
      <el-form-item label="卡密编号">
        <el-input v-model="addForm.cardNo" disabled></el-input>
      </el-form-item>
      <el-form-item label="卡密等级" prop="cardLevel">
        <el-select v-model="addForm.cardLevel" style="width: 100%">
          <el-option
            v-for="(item, index) in levelOptions"
            :key="index"
            :label="`${item.levelName}-${item.packageName}`"
            :value="item.levelId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="卡密类型" prop="cardType">
        <el-select v-model="addForm.cardType" style="width: 100%">
          <el-option value="week" label="周卡"></el-option>
          <el-option value="month" label="月卡"></el-option>
          <el-option value="quarter" label="季卡"></el-option>
          <el-option value="year" label="年卡"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="失效日期" prop="expirationDate">
        <el-date-picker
          style="width: 100%"
          v-model="addForm.expirationDate"
          type="date"
          placeholder="请选择日期"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="info" @click="handleClose">取消</el-button>
        <el-button
          :loading="isLoading"
          type="primary"
          style="margin-left: 20px"
        >
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
  <!--------------------------卡密创建弹窗结束--------------------------------->
  <!--------------------------批量创建卡密弹窗开始------------------------------>
  <el-dialog
    v-model="dialogBatchFormVisible"
    :before-close="handleBatchClose"
    title="批量创建会员卡密"
    width="30%"
    top="20vh"
  >
    <el-form
      :model="addBatchForm"
      ref="viewFormRef"
      label-width="100px"
      label-position="right"
      style="width: 95%"
    >
      <el-form-item label="卡密数量" prop="cardNum">
        <el-input-number
          :min="1"
          style="width: 100%"
          v-model="addBatchForm.cardNum"
          :step="1"
          step-strictly
        />
      </el-form-item>
      <el-form-item label="卡密等级" prop="cardLevel">
        <el-select v-model="addBatchForm.cardLevel" style="width: 100%">
          <el-option
            v-for="(item, index) in levelOptions"
            :key="index"
            :label="`${item.levelName}-${item.packageName}`"
            :value="item.levelId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="卡密类型" prop="cardType">
        <el-select v-model="addBatchForm.cardType" style="width: 100%">
          <el-option value="week" label="周卡"></el-option>
          <el-option value="month" label="月卡"></el-option>
          <el-option value="quarter" label="季卡"></el-option>
          <el-option value="year" label="年卡"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="失效日期" prop="expirationDate">
        <el-date-picker
          style="width: 100%"
          v-model="addBatchForm.expirationDate"
          type="date"
          placeholder="请选择日期"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="info" @click="handleBatchClose">取消</el-button>
        <el-button
          :loading="isLoading"
          type="primary"
          style="margin-left: 20px"
        >
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
  <!--------------------------批量创建卡密弹窗结束------------------------------>
</template>

<script setup>
import { reactive, onMounted, ref, getCurrentInstance, computed } from "vue";
import api from "@/api/member/card.js";
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
let addForm = reactive({
  cardNo: "",
  cardLevel: "",
  cardType: "",
  expirationDate: "",
});

const openCreate = () => {
  dialogFormVisible.value = true;
  addForm = reactive({
    cardNo: "",
    cardLevel: "",
    cardType: "",
    expirationDate: "",
  });
};

let levelOptions = ref([]);
const handleClose = () => {
  dialogFormVisible.value = false;
  addForm = reactive({
    cardNo: "",
    cardLevel: "",
    cardType: "",
    expirationDate: "",
  });
};

let dialogBatchFormVisible = ref(false);
let addBatchForm = reactive({
  cardNum: 1,
  cardLevel: "",
  cardType: "",
  expirationDate: "",
});
const openBatchCreate = () => {
  dialogBatchFormVisible.value = true;
  addBatchForm = reactive({
    cardNum: 1,
    cardLevel: "",
    cardType: "",
    expirationDate: "",
  });
};
const handleBatchClose = () => {
  dialogBatchFormVisible.value = false;
  addBatchForm = reactive({
    cardNum: 1,
    cardLevel: "",
    cardType: "",
    expirationDate: "",
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

const deleteUser = async (userId) => {
  ElMessageBox.confirm("此操作将永久删除该用户, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    await api.deleteUser(userId);
    ElMessage.success("用户删除成功");
    getUserList();
  });
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
