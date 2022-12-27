<template>
  <div class="us-container">
    <!-- 关于我们 -->
    <div class="about0ur">
      <img :src="require('@/assets/images/us/引号.png')" class="usImg-item usImg-item4" alt="">
      <img :src="require('@/assets/images/us/About Us.png')" class="usImg-item usImg-item1" alt="">
      <img :src="require('@/assets/images/us/关于我们.png')" class="usImg-item usImg-item3" alt="">
      <img :src="require('@/assets/images/us/专注技术提升服务.png')" class="usImg-item usImg-item2" alt="">
    </div>
    <div class="other">
      <!-- 触及科技 -->
      <div class="cjkj">
        <!-- <transition v-show="isShow1" appear appear-active-class="animated flash" enter-active-class="animated flash" leave-active-class="animated pulse">
          <img :src="require('@/assets/images/us/触及科技.png')" class="cjkj-left " alt="">
        </transition> -->
        <div class="wow bounceInLeft">
          <img :src="require('@/assets/images/us/触及科技.png')" class="cjkj-left " alt="">
        </div>
        <div class="cjkj-center">
          <p>成都触及科技是一家专业以“机器视觉”和“AR技术”为主的软件外包服务商，公司拥有自主研发的AR云引擎，也能为您提供信息系统开发，数字孪生、门户网站开发、android、ios微信公众号、微信小程序等开发服务。</p>
          <p>公司以“专注技术，用心服务”为核心价值，希望通过我们的专业水平和不屑努力，为传统企业在百年未有之大变革中寻找更多商机贡献力量。</p>
        </div>
        <!-- <transition v-show="isShow1" appear appear-active-class="animated bounceInRight" enter-active-class="animated bounceInRight" leave-active-class="animated bounceIn">
          <img :src="require('@/assets/images/us/公司前台.png')" class="cjkj-right" alt="">
        </transition> -->
        <div class="wow slideInRight">
          <img :src="require('@/assets/images/us/公司前台.png')" class="cjkj-right" alt="">
        </div>
        <div class="cjkj-bottom">
          <div class="cjkj-bottom-right"></div>
        </div>
      </div>
      <!-- 服务客户 -->
      <div class="serve">
        <div class="serveBox">
          <img :src="require('@/assets/images/us/服务流程.png')" class="serve-top  wow bounceInUp" alt="">

            <swiper
              v-if="swiperList.length"
              :autoplay="{ delay: 50, disableOnInteraction: false}"
              :centeredSlides="true"
              :loop="true"
              :coverflowEffect="{
                  rotate: 0,
                  stretch: 0,
                  depth: 0,
                  modifier: 1,
                  slideShadows: false,
            }"
              :effect="'coverflow'"
              :grabCursor="true"
              :initialSlide="1"
              :modules="modules"
              :slidesPerView="'auto'"
              :space-between="100"
              class="mySwiper"
              :speed="4000"
              @slideChange="onSlideChange"
              @swiper="onSwiper"
            >
              <swiper-slide v-for="(item,index) in swiperList" :key="index" style="width: 270px;height: 250px;display: flex;flex-direction: row;justify-items: center">
                <div ref="swiperImgBox" :class="!item.state ? 'swiperImgBox':'swiperImgBox hoverBox'" @mouseenter="serveOver(),item.state = true" @mouseleave="serveLeave(),item.state = false">
                <img
                  :src="item.state ? item.activePath:item.inactivePath" :class="!item.state ? 'swiperImg':'swiperImg hover'" ref="swiperImg" style="width: 150px"/>
                </div>
              </swiper-slide
              >
            </swiper>

          <!-- 箭头 -->
          <div class="arrow">
            <div class="arrow-left" @click="slidePrev"></div>
            <div class="arrow-right" @click="slideNext"></div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'
import '@/assets/styles/swiper.css'
import WOW from 'wow.js'
import 'swiper/css/autoplay'

// import required modules
import { EffectCoverflow, Pagination, Autoplay } from 'swiper'
import { computed, onBeforeMount, onMounted, reactive, ref } from 'vue'

