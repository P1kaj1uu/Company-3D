<!--
 * @Description: 技术页面
 * @Author: 杨锐
 * @version: 0.1
 * @LastEditTime: 2022-12-12 16:21:14
-->
<template>
  <div class="containerBox">
    <div class="headerBox">
      <div class="container">
        <img class="img1 wow fadeInDown" src="@/assets/images/advantage/img1.png">
        <img class="img2 wow fadeInUp" src="@/assets/images/advantage/img2.png">
        <img class="img3" src="@/assets/images/advantage/img3.png">
      </div>
    </div>
    <div class="contentBox">
      <div class="domain">
        <img class="img4 wow fadeInUp" src="@/assets/images/advantage/开发领域-titile.png">

        <swiper
          v-if="swiperList.length"
          :autoplay="{ delay: 3000, disableOnInteraction: false }"
          :centeredSlides="true"
          :coverflowEffect="{
                  rotate: 50,
                  stretch: 0,
                  depth: 100,
                  modifier: 1,
                  slideShadows: true,
            }"
          :effect="'coverflow'"
          :grabCursor="true"
          :initialSlide="1"
          :modules="modules"
          :pagination="true"
          :slidesPerView="'auto'"
          :space-between="178"
          class="mySwiper"
          navigation
          :speed="2500"
          @slideChange="onSlideChange"
          @swiper="onSwiper"
        >
          <swiper-slide v-for="(item,index) in swiperList" :key="index">
            <img
              :src="item.path" class="swiperImg"/></swiper-slide
          >
        </swiper>

        <div class="btnBox">
          <div class="btn-left" @click="slidePrev"/>
          <div class="btn-right" @click="slideNext"/>
        </div>

      </div>
      <div class="flow">
        <img class="img4 wow fadeInUp" src="@/assets/images/advantage/服务流程-titile.png">

        <h2 class="serveTitle" style="margin-top: 120px">触及科技除了有核心技术的研发团队， </h2>
        <h2 class="serveTitle">也为客户提供从产品集成到交付培训的全流程、定制化的服务</h2>

        <div class="serveBox" style="position: relative">
          <div v-for="(item,index) in serveList" :key="index" class="serve" style="position: relative;"
               @mouseenter="serveOver(index)" @mouseleave="serveLeave(index)">

            <div ref="serveImg"
                 :style="{'background-image': `url(${require('@/assets/images/advantage/serveBoxBorderGray.png')})`}"
                 class="serveImg"></div>
            <img ref="serveIcon" :src="item.iconPath"
                 alt="" class="serveIcon" style="width: 66px;height: 66px;z-index:999;">
            <span style="font-size: 24px;color: #FFFFFF;z-index:999;font-weight: 400;line-height: 40px;">{{
                item.text
              }}</span>
          </div>
        </div>

      </div>
      <div class="afterSale">
        <img class="img4 wow fadeInUp" src="@/assets/images/advantage/售后服务-titile.png">

        <div class="saleList">
          <div v-for="(item,index) in saleList" :key="index" class="sale">
            <img :src="item.iconPath" alt="" style="width: 244px;height: 174px;z-index:999;">
            <span>{{ item.title }}</span>
            <div style="width: 44px;height: 2px;background-color: #0AF9BA"></div>
            <div style="text-align: center">
              <span>{{ item.firstWord }}</span><br>
              <span>{{ item.secondWord }}</span>
            </div>
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
import { onBeforeMount, onMounted, reactive, ref } from 'vue'

export default {
  components: {
    Swiper,
    SwiperSlide
  },

  setup () {
    // 轮播图列表
    const swiperList = reactive([
      {
        path: require('@/assets/images/advantage/i.png')
      },
      {
        path: require('@/assets/images/advantage/w.png')
      },
      {
        path: require('@/assets/images/advantage/b.png')
      },
      {
        path: require('@/assets/images/advantage/a.png')
      },
      {
        path: require('@/assets/images/advantage/v.png')
      },
      {
        path: require('@/assets/images/advantage/banner.png')
      },
      {
        path: require('@/assets/images/advantage/c.png')
      }
    ])

    // 服务流程信息
    const serveList = reactive([
      {
        iconPath: require('@/assets/images/advantage/需求沟通.png'),
        text: '需求沟通'
      },
      {
        iconPath: require('@/assets/images/advantage/方案.png'),
        text: '方案确认'
      },
      {
        iconPath: require('@/assets/images/advantage/协议.png'),
        text: '协议款项'
      },
      {
        iconPath: require('@/assets/images/advantage/评估.png'),
        text: '项目评估'
      },
      {
        iconPath: require('@/assets/images/advantage/软件.png'),
        text: '软件开发'
      },
      {
        iconPath: require('@/assets/images/advantage/验收.png'),
        text: '测试验收'
      },
      {
        iconPath: require('@/assets/images/advantage/售后.png'),
        text: '售后服务'
      }
    ])

    // 售后服务信息
    const saleList = reactive([
      {
        iconPath: require('@/assets/images/advantage/免费.png'),
        title: '免费维护',
        firstWord: '项目完成后',
        secondWord: '我们维护6个月'
      },
      {
        iconPath: require('@/assets/images/advantage/bug.png'),
        title: '修复Bug',
        firstWord: '正常的系统技术',
        secondWord: '维护和及时修改Bug'
      },
      {
        iconPath: require('@/assets/images/advantage/基础.png'),
        title: '基础修改',
        firstWord: '原功能基础上的页面',
        secondWord: '文字、图片简单修改'
      }
    ])

    // 创建空对象 接收swiper对象
    const mySwiper = reactive({})

    const onSwiper = (swiper) => {
      mySwiper.value = swiper // swiper对象
    }

    const slidePrev = () => {
      mySwiper.value.slidePrev() // 上一页
    }

    const slideNext = () => {
      console.log(mySwiper)
      mySwiper.value.slideNext() // 下一页
    }

    const serveImg = ref(null)

    const serveIcon = ref(null)

    // 鼠标移动到demo中，进行样式变换
    const serveOver = (index) => {
      // console.log(serveImg.value[index])
      serveImg.value[index].style.backgroundImage = `url(${require('@/assets/images/advantage/serveBoxBorderGreen.png')})`
      serveIcon.value[index].style.transform = 'rotateY(180deg)'
    }

    // 鼠标移出demo，进行样式变换
    const serveLeave = (index) => {
      // console.log(serveImg.value[index].style.backgroundImage)
      serveImg.value[index].style.backgroundImage = `url(${require('@/assets/images/advantage/serveBoxBorderGray.png')})`
      serveIcon.value[index].style.transform = 'rotateY(0)'
    }

    onMounted(() => {
      const wow = new WOW({})
      wow.init()
      mySwiper.value.update() // 每次加载进行更新，避免图形变形
    })

    // onBeforeMount(() => {
    // })
    return {
      swiperList,
      serveList,
      saleList,
      serveImg,
      serveIcon,

      onSwiper,
      slidePrev,
      slideNext,
      serveOver,
      serveLeave,

      modules: [EffectCoverflow, Pagination, Autoplay]
    }
  }
}
</script>

