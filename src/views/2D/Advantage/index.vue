<template>
  <div id="advantage">
    <div class="title">
      <div class="title-content"></div>
      <div class="title-en"></div>
    </div>
    <div class="kb">
      <div class="bar">
        <div></div>
      </div>
    </div>
    <div class="us">
      <div class="left">
        <div class="chooseUs"></div>
        <div class="">{{ advantageArr[num].introduce }}
        </div>
        <div>{{ advantageArr[num].en }}
        </div>
      </div>
      <div class="right">
        <Card v-for="item in advantageArr"
              :advantageItem="item"
              @click="item.num"
              @mouseenter="mouseOver"
              @mouseleave="mouseOut"/>
      </div>
      <div></div>
    </div>
    <audio ref="audio" preload="auto" autoplay loop :src="require('@/assets/背景音效1.mp3')"></audio>
  </div>
</template>

<script>
import Card from './components/Card.vue'

export default {
  name: 'advantage',
  data () {
    return {
      num: 0,
      barEle: null, // 进度条节点
      titleEle: null, // title节点
      cardList: null,
      hoverStop: null, // hover效果的定时器
      // fag:0,//记录当前hover轮播到的组件
      advantageArr: [
        {
          num: 0,
          title: '经验丰富',
          imgUrl: require('@/assets/images/优势/经验.png'),
          introduce: '与全国各大中小企业有深入合作，有各类APP和小程序等成功项目超过80多个。',
          en: 'It has in-depth cooperation with major and small enterprises across the country, and has more than 80 successful projects such as various APPs and small programs.'
        },
        {
          num: 1,
          title: '技术雄厚',
          imgUrl: require('@/assets/images/优势/雄厚.png'),
          introduce: '基于云识别大数据的增强现实技术平台，识别、人工智能、电商、游戏等方面有很 深的技术积累。',
          en: 'The augmented reality technology platform based on cloud recognition big data has deep technical accumulation in recognition, artificial intelligence, e-commerce, games, etc.'

        },
        {
          num: 2,
          title: '高效快速',
          imgUrl: require('@/assets/images/优势/高效.png'),
          introduce: '具有多年开发经验的专业团队，高质量高效率完成客户需求。',
          en: 'Professional team with many years of development experience, high quality and high efficiency to complete customer needs.'

        },
        {
          num: 3,
          title: '负责到底',
          imgUrl: require('@/assets/images/优势/到底.png'),
          introduce: '全程跟踪式设计流程，始终对客户项目抱有负责到底的态度。',
          en: 'Tracking the design process throughout the process, always taking responsibility for customer projects.'

        }
      ]
    }
  },
  components: {
    Card
  },
  methods: {
    // 改变进度条
    changeBar () {
      //  进度节点
      const barChild = this.barEle.children[0]
      const scrollHeight = document.body.offsetHeight
      document.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
        barChild.style.height = (scrollTop) / scrollHeight * this.barEle.offsetHeight + 20 + 'px'
        // console.log(barChild.style.height)
      })
    },
    // 卡片轮播
    cardHover () {
      let fag = 0// 计数
      // console.log(this.cardList.children)
      const nodeList = this.cardList.children
      nodeList[0].classList.add('hoverCard')
      // console.log(nodeList[fag].classList[0])
      this.hoverStop = setInterval(() => {
        //  判断边界
        if (fag >= nodeList.length) {
          this.num = fag = 0
        }
        // 添加hover效果
        nodeList[fag].classList.add('hoverCard')
        this.num = fag
        //  当hover为第一个时
        if (fag === 0) {
          nodeList[nodeList.length - 1].classList.forEach(item => {
            if (item === 'hoverCard') {
              // 清除样式
              nodeList[nodeList.length - 1].classList.remove('hoverCard')
            }
          })
        } else {
          nodeList[fag - 1].classList.forEach(item => {
            if (item === 'hoverCard') {
              nodeList[fag - 1].classList.remove('hoverCard')
            }
          })
        }
        fag++
      }, 1500)
    },
    // title显示效果
    titleMove () {
      const title = document.querySelector('.title-content')
      const titleEn = document.querySelector('.title-en')
      title.style.top = -90 + 'px'
      titleEn.style.top = 240 + 'px'
      title.style.opacity = 0
      titleEn.style.opacity = 0
      // console.log( titleEn.style.opacity)
      const stop = setInterval(() => {
        if (parseInt(title.style.top) !== 0) {
          title.style.top = parseInt(title.style.top) + 2 + 'px'
          titleEn.style.top = parseInt(titleEn.style.top) - 2 + 'px'
          if (parseFloat(title.style.opacity) < 1) {
            title.style.opacity = parseFloat(title.style.opacity) + 0.03
            titleEn.style.opacity = parseFloat(titleEn.style.opacity) + 0.03
          } else {
            title.style.opacity = titleEn.style.opacity = 1
          }
        } else {
          clearInterval(stop)
        }
      }, 20)
    },
    //  鼠标进入
    mouseOver (e) {
      // console.log(this.cardList.children)//HTMLCollection
      // 清除所有的hover样式
      for (let i = 0; i < this.cardList.children.length; i++) {
        this.cardList.children[i].classList.remove('hoverCard')
      }
      // 改变右侧的文字
      this.advantageArr.map((item) => {
        if (item.title === e.target.innerText) {
          this.num = item.num
        }
      })
      // 暂停计时器
      clearInterval(this.hoverStop)
    },
    //  鼠标移出
    mouseOut () {
      // for (let i = 0; i < this.cardList.children.length; i++) {
      //   this.cardList.children[i].classList.remove('hoverCard')
      // }
      // 开始计时器
      this.cardHover()
    },
    //  鼠标hover
    mouseHover () {

    }
  },
  mounted () {
    //  获取进度条的节点
    this.barEle = document.getElementsByClassName('bar')[0]
    this.changeBar()
    //  文字效果
    this.titleMove()
    //
    this.cardList = document.getElementsByClassName('right')[0]
    // console.log(this.cardList)
    this.cardHover()
  },
  created () {
  },
  beforeUnmount () {
    // 清除计时器
    clearInterval(this.hoverStop)
  }
}
</script>

