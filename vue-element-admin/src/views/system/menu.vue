<template>
  <div class="search-box">
    <el-form :inline="true" :model="searchForm">
      <el-form-item label="菜单名称：" prop="username">
        <el-input
          v-model="searchForm.menuName"
          placeholder="请输入菜单名称"
          style="width: 160px"
        ></el-input>
      </el-form-item>
      <el-form-item label="菜单状态：" prop="menuState">
        <el-select v-model="searchForm.menuState">
          <el-option label="正常" value="正常"></el-option>
          <el-option label="下线" value="下线"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="info" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="action-btn">
    <el-button
      type="primary"
      style="margin-right: 10px"
      @click="addMenu('father')"
      >新增</el-button
    >
  </div>
  <div class="table-box">
    <el-table
      ref="multipleTableRef"
      row-key="_id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :data="tableData"
      height="calc(100vh - 310px)"
      style="width: 100%; border: none"
      :header-cell-style="setHeaderCellStyle"
      border
    >
      <el-table-column
        label="菜单名称"
        prop="menuName"
        min-width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        label="图标"
        prop="icon"
        min-width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        label="菜单类型"
        prop="menuType"
        min-width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        label="权限标识"
        prop="menuCode"
        min-width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        label="路由地址"
        prop="path"
        min-width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        label="组件路径"
        prop="component"
        min-width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        label="菜单状态"
        prop="menuState"
        min-width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        label="创建时间"
        prop="createTime"
        min-width="100"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" width="160" align="center">
        <template #default="scope">
          <el-button type="primay" text>新增</el-button>
          <el-divider direction="vertical" />
          <el-button type="primay" text>编辑</el-button>
          <el-divider direction="vertical" />
          <el-button type="danger" text>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!--------------------------菜单新增弹出开始------------------------------ -->
  <el-dialog
    v-model="dialogFormVisible"
    :before-close="handleClose"
    :title="dialogTitle"
    width="28%"
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
      <el-form-item label="父级菜单" prop="parentId">
        <div style="display: flex; align-items: center; width: 100%">
          <el-cascader
            style="width: 100%"
            :options="tableData"
            :props="{ checkStrictly: true, label: 'menuName', value: '_id' }"
            clearable
          />
          <el-tooltip
            effect="light"
            content="不选，则直接创建一级菜单"
            placement="right-start"
          >
            <el-icon class="info-icon">
              <InfoFilled />
            </el-icon>
          </el-tooltip>
        </div>
      </el-form-item>
      <el-form-item label="菜单类型" prop="menuType">
        <el-radio-group v-model="addForm.menuType">
          <el-radio :label="1">菜单</el-radio>
          <el-radio :label="2">按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="菜单名称" prop="menuName">
        <el-input v-model="addForm.menuName" placeholder="请输入菜单名称" />
      </el-form-item>
      <el-form-item label="菜单图标" prop="icon">
        <el-input v-model="addForm.icon" placeholder="请输入菜单图标" />
      </el-form-item>
      <el-form-item label="路由地址" prop="path">
        <el-input v-model="addForm.path" placeholder="请输入路由地址" />
      </el-form-item>
      <el-form-item label="组件路径" prop="component">
        <el-input v-model="addForm.component" placeholder="请输入组件路径" />
      </el-form-item>
      <el-form-item label="菜单状态" prop="menuState">
        <el-radio-group v-model="addForm.menuState">
          <el-radio label="正常">正常</el-radio>
          <el-radio label="下线">下线</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose" type="info">取消</el-button>
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
  <!--------------------------菜单新增弹窗结束--------------------------------->
</template>

<script setup>
import { reactive, onMounted, ref, getCurrentInstance } from "vue";
import api from "@/api/system/menu.js";
import moment from "moment";
import { ElMessage } from "element-plus";
import { ElMessageBox } from "element-plus";
import mockdata from "@/mock/menus/menus.json";
let { proxy } = getCurrentInstance();
const formatTableData = (data) => {
  data.forEach((item) => {
    if (item.menuType == "1") {
      item.disabled = false;
    } else {
      item.disabled = true;
    }
    if (item.children && item.children.length > 0) {
      formatTableData(item.children);
    }
  });
};

onMounted(() => {
  tableData.value = mockdata;
  formatTableData(tableData.value);
});

const searchForm = reactive({});
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

const search = () => {};
const reset = () => {};
let dialogTitle = ref("");

let dialogFormVisible = ref(false);
const addForm = reactive({
  parentId: [null],
  menuType: 1,
});
const addMenu = (type) => {
  dialogTitle.value = "新增菜单";
  if (type == "father") {
    dialogFormVisible.value = true;
  } else {
  }
};
const addFormRules = reactive({});

const handleClose = () => {
  dialogFormVisible.value = false;
  proxy.$refs.addFormRef.resetFields();
};
const addFormRef = ref();
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
<style scoped>
.info-icon {
  font-size: 22px;
  margin-left: 5px;
}
</style>
