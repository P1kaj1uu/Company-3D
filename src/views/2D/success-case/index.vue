<template>
  <div class="box">
    <!-- 返回主页 -->
    <div class="toggleDisplay">
      <button class="toggleBtn" @click="router.push('/')">回退到首页</button>
    </div>
    <div class="container-box">
      <div id="model-container"></div>
      <div class="success-list">
        <div class="success-item" style="user-select: none;">智能硬件/人工智能</div>
        <div class="success-item-index" style="user-select: none;">01</div>
        <div class="arrow" @mouseover="handleMouseOver($event)" @mouseout="handleMouseOut" style="user-select: none;">
          <img :src="require('@/assets/images/us/右箭头未激活.png')" :data-arrowLR="1" v-show="isActArrow" class="arrow-right" alt="">
          <img :src="require('@/assets/images/us/右箭头激活.png')" :data-arrowLR="1" @click="toSuccessList($event)" v-show="!isActArrow" class="arrow-right" alt="">
        </div>
      </div>
      <div class="in-line"></div>
      <img class="under-line" :src="require('@/assets/images/underline.png')" alt="">
      <div class="under-txt">
        <span class="cur" style="user-select: none;">1</span>
        <span class="middle" style="user-select: none;">/</span>
        <span class="total" style="user-select: none;">{{ textList.length }}</span>
      </div>
      <div class="circle">
        <span class="tips">双击模型快速跳转</span>
      </div>
      <audio ref="audio" preload="auto" autoplay loop :src="require('../../../assets/背景音效1.mp3')"></audio>
    </div>
    <div class="loadEffect">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</template>

<script setup>
import { onMounted, defineExpose, ref, toRaw, reactive, onUnmounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Reflector } from 'three/examples/jsm/objects/Reflector.js'
// import dat from 'dat.gui'
const $ = name => document.querySelector(name)
// 3D模型
const camera = ref(null)
const scene = ref(null)
const renderer = ref(null)
const controls = ref(null)
const rotateModel = ref(null)
const i = ref(0)
const timer = ref(null)
const router = useRouter()
// const gui = ref(null)
// 详情页序号
const listIndex = ref(0)
// 箭头是否激活
const isActArrow = ref(true)
const textList = reactive([
  {
    title: '智能硬件/人工智能',
    titleId: 0,
    titleIndex: '01'
  },
  {
    title: '数字孪生',
    titleId: 1,
    titleIndex: '02'
  },
  {
    title: 'C＋＋/QT/CAD插件',
    titleId: 2,
    titleIndex: '03'
  },
  {
    title: '移动应用开发',
    titleId: 3,
    titleIndex: '04'
  },
  {
    title: 'VR/AR',
    titleId: 4,
    titleIndex: '05'
  },
  {
    title: '信息化项目',
    titleId: 5,
    titleIndex: '06'
  }
])
const isShowTips = ref(false)
// 判断鼠标按下与否
const isDownOrUp = ref(false)
const container = ref(null)
onMounted(() => {
  container.value = document.querySelector('#model-container')
  init()
  animate()
  container.value.addEventListener('mousedown', handleMouseDown, false)
  container.value.addEventListener('mouseup', handleMouseUp, false)
  container.value.addEventListener('dblclick', handleClick, false)
  window.addEventListener('mousemove', handleMouseMove, false)
  swipeText()
})
onUnmounted(() => {
  clearInterval(timer.value)
})
onBeforeUnmount(() => {
  // 销毁页面时，清除定时器
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
})

// 获取模型数组
const getIntersects = (event) => {
  event.preventDefault()
  // 声明 rayCaster 和 mouse 变量
  const rayCaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  // 通过鼠标点击位置，计算出raycaster所需点的位置，以屏幕为中心点，范围-1到1
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1 // 这里为什么是-号，没有就无法点中
  // 通过鼠标点击的位置(二维坐标)和当前相机的矩阵计算出射线位置
  rayCaster.setFromCamera(mouse, camera.value)
  // 获取与射线相交的对象数组， 其中的元素按照距离排序，越近的越靠前。
  // +true，是对其后代进行查找，这个在这里必须加，因为模型是由很多部分组成的，后代非常多。
  const intersects = rayCaster.intersectObjects(scene.value.children, true)
  // 返回选中的对象
  return intersects
}

