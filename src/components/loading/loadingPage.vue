<template>
  <div ref="loadingPage" class="loadingPage">
    <div class="body" ref="line">
      <div class="many">
        <span :ref="line1"></span>
        <span :ref="line1"></span>
        <span :ref="line1"></span>
        <span :ref="line1"></span>
        <span :ref="line1"></span>
      </div>
      <div class="base">
        <img src="~@/assets/images/logo-loading.png" alt="">
      </div>
    </div>
    <div ref="title" class="title">触及科技</div>
    <div style="font-size: 25px !important; margin-top: 25px !important; color: red;">{{ shijians }}</div>
    <div class="longfazers">
      <span :ref="line1"></span>
      <span :ref="line1"></span>
      <span :ref="line1"></span>
      <span :ref="line1"></span>
      <span :ref="line1"></span>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, defineProps, toRefs, watch } from 'vue'

const props = defineProps({
  info: Boolean,
  home: Boolean
})

const { info, home } = toRefs(props)

const shijians = ref(0)
const timier = ref(null)
timier.value = setInterval(() => {
  shijians.value++
}, 1000)

watch(info, () => {
  timer.value = setInterval(() => {
    // line.value.style.transform = 'translateX(1500px)'
    if (loadingPage.value) {
      loadingPage.value.style.height = '0'
    }
    lineList.value.forEach((item) => {
      item.style.animationPlayState = 'paused'
      item.style.display = 'none'
    })
    if (line.value) {
      line.value.style.animationPlayState = 'paused'
    }
    if (title.value) {
      title.value.className = 'title animate__animated animate__zoomOut'
    }
    clearInterval(timer)
    timer.value = null
  }, 2000)
})

// 创建ref接收参数 loadingPage(整体页面domo) timer(定时器) line(log及尾部线条) title(公司名称)
const loadingPage = ref(null)
const timer = ref(null)
const line = ref(null)
const title = ref(null)
const lineList = ref([])
const line1 = (el) => {
  lineList.value.push(el)
}

onMounted(() => {
  if (home.value) {
    loadingPage.value.className = 'loadingPage backgroundUrl'
  }
  loadingPage.value.style.height = '100%'
})

onBeforeUnmount(() => {
  shijians.value = 0
  clearInterval(timier)
  timier.value = null
})

</script>

<style lang="less" scoped>
@import url(https://fonts.googleapis.com/css?family=Open+Sans:300);

.loadingPage {
  width: 100%;
  height: 100%;
  background:url('~@/assets/images/loading.png');
  z-index: 1200;
  position: absolute;
  top: 0;
  transition: height 1s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.backgroundUrl{
  background:url('~@/assets/images/home/homeBackground.png');

}

.title {
  width: 80vw;
  font-family: 'Open Sans';
  font-weight: 600;
  font-size: calc(10px + 1vw);
  text-align: center;
  color:RGB(0, 255, 186);
  letter-spacing: calc(10px + 1vw);
  text-indent: 20px;
  left: 0;
  transition: left .8s ease;
  position: relative;
  //animation: speeder .5s ease-in infinite;

  span{
    text-align: center;

  }
}

.body {
  width: calc(35px + 2vw);
  margin-left: -20px;
  animation: speeder .4s linear infinite;
  position: relative;
  transform: translateX(0);
  transition: transform .5s ease-in;

  .many{
    width: calc(35px + 2vw);
    height: calc(35px + 2vw);
    margin-left: 30px;
    position: absolute;
  }

  .base {
    margin-bottom: calc(10px + 2vw);
    img {
      width: calc(60px + 2vw);
      //margin-left: 12px;
    }
  }
}

.many > span:nth-child(1),
.many > span:nth-child(2),
.many > span:nth-child(3),
.many > span:nth-child(4),
.many > span:nth-child(5) {
  width: calc(20px + 1vw);
  height: 1px;
  position: absolute;
  left: 20px;
  background: RGB(0, 255, 186);
  animation: fazer1 .2s linear infinite;
}

.many > span:nth-child(1) {
  top: 30%;
  animation: fazer1 .3s linear infinite;
}

.many > span:nth-child(2) {
  top: 50%;
  animation: fazer2 .4s linear infinite;
}

.many > span:nth-child(3) {
  top: 60%;
  animation: fazer3 .5s linear infinite;
}

.many > span:nth-child(4) {
  top: 90%;
  animation: fazer4 1s linear infinite;
}

.many > span:nth-child(5) {
  top: 100%;
  animation: fazer5 .5s linear infinite;
}

@keyframes fazer1 {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-130px);
    opacity: 0;
  }
}

@keyframes fazer2 {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-180px);
    opacity: 0;
  }
}

@keyframes fazer3 {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-300px);
    opacity: 0;
  }
}

@keyframes fazer4 {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-180px);
    opacity: 0;
  }
}

@keyframes fazer5 {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-130px);
    opacity: 0;
  }
}

@keyframes speeder {
  0% {
    transform: translate(2px, 1px) rotate(0deg);
  }
  10% {
    transform: translate(-1px, -3px) rotate(-1deg);
  }
  20% {
    transform: translate(-2px, 0px) rotate(1deg);
  }
  30% {
    transform: translate(1px, 2px) rotate(0deg);
  }
  40% {
    transform: translate(1px, -1px) rotate(1deg);
  }
  50% {
    transform: translate(-1px, 3px) rotate(-1deg);
  }
  60% {
    transform: translate(-1px, 1px) rotate(0deg);
  }
  70% {
    transform: translate(3px, 1px) rotate(-1deg);
  }
  80% {
    transform: translate(-2px, -1px) rotate(1deg);
  }
  90% {
    transform: translate(2px, 1px) rotate(0deg);
  }
  100% {
    transform: translate(1px, -2px) rotate(-1deg);
  }
}

.longfazers {
  position: absolute;
  width: 100%;
  height: 100%;

  span {
    position: absolute;
    height: 1px;
    width: 20%;
    background: RGB(0, 255, 186);

    &:nth-child(1) {
      top: 20%;
      animation: lf .6s linear infinite;
      animation-delay: -5s;
    }

    &:nth-child(2) {
      top: 40%;
      animation: lf2 .8s linear infinite;
      animation-delay: -1s;
    }

    &:nth-child(3) {
      top: 60%;
      animation: lf3 .6s linear infinite;
    }

    &:nth-child(4) {
      top: 80%;
      animation: lf4 .5s linear infinite;
      animation-delay: -2s;
    }

    &:nth-child(5) {
      top: 10%;
      animation: lf4 .5s linear infinite;
      animation-delay: -3s;
    }
  }
}

@keyframes lf {
  0% {
    transform: translateX(400%);
  }
  100% {
    transform: translateX(-180%);
    opacity: 0;
  }
}
@keyframes lf2 {
  0% {
    transform: translateX(400%);
  }
  100% {
    transform: translateX(-160%);
    opacity: 0;
  }
}
@keyframes lf3 {
  0% {
    transform: translateX(400%);
  }
  100% {
    transform: translateX(-140%);
    opacity: 0;
  }
}
@keyframes lf4 {
  0% {
    transform: translateX(400%);
  }
  100% {
    transform: translateX(-120%);
    opacity: 0;
  }
}

@keyframes lf5 {
  0% {
    transform: translateX(400%);
  }
  100% {
    transform: translateX(-200%);
    opacity: 0;
  }
}
</style>
