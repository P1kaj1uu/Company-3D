<template>
  <div class="footer-content">
    <div class="core">
      <!--  边框颜色不同样式    -->
      <div class="core-border"></div>
      <div class="text">
        <!--   地址     -->
        <div class="text-left">
          <div class="text-left-title">
            <div class="text-left-us">联系我们</div>
            <img src="@/assets/images/箭头.png" alt="">
          </div>
          <div class="text-left-content">
            <div class="text-left-content-item">
              <img src="@/assets/images/位置icon.png" alt="">
              <p>成都市高新西区龙湖时代天街17栋1718-1719</p>
            </div>
            <div class="text-left-content-item">
              <img src="@/assets/images/e-mai.png" alt="">
              <p>1012091674@qq.com</p>
            </div>
            <div class="text-left-content-item">
              <img src="@/assets/images/电话.png" alt="">
              <p>18081937630</p>
            </div>
            <div class="text-left-content-item">
              <img src="@/assets/images/QQ.png" alt="">
              <p>1012091674</p>
            </div>
          </div>
        </div>

        <!--   二维码    -->
        <div class="text-right">
          <div class="text-right-flex">
            <div class="tiktok">
              <img class="website-tiktok" src="@/assets/images/抖音.png" alt="">
            </div>
            <p>抖音</p>
          </div>
          <div class="text-right-flex">
            <div class="tiktok">
              <img class="website" src="@/assets/images/官网.png" alt="">
            </div>
            <p>官网</p>
          </div>
          <div class="text-right-flex">
            <div class="tiktok">
              <img class="website" src="@/assets/images/公众号.png" alt="">
            </div>
            <p>公众号</p>
          </div>
        </div>
      </div>
      <div class="company">
        <div class="wow fadeInDown company-1">成都触及科技/未来触手可及</div>
        <div class="wow fadeInUp company-2">© 2018-2019 All Rights Reserved蜀</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { WOW } from 'wowjs'
import { onMounted } from 'vue'

onMounted(() => {
  new WOW().init()
})
</script>

<style scoped lang="less">
.footer-content {
  width: 100%;
  height: 443px;
  display: flex;
  justify-content: center;
  background-color: #000B19;

  .core {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 1678px;
    height: 443px;
    //background-color: saddlebrown;
    border-top: #0b65a3 solid 1px;

    .core-border {
      position: absolute;
      top: -1px;
      left: 49px;
      width: 176px;
      //background-color: #fff;
      border-top: #00FFBA solid 1px;
    }

    .text {
      width: 1580px;
      margin-top: 38px;
      height: 330px;
      //background-color: pink;
      display: flex;
      justify-content: space-between;

      .text-left {
        height: 100%;
        width: 600px;
        //background-color: aquamarine;

        .text-left-title {
          display: flex;
          align-items: flex-end;

          .text-left-us {
            margin-right: 13px;
            //margin-bottom: 26px;
            font-size: 24px;
            font-weight: 400;
            font-style: italic;
            color: #FFFFFF;
          }

          img {
            width: 34px;
            height: 10px;
          }
        }

        .text-left-content {
          padding-top: 26px;
          //background-color: black;

          .text-left-content-item {
            display: flex;
            align-items: center;
            margin-bottom: 35px;

            img {
              width: 30px;
              height: 30px;
              margin-right: 18px;
            }

            p {
              font-size: 16px;
              color: #FFFFFF;
            }
          }
        }

      }

      .text-right {
        height: 100%;
        width: 700px;
        //background-color: orange;
        display: flex;
        justify-content: space-around;
        align-items: center;

        .text-right-flex {
          display: flex;
          flex-direction: column;
          align-items: center;

          .tiktok {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 165px;
            height: 165px;

            .website-tiktok {
              width: 165px;
              height: 165px;
            }
          }

          .website {
            width: 118px;
            height: 118px;
          }

          p {
            color: white;
          }
        }
      }
    }

    .company {
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;

      .company-1 {
        -webkit-animation: move_1 1s;
        font-size: 14px;
        color: #FFFFFF;
        margin-bottom: 21px;
      }

      .company-2 {
        font-size: 14px;
        color: #FFFFFF;
      }
    }
  }
}

@-webkit-keyframes move_1 {
  0% {
    -webkit-transform: translateY(-50px);
    opacity: 0;
  }
}

@-webkit-keyframes move_2 {
  0% {
    -webkit-transform: translateY(50px);
    opacity: 0;
  }
}
</style>
