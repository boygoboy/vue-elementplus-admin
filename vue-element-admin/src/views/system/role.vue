<template>
  <div class="search-box">
    <el-form :inline="true" :model="searchForm">
      <el-form-item label="角色名称：" prop="roleName">
        <el-input
          v-model="searchForm.roleName"
          placeholder="请输入角色名称"
          style="width: 160px"
        ></el-input>
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
    <el-button
      type="primary"
      style="margin-right: 10px"
      @click="addRole"
      v-has="'role_create'"
      >创建</el-button
    >
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
        label="角色名称"
        prop="roleName"
        min-width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        label="备注"
        prop="remark"
        min-width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        label="更新时间"
        prop="updateTime"
        width="200"
        align="center"
      ></el-table-column>
      <el-table-column
        label="创建时间"
        prop="createTime"
        width="200"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template #default="scope">
          <el-button
            type="primay"
            text
            @click="editRole(scope.row)"
            v-has="'role_edit'"
            >编辑</el-button
          >
          <el-button
            type="primay"
            text
            @click="setPermission(scope.row)"
            v-has="'role_setting'"
            >设置权限</el-button
          >
          <el-button
            type="danger"
            text
            @click="deleteRole(scope.row.roleId)"
            v-has="'role_delete'"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      v-model:current-page="pageObj.currentPage"
      v-model:page-size="pageObj.pageSize"
      :page-sizes="[15, 30, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageObj.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
  <!--------------------------角色创建弹窗出开始------------------------------ -->
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
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="addForm.roleName" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="addForm.remark"
          type="textarea"
          placeholder="请输入备注"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose" type="info">取消</el-button>
        <el-button
          :loading="isLoading"
          type="primary"
          style="margin-left: 20px"
          @click="submitAddRole(addFormRef)"
        >
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
  <!--------------------------角色创建弹窗结束--------------------------------->
  <!--------------------------设置权限弹窗开始----------------------------------->
  <el-dialog
    v-model="dialogPermissionFormVisible"
    :before-close="handlePermissionClose"
    :title="dialogPermissionTitle"
    width="30%"
    top="15vh"
  >
    <el-form
      :model="addPermissionForm"
      ref="addPermissionFormRef"
      label-width="100px"
      label-position="right"
      style="width: 95%"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="addPermissionForm.roleName" disabled />
      </el-form-item>
      <el-form-item label="权限选择">
        <el-tree
          ref="treeRef"
          :data="menuList"
          show-checkbox
          default-expand-all
          node-key="_id"
          highlight-current
          :props="{ children: 'children', label: 'menuName' }"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handlePermissionClose" type="info">取消</el-button>
        <el-button
          :loading="isLoading"
          type="primary"
          style="margin-left: 20px"
          @click="submitPermission(addPermissionFormRef)"
        >
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
  <!--------------------------设置权限弹窗结束---------------------------------->
</template>

<script setup>
import { reactive, onMounted, ref, getCurrentInstance, computed } from "vue";
import api from "@/api/system/role.js";
import moment from "moment";
import { ElMessage } from "element-plus";
import { ElMessageBox } from "element-plus";
let { proxy } = getCurrentInstance();
import { useStore } from "vuex";
const store = useStore();
let isLoading = computed(() => store.getters.isLoading);
onMounted(() => {
  getRoleList();
  getMenuList();
});

