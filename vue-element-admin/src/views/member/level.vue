<template>
  <div class="search-box">
    <el-form :inline="true" :model="searchForm">
      <el-form-item label="等级名称：" prop="levelName">
        <el-input
          v-model="searchForm.levelName"
          placeholder="请输入等级名称"
          style="width: 160px"
        ></el-input>
      </el-form-item>
      <el-form-item label="套餐名称：" prop="packageName">
        <el-input
          v-model="searchForm.packageName"
          placeholder="请输入套餐名称"
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
      @click="openLevelDialog"
      type="primary"
      style="margin-right: 10px"
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
        label="等级图标"
        prop="levelIcon"
        min-width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        label="等级名称"
        prop="levelName"
        min-width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        label="套餐名称"
        prop="packageName"
        width="200"
        align="center"
      ></el-table-column>
      <el-table-column
        label="套餐状态"
        prop="packageStatus"
        width="200"
        align="center"
      >
        <template #default="scope">
          <el-switch
            :value="scope.row.packageStatus"
            @change="switchState(scope.row.packageStatus, scope.row.levelId)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="套餐价格"
        prop="packagePrice"
        width="200"
        align="center"
      ></el-table-column>
      <el-table-column
        label="套餐时长"
        prop="packageDuration"
        width="200"
        align="center"
      ></el-table-column>
      <el-table-column
        label="权益列表"
        prop="benefitList"
        width="200"
        align="center"
      ></el-table-column>
      <el-table-column
        label="关联角色"
        prop="linkroleId"
        width="200"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template #default="scope">
          <el-button type="primay" text @click="editLevel(scope.row)"
            >编辑</el-button
          >
          <el-button type="danger" text @click="deleteLevel(scope.row.levelId)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!--------------------------等级创建弹窗出开始------------------------------ -->
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
      <el-form-item label="等级名称" prop="levelName">
        <el-input v-model="addForm.levelName" placeholder="请输入等级名称" />
      </el-form-item>
      <el-form-item label="套餐名称" prop="packageName">
        <el-input v-model="addForm.packageName" placeholder="请输入套餐名称" />
      </el-form-item>
      <el-form-item label="等级图标" prop="levelIcon">
        <el-input v-model="addForm.levelIcon" placeholder="请输入等级图标" />
      </el-form-item>
      <el-form-item label="套餐价格/元" prop="packagePrice">
        <el-input v-model="addForm.packagePrice" placeholder="请输入套餐价格" />
      </el-form-item>
      <el-form-item label="套餐时长/天" prop="packageDuration">
        <el-input
          v-model="addForm.packageDuration"
          placeholder="请输入套餐时长/天"
        />
      </el-form-item>
      <el-form-item label="权益列表" prop="benifitsList">
        <div
          v-for="(item, index) in addForm.benifitsList"
          :key="index"
          style="width: 100%"
        >
          <div style="display: flex; align-items: center; margin-bottom: 10px">
            <el-input
              style="width: 90%; margin-right: 10px"
              v-model="addForm.benifitsList[index]"
              placeholder="请输入权益项"
            ></el-input>
            <div style="width: 10%; display: flex; jusitiy-content: start">
              <svg-icon
                v-if="index == addForm.benifitsList.length - 1"
                className="iconfont"
                iconName="icon-jia"
                style="margin-right: 5px"
                @click="addBenifit"
              ></svg-icon>
              <svg-icon
                v-if="index !== 0 && index == addForm.benifitsList.length - 1"
                className="iconfont"
                @click="deleteBenifit(index)"
                iconName="icon-jianqu"
              ></svg-icon>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item prop="linkroleId" label="关联角色">
        <el-select v-model="addForm.linkroleId" style="width: 100%">
          <el-option
            :label="item.roleName"
            :value="item.roleId"
            v-for="(item, index) in roleOptions"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose" type="info">取消</el-button>
        <el-button
          :loading="isLoading"
          type="primary"
          style="margin-left: 20px"
          @click="submitLevel(addFormRef)"
        >
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
  <!--------------------------等级创建弹窗结束--------------------------------->
</template>

<script setup>
import { reactive, onMounted, ref, getCurrentInstance, computed } from "vue";
import api from "@/api/member/level.js";
import moment from "moment";
import { ElMessage } from "element-plus";
import { ElMessageBox } from "element-plus";
let { proxy } = getCurrentInstance();
import { useStore } from "vuex";
const store = useStore();
let isLoading = computed(() => store.getters.isLoading);
onMounted(() => {
  search();
});

