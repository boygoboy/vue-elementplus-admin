<template>
  <el-breadcrumb :separator-icon="ArrowRight">

        <el-breadcrumb-item :to="{ path: item.path }"  v-for="(item,index) in breadList"
    :key="index" 
    >
    <router-link to="/home" v-if="index==0">{{item.meta.title}}</router-link>
    <span v-else>{{item.meta.title}}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { onMounted, getCurrentInstance ,computed } from "vue";
import { useRoute } from 'vue-router'
const route=useRoute()
onMounted(()=>{

})
const breadList=computed(()=>{
    return route.matched
})
</script>

<style lang="scss" scoped>

</style>