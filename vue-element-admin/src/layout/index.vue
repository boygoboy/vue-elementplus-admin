<template>
  <div class="basic-layout">
    <div :class="['nav-side', isCollapse ? 'fold' : 'expand']">
      <div class="logo">
        <img src="./../assets/logo.png" />
        <span style="white-space: nowrap">baicai-admin</span>
      </div>
      <el-menu
        style="width: 96%; border-right: none"
        background-color="#1c0054"
        text-color="#7875ae"
        active-text-color="#ffffff"
        default-active="/home"
        router
        collapse-transition
        :collapse="isCollapse"
      >
        <tree-menu :menuList="menuList"></tree-menu>
      </el-menu>
    </div>
    <div :class="['content-right', isCollapse ? 'expand' : 'fold']">
      <div class="nav-top">
        <div class="left-nav">
          <el-icon
            v-if="!isCollapse"
            @click="handleCollapse(true)"
            class="collapse-icon"
            ><Expand
          /></el-icon>
          <el-icon v-else @click="handleCollapse(false)" class="collapse-icon"
            ><Fold
          /></el-icon>
          <bread-crumb style="margin-left: 15px"></bread-crumb>
        </div>
        <div class="right-userinfo">
          <el-dropdown @command="handleCommand">
            <span style="border: none">
              <el-avatar :size="30" :icon="Avatar" />
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="info">
                  <span>用户名：{{ userInfo.userName }}</span>
                </el-dropdown-item>
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="wrapper">
        <router-view> </router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { menuList } from "@/mock/menus";
import { ref, computed, reactive, toRefs, defineProps, defineEmits } from "vue";
import treeMenu from "./treeMenu.vue";
import breadCrumb from "./BreadCrumb.vue";
import BreadCrumb from "./BreadCrumb.vue";
import { Avatar } from "@element-plus/icons-vue";
import { useStore } from "vuex"; // 引入useStore 方法
import storage from "../utils/storage.js";
import { useRouter } from "vue-router";
const store = useStore();
const router = useRouter();
const data = reactive({
  isCollapse: false,
  menuList,
});
const userInfo = reactive(store.state.user.userInfo);
const { isCollapse } = toRefs(data);

const handleCollapse = (bol) => {
  console.log(bol);
  data.isCollapse = bol;
};

const handleCommand = (val) => {
  if (val == "info") {
  }
  if (val == "logout") {
    store.commit("user/saveUserInfo", "");
    storage.clearAll();
    router.push("/login");
  }
};
</script>

<style lang="scss" scoped>
.basic-layout {
  position: relative;
  background: #eef0f3;
  height: 100vh;
  .nav-side {
    position: fixed;
    width: 200px;
    height: 100%;
    background-color: #1c0054;
    overflow-y: auto;
    overflow-x: hidden;
    color: #fff;
    transition: width 0.5s;
    .logo {
      display: flex;
      align-items: center;
      height: 50px;
      font-size: 18px;
      img {
        margin: 0 16px;
        width: 32px;
        height: 32px;
      }
    }
    &.fold {
      width: 49px;
    }
    &.expand {
      width: 200px;
    }
  }
  .content-right {
    margin-left: 200px;
    transition: margin-left 0.5s;
    .nav-top {
      height: 50px;
      line-height: 50px;
      background: #1c0054;
      border-bottom: solid 1px #dddddd;
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
      .left-nav {
        display: flex;
        align-items: center;
        .collapse-icon {
          cursor: pointer;
          color: #ffffff;
        }
      }
      .right-userinfo {
        display: flex;
        align-items: center;
        cursor: pointer;
      }
    }

    .wrapper {
      margin: 20px;
      height: calc(100vh - 93px);
      background: #ffffff;
    }
    &.expand {
      margin-left: 49px;
    }
    &.fold {
      margin-left: 200px;
    }
  }
}
</style>
