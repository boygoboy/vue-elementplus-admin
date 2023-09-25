<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item v-for="(item, index) in breadList" :key="index">
      <span style="color: #ffffff">{{ item.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import { ArrowRight, List } from "@element-plus/icons-vue";
import { onMounted, getCurrentInstance, computed, watch, ref } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
const store = useStore();
const route = useRoute();
let currentRoute = ref(route.path);
let breadList = ref([{ title: "首页", path: "/home" }]);
const handleBreadList = (currentRoute) => {
  console.log(store.state.menu.menuList);
  const menuList = JSON.parse(JSON.stringify(store.state.menu.menuList));
  let parentId = [];
  let curmenuName = "";
  const deepMenuList = (list) => {
    list.forEach((item) => {
      if (item.action && item.children) {
        if (item.path == currentRoute) {
          parentId = item.parentId;
          curmenuName = item.menuName;
        }
      } else if (item.children) {
        deepMenuList(item.children);
      }
    });
    return parentId;
  };
  deepMenuList(menuList);
  console.log(curmenuName);
  console.log(parentId);
  const deepMenuName = (menuList, menuNameList, parentId) => {
    menuList.forEach((item) => {
      if (parentId.includes(item._id)) {
        menuNameList.push({ path: item.path, title: item.menuName });
      } else if (item.children && !item.action) {
        deepMenuName(item.children, menuNameList, parentId);
      }
    });
  };
  let menuNameList = [];
  deepMenuName(menuList, menuNameList, parentId);
  menuNameList.push({ path: currentRoute, title: curmenuName });
  breadList.value = menuNameList;
};
watch(
  () => route.fullPath,
  (newPath, oldPath) => {
    if (newPath == "/home") {
      breadList.value = [{ title: "首页", path: "/home" }];
      return;
    }
    handleBreadList(newPath);
  }
);
onMounted(() => {
  if (route.path == "/home") {
    breadList.value = [{ title: "首页", path: "/home" }];
    return;
  }
  handleBreadList(route.path);
});
</script>

<style lang="scss" scoped></style>
