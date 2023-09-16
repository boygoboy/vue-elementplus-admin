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
          <el-option value="enable" label="启用"></el-option>
          <el-option value="diaabled" label="禁用"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="action-btn">
    <el-button type="primary" style="margin-right: 10px">新增</el-button>
    <el-button type="danger">批量删除</el-button>
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
        label="用户ID"
        prop="userId"
        min-width="100"
        align="center"
      ></el-table-column>
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
        prop="role"
        min-width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        label="用户状态"
        prop="state"
        min-width="100"
        align="center"
      ></el-table-column>
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
          <el-button type="primay" text>编辑</el-button>
          <el-button type="danger" text>删除</el-button>
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
</template>

<script setup>
import { reactive } from "vue";
import api from "@/api/system/user.js";

const searchForm = reactive({
  userName: "",
  userEmail: "",
  state: "",
});
const tableData = reactive([{}]);

const setHeaderCellStyle = ({ row, column, rowIndex, columnIndex }) => {
  return {
    backgroundColor: "#6b89e9",
    fontSize: "18px",
    color: "#ffffff",
    fontWeight: "bold",
    borderRight: "solid 1px #b5c4f4",
    borderBottom: "solid 1px #b5c4f4",
  };
};
const handleSelectionChange = (rows) => {};
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
  };
  let result = await api.getUserList(query);
  this.tableData = result;
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
