<template>
  <div class="nav-content" :class="{show: y > 130}">
    <div class="logo" data-id="logos" @click="$router.push('/')">
    </div>
    <div class="goHomesBox">
      <div class="goHomes">回退到首页</div>
    </div>
    <div class="menu">
      <router-link to="/advantage" exact-active-class="router-link-active">优势</router-link>
      <router-link to="/technology" active-class="router-link-active">技术</router-link>
      <router-link to="/us" active-class="router-link-active">关于我们</router-link>
      <router-link to="/success" active-class="router-link-active">成功案例</router-link>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, onMounted, ref } from 'vue'

const y = ref(0)

const onScroll = () => {
  y.value = document.documentElement.scrollTop
}
onMounted(() => {
  window.addEventListener('scroll', onScroll, true)
  document.addEventListener('mousemove', mouseMoveFn)
})
onBeforeMount(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('mousemove', mouseMoveFn)
})
const mouseMoveFn = (e) => {
  if (e.target.dataset.id === 'logos') {
    console.log(e.target.dataset.id)
    document.querySelector('.goHomes').style.display = 'block'
    // 获取鼠标x坐标
    const x = e.clientX
    // 获取鼠标y坐标
    const y = e.clientY
    document.querySelector('.goHomes').style.left = x - 760 + 'px'
    document.querySelector('.goHomes').style.top = y - 50 + 'px'
  } else {
    if (document.querySelector('.goHomes')) {
      document.querySelector('.goHomes').style.display = 'none'
    }
  }
}
</script>

<style scoped lang="less">

.nav-content {
  z-index: 999;
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
  transform: translateY(-100%);
  opacity: 0;

  &.show {
    transition: all 0.3s linear;
    transform: none;
    opacity: 1;
    background-color: #000B19;
  }

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
.goHomesBox {
  position: relative;
}
.goHomes {
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
