<template>
<div class="basic-layout">
    <div class="nav-side">
    </div>
    <div class="content-right">
     <div class="nav-top">
       <div>首页</div>
       <div>个人中心</div>
     </div>
     <div class="wrapper">
        <router-view>

        </router-view>
     </div>
    </div>
</div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.basic-layout{
    position: relative;
    background: #eef0f3;
    height: 100vh;
    .nav-side{
      position: fixed;
      width: 200px;
      height: 100%;
      background-color: #001529;
      overflow-y: auto;
      color: #fff;
      transition: width 0.5s;
    }
   .content-right{
      margin-left: 200px;
      .nav-top{
        height: 50px;
        line-height: 50px;
        background: #ffffff;
        border-bottom: solid 1px #dddddd;
        display: flex;
        justify-content: space-between;
        padding: 0 20px;
      }
        
      .wrapper{
         margin: 20px;
         height: calc(100vh - 93px);
         background: #ffffff;
      }
   }
}
</style>