let searchForm = reactive({
  packageName: "",
  levelName: "",
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
const deleteLevel = (id) => {
  ElMessageBox.confirm("此操作会删除该套餐, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    store.commit("system/SET_ISLOADING", true);
    await api.deleteLevel(id);
    store.commit("system/SET_ISLOADING", false);
    ElMessage.success({
      message: "删除套餐成功!",
    });
    search();
  });
};

const getLevelList = async () => {
  const query = {
    levelName: searchForm.levelName,
    packageName: searchForm.packageName,
  };
  store.commit("system/SET_ISLOADING", true);
  tableData.value = await api.getLevelList(query);
  store.commit("system/SET_ISLOADING", false);
};
const search = () => {
  getLevelList();
};
const reset = () => {
  searchForm = reactive({
    packageName: "",
    levelName: "",
  });
  search();
};
let dialogTitle = ref("");
let roleOptions = ref([]);
let dialogFormVisible = ref(false);
let addForm = reactive({
  levelId: "",
  levelName: "",
  packageName: "",
  levelIcon: "",
  packagePrice: "",
  packageDuration: "",
  benifitsList: [""],
  linkroleId: "",
});
const getroleList = async () => {
  roleOptions.value = [];
  store.commit("system/SET_ISLOADING", true);
  roleOptions.value = await api.getRoleList();
  store.commit("system/SET_ISLOADING", false);
};
const switchState = (state, id) => {
  const data = {
    levelId: id,
    packageStatus: state,
  };
  store.commit("system/SET_ISLOADING", true);
  api.switchState(data);
  store.commit("system/SET_ISLOADING", false);
  ElMessage.success("套餐状态修改成功");
};
const openLevelDialog = () => {
  dialogFormVisible.value = true;
  dialogTitle.value = "创建套餐等级";
  getroleList();
};
const checkPrice = (rule, value, callback) => {
  if (!value) {
    callback(new Error("套餐价格不能为空"));
  } else {
    const pattern = /^\+?[1-9][0-9]*$/;
    if (!pattern.test(value)) {
      callback(new Error("套餐价格必须为正整数"));
    } else {
      callback();
    }
  }
};

const addBenifit = () => {
  addForm.benifitsList.push("");
};

const deleteBenifit = (index) => {
  addForm.benifitsList.splice(index, 1);
};

const checkDuration = (rule, value, callback) => {
  if (!value) {
    callback(new Error("套餐时长不能为空"));
  } else {
    const pattern = /^\+?[1-9][0-9]*$/;
    if (!pattern.test(value)) {
      callback(new Error("套餐时长必须为正整数"));
    } else {
      callback();
    }
  }
};

const addFormRules = reactive({
  levelName: [{ required: true, message: "请输入等级名称", trigger: "blur" }],
  packageName: [{ required: true, message: "请输入套餐名称", trigger: "blur" }],
  levelIcon: [{ required: true, message: "请输入等级图标", trigger: "blur" }],
  packagePrice: [
    { required: true, message: "请输入套餐价格", trigger: "blur" },
    { validator: checkPrice, trigger: "blur" },
  ],
  packageDuration: [
    { required: true, message: "请输入套餐时长", trigger: "blur" },
    { validator: checkDuration, trigger: "blur" },
  ],
  benifitsList: [
    { required: true, message: "请输入权益列表", trigger: "blur" },
  ],
  linkroleId: [
    { required: true, message: "请选择关联角色", trigger: "change" },
  ],
});

const handleClose = () => {
  addForm = reactive({
    levelId: "",
    levelName: "",
    packageName: "",
    levelIcon: "",
    packagePrice: "",
    packageDuration: "",
    benifitsList: [""],
    linkroleId: "",
  });
  dialogFormVisible.value = false;
  proxy.$refs.addFormRef.resetFields();
};
const addFormRef = ref();
const submitLevel = (addFormRef) => {
  addFormRef.validate(async (valid) => {
    if (valid) {
      let findIndex = addForm.benifitsList.findIndex((item) => item == "");
      if (findIndex != -1) {
        ElMessage.warning("权益列表不能为空");
        return;
      }
      const data = {
        levelName: addForm.levelName,
        packageName: addForm.packageName,
        levelIcon: addForm.levelIcon,
        packagePrice: addForm.packagePrice,
        packageDuration: addForm.packageDuration,
        benifitsList: JSON.stringify(addForm.benifitsList),
        linkroleId: addForm.linkroleId,
      };
      if (addForm.levelId) {
        data.levelId = addForm.levelId;
        store.commit("system/SET_ISLOADING", true);
        await api.editLevel(data);
        store.commit("system/SET_ISLOADING", false);
        ElMessage.success("套餐等级编辑成功");
        handleClose(addFormRef);
        search();
      } else {
        store.commit("system/SET_ISLOADING", true);
        await api.addLevel(data);
        store.commit("system/SET_ISLOADING", false);
        ElMessage.success("套餐等级新建成功");
        handleClose(addFormRef);
        search();
      }
    }
  });
};

const editLevel = (row) => {
  addForm = reactive({
    levelId: row.levelId,
    levelName: row.levelName,
    packageName: row.packageName,
    levelIcon: row.levelIcon,
    packagePrice: row.packagePrice,
    packageDuration: row.packageDuration,
    benifitsList: row.benifitsList,
    linkroleId: row.linkroleId,
  });
  dialogFormVisible.value = true;
  dialogTitle.value = "编辑套餐等级";
  getroleList();
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
.iconfont {
  font-size: 1.5em;
  cursor: pointer;
  flex: 1;
}
</style>
