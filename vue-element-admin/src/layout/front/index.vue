<template>
  <div class="header">
    <div class="router-box" v-for="(item, index) in menuList" :key="index">
      <span>
        <router-link class="router-item" :to="item.path" tag="button" replace>{{
          item.menuName
        }}</router-link>
      </span>
    </div>
  </div>
  <div class="main">
    <router-view></router-view>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
const curPath = ref(route.path);
const menuList = ref([
  {
    menuName: "主页",
    path: "/front/home",
  },
  {
    menuName: "AI聊天",
    path: "/front/chat",
  },
  {
    menuName: "AI绘画",
    path: "/front/paint",
  },
  {
    menuName: "登录",
    path: "/front/login",
  },
]);
</script>

<style lang="scss" scoped>
.header {
  height: 50px;
  line-height: 50px;
  border-bottom: none;
  // background: #250942;
  background: linear-gradient(to right, #130c1a, #371e4f, #250942);
  position: absolute;
  width: 100%;
  top: 0px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  box-shadow: 0px 0px 5px #2c1642;
  .router-box {
    .router-item {
      color: #e7e7e5;
      margin-right: 50px;
      font-size: 16px;
      padding: 5px;
    }
    .router-link-active {
      color: #aa54ff;
    }
  }
}
</style>
<style scoped>
.active-router {
  border-bottom: solid 1px #aa54ff;
}
</style>
