<template>
  <div class="nav-content">
    <div class="logo" data-id="logo" @click="$router.push('/')">
    </div>
    <div class="goHome">回退到首页</div>
    <div class="menu">
      <router-link to="/advantage" exact-active-class="router-link-active">优势</router-link>
      <router-link to="/technology" active-class="router-link-active">技术</router-link>
      <router-link to="/us" active-class="router-link-active">关于我们</router-link>
      <router-link to="/success" active-class="router-link-active">成功案例</router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
onMounted(() => {
  document.addEventListener('mousemove', mouseMoveFn)
})
const mouseMoveFn = (e) => {
  if (e.target.dataset.id === 'logo') {
    console.log(e.target.dataset.id)
    document.querySelector('.goHome').style.display = 'block'
    // 获取鼠标x坐标
    const x = e.pageX
    // 获取鼠标y坐标
    const y = e.pageY
    document.querySelector('.goHome').style.left = x + 20 + 'px'
    document.querySelector('.goHome').style.top = y + 20 + 'px'
  } else {
    if (document.querySelector('.goHome')) {
      document.querySelector('.goHome').style.display = 'none'
    }
  }
}
onBeforeUnmount(() => {
  document.removeEventListener('mousemove', mouseMoveFn)
})
</script>

<style scoped lang="less">

.nav-content {
  position: fixed;
  top: 0;
  left: 0;
  padding-left: 120px;
  padding-right: 30px;
  box-sizing: border-box;
  width: 100%;
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index:3;

  .logo {
    width: 173px;
    height: 51px;
    background-image: url("~@/assets/images/logo.png");
    background-size: 173px 51px;
    cursor: pointer;
  }

  .menu {
    height: 100%;
    width: 600px;
    display: flex;
    align-items: center;
    justify-content: space-around;

    a {
      font-size: 24px;
      color: #FFFFFF;
      line-height: 75px;
      font-weight: 500;
      text-decoration: none;
    }

    a:hover {
      color: #00FFBA;
    }

    .router-link-active {
      text-decoration: none;
      color: #00FFBA;
    }
  }
}
.goHome {
  display: none;
  position: absolute;
  background-color: #000000;
  color: #FFFFFF;
  font-size: 15px;
  width: 100px;
  height: 30px;
  text-align: center;
  line-height: 30px;
}
</style>