// 双击模型跳转对应详情页
const handleClick = (e) => {
  const intersects = getIntersects(e)
  const name = intersects[0]?.object?.name
  switch (name) {
    case '智能硬件':
      router.push('/successlist/1')
      break
    case '数字孪生':
      router.push('/successlist/2')
      break
    case 'C++':
      router.push('/successlist/3')
      break
    case '移动':
      router.push('/successlist/4')
      break
    case 'VR':
      router.push('/successlist/5')
      break
    case '信息化':
      router.push('/successlist/6')
      break
  }
}

// 3D模型
const init = () => {
  // const mouse = new THREE.Vector2()

  // self.camera.position.set(700, 200, 300)
  scene.value = new THREE.Scene()
  // ground
  const mesh = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2000, 2000),
    new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
  )
  mesh.rotation.x = -Math.PI / 2
  mesh.receiveShadow = true
  scene.value.add(mesh)
  // const grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000)
  // grid.material.opacity = 0.2
  // grid.material.transparent = true
  // scene.value.add(grid)

  camera.value = new THREE.PerspectiveCamera(
    45,
    container.value.clientWidth / container.value.clientHeight,
    0.01,
    2000
  )
  camera.value.position.set(78, 20, -40)
  camera.value.lookAt(scene.value)

  renderer.value = new THREE.WebGLRenderer({
    // 增加抗锯齿效果
    antialias: true,
    alpha: true
    // precision: 'highp'
  })
  // 设置渲染器
  renderer.value.shadowMapEnabled = true
  renderer.value.setClearColor(new THREE.Color(0x000000))
  renderer.value.setSize(container.value.clientWidth, container.value.clientHeight)
  renderer.value.setPixelRatio(window.devicePixelRatio)
  container.value.appendChild(renderer.value.domElement)

  controls.value = new OrbitControls(camera.value, renderer.value.domElement)
  controls.value.target.set(0, 0, 0)
  // 禁止滚轮缩放模型
  controls.value.enableZoom = false
  controls.value.target.x = 0
  controls.value.target.y = 0
  controls.value.target.z = 0
  // 禁止右键拖曳
  controls.value.enablePan = false
  // 控制器垂直方向最大旋转角度（理解为逆时针旋转角度）
  controls.value.maxPolarAngle = 1.55
  // 控制器垂直方向最大小旋转角度（理解为顺时针旋转角度）
  controls.value.minPolarAngle = 1.5
  controls.value.update()
  controls.value.addEventListener('change', () => {
    rotateModel.value.position.set(0, -8, 0)
    // setTimeout(() => {
    //   camera.value.position.x = 79.80402548163777
    //   camera.value.position.y = 6.360057290701041
    //   camera.value.position.z = -40.92514127263478
    // }, 1000)
  })

  // const point0 = new THREE.PointLight(0xffffff, 1.5)
  // point0.position.set(2800, -500, 1400)
  // point0.castShadow = true
  // scene.value.add(point0)
  // const pointLightHelper = new THREE.PointLightHelper(point0, 100)
  // scene.value.add(pointLightHelper)

  // const point1 = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.5)
  // point1.position.set(0, 0, 0)
  // point1.decay = 0.0002
  // point1.castShadow = true
  // scene.value.add(point1)
  // const pointLightHelper1 = new THREE.PointLightHelper(point1, 10)
  // scene.value.add(pointLightHelper1)

  // const point3 = new THREE.PointLight(0x0062f5, 0.3)
  // point3.position.set(1500, 200, 1380)
  // point3.decay = 0.03
  // point3.castShadow = true
  // scene.value.add(point3)
  // const pointLightHelper3 = new THREE.PointLightHelper(point3, 10)
  // scene.value.add(pointLightHelper3)

  // -----------上面的是备份灯光

  const point0 = new THREE.PointLight(0xffffff, 1.3)
  // point0.position.set(2500, -500, 1400)
  point0.position.set(2500, -500, 865)
  point0.castShadow = true
  scene.value.add(point0)
  // gui.value = new dat.GUI()
  // const point0Value = gui.value.addFolder('点光位置0')
  // point0Value.add(point0.position, 'x', -3000, 3000)
  // point0Value.add(point0.position, 'y', -3000, 3000)
  // point0Value.add(point0.position, 'z', -3000, 3000)

  const point2 = new THREE.PointLight(0xffffff, 1.2)
  // point2.position.set(50, -200, -200)
  point2.position.set(50, -260, 443)
  point2.castShadow = true
  scene.value.add(point2)
  // const point2Value = gui.value.addFolder('点光位置2')
  // point2Value.add(point2.position, 'x', -3000, 3000)
  // point2Value.add(point2.position, 'y', -3000, 3000)
  // point2Value.add(point2.position, 'z', -3000, 3000)

  const point1 = new THREE.HemisphereLight(0x080a12, 0x000000, 1.3)
  // point1.position.set(0, 0, 0)
  point1.position.set(2171, 709, 576)
  point1.decay = 0.0002
  point1.castShadow = true
  scene.value.add(point1)
  // const point1Value = gui.value.addFolder('半球光光位置1')
  // point1Value.add(point1.position, 'x', -3000, 3000)
  // point1Value.add(point1.position, 'y', -3000, 3000)
  // point1Value.add(point1.position, 'z', -3000, 3000)

  const point3 = new THREE.PointLight(0x0062f5, 0.01)
  // point3.position.set(1500, 200, 1380)
  point3.position.set(1507, -553, 975)
  point3.decay = 0.03
  point3.angle = Math.PI / 3
  point3.castShadow = true
  scene.value.add(point3)
  // const point3Value = gui.value.addFolder('点光位置3')
  // point3Value.add(point3.position, 'x', -3000, 3000)
  // point3Value.add(point3.position, 'y', -3000, 3000)
  // point3Value.add(point3.position, 'z', -3000, 3000)

  const point4 = new THREE.PointLight(0xffffff, 0.4)
  // point4.position.set(1200, -900, -1100)
  point4.position.set(1573, -155, -1100)
  point4.castShadow = true
  scene.value.add(point4)
  // const point4Value = gui.value.addFolder('点光位置4')
  // point4Value.add(point4.position, 'x', -3000, 3000)
  // point4Value.add(point4.position, 'y', -3000, 3000)
  // point4Value.add(point4.position, 'z', -3000, 3000)

  const point5 = new THREE.PointLight(0xffffff, 0.4)
  // point5.position.set(1000, -700, -980)
  point5.position.set(1241, -700, 2238)
  point5.castShadow = true
  scene.value.add(point5)
  // const point5Value = gui.value.addFolder('点光位置5')
  // point5Value.add(point5.position, 'x', -3000, 3000)
  // point5Value.add(point5.position, 'y', -3000, 3000)
  // point5Value.add(point5.position, 'z', -3000, 3000)

  // 试错
  const point6 = new THREE.PointLight(0xffffff, 1.6)
  // point6.position.set(-1800, -300, -500)
  point6.position.set(-288, -354, -553)
  point6.castShadow = true
  scene.value.add(point6)
  // const point6Value = gui.value.addFolder('点光位置6')
  // point6Value.add(point6.position, 'x', -3000, 3000)
  // point6Value.add(point6.position, 'y', -3000, 3000)
  // point6Value.add(point6.position, 'z', -3000, 3000)

  const fbxLoader = new GLTFLoader()
  fbxLoader.load('model/yh24.gltf', function (object) {
    object.scene.position.y = -8
    object.scene.position.z = -6
    object.scene.castShadow = true
    object.scene.receiveShadow = true
    object.scene.children.forEach(item => {
      item.castShadow = true
      item.receiveShadow = true
    })
    object.cameras.forEach(item => {
      if (item.name === '摄像机1') {
        item.visible = false
      }
    })
    scene.value.add(object.scene)
    rotateModel.value = object.scene
    console.log(object)
    // poly1：C++  3
    // poly2：移动设备  2
    // poly3：信息化  6
    // poly3_1：VRAR  1
    // poly4：人工智能  5
    // poly5：数字孪生  4
    object.scene.children[0].children.forEach(item => {
      console.log(item.name, item.rotation)
    })
    console.log(object.scene.children[0].children)
  }, size => {
    console.log(size)
    if (size.loaded >= 3760000) {
      document.querySelector('.loadEffect').style.display = 'none'
      document.querySelector('.success-list').style.display = 'block'
      document.querySelector('.under-txt').style.display = 'block'
      document.querySelector('.in-line').style.display = 'block'
      document.querySelector('.under-line').style.display = 'block'
      document.querySelector('.toggleDisplay').style.display = 'block'
      isShowTips.value = true
      console.log(timer.value)
      if (timer.value) {
        clearInterval(timer.value)
        swipeText()
      }
    } else {
      clearInterval(timer.value)
      document.querySelector('.loadEffect').style.display = 'block'
    }
  }, error => {
    console.log(error)
  })
  const geometry = new THREE.PlaneGeometry(130, 200)
  const groundMirror = new Reflector(geometry, {
    clipBias: 0.001,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color: 0x000010
  })
  groundMirror.position.y = -7.8
  groundMirror.position.x = 0
  groundMirror.rotateX(-Math.PI / 2)
  scene.value.add(groundMirror)
}
const animate = () => {
  requestAnimationFrame(animate)
  renderer.value.clear()
  if (!isDownOrUp.value) {
    isRoate()
  }
  renderer.value.render(toRaw(scene.value), camera.value)
  renderer.value.clearDepth()
}
// 控制是否旋转
const isRoate = () => {
  if (rotateModel.value) {
    rotateModel.value.rotation.x = 0
    rotateModel.value.rotation.y += 0.005
    rotateModel.value.rotation.z = 0
  }
}

