<template>
  <div class="search-box">
    <el-form :inline="true" :model="searchForm">
      <el-form-item label="用户名称：" prop="username">
        <el-input
          v-model="searchForm.userName"
          placeholder="请输入用户名称"
          style="width: 160px"
        ></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱：" prop="userEmail">
        <el-input
          v-model="searchForm.userEmail"
          placeholder="请输入用户邮箱"
          style="width: 160px"
        ></el-input>
      </el-form-item>
      <el-form-item label="用户状态：" prop="state">
        <el-select v-model="searchForm.state" style="width: 160px">
          <el-option :value="true" label="启用"></el-option>
          <el-option :value="false" label="禁用"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="info" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="action-btn">
    <el-button type="primary" style="margin-right: 10px" @click="addUser"
      >新增</el-button
    >
    <el-button type="info" :disabled="!userIds.length" @click="deleteUser"
      >批量删除</el-button
    >
  </div>
  <div class="table-box">
    <el-table
      ref="multipleTableRef"
      :data="tableData"
      height="calc(100vh - 310px)"
      style="width: 100%; border: none"
      :header-cell-style="setHeaderCellStyle"
      @selection-change="handleSelectionChange"
      border
    >
      <el-table-column type="selection" width="55" />
      <el-table-column
        label="用户名"
        prop="userName"
        min-width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        label="用户邮箱"
        prop="userEmail"
        min-width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        label="用户角色"
        prop="roleList"
        min-width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        label="用户状态"
        prop="state"
        min-width="100"
        align="center"
      >
        <template #default="scope">
          <el-switch
            :value="scope.row.state"
            @change="switchState(scope.row.state, scope.row.userId)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="注册时间"
        prop="createTime"
        min-width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        label="最后登录时间"
        prop="lastLoginTime"
        min-width="100"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" width="160" align="center">
        <template #default="scope">
          <el-button type="primay" text @click="editUser(scope.row)"
            >编辑</el-button
          >
          <el-button type="danger" text @click="deleteUser(scope.row)"
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
  <!--------------------------用户新增弹出开始------------------------------ -->
  <el-dialog
    v-model="dialogFormVisible"
    :before-close="handleClose"
    :title="dialogTitle"
    width="30%"
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
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="addForm.userName" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="邮箱" prop="userEmail">
        <el-input v-model="addForm.userEmail" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="addForm.mobile" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="系统角色" prop="roleList">
        <el-select
          style="width: 100%"
          v-model="addForm.roleList"
          multiple
          collapse-tags
          placeholder="请选择系统角色"
        >
          <el-option
            v-for="item in roleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="密码" prop="userPwd">
        <el-input
          v-model="addForm.userPwd"
          type="password"
          show-password
          placeholder="请输入密码"
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="userRepeatPwd">
        <el-input
          :disabled="!addForm.userPwd"
          v-model="addForm.userRepeatPwd"
          type="password"
          show-password
          placeholder="请输入确认密码"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose(addFormRef)" type="info">取消</el-button>
        <el-button
          type="primary"
          style="margin-left: 20px"
          @click="submitAddUser(addFormRef)"
        >
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
  <!--------------------------用户新增弹窗结束--------------------------------->
</template>

<script setup>
import { reactive, onMounted, ref } from "vue";
import api from "@/api/system/user.js";
import moment from "moment";
import { ElMessage } from "element-plus";
import { ElMessageBox } from "element-plus";
onMounted(() => {
  getUserList();
});

const searchForm = reactive({
  userName: "",
  userEmail: "",
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
let userIds = ref([]);
const handleSelectionChange = (rows) => {
  userIds.value = [];
  userIds.value = rows.map((item) => item.userId);
};
const deleteUser = (row) => {
  ElMessageBox.confirm("此操作会删除用户, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    if (row) {
      userIds.value = [row.userId];
    }
    await api.deleteUsers(userIds.value);
    ElMessage.success({
      message: "删除用户成功!",
    });
    search();
  });
};
const pageObj = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
});
const handleSizeChange = (val) => {};
const handleCurrentChange = (val) => {};
const getUserList = async () => {
  const query = {
    userName: searchForm.userName,
    userEmail: searchForm.userEmail,
    state: searchForm.state,
    currentPage: pageObj.currentPage,
    pageSize: pageObj.pageSize,
  };
  let { list, page } = await api.getUserList(query);
  tableData.value = list;
  tableData.value.forEach((item) => {
    item.createTime = moment(new Date(item.createTime)).format("YYYY-MM-DD");
    item.lastLoginTime = moment(new Date(item.lastLoginTime)).format(
      "YYYY-MM-DD"
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
  searchForm.userName = "";
  searchForm.userEmail = "";
  searchForm.state = "";
  search();
};
let dialogTitle = ref("");
const addUser = () => {
  dialogTitle.value = "新增用户";
  dialogFormVisible.value = true;
};
let dialogFormVisible = ref(false);
const addForm = reactive({
  userName: "",
  userEmail: "",
  mobile: "",
  userPwd: "",
  userRepeatPwd: "",
  roleList: [],
});
const checkEmail = (rule, value, callback) => {
  console.log("test");
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
    if (value != addForm.userPwd) {
      callback(new Error("密码不一致"));
    } else {
      callback();
    }
  }
};

const addFormRules = reactive({
  userName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  userEmail: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { validator: checkEmail, trigger: "blur" },
  ],
  mobile: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { validator: checkMobile, trigger: "blur" },
  ],
  roleList: [{ required: true, message: "请选择系统角色", trigger: "change" }],
  userPwd: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      pattern:
        /^([a-zA-Z]+[0-9]+[,._!@#$%^&*]+)|([a-zA-Z]+[,._!@#$%^&*]+[0-9]+)|([0-9]+[,._!@#$%^&*]+[a-zA-Z]+)|([0-9]+[a-zA-Z]+[,._!@#$%^&*]+)|([,._!@#$%^&*]+[a-zA-Z]+[0-9]+)|([,._!@#$%^&*]+[0-9]+[a-zA-Z]+)$/,
      message: "密码必须包含数字，字母和特殊符号",
      trigger: "blur",
    },
  ],
  userRepeatPwd: [
    { required: true, message: "请输入确认密码", trigger: "blur" },
    { validator: checkRepeatPwd, trigger: "blur" },
  ],
});
let roleOptions = ref([]);
const handleClose = (addFormRef) => {
  dialogFormVisible.value = false;
  addFormRef.resetFields();
};
const addFormRef = ref();
const submitAddUser = (addFormRef) => {
  addFormRef.validate(async (valid) => {
    if (valid) {
      const data = {
        userName: addForm.userName,
        userEmail: addForm.userEmail,
        mobile: addForm.mobile,
        roleList: addForm.roleList,
        userPwd: addForm.userPwd,
      };
      if (addForm.userId) {
        data.userId = addForm.userId;
        await api.editUser(data);
        ElMessage.success("用户编辑成功");
        handleClose(addFormRef);
        search();
      } else {
        await api.addUser(data);
        ElMessage.success("用户新增成功");
        handleClose(addFormRef);
        search();
      }
    }
  });
};

const editUser = (row) => {
  dialogFormVisible.value = true;
  dialogTitle.value = "编辑用户";
  addForm.userId = row.userId;
  addForm.userName = row.userName;
  addForm.userEmail = row.userEmail;
  addForm.mobile = row.mobile;
  addForm.roleList = row.roleList;
  addForm.userPwd = row.userPwd;
  addForm.userRepeatPwd = row.userPwd;
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
