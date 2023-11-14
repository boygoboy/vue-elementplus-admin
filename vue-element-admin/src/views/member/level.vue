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
      >
        <template #default="scope">
          <svg-icon :iconName="`icon-${scope.row.levelIcon}`"></svg-icon>
        </template>
      </el-table-column>
      <el-table-column
        label="等级名称"
        prop="levelName"
        min-width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        label="套餐名称"
        prop="packageName"
        width="160"
        align="center"
      ></el-table-column>
      <el-table-column
        label="套餐状态"
        prop="packageStatus"
        width="160"
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
        width="150"
        align="center"
      >
        <template #default="scope"> {{ scope.row.packagePrice }}元 </template>
      </el-table-column>
      <el-table-column
        label="套餐时长"
        prop="packageDuration"
        width="150"
        align="center"
      >
        <template #default="scope">
          {{ scope.row.packageDuration }}天
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="权益列表"
        prop="benefitsList"
        width="220"
        align="center"
      >
        <template #default="scope">
          <span v-for="(item, index) in scope.row.benefitsList" :key="index">
            {{ index + 1 }}.{{ item }}。
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="关联角色"
        prop="linkroleId"
        width="150"
        :formatter="formatRole"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <el-button type="primay" text @click="distrbuteResource(scope.row)"
            >分配资源</el-button
          >
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
      <el-form-item label="权益列表" prop="benefitsList">
        <div
          v-for="(item, index) in addForm.benefitsList"
          :key="index"
          style="width: 100%"
        >
          <div style="display: flex; align-items: center; margin-bottom: 10px">
            <el-input
              style="width: 90%; margin-right: 10px"
              v-model="addForm.benefitsList[index]"
              placeholder="请输入权益项"
            ></el-input>
            <div style="width: 10%; display: flex; justify-content: start">
              <svg-icon
                v-if="index == addForm.benefitsList.length - 1"
                className="iconfont"
                iconName="icon-jia"
                style="margin-right: 5px"
                @click="addBenifit"
              ></svg-icon>
              <svg-icon
                v-if="index !== 0 && index == addForm.benefitsList.length - 1"
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
  <!---------------------------分配资源弹窗开始-------------------------------->
  <el-dialog
    v-model="dialogresourceFormVisible"
    :before-close="handleResourceClose"
    :title="dialogResourceTitle"
    width="60%"
    top="20vh"
  >
    <el-form
      :model="resourceForm"
      ref="resourceFormRef"
      label-width="100px"
      label-position="right"
      style="width: 95%"
      :rules="resourceFormRules"
    >
      <el-form-item label="套餐等级" prop="levelName">
        <el-input v-model="resourceForm.levelName" disabled />
      </el-form-item>
      <el-form-item label="套餐名称" prop="packageName">
        <el-input v-model="resourceForm.packageName" disabled />
      </el-form-item>
      <el-form-item label="充值金额" prop="packageMoney">
        <el-input
          v-model.number="resourceForm.packageMoney"
          placeholder="请输入充值金额"
        />
      </el-form-item>
      <el-form-item label="资费配置" prop="resourceData">
        <el-table
          :data="resourceForm.resourceData"
          max-height="300px"
          style="width: 100%; border: none"
          :header-cell-style="setHeaderCellStyle"
          border
          @cell-dblclick="handleDbClick"
        >
          <el-table-column
            label="模型名称"
            prop="modelName"
            align="center"
            min-width="150"
          >
            <template #default="scope">
              <el-input
                class="center-input"
                v-model="scope.row.modelName.value"
                v-if="scope.row.modelName.isInput"
              ></el-input>
              <span v-else>{{ scope.row.modelName.value }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="访问速率(次/分)"
            prop="accessRate"
            align="center"
            min-width="180"
          >
            <template #default="scope">
              <el-input
                class="center-input"
                v-model="scope.row.accessRate.value"
                v-if="scope.row.accessRate.isInput"
              ></el-input>
              <span v-else>{{ scope.row.accessRate.value }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="模型单价(元/1000token)"
            prop="modelUnitPrice"
            align="center"
            min-width="240"
          >
            <template #default="scope">
              <el-input
                class="center-input"
                v-model="scope.row.modelUnitPrice.value"
                v-if="scope.row.modelUnitPrice.isInput"
              ></el-input>
              <span v-else>{{ scope.row.modelUnitPrice.value }}</span>
            </template>
          </el-table-column>
          <el-table-column width="120" label="操作" align="center">
            <template #default="scope">
              <div style="display: flex; justify-content: center">
                <svg-icon
                  @click="addResource(scope.$index)"
                  className="iconfont-table"
                  iconName="icon-jia"
                  style="margin-right: 5px"
                ></svg-icon>
                <svg-icon
                  @click="deleteResource(scope.$index)"
                  v-if="resourceForm.resourceData.length > 1"
                  className="iconfont-table"
                  iconName="icon-jianqu"
                ></svg-icon>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="info" @click="handleResourceClose">取消</el-button>
        <el-button
          @click="submitResource(resourceFormRef)"
          :loading="isLoading"
          type="primary"
          style="margin-left: 20px"
        >
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
  <!---------------------------分配资源弹窗结束--------------------------------->
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
  initData();
});
const initData = async () => {
  await getroleList();
  await search();
};

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
  benefitsList: [""],
  linkroleId: "",
});
const getroleList = async () => {
  roleOptions.value = [];
  store.commit("system/SET_ISLOADING", true);
  roleOptions.value = await api.getRoleList();
  store.commit("system/SET_ISLOADING", false);
};
const formatRole = (row, column, cellValue) => {
  let findRole = roleOptions.value.find((item) => item.roleId == cellValue);
  if (findRole) {
    return findRole.roleName;
  } else {
    return "";
  }
};
const switchState = async (state, id) => {
  const data = {
    levelId: id,
    packageStatus: !state,
  };
  store.commit("system/SET_ISLOADING", true);
  await api.changeLevelStatus(data);
  store.commit("system/SET_ISLOADING", false);
  ElMessage.success("套餐状态修改成功");
  search();
};
const openLevelDialog = () => {
  dialogFormVisible.value = true;
  dialogTitle.value = "创建套餐等级";
  getroleList();
};
const checkPrice = (rule, value, callback) => {
  if (!value && value != 0) {
    callback(new Error("套餐价格不能为空"));
  } else {
    const pattern = /^\+?[0-9][0-9]*$/;
    if (!pattern.test(value)) {
      callback(new Error("套餐价格必须为整数且不能为负"));
    } else {
      callback();
    }
  }
};