// 监听鼠标按下事件
const handleMouseDown = () => {
  isDownOrUp.value = true
  container.value.style.cursor = 'grabbing'
  document.querySelector('.circle').style.transform = 'scale(.7)'
  // 清除定时器
  clearInterval(timer.value)
}
// 监听鼠标松开事件
const handleMouseUp = () => {
  isDownOrUp.value = false
  container.value.style.cursor = 'grab'
  document.querySelector('.circle').style.transform = 'scale(1)'
  // 重新开启定时器
  swipeText()
}
// 监听鼠标移动事件
const handleMouseMove = (e) => {
  if (document.querySelector('.circle')) {
    document.querySelector('.circle').style.left = e.pageX + 'px'
    document.querySelector('.circle').style.top = e.pageY + 'px'
  }
  if (e.target.localName === 'canvas') {
    if (document.querySelector('.circle .tips') && isShowTips.value) {
      document.querySelector('.circle .tips').style.display = 'block'
    }
  } else {
    if (document.querySelector('.circle .tips')) {
      document.querySelector('.circle .tips').style.display = 'none'
    }
  }
}
// 轮播文字
const swipeText = () => {
  timer.value = setInterval(function () {
    i.value++
    if (document.querySelector('.success-item')) {
      document.querySelector('.success-item').innerHTML = textList[i.value]?.title
      document.querySelector('.success-item-index').innerHTML = textList[i.value]?.titleIndex
      document.querySelector('.under-txt .cur').innerHTML = parseInt(textList[i.value]?.titleIndex)
    }
    if (i.value >= 5) {
      i.value = -1
    }
  }, 3610)
}
// 鼠标经过事件
const handleMouseOver = (e) => {
  if (e.target.dataset.arrowlr === '1') {
    isActArrow.value = false
  }
}
// 鼠标离开事件
const handleMouseOut = () => {
  isActArrow.value = true
}
// 前往成功案例详情页
const toSuccessList = (e) => {
  listIndex.value = parseInt(e.target.parentNode.previousElementSibling.innerHTML)
  router.push('/successlist/' + listIndex.value)
}
defineExpose({
  init,
  animate
})
</script>