<style lang="less" scoped>
@keyframes fade-in-bottom {
  0% {
    transform: translateY(100px);
    opacity: 0
  }
  100% {
    transform: translateY(0);
    opacity: 1
  }
}

.containerBox {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;

  .headerBox {
    width: 100%;
    height: 542px;
    position: relative;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    padding-block: 100px;
    background-image: url("@/assets/images/advantage/1-1.png");
    display: flex;
    justify-content: center;

    .container {
      width: 1458px;
      position: absolute;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .img1 {
        margin-top: 120px;
        margin-left: 200px;
      }

      .img2 {
        width: 50%;
        position: relative;
        top: -90px;
        left: 450px
      }

      .img3 {
        width: 35%;
        margin-top: 60px;
        margin-left: 500px;
      }

    }
  }

  .contentBox {
    width: 100%;
    height: 3000px;
    position: sticky;
    top: -43px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    padding-block: 146px;
    background-image: url("@/assets/images/advantage/1-2.png");
    display: flex;
    flex-direction: column;
    align-items: center;

    .domain {
      width: 1920px;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 100px;

      .img4 {
        animation: fade-in-bottom .9s both;
        width: 40%;
      }

      .mySwiper {
        margin-top: 100px;
      }

      .btnBox {
        width: 800px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;

        .btn-left {
          width: 95px;
          height: 38px;
          background-repeat: no-repeat;
          background-image: url("@/assets/images/advantage/leftArrows.png");
          cursor: pointer;
        }

        .btn-right {
          width: 95px;
          height: 38px;
          background-repeat: no-repeat;
          background-image: url("@/assets/images/advantage/leftArrows.png");
          transform: rotate(180deg);
          cursor: pointer;

        }

        .btn-left:hover {
          background-image: url("@/assets/images/advantage/rightArrows.png");
          transform: rotate(180deg);
        }

        .btn-right:hover {
          background-image: url("@/assets/images/advantage/rightArrows.png");
          transform: rotate(0deg);
        }
      }

    }

  }
}

.swiper-slide {
  width: 1000px;
  height: 563px;
  line-height: 300px;
  font-size: 30px;
  text-align: center;
  user-select: none;
  overflow: hidden;
  transition: all 0.5s;
  border-radius: 10px;

  img {
    border-radius: 10px;
    transition: all 0.5s;
  }

  img:hover {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }

}

.swiper-slide:hover {
  //border: 1px solid #0AF9BA;
  box-shadow: 0 0 20px #0AF9BA;
}

.domain /deep/ .swiper-pagination-bullet {
  border-radius: 0;
  width: 30px;
  height: 2px;
  background: #0AF9BA
}

.flow {
  width: 1920px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 87px;

  .img5 {
    margin-bottom: 64px;
  }

  .serveTitle {
    font-size: 24px;
    font-weight: 400;
    color: #19FFEC;
    line-height: 45px;
    text-align: center;
  }
}

.serveBox {
  width: 1600px;
  height: auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 120px;

  .serve {
    width: 25%;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-bottom: 40px;

    .serveIcon {
      transition: all 1s ease;
    }

    .serveImg {
      position: absolute;
      width: 320px;
      height: 288px;
      transition: all 1s ease;

    }

    img {
      width: 300px;
    }
  }
}

.swiperImg {

}

.afterSale {
  width: 1920px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 126px;

  .img6 {
    margin-bottom: 152px;

  }

  .saleList {
    margin-top: 150px;
    width: 1300px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;

    .sale {
      height: 350px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;

      img {
        transition: all 0.3s;
      }

      img:hover {
        transform: scale(1.2);
      }
    }

    span {
      font-size: 20px;
      line-height: 32px;
      color: #FFFFFF;
      font-weight: 400;
    }

  }

}

</style>
