<template>
  <div>
    <!--  菜单s  -->
    <div class="top">
      <h-nav></h-nav>
      <h-nav-sticky></h-nav-sticky>
    </div>
    <!--  菜单e  -->

    <!--  内容s   -->
    <div :class="[router.options.history.location !== '/success' ? 'content' : 'content1']">
      <RouterView/>
    </div>
    <!--  内容e   -->

    <!--  底部s   -->
    <h-footer v-if="router.options.history.location !== '/success'"></h-footer>
    <!--  底部e   -->
  </div>
</template>

<script setup>
import HNav from '@/components/nav'
import hNavSticky from '@/components/nav-sticky'
import hFooter from '@/components/footer'
import router from '@/router'
</script>

<style scoped lang="less">
.content {
  padding-bottom: 100px;
  background-color: #000B19;
}

.content1 {
  // padding-bottom: 100px;
  // 渐进色
  // background: -webkit-linear-gradient(to right, #000008, #00000b);
  // background: -o-linear-gradient(to right, #000008, #00000b);
  // background: -moz-linear-gradient(to right, #000008, #00000b);
  // background: linear-gradient(to right, #000008, #00000b);
  /deep/ #model-container {
    height: 100vh !important;
    canvas {
      height: 100% !important;
    }
  }
}

.top {
  //position: fixed;
  width: 100%;
}
</style>