<style lang="less" scoped>
.box {
  overflow: hidden;
}
#model-container {
  width: 100%;
  height: 100vh;
  cursor: grab;
}
.container-box {
  position: relative;
}
.success-list {
  display: none;
  position: absolute;
  top: 487px;
  left: 122px;
  font-size: 64px;
  color: #ffffff;
  font-family: Source Han Sans CN;
  font-weight: bold;
  height: 64px;
  line-height: 64px;
  padding-bottom: 50px;
  border-bottom: 1px solid #0B65A3;
}
.in-line {
  display: none;
  width: 78px;
  border: 1px solid #00FFBA;
  position: absolute;
  top: 600px;
  left: 256px;
}
.success-item-index {
  position: absolute;
  top: 150px;
  left: 0px;
  width: 63px;
  height: 35px;
  font-size: 60px;
  font-family: YouSheBiaoTiHei;
  font-weight: 400;
  color: #19FFEC;
  line-height: 108px;
}
.arrow {
  position: absolute;
  top: 175px;
  left: 130px;
  .arrow-right:hover {
    cursor: pointer;
  }
}
.circle {
  position: absolute;
  width: 65px;
  height: 50px;
  border: 1px solid #333;
  border-radius: 50%;
  font-size: 14px;
  padding-top: 20px;
  text-align: center;
  color: #ffffff;
  background-color: rgba(0, 0, 0, .2);
}
.circle .tips {
  display: none;
}
.under-line {
  display: none;
  position: absolute;
  top: 900px;
  left: 120px;
}
.under-txt {
  display: none;
  position: absolute;
  top: 920px;
  left: 1770px;
  span {
    width: 22px;
    height: 17px;
    font-size: 16px;
    font-family: Source Han Sans CN;
    font-weight: 300;
    color: #0B65A3;
    line-height: 16px;
  }
}

