<template>
  <div>
    <div v-for="(item, index) in menuList" :key="index">
      <el-sub-menu
        :index="item.path"
        v-if="
          item.children &&
          item.children.length > 0 &&
          item.children[0].menuType == 1 &&
          item.menuType == 1
        "
        :key="item._id"
      >
        <template #title>
          <el-icon>
            <component :is="item.icon"></component>
          </el-icon>
          <span>{{ item.menuName }}</span>
        </template>
        <tree-menu :menuList="item.children"></tree-menu>
      </el-sub-menu>
      <el-menu-item
        :index="item.path"
        v-else-if="item.menuType == 1"
        :key="item._id"
      >
        <el-icon>
          <component :is="item.icon"></component>
        </el-icon>
        <span>{{ item.menuName }}</span>
      </el-menu-item>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  menuList: {
    type: Array,
    default: () => [1, 1, 1, 1],
  },
});
</script>

 <style lang="scss" scoped>
</style>