const searchForm = reactive({
  roleName: "",
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
const deleteRole = (id) => {
  ElMessageBox.confirm("此操作会删除角色, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    store.commit("system/SET_ISLOADING", true);
    await api.deleteRole(id);
    store.commit("system/SET_ISLOADING", false);
    ElMessage.success({
      message: "删除角色成功!",
    });
    search();
  });
};
const pageObj = reactive({
  currentPage: 1,
  pageSize: 15,
  total: 0,
});
const handleSizeChange = (val) => {
  pageObj.pageSize = val;
  getRoleList();
};
const handleCurrentChange = (val) => {
  pageObj.currentPage = val;
  getRoleList();
};
const getRoleList = async () => {
  const query = {
    roleName: searchForm.roleName,
    currentPage: pageObj.currentPage,
    pageSize: pageObj.pageSize,
  };
  store.commit("system/SET_ISLOADING", true);
  let { list, page } = await api.getRoleList(query);
  store.commit("system/SET_ISLOADING", false);
  pageObj.total = page.total;
  tableData.value = list;
  tableData.value.forEach((item) => {
    item.createTime = moment(new Date(item.createTime)).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    item.updateTime = moment(new Date(item.updateTime)).format(
      "YYYY-MM-DD HH:mm:ss"
    );
  });
};
const search = () => {
  pageObj.currentPage = 1;
  pageObj.pageSize = 15;
  pageObj.total = 0;
  getRoleList();
};
const reset = () => {
  searchForm.roleName = "";
  search();
};
let dialogTitle = ref("");
const addRole = () => {
  dialogTitle.value = "创建角色";
  dialogFormVisible.value = true;
  console.log(addForm);
};
let dialogFormVisible = ref(false);
let addForm = reactive({
  roleName: "",
  remark: "",
  roleId: "",
});

const addFormRules = reactive({
  roleName: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
});

const handleClose = () => {
  addForm = reactive({
    roleName: "",
    remark: "",
    roleId: "",
  });
  dialogFormVisible.value = false;
  proxy.$refs.addFormRef.resetFields();
};
const addFormRef = ref();
const submitAddRole = (addFormRef) => {
  addFormRef.validate(async (valid) => {
    if (valid) {
      const data = {
        roleName: addForm.roleName,
        remark: addForm.remark,
      };
      if (addForm.roleId) {
        data.roleId = addForm.roleId;
        store.commit("system/SET_ISLOADING", true);
        await api.editRole(data);
        store.commit("system/SET_ISLOADING", false);
        ElMessage.success("角色编辑成功");
        handleClose(addFormRef);
        search();
      } else {
        store.commit("system/SET_ISLOADING", true);
        await api.addRole(data);
        store.commit("system/SET_ISLOADING", false);
        ElMessage.success("角色新建成功");
        handleClose(addFormRef);
        search();
      }
    }
  });
};

const editRole = (row) => {
  dialogFormVisible.value = true;
  dialogTitle.value = "编辑角色";
  addForm.roleId = row.roleId;
  addForm.roleName = row.roleName;
  addForm.remark = row.remark;
};

let dialogPermissionFormVisible = ref(false);
let dialogPermissionTitle = ref("");
let addPermissionForm = reactive({
  roleId: "",
  roleName: "",
  permissionList: {
    checkedKeys: [],
    halfCheckedKeys: [],
  },
});
const setPermission = (row) => {
  dialogPermissionFormVisible.value = true;
  dialogPermissionTitle.value = "设置权限";
  proxy.$nextTick(() => {
    proxy.$refs.treeRef.setCheckedKeys(row.permissionList.checkedKeys);
  });
  addPermissionForm.roleId = row.roleId;
  addPermissionForm.roleName = row.roleName;
  addPermissionForm.permissionList.checkedKeys = row.permissionList.checkedKeys;
  addPermissionForm.permissionList.halfCheckedKeys =
    row.permissionList.halfCheckedKeys;
};
const handlePermissionClose = () => {
  dialogPermissionFormVisible.value = false;
  addPermissionForm = reactive({
    roleId: "",
    roleName: "",
    permissionList: {
      checkedKeys: [],
      halfCheckedKeys: [],
    },
  });
};
const submitPermission = async (formRef) => {
  let checkedKeys = [];
  let parentKeys = [];
  let halfCheckedKeys = proxy.$refs.treeRef.getHalfCheckedKeys();
  proxy.$refs.treeRef.getCheckedNodes().map((item) => {
    if (!item.children) {
      checkedKeys.push(item._id);
    } else {
      parentKeys.push(item._id);
    }
  });
  let permissionList = {
    checkedKeys: checkedKeys,
    halfCheckedKeys: halfCheckedKeys.concat(parentKeys),
  };
  const data = {
    roleId: addPermissionForm.roleId,
    permissionList: permissionList,
  };
  store.commit("system/SET_ISLOADING", true);
  await api.setRolePermission(data);
  ElMessage.success("权限设置成功");
  store.commit("system/SET_ISLOADING", false);
  search();
  handlePermissionClose();
};
let menuList = ref([]);
const getMenuList = async () => {
  menuList.value = await api.getMenuList({
    menuName: "",
    menuState: "正常",
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