.toggleDisplay {
  display: none;
  position: absolute;
  z-index: 999;
  top: 42px;
  left: 355px;
  .toggleBtn {
    cursor: pointer;
    width: 100px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 15px;
    font-weight: 550;
    border: 1px solid #52a9c4;
    background-color: #52a9c4;
    color: white;
  }
}

.loadEffect {
  display: none;
  width: 100px;
  height: 100px;
  margin-left: 50%;
  transform: translate(-50%, -525%);
  position: absolute;
}
.loadEffect span {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: lightgreen;
  position: absolute;
  animation: load 1.04s ease infinite;
}
@keyframes load {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
}
.loadEffect span:nth-child(1) {
  left: 0;
  top: 50%;
  margin-top: -8px;
  animation-delay: 0.13s;
}
.loadEffect span:nth-child(2) {
  left: 14px;
  top: 14px;
  animation-delay: 0.26s;
}
.loadEffect span:nth-child(3) {
  left: 50%;
  top: 0;
  margin-left: -8px;
  animation-delay: 0.39s;
}
.loadEffect span:nth-child(4) {
  top: 14px;
  right: 14px;
  animation-delay: 0.52s;
}
.loadEffect span:nth-child(5) {
  right: 0;
  top: 50%;
  margin-top: -8px;
  animation-delay: 0.65s;
}
.loadEffect span:nth-child(6) {
  right: 14px;
  bottom: 14px;
  animation-delay: 0.78s;
}
.loadEffect span:nth-child(7) {
  bottom: 0;
  left: 50%;
  margin-left: -8px;
  animation-delay: 0.91s;
}
.loadEffect span:nth-child(8) {
  bottom: 14px;
  left: 14px;
  animation-delay: 1.04s;
}
</style>