const addBenifit = () => {
  addForm.benefitsList.push("");
};

const deleteBenifit = (index) => {
  addForm.benefitsList.splice(index, 1);
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
  benefitsList: [
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
    benefitsList: [""],
    linkroleId: "",
  });
  dialogFormVisible.value = false;
  proxy.$refs.addFormRef.resetFields();
};
const addFormRef = ref();
const submitLevel = (addFormRef) => {
  addFormRef.validate(async (valid) => {
    if (valid) {
      let findIndex = addForm.benefitsList.findIndex((item) => item == "");
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
        benefitsList: JSON.stringify(addForm.benefitsList),
        linkroleId: addForm.linkroleId,
      };
      if (addForm.levelId || addForm.levelId == 0) {
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
    benefitsList: row.benefitsList,
    linkroleId: row.linkroleId,
  });
  dialogFormVisible.value = true;
  dialogTitle.value = "编辑套餐等级";
  getroleList();
};

const distrbuteResource = (row) => {
  let resourceData = [];
  row.resourceList.resourceData.forEach((item) => {
    let resourceItem = {};
    resourceItem.modelName = {
      value: item.modelName,
      isInput: false,
    };
    resourceItem.accessRate = {
      value: item.accessRate,
      isInput: false,
    };
    resourceItem.modelUnitPrice = {
      value: item.modelUnitPrice,
      isInput: false,
    };
    resourceData.push(resourceItem);
  });
  resourceForm = reactive({
    levelId: row.levelId,
    levelName: row.levelName,
    packageName: row.packageName,
    packageMoney: row.resourceList.packageMoney,
    resourceData:
      resourceData.length > 0
        ? resourceData
        : [
            {
              modelName: {
                value: "gpt3.5",
                isInput: false,
              },
              accessRate: {
                value: "",
                isInput: false,
              },
              modelUnitPrice: {
                value: "",
                isInput: false,
              },
            },
          ],
  });
  dialogresourceFormVisible.value = true;
  dialogResourceTitle.value = "分配套餐资源";
};
let dialogResourceTitle = ref("");
let dialogresourceFormVisible = ref(false);
let resourceForm = reactive({
  levelId: "",
  levelName: "",
  packageName: "",
  packageMoney: "",
  resourceData: [
    {
      modelName: {
        value: "gpt3.5",
        isInput: false,
      },
      accessRate: {
        value: "",
        isInput: false,
      },
      modelUnitPrice: {
        value: "",
        isInput: false,
      },
    },
  ],
});
const resourceFormRef = ref();
const handleResourceClose = () => {
  dialogresourceFormVisible.value = false;
  resourceForm = reactive({
    levelId: "",
    levelName: "",
    packageName: "",
    packageMoney: "",
    resourceData: [
      {
        modelName: {
          value: "gpt3.5",
          isInput: false,
        },
        accessRate: {
          value: "",
          isInput: false,
        },
        modelUnitPrice: {
          value: "",
          isInput: false,
        },
      },
    ],
  });
  proxy.$refs.resourceFormRef.resetFields();
};
const resourceFormRules = reactive({
  packageMoney: [
    { required: true, message: "请输入充值金额", trigger: "blur" },
    { pattern: /^[1-9]\d*$/, message: "请输入正整数", trigger: "blur" },
  ],
});
const submitResource = (resourceRef) => {
  resourceRef.validate(async (valid) => {
    let resourceList = {};
    resourceList.levelId = resourceForm.levelId;
    resourceList.packageMoney = resourceForm.packageMoney;
    resourceList.resourceData = [];
    resourceForm.resourceData.forEach((item) => {
      let resourceItem = {};
      resourceItem.modelName = item.modelName.value;
      resourceItem.accessRate = item.accessRate.value;
      resourceItem.modelUnitPrice = item.modelUnitPrice.value;
      resourceList.resourceData.push(resourceItem);
    });
    if (
      resourceList.resourceData.some(
        (item) =>
          item.modelName == "" ||
          item.accessRate == "" ||
          item.modelUnitPrice == ""
      )
    ) {
      ElMessage.warning("模型名称、访问速率、模型单价不能为空");
      return;
    }

    store.commit("system/SET_ISLOADING", true);
    await api.distrbuteResource(resourceList);
    store.commit("system/SET_ISLOADING", false);
    ElMessage.success("套餐资源分配成功");
    getLevelList();
    handleResourceClose();
  });
};
const addResource = (index) => {
  resourceForm.resourceData.splice(index + 1, 0, {
    modelName: {
      value: "",
      isInput: false,
    },
    accessRate: {
      value: "",
      isInput: false,
    },
    modelUnitPrice: {
      value: "",
      isInput: false,
    },
  });
};
const deleteResource = (index) => {
  resourceForm.resourceData.splice(index, 1);
};

const handleDbClick = (row, column, cell) => {
  row[column.property].isInput = true;
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
.iconfont-table {
  font-size: 1.2em;
  cursor: pointer;
}
.center-input /deep/ .el-input__inner {
  text-align: center;
}
</style>
