<template>
    <div class="search-box">
    <el-form :inline="true" :model="searchForm">
    <el-form-item label="用户名称：" prop="username">
        <el-input v-model="searchForm.username" placeholder="请输入用户名称" style="width:160px;"></el-input>
    </el-form-item>
    <el-form-item label="用户邮箱：" prop="userEmail">
    <el-input v-model="searchForm.userEmail" placeholder="请输入用户邮箱" style="width:160px;"></el-input>
    </el-form-item>
    <el-form-item label="用户状态：" prop="state">
        <el-select v-model="searchForm.state" style="width:160px;">
            <el-option value="enable" label="启用"></el-option>
            <el-option value="diaabled" label="禁用"></el-option>
        </el-select>
    </el-form-item>
    <el-form-item>
        <el-button type="primary" >查询</el-button>
        <el-button  >重置</el-button>
    </el-form-item>
    </el-form>
    </div>
    <div class="action-btn">
        <el-button type="primary" style="margin-right:20px;" >新增</el-button>
        <el-button type="danger" >批量删除</el-button>
    </div>
</template>

<script setup>
import {reactive} from "vue"

const searchForm=reactive({
      username:'',
      userEmail:'',
      state:''
})

</script>

<style lang="scss" scoped>
.search-box{
padding: 20px;
padding-bottom: 0px;
border-bottom: solid 1px #eef0f3;
}
.action-btn{
    display: flex;
    padding: 20px;
}
</style>