export default {
  components: {
    Swiper,
    SwiperSlide
  },

  setup () {
    // 轮播图列表
    const swiperList = reactive([
      {
        inactivePath: require('@/assets/images/us/国家电网公司未激活.png'),
        activePath: require('@/assets/images/us/国家电网公司激活.png'),
        state: false
      },
      {
        inactivePath: require('@/assets/images/us/华日通讯未激活.png'),
        activePath: require('@/assets/images/us/华日通讯激活.png'),
        state: false
      },
      {
        inactivePath: require('@/assets/images/us/中国移动未激活.png'),
        activePath: require('@/assets/images/us/中国移动激活.png'),
        state: false
      },
      {
        inactivePath: require('@/assets/images/us/西南油气田未激活.png'),
        activePath: require('@/assets/images/us/西南油气田激活.png'),
        state: false
      },
      {
        inactivePath: require('@/assets/images/us/蜀能产业未激活.png'),
        activePath: require('@/assets/images/us/蜀能产业激活.png'),
        state: false
      },
      {
        inactivePath: require('@/assets/images/us/长庆油田未激活.png'),
        activePath: require('@/assets/images/us/长庆油田激活.png'),
        state: false
      },
      {
        inactivePath: require('@/assets/images/us/车V店未激活.png'),
        activePath: require('@/assets/images/us/车V店激活.png'),
        state: false
      },
      {
        inactivePath: require('@/assets/images/us/启客强条未激活.png'),
        activePath: require('@/assets/images/us/启客强条激活.png'),
        state: false
      },
      {
        inactivePath: require('@/assets/images/us/卡斯柯未激活.png'),
        activePath: require('@/assets/images/us/卡斯柯激活.png'),
        state: false
      },
      {
        inactivePath: require('@/assets/images/us/车拇指科技未激活.png'),
        activePath: require('@/assets/images/us/车拇指科技激活.png'),
        state: false
      },
      {
        inactivePath: require('@/assets/images/us/医福通未激活.png'),
        activePath: require('@/assets/images/us/医福通激活.png'),
        state: false
      },
      {
        inactivePath: require('@/assets/images/us/君享环球未激活.png'),
        activePath: require('@/assets/images/us/君享环球激活.png'),
        state: false
      },
      {
        inactivePath: require('@/assets/images/us/IMG足球未激活.png'),
        activePath: require('@/assets/images/us/IMG足球激活.png'),
        state: false
      },
      {
        inactivePath: require('@/assets/images/us/芭夯兔未激活.png'),
        activePath: require('@/assets/images/us/芭夯兔激活.png'),
        state: false
      },
      {
        inactivePath: require('@/assets/images/us/咪咕音乐未激活.png'),
        activePath: require('@/assets/images/us/咪咕音乐激活.png'),
        state: false
      },
      {
        inactivePath: require('@/assets/images/us/车载智能硬件未激活.png'),
        activePath: require('@/assets/images/us/车载智能硬件激活.png'),
        state: false
      },
      {
        inactivePath: require('@/assets/images/us/翠屏山仪陇未激活.png'),
        activePath: require('@/assets/images/us/翠屏山仪陇激活.png'),
        state: false
      },
      {
        inactivePath: require('@/assets/images/us/爱捷健康未激活.png'),
        activePath: require('@/assets/images/us/爱捷健康激活.png'),
        state: false
      },
      {
        inactivePath: require('@/assets/images/us/药之道未激活.png'),
        activePath: require('@/assets/images/us/药之道激活.png'),
        state: false
      },
      {
        inactivePath: require('@/assets/images/us/中机十院未激活.png'),
        activePath: require('@/assets/images/us/中机十院激活.png'),
        state: false
      }
    ])

    // 创建空对象 接收swiper对象
    const mySwiper = reactive({})

    const onSwiper = (swiper) => {
      mySwiper.value = swiper // swiper对象
    }

    const slidePrev = () => {
      mySwiper.value.slideToLoop(mySwiper.value.realIndex - 2, 1000)
      mySwiper.value.slidePrev() // 上一页
    }

    const slideNext = () => {
      mySwiper.value.slideToLoop(mySwiper.value.realIndex + 2, 1000)
      mySwiper.value.slideNext(1000) // 下一页
    }

    const swiperImgBox = ref(null) // 盒子实例

    const swiperImg = ref(null) // 图片实例

    // 鼠标移动到demo中，进行样式变换
    const serveOver = (index) => {
      // mySwiper.value.speed = 0
      mySwiper.value.slideToLoop(mySwiper.value.realIndex, 1000)
      mySwiper.value.autoplay.stop()
    }

    // 鼠标移出demo，进行样式变换
    const serveLeave = (index) => {
      mySwiper.value.autoplay.start()
      // mySwiper.value.speed = 4000
    }

    const onSlideChange = (index) => {
    }

    onMounted(() => {
      const wow = new WOW({})
      wow.init()
      mySwiper.value.update() // 每次加载进行更新，避免图形变形
    })

    onBeforeMount(() => {
    })
    return {
      swiperList,
      swiperImgBox,
      swiperImg,
      mySwiper,

      onSwiper,
      slidePrev,
      slideNext,
      serveOver,
      serveLeave,
      onSlideChange,

      modules: [EffectCoverflow, Pagination, Autoplay]
    }
  }

}

</script>

<style lang="less" scoped>

.swiperBox {
  width: 1920px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .mySwiper {
    margin-top: 100px;
    height: 110px;

  }

  /deep/ .swiper{
    padding-bottom:0
  }
}

.swiperBox /deep/ .swiper-wrapper {
  -webkit-transition-timing-function: linear; /*之前是ease-out*/
  transition-timing-function: linear;
}

