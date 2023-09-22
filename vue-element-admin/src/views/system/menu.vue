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
    <el-button type="primary" style="margin-right: 10px" @click="openMenu('1')"
      >新增</el-button
    >
  </div>
  <div class="table-box">
    <el-table
      ref="multipleTableRef"
      row-key="_id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :data="tableData"
      height="calc(100vh - 260px)"
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
        min-width="80"
        align="center"
      ></el-table-column>
      <el-table-column
        label="菜单类型"
        prop="menuType"
        width="100"
        align="center"
      >
        <template #default="scope">
          {{ scope.row.menuType == 1 ? "菜单" : "按钮" }}
        </template>
      </el-table-column>
      <el-table-column
        label="权限标识"
        prop="menuCode"
        min-width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        label="菜单地址"
        prop="path"
        min-width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        label="接口路由"
        prop="apiPath"
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
        min-width="70"
        align="center"
      ></el-table-column>
      <el-table-column
        label="创建时间"
        prop="createTime"
        width="200"
        align="center"
      >
        <template #default="scope">
          {{
            moment(new Date(scope.row.createTime).toLocaleString()).format(
              "yyyy-MM-DD HH:mm:ss"
            )
          }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" align="center">
        <template #default="scope">
          <el-button
            type="primay"
            :disabled="scope.row.menuType == 2"
            text
            @click="openMenu('2', scope.row)"
            >新增</el-button
          >
          <el-divider direction="vertical" />
          <el-button type="primay" text @click="openMenu('3', scope.row)"
            >编辑</el-button
          >
          <el-divider direction="vertical" />
          <el-button type="danger" text @click="deleteMenu(scope.row)"
            >删除</el-button
          >
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
            :disabled="addForm._id != ''"
            v-model="addForm.parentId"
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
        <el-radio-group
          @change="changeMenuType"
          v-model="addForm.menuType"
          :disabled="addForm._id != ''"
        >
          <el-radio :label="1">菜单</el-radio>
          <el-radio :label="2">按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        :label="`${addForm.menuType == 1 ? '菜单' : '按钮'}名称`"
        prop="menuName"
      >
        <el-input
          v-model="addForm.menuName"
          :placeholder="`请输入${addForm.menuType == 1 ? '菜单' : '按钮'}名称`"
        />
      </el-form-item>
      <el-form-item
        label="权限标识"
        prop="menuCode"
        v-if="addForm.menuType == 2"
      >
        <el-input v-model="addForm.menuCode" placeholder="请输入权限标识" />
      </el-form-item>
      <el-form-item label="菜单图标" prop="icon" v-if="addForm.menuType == 1">
        <el-input v-model="addForm.icon" placeholder="请输入菜单图标" />
      </el-form-item>
      <el-form-item label="路由地址" prop="path" v-if="addForm.menuType == 1">
        <el-input v-model="addForm.path" placeholder="请输入路由地址" />
      </el-form-item>
      <el-form-item
        label="接口路由"
        prop="apiPath"
        v-if="addForm.menuType == 2"
      >
        <el-input v-model="addForm.apiPath" placeholder="请输入接口路由地址" />
      </el-form-item>
      <el-form-item
        label="组件路径"
        prop="component"
        v-if="addForm.menuType == 1"
      >
        <el-input v-model="addForm.component" placeholder="请输入组件路径" />
      </el-form-item>
      <el-form-item
        label="菜单状态"
        prop="menuState"
        v-if="addForm.menuType == 1"
      >
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
          :loading="isLoading"
          type="primary"
          style="margin-left: 20px"
          @click="submitMenu(addFormRef)"
        >
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
  <!--------------------------菜单新增弹窗结束--------------------------------->
</template>

<script setup>
import { reactive, onMounted, ref, getCurrentInstance, computed } from "vue";
import { useStore } from "vuex";
import api from "@/api/system/menu.js";
import moment from "moment";
import { ElMessage } from "element-plus";
import { ElMessageBox } from "element-plus";
import mockdata from "@/mock/menus/menus.json";
let { proxy } = getCurrentInstance();
const store = useStore();
let isLoading = computed(() => store.getters.isLoading);
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

onMounted(async () => {
  await search();
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

const search = async () => {
  const query = {
    menuName: searchForm.menuName,
    menuState: searchForm.menuState,
  };
  store.commit("system/SET_ISLOADING", true);
  tableData.value = await api.getMenuList(query);
  store.commit("system/SET_ISLOADING", false);
};
const reset = () => {
  searchForm.menuName = "";
  searchForm.menuState = "";
  tableData.value = [];
  search();
};
let dialogTitle = ref("");

let dialogFormVisible = ref(false);
let addForm = reactive({
  _id: "",
  parentId: [null],
  menuType: 1,
  menuName: "",
  menuCode: "",
  icon: "",
  path: "",
  apiPath: "",
  component: "",
  menuState: "正常",
});
const openMenu = (tag, row) => {
  dialogTitle.value = "新增菜单";
  dialogFormVisible.value = true;
  proxy.$nextTick(() => {
    proxy.$refs.addFormRef.resetFields();
  });
  if (tag == "2" && row) {
    proxy.$nextTick(() => {
      addForm.parentId = [...row.parentId, row._id].filter((item) => item);
    });
  }
  if (tag == "3" && row) {
    dialogTitle.value = "编辑菜单";
    addForm._id = row._id;
    if (row.menuType == 1) {
      proxy.$nextTick(() => {
        addForm.parentId = [...row.parentId].filter(
          (item) => item == null || item
        );
      });
    } else {
      proxy.$nextTick(() => {
        addForm.parentId = [...row.parentId].filter(
          (item) => item == null || item
        );
      });
    }
    proxy.$nextTick(() => {
      addForm.menuType = row.menuType;
      addForm.menuName = row.menuName;
      addForm.menuCode = row.menuCode;
      addForm.icon = row.icon;
      addForm.path = row.path;
      addForm.component = row.component;
      addForm.menuState = row.menuState;
      addForm.apiPath = row.apiPath;
    });
  }
};
const addFormRules = reactive({
  menuType: [{ required: true, message: "请选择菜单类型", trigger: "change" }],
  menuName: [
    {
      required: true,
      message: `请输入名称`,
      trigger: "blur",
    },
    { min: 2, max: 6, message: "长度在 2 到 6 个字符", trigger: "blur" },
  ],
  menuCode: [{ required: true, message: "请输入权限标识", trigger: "blur" }],
  path: [{ required: true, message: "请输入路由地址", trigger: "blur" }],
  apiPath: [{ required: true, message: "请输入接口路由地址", trigger: "blur" }],
  menuState: [{ required: true, message: "请选择菜单状态", trigger: "change" }],
});

const handleClose = () => {
  dialogFormVisible.value = false;
  addForm = reactive({
    _id: "",
    parentId: [null],
    menuType: 1,
    menuName: "",
    menuCode: "",
    icon: "",
    path: "",
    apiPath: "",
    component: "",
    menuState: "正常",
  });
  isLoading.value = false;
  proxy.$refs.addFormRef.resetFields();
  store.commit("system/SET_ISLOADING", false);
  search();
};
const addFormRef = ref();
const submitMenu = (formRef) => {
  formRef.validate(async (valid) => {
    if (valid) {
      const data = {
        menuType: addForm.menuType,
        menuName: addForm.menuName,
        menuCode: addForm.menuCode,
        icon: addForm.icon,
        path: addForm.path,
        apiPath: addForm.apiPath,
        component: addForm.component,
        menuState: addForm.menuState,
        parentId: addForm.parentId,
      };
      if (addForm.menuType == 1) {
        data.apiPath = "";
        data.menuCode = "";
      } else {
        data.path = "";
        data.icon = "";
        data.component = "";
      }
      if (addForm._id) {
        data._id = addForm._id;
        store.commit("system/SET_ISLOADING", true);
        await api.editMenu(data);
        ElMessage.success("编辑菜单成功");
        handleClose();
      } else {
        store.commit("system/SET_ISLOADING", true);
        await api.addMenu(data);
        ElMessage.success("新增菜单成功");
        handleClose();
      }
    }
  });
};
const deleteMenu = (row) => {
  ElMessageBox.confirm(
    `此操作会删除此${row.menuType == 1 ? "菜单" : "按钮"}, 是否继续?`,
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  ).then(async () => {
    await api.deleteMenu(row._id);
    ElMessage.success({
      message: "删除菜单成功!",
    });
    search();
  });
};
const changeMenuType = () => {
  addForm.menuCode = "";
  addForm.icon = "";
  addForm.apiPath = "";
  addForm.path = "";
  addForm.component = "";
  addForm.menuName = "";
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
<style scoped>
.info-icon {
  font-size: 22px;
  margin-left: 5px;
}
</style>
