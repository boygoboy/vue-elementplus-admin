<template>
  <div class="header"></div>
  <div class="main">
    <Login></Login>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import Login from "@/views/Login.vue";
</script>

<style lang="scss" scoped>
.header {
  height: 50px;
  line-height: 50px;
  border-bottom: none;
  background: transparent;
  position: absolute;
  width: 100%;
  top: 0px;
}
</style>
<style scoped></style>
