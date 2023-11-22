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
          <el-option value="充值卡" label="充值卡"></el-option>
          <el-option value="会员卡" label="会员卡"></el-option>
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
    <el-button
      :loading="isLoading"
      type="info"
      :disabled="cardIds.length == 0"
      @click="deleteCard(cardIds)"
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
          <div
            style="display: flex; align-items: center; justify-content: center"
          >
            <span>
              <svg-icon
                className="icon-level"
                :iconName="`icon-${
                  levelOptions.find(
                    (item) => item.levelId == scope.row.cardLevel
                  ) &&
                  levelOptions.find(
                    (item) => item.levelId == scope.row.cardLevel
                  ).levelIcon
                }`"
              ></svg-icon>
            </span>
            <span style="margin-left: 3px">
              {{
                levelOptions.find(
                  (item) => item.levelId == scope.row.cardLevel
                ) &&
                levelOptions.find((item) => item.levelId == scope.row.cardLevel)
                  .levelName
              }}
            </span>
          </div>
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
        <template #default="scope">
          <el-tag
            v-if="scope.row.cardState == '未使用'"
            type="success"
            size="small"
            effect="dark"
          >
            {{ scope.row.cardState }}
          </el-tag>
          <el-tag
            v-if="scope.row.cardState == '已使用'"
            type="warning"
            size="small"
            effect="dark"
          >
            {{ scope.row.cardState }}
          </el-tag>
          <el-tag
            v-if="scope.row.cardState == '已过期'"
            type="danger"
            size="small"
            effect="dark"
          >
            {{ scope.row.cardState }}
          </el-tag>
        </template>
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
            @click="deleteCard(scope.row.cardId)"
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
      ref="addFormRef"
      label-width="100px"
      label-position="right"
      style="width: 95%"
      :rules="addFormRules"
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
          <el-option value="充值卡" label="充值卡"></el-option>
          <el-option value="会员卡" label="会员卡"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="失效日期" prop="expirationDate">
        <el-date-picker
          style="width: 100%"
          v-model="addForm.expirationDate"
          type="date"
          placeholder="请选择日期"
          :disabled-date="disabledDateFuns"
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
          @click="addOneCard"
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
      ref="addBatchFormRef"
      label-width="100px"
      label-position="right"
      style="width: 95%"
      :rules="addBatchFormRules"
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
          <el-option value="充值卡" label="充值卡"></el-option>
          <el-option value="会员卡" label="会员卡"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="失效日期" prop="expirationDate">
        <el-date-picker
          style="width: 100%"
          v-model="addBatchForm.expirationDate"
          type="date"
          placeholder="请选择日期"
          :disabled-date="disabledDateFuns"
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
          @click="submitBatchCreate"
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
  getCardList();
  getLevelList();
});

const disabledDateFuns = (time) => {
  return time.getTime() < Date.now() - 8.64e7;
};

const searchForm = reactive({
  cardNo: "",
  cardLevel: "",
  cardType: "",
  cardState: "",
  expirationDate: "",
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
  getCardList();
};
const handleCurrentChange = (val) => {
  pageObj.currentPage = val;
  getCardList();
};
const getCardList = async () => {
  const query = {
    cardNo: searchForm.cardNo,
    cardLevel: searchForm.cardLevel,
    cardType: searchForm.cardType,
    cardState: searchForm.cardState,
    expirationDate: searchForm.expirationDate,
    currentPage: pageObj.currentPage,
    pageSize: pageObj.pageSize,
  };
  store.commit("system/SET_ISLOADING", true);
  let { list, page } = await api.getCardList(query);
  store.commit("system/SET_ISLOADING", false);
  pageObj.total = page.total;
  tableData.value = list;
  tableData.value.forEach((item) => {
    item.expirationDate = moment(new Date(item.expirationDate)).format(
      "YYYY-MM-DD HH:mm:ss"
    );
  });
};
const search = () => {
  pageObj.currentPage = 1;
  pageObj.pageSize = 10;
  pageObj.total = 0;
  getCardList();
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

const addFormRules = reactive({
  cardNo: [{ required: true, message: "请生成卡密", trigger: "blur" }],
  cardLevel: [{ required: true, message: "请选择卡密等级", trigger: "change" }],
  cardType: [{ required: true, message: "请选择卡密类型", trigger: "change" }],
  expirationDate: [
    { required: true, message: "请选择失效日期", trigger: "change" },
  ],
});

const openCreate = () => {
  //生成卡密函数
  const randomWord = (length) => {
    let str = "",
      arr = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
      ];
    //每位随机字符
    for (let i = 0; i < length; i++) {
      let pos = Math.round(Math.random() * (arr.length - 1));
      str += arr[pos];
    }
    return str;
  };
  dialogFormVisible.value = true;
  addForm = reactive({
    cardNo: randomWord(16),
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
  store.commit("system/SET_ISLOADING", false);
  proxy.$refs["addFormRef"].resetFields();
};

let dialogBatchFormVisible = ref(false);
let addBatchForm = reactive({
  cardNum: 1,
  cardLevel: "",
  cardType: "",
  expirationDate: "",
});

const addBatchFormRules = reactive({
  cardNum: [{ required: true, message: "请输入卡密数量", trigger: "blur" }],
  cardLevel: [{ required: true, message: "请选择卡密等级", trigger: "change" }],
  cardType: [{ required: true, message: "请选择卡密类型", trigger: "change" }],
  expirationDate: [
    { required: true, message: "请选择失效日期", trigger: "change" },
  ],
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
  store.commit("system/SET_ISLOADING", false);
  proxy.$refs["addBatchFormRef"].resetFields();
};

const submitBatchCreate = async () => {
  proxy.$refs["addBatchFormRef"].validate(async (valid) => {
    if (valid) {
      store.commit("system/SET_ISLOADING", true);
      await api.barchCard(addBatchForm);
      store.commit("system/SET_ISLOADING", false);
      ElMessage.success("卡密批量创建成功");
      handleBatchClose();
      getCardList();
    }
  });
};

const addOneCard = async () => {
  proxy.$refs["addFormRef"].validate(async (valid) => {
    if (valid) {
      store.commit("system/SET_ISLOADING", true);
      await api.addOneCard(addForm);
      store.commit("system/SET_ISLOADING", false);
      ElMessage.success("卡密创建成功");
      handleClose();
      getCardList();
    }
  });
};

const getLevelList = async () => {
  levelOptions.value = await api.getLevelList();
};

let cardIds = ref([]);
const handleSelectionChange = (rows) => {
  cardIds.value = [];
  cardIds.value = rows.map((item) => item.cardId);
};

const deleteCard = async (cardIds) => {
  ElMessageBox.confirm("此操作将永久删除该卡密, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    await api.deleteCard(Array.isArray(cardIds) ? cardIds.join(",") : cardIds);
    ElMessage.success("卡密删除成功");
    getCardList();
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
<style scoped>
.icon-level {
  width: 1.5em;
  height: 1.5em;
  vertical-align: -6px;
}
</style>