<style lang="less" scoped>
* {
  box-sizing: border-box;
}

#advantage {
  height: 100%;
  background-image: url('../../../assets/images/优势/141655305.png');
  background-size: 100% 100%;
  overflow: hidden;
  padding: 0 165px;

  .kb {
    width: 100%;
    height: 350px;
    margin-top: 144px;

    .bar {
      width: 1px;
      height: 350px;
      margin: 0 auto;
      background-color: #0B65A3;

      & > div {
        width: 1px;
        height: 20px;
        background-color: #00FFBA;
      }
    }
  }

  .us {
    width: 100%;
    height: 550px;
    margin-top: 73px;
    display: flex;
    //background-color: aquamarine;
    .left {
      width: 50%;
      height: 80%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      //align-content:space-between ;
      .chooseUs {
        width: 588px;
        height: 130px;
        background-image: url('../../../assets/images/优势/chooseUs.png');
        background-size: 100% 100%;
      }

      > div:nth-child(2) {
        width: 772px;
        height: 69px;
        font-size: 24px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 44px;
      }

      > div:nth-child(3) {
        width: 799px;
        height: 32px;
        font-size: 14px;
        font-family: Myriad Pro;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 20px;
        opacity: 0.3;
      }
    }

    .right {
      width: 50%;
      height: 100%;
      //background-color: aquamarine;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      align-items: center;
    }
  }
}

.title {
  width: 901px;
  height: 181px;
  margin-left: 315px;
  margin-top: 325px;
  background-image: url('../../../assets/images/优势/引号.png');
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  .title-content {
    width: 590px;
    height: 134px;
    //top: -50px;
    background-image: url("../../../assets/images/优势/组 21.png");
    background-size: 100% 100%;
    position: absolute;
  }

  .title-en {
    width: 579px;
    height: 18px;
    background-image: url("../../../assets/images/优势/OUR COMPETITIVE ADNANTAGES.png");
    background-size: 100% 100%;
    //top: 200px;
    position: absolute;
  }
}

.hoverCard {
  border: 2px solid #0AF9BA;
  box-shadow: 0 0 32px 0 rgba(0, 255, 188, 0.75);
  color: #0AF9BA;
  transform: scale(1.05); /* 整体放大到原来的1.05倍 */
}
</style>