.swiperImgBox{
  width: 270px;
  height: 110px;
  background-color: #020F2A;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all 0.5s ease;

  .swiperImg{
    transition: all 0.8s ease;
  }

}

.hover{
  transform: scale(1.1);
}

.hoverBox{
  box-shadow: 0 0 20px #0AF9BA;
  border: 1px solid #0AF9BA;
  transform: scale(1.2);
}

.swiper-slide {
  width: 270px;
  height: 110px;

}

.us-container {
  overflow: hidden;
}
// 关于我们动画
@keyframes about1 {
  from {
    transform: translate(0px, -300px);
  } to {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
}
@keyframes about2 {
  from {
    transform: translate(0px, -300px);
  } to {
      top: 35%;
      left: 44%;
      transform: translate(-50%, -50%);
    }
}
@keyframes about3 {
  from {
    transform: translate(0px, 300px);
  } to {
      top: 60%;
      transform: translate(-50%, -50%);
    }
}
@keyframes about4 {
  from {
    transform: translate(0px, 300px);
  } to {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
}
// 服务客户部分动画
@keyframes serveScroll {
  0% {
    top: 392px;
    left: 1900px;
  }
  100% {
    top: 392px;
    left: -7120px;
  }
}
.about0ur {
  background-image: url(../../../assets/images/us/banner\ _\ bg.png);
  width: 1920px;
  height: 777px;
  position: relative;
}
.usImg-item {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.usImg-item1 {
  // top: 60%;
  animation: about3 2s;
  animation-fill-mode: forwards;
}
.usImg-item2 {
  // top: 35%;
  // left: 44%;
  animation: about2 2s;
  animation-fill-mode: forwards;
}
.usImg-item3 {
  animation: about1 2s;
  animation-fill-mode: forwards;
}
.usImg-item4 {
  animation: about4 2s;
  animation-fill-mode: forwards;
}
.other {
  background-image: url(../../../assets/images/us/bg2.png);
  width: 1920px;
  // height: 2164px;
  width: 1719px;
  position: relative;
}
.other .cjkj {
  height: 771px;
  .cjkj-left {
    position: absolute;
    top: 133px;
    left: 164px;
  }
  .cjkj-center {
    position: absolute;
    top: 342px;
    left: 165px;
    width: 763px;
    height: 220px;
    p {
      font-size: 20px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 50px;
      text-indent: 2em;
    }
  }
  .cjkj-right {
    position: absolute;
    top: 92px;
    right: -100px;
  }
  .cjkj-bottom {
    background: rgba(0,255,186, .2);
    height: 1px;
    width: 1675px;
    border-radius: 1px;
    margin-left: 120px;
    position: absolute;
    top: 771px;
    .cjkj-bottom-right {
      background: rgba(0,255,186, 1);
      width: 480px;
      margin-left: 1194px;
      border: 1px solid #00FFBA;
    }
  }
}
.other .serve {
  height: auto;
  position: relative;

  .serveBox{
    width: 1920px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 50px;

    /deep/ .swiper-wrapper{
      -webkit-transition-timing-function: linear; /*之前是ease-out*/
      -moz-transition-timing-function: linear;
      -ms-transition-timing-function: linear;
      -o-transition-timing-function: linear;
      transition-timing-function: linear;
    }

    .serve-top {
      margin-bottom: 120px;
      margin-top: 80px;
    }
  }

  .arrow {
    width: 200px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .arrow-right {
      cursor: pointer;
      position: relative;
      top: 1px;
      width: 65px;
      height: 39px;
      background-image: url("@/assets/images/us/右箭头未激活.png");
    }

    .arrow-right:hover {
      background-image: url("@/assets/images/us/右箭头激活.png");
    }

    .arrow-left{
      cursor: pointer;
      width: 65px;
      height: 39px;
      background-image: url("@/assets/images/us/左箭头未激活.png");
    }

    .arrow-left:hover{
      background-image: url("@/assets/images/us/左箭头激活.png");
    }
  }
}
.serve-list:hover {
  animation-play-state: paused !important;
}
.serve-item .serve-img1 {
  margin: 25px 43px 24px 44px;
}
.serve-item .serve-img2 {
  margin: 25px 38px 24px 38px;
}
.serve-item .serve-img3 {
  margin: 25px 36px 24px 36px;
}
.serve-item .serve-img4 {
  margin: 25px 48px 24px 48px;
}
.serve-item .serve-img5 {
  margin: 32px 29px 31px 29px;
}
.serve-item .serve-img6 {
  margin: 25px 59px 24px 59px;
}
.serve-item .serve-img7 {
  margin: 25px 74px 24px 74px;
}
.serve-item .serve-img8 {
  margin: 25px 60px 24px 60px;
}
.serve-item .serve-img9 {
  margin: 25px 40px 24px 41px;
}
.serve-item .serve-img10 {
  margin: 20px 54px 20px 54px;
}
</style>
