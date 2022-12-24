<!--
 * @Description: 室内模型
 * @Author: 杨锐
 * @version: 0.1
 * @LastEditTime: 2022-12-12 18:36:27
-->

<template>
  <div ref="container" class="container"></div>
  <!-- 返回 -->
  <div class="fanhui" v-if="show" @click="clickBack">
    <img src="@/assets/images/后退1.png" alt="" class="fanhui1" />
  </div>
  <!-- 切换白天晚上（动态显示天空） -->
  <div class="toggleDisplay">
    <button
      class="toggleBtn"
      id="daylight"
      v-show="isShowSky"
      @click="toggleFn"
    >
      切换到白天场景
    </button>
    <button
      class="toggleBtn"
      id="evening"
      v-show="!isShowSky"
      @click="toggleFn"
    >
      切换到傍晚场景
    </button>
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
  <loadingPage :info="state"></loadingPage>
</template>

<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { onBeforeUnmount, onMounted, reactive, ref, toRaw } from 'vue'
import { Loading } from '@/components/loading/loading'
import { MeshPhysicalMaterial } from 'three'
import loadingPage from '@/components/loading/loadingPage'
import * as dat from 'dat.gui'
import router from '@/router'

// const load = ref()
// const loading = () => {
//   load.value = new Loading({
//     type: 1,
//     tipLabel: '触及科技',
//     wrap: document.body
//   })
// }
// const loadingHide = () => {
//   setTimeout(() => {
//     load.value.hide()
//   }, 5000)
// }
// const loadingInit = () => {
//   load.value.init()
// }

const state = ref(true)

const show = ref(true)

const clickBack = async () => {
  show.value = false
  router.push('/interior')
}

const isShowSky = ref(true)
const timer1 = ref(null)
const timer2 = ref(null)
const toggleFn = (e) => {
  isShowSky.value = !isShowSky.value
  // 切换白天
  if (e.target.id === 'daylight') {
    // 显示天空
    document.querySelector('.loadEffect').style.display = 'block'
    showSky()
    timer1.value = setInterval(() => {
      if (scene.value.background !== null || scene.value.environment !== null) {
        document.querySelector('.loadEffect').style.display = 'none'
        scene.value.children.forEach((child) => {
          if (child.type === 'DirectionalLight') {
            child.intensity = 0.35
          }
        })
        clearInterval(timer1.value)
      }
    }, 1000)
  } else {
    // 隐藏天空
    clearInterval(timer1.value)
    document.querySelector('.loadEffect').style.display = 'block'
    scene.value.background = null
    scene.value.environment = null
    timer2.value = setTimeout(() => {
      if (scene.value.background === null && scene.value.environment === null) {
        document.querySelector('.loadEffect').style.display = 'none'
        scene.value.children.forEach((child) => {
          if (child.type === 'DirectionalLight') {
            child.intensity = 0
          }
        })
      }
    }, 150)
  }
}

// 初始化场景
const scene = ref(null)
const initScene = () => {
  scene.value = new THREE.Scene()
  // scene.value.rotateY(1)
  // const axes = new THREE.AxesHelper(1000)
  // scene.value.add(axes)
}

// 初始化相机
const camera = ref(null)
const initCamera = () => {
  camera.value = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    3000
  )
  // camera.value.position.set(200, 50, 100) // 相机测试位
  camera.value.position.set(40, 35, -35) // 相机最终位
}

// 初始化渲染器
const renderer = ref(null)
const container = ref(null)
const initRender = () => {
  renderer.value = new THREE.WebGLRenderer({ antialias: true })
  renderer.value.setSize(
    container.value.clientWidth,
    container.value.clientHeight
  )
  // 告诉渲染器需要阴影效果
  renderer.value.shadowMap.enabled = true
  renderer.value.shadowMap.type = THREE.PCFSoftShadowMap // 使用Percentage-Closer Soft Shadows (PCSS) 算法来过滤阴影映射
  container.value.appendChild(renderer.value.domElement)
}

// 导入纹理
// 初始化模型
const initModel = () => {
  const textureLoader = new THREE.TextureLoader()

  // 贴图集合
  const marbleWallTexture = textureLoader.load(
    'texture/wall/vdfjbchv_2K_Albedo.jpg'
  )
  const floorTexture = textureLoader.load(
    'texture/floor/uh1kefxv_2K_Albedo.jpg'
  )
  const windowFloorTexture = textureLoader.load(
    'texture/besideWindowFloor/uh4kahyg_4K_Albedo.jpg'
  )
  const tableTexture = textureLoader.load(
    'texture/table/tfiqbghc_4K_Albedo.jpg'
  )
  tableTexture.rotation = Math.PI / 2
  const grassTexture = textureLoader.load(
    'texture/grass/pfdh2js_4K_Albedo.jpg'
  )
  const moreWallTexture = textureLoader.load(
    'texture/moreWall/wfnhfaq_2K_Albedo.jpg'
  )
  const windowBorderTexture = textureLoader.load(
    'texture/windowBorder/shkafchc_2K_Albedo.jpg'
  )
  const flowerBoxTexture = textureLoader.load(
    'texture/flowerBox/vlzhcfsew_2K_Albedo.jpg'
  )

  // 法线贴图
  const marbleWallNormal = textureLoader.load(
    'texture/wall/vdfjbchv_2K_Normal.jpg'
  )
  const floorNormal = textureLoader.load(
    'texture/floor/uh1kefxv_2K_Normal.jpg'
  )
  const windowFloorNormal = textureLoader.load(
    'texture/besideWindowFloor/uh4kahyg_4K_Normal.jpg'
  )
  const tableNormal = textureLoader.load(
    'texture/table/tfiqbghc_4K_Normal.jpg'
  )
  tableNormal.rotation = Math.PI / 2
  const grassNormal = textureLoader.load('texture/grass/pfdh2js_4K_Normal.jpg')
  const moreWallNormal = textureLoader.load(
    'texture/moreWall/wfnhfaq_2K_Normal.jpg'
  )
  const windowBorderNormal = textureLoader.load(
    'texture/windowBorder/shkafchc_2K_Normal.jpg'
  )
  const flowerBoxNormal = textureLoader.load(
    'texture/flowerBox/vlzhcfsew_2K_Normal.jpg'
  )

  // 粗糙度贴图
  const marbleWallRough = textureLoader.load(
    'texture/wall/vdfjbchv_2K_Roughness.jpg'
  )
  const floorRough = textureLoader.load(
    'texture/floor/uh1kefxv_2K_Roughness.jpg'
  )
  const windowFloorRough = textureLoader.load(
    'texture/besideWindowFloor/uh4kahyg_4K_Roughness.jpg'
  )
  const tableRough = textureLoader.load(
    'texture/table/tfiqbghc_4K_Roughness.jpg'
  )
  tableRough.rotation = Math.PI / 2
  const grassRough = textureLoader.load(
    'texture/grass/pfdh2js_4K_Roughness.jpg'
  )
  const moreWallRough = textureLoader.load(
    'texture/moreWall/wfnhfaq_2K_Roughness.jpg'
  )
  const windowBorderRough = textureLoader.load(
    'texture/windowBorder/shkafchc_2K_Roughness.jpg'
  )
  const flowerBoxRough = textureLoader.load(
    'texture/flowerBox/vlzhcfsew_2K_Roughness.jpg'
  )

  // 环境遮挡贴图
  const marbleWallAoMap = textureLoader.load('texture/wall/vdfjbchv_2K_AO.jpg')
  const windowFloorAoMap = textureLoader.load(
    'texture/besideWindowFloor/uh4kahyg_4K_AO.jpg'
  )
  const floorAoMap = textureLoader.load('texture/floor/uh1kefxv_2K_AO.jpg')
  const grassAoMap = textureLoader.load('texture/grass/pfdh2js_4K_AO.jpg')
  const moreWallAoMap = textureLoader.load(
    'texture/moreWall/wfnhfaq_2K_AO.jpg'
  )
  // const windowBorderAoMap = textureLoader.load('texture/windowBorder/shkafchc_2K_AO.jpg')
  const flowerBoxAoMap = textureLoader.load(
    'texture/flowerBox/vlzhcfsew_2K_AO.jpg'
  )

  // 导入置换贴图
  const marbleWallDisplacement = textureLoader.load(
    'texture/wall/vdfjbchv_2K_Displacement.jpg'
  )
  const floorDisplacement = textureLoader.load(
    'texture/floor/uh1kefxv_2K_Displacement.jpg'
  )
  const windowFloorDisplacement = textureLoader.load(
    'texture/besideWindowFloor/uh4kahyg_4K_Displacement.jpg'
  )
  // const tableDisplacement = textureLoader.load('texture/table/vdcjecc_4K_Displacement.jpg')
  // const grassDisplacement = textureLoader.load('texture/grass/pfdh2js_4K_Displacement.jpg')
  // const windowBorderDisplacement = textureLoader.load('texture/windowBorder/ve4kaaxcw_2K_Displacement.jpg')

  marbleWallTexture.repeat.set(5, 5)
  marbleWallTexture.wrapS = THREE.MirroredRepeatWrapping
  marbleWallTexture.wrapT = THREE.MirroredRepeatWrapping
  marbleWallNormal.repeat.set(5, 5)
  marbleWallNormal.wrapS = THREE.MirroredRepeatWrapping
  marbleWallNormal.wrapT = THREE.MirroredRepeatWrapping
  marbleWallRough.repeat.set(5, 5)
  marbleWallRough.wrapS = THREE.MirroredRepeatWrapping
  marbleWallRough.wrapT = THREE.MirroredRepeatWrapping
  marbleWallAoMap.repeat.set(5, 5)
  marbleWallAoMap.wrapS = THREE.MirroredRepeatWrapping
  marbleWallAoMap.wrapT = THREE.MirroredRepeatWrapping

  floorTexture.repeat.set(8, 4)
  floorTexture.wrapS = THREE.MirroredRepeatWrapping
  floorTexture.wrapT = THREE.MirroredRepeatWrapping
  floorDisplacement.repeat.set(8, 4)
  floorDisplacement.wrapS = THREE.MirroredRepeatWrapping
  floorDisplacement.wrapT = THREE.MirroredRepeatWrapping
  floorNormal.repeat.set(8, 4)
  floorNormal.wrapS = THREE.MirroredRepeatWrapping
  floorNormal.wrapT = THREE.MirroredRepeatWrapping
  floorAoMap.repeat.set(8, 4)
  floorAoMap.wrapS = THREE.MirroredRepeatWrapping
  floorAoMap.wrapT = THREE.MirroredRepeatWrapping
  floorRough.repeat.set(8, 4)
  floorRough.wrapS = THREE.MirroredRepeatWrapping
  floorRough.wrapT = THREE.MirroredRepeatWrapping

  windowFloorTexture.repeat.set(8, 4)
  windowFloorTexture.wrapS = THREE.MirroredRepeatWrapping
  windowFloorTexture.wrapT = THREE.MirroredRepeatWrapping
  windowFloorDisplacement.repeat.set(8, 4)
  windowFloorDisplacement.wrapS = THREE.MirroredRepeatWrapping
  windowFloorDisplacement.wrapT = THREE.MirroredRepeatWrapping
  windowFloorNormal.repeat.set(8, 4)
  windowFloorNormal.wrapS = THREE.MirroredRepeatWrapping
  windowFloorNormal.wrapT = THREE.MirroredRepeatWrapping
  windowFloorAoMap.repeat.set(8, 4)
  windowFloorAoMap.wrapS = THREE.MirroredRepeatWrapping
  windowFloorAoMap.wrapT = THREE.MirroredRepeatWrapping
  windowFloorRough.repeat.set(8, 4)
  windowFloorRough.wrapS = THREE.MirroredRepeatWrapping
  windowFloorRough.wrapT = THREE.MirroredRepeatWrapping

  windowBorderTexture.repeat.set(8, 4)
  windowBorderTexture.wrapS = THREE.MirroredRepeatWrapping
  windowBorderTexture.wrapT = THREE.MirroredRepeatWrapping
  windowBorderNormal.repeat.set(8, 4)
  windowBorderNormal.wrapS = THREE.MirroredRepeatWrapping
  windowBorderNormal.wrapT = THREE.MirroredRepeatWrapping
  // windowBorderAoMap.repeat.set(8, 4)
  // windowBorderAoMap.wrapS = THREE.MirroredRepeatWrapping
  // windowBorderAoMap.wrapT = THREE.MirroredRepeatWrapping
  windowBorderRough.repeat.set(8, 4)
  windowBorderRough.wrapS = THREE.MirroredRepeatWrapping
  windowBorderRough.wrapT = THREE.MirroredRepeatWrapping

  flowerBoxTexture.repeat.set(4, 4)
  flowerBoxTexture.wrapS = THREE.MirroredRepeatWrapping
  flowerBoxTexture.wrapT = THREE.MirroredRepeatWrapping
  flowerBoxNormal.repeat.set(4, 4)
  flowerBoxNormal.wrapS = THREE.MirroredRepeatWrapping
  flowerBoxNormal.wrapT = THREE.MirroredRepeatWrapping
  flowerBoxAoMap.repeat.set(4, 4)
  flowerBoxAoMap.wrapS = THREE.MirroredRepeatWrapping
  flowerBoxAoMap.wrapT = THREE.MirroredRepeatWrapping
  flowerBoxRough.repeat.set(4, 4)
  flowerBoxRough.wrapS = THREE.MirroredRepeatWrapping
  flowerBoxRough.wrapT = THREE.MirroredRepeatWrapping

  tableTexture.repeat.set(4, 2)
  tableTexture.wrapS = THREE.MirroredRepeatWrapping
  tableTexture.wrapT = THREE.MirroredRepeatWrapping
  tableNormal.repeat.set(4, 2)
  tableNormal.wrapS = THREE.MirroredRepeatWrapping
  tableNormal.wrapT = THREE.MirroredRepeatWrapping
  tableRough.repeat.set(4, 2)
  tableRough.wrapS = THREE.MirroredRepeatWrapping
  tableRough.wrapT = THREE.MirroredRepeatWrapping

  moreWallTexture.repeat.set(8, 8)
  moreWallTexture.wrapS = THREE.MirroredRepeatWrapping
  moreWallTexture.wrapT = THREE.MirroredRepeatWrapping
  moreWallNormal.repeat.set(8, 8)
  moreWallNormal.wrapS = THREE.MirroredRepeatWrapping
  moreWallNormal.wrapT = THREE.MirroredRepeatWrapping
  moreWallRough.repeat.set(8, 8)
  moreWallRough.wrapS = THREE.MirroredRepeatWrapping
  moreWallRough.wrapT = THREE.MirroredRepeatWrapping

  // 创建右侧墙面材质
  const marbleWallMaterial = new THREE.MeshStandardMaterial({
    map: marbleWallTexture,
    aoMap: marbleWallAoMap,
    aoMapIntensity: 1,
    roughness: 1,
    roughnessMap: marbleWallRough,
    normalMap: marbleWallNormal,
    bumpMap: marbleWallDisplacement
    // side: THREE.DoubleSide // 双面贴图
  })

  // 创建主地板材质
  const floorMaterial = new THREE.MeshStandardMaterial({
    // color: '#f0f0f0',
    map: floorTexture,
    aoMap: floorAoMap,
    aoMapIntensity: 1,
    roughness: 1,
    roughnessMap: floorRough,
    normalMap: floorNormal
    // displacementMap: floorDisplacement
  })

  // 创建靠窗地板材质
  const windowFloorMaterial = new THREE.MeshStandardMaterial({
    map: windowFloorTexture,
    aoMap: windowFloorAoMap,
    aoMapIntensity: 1,
    roughness: 1,
    roughnessMap: windowFloorRough,
    normalMap: windowFloorNormal,
    bumpMap: windowFloorDisplacement
  })

  // 创建桌子材质
  const tableMaterial = new THREE.MeshStandardMaterial({
    map: tableTexture,
    // aoMap: tableAoMap,
    aoMapIntensity: 1,
    roughness: 1,
    roughnessMap: tableRough,
    normalMap: tableNormal
    // bumpMap: tableDisplacement
  })

  // 创建草地材质
  const grassMaterial = new THREE.MeshStandardMaterial({
    map: grassTexture,
    aoMap: grassAoMap,
    aoMapIntensity: 1,
    roughness: 1,
    roughnessMap: grassRough,
    normalMap: grassNormal
    // displacementMap: grassDisplacement,
    // displacementBias: 50
  })

  // 墙面材质
  const moreWallMaterial = new THREE.MeshStandardMaterial({
    map: moreWallTexture,
    aoMap: moreWallAoMap,
    aoMapIntensity: 1,
    roughness: 1,
    roughnessMap: moreWallRough,
    normalMap: moreWallNormal
  })

  // 窗户框材质
  const windowBorderMaterial = new THREE.MeshStandardMaterial({
    map: windowBorderTexture,
    // aoMap: windowBorderAoMap,
    aoMapIntensity: 1,
    roughness: 1,
    roughnessMap: windowBorderRough,
    normalMap: windowBorderNormal
  })

  // 窗户玻璃
  const params = {
    color: 0xffffff,
    // 类似透明度
    transmission: 0.9,
    opacity: 0.8,
    // 金属度
    metalness: 0,
    // 粗糙
    roughness: 0.1,
    // 折射率
    ior: 1.55,
    // 厚度 透过看物体的模糊程度
    thickness: 0.1,
    // 镜面强度
    specularIntensity: 0.8,
    // 镜面颜色
    specularColor: '#e2e2e2',
    // 光强度
    lightIntensity: 1
  }
  const glassMaterial = new MeshPhysicalMaterial({
    // side: DoubleSide,
    specularColor: '#e2e2e2',
    ...params
  })

  // 花坛材质
  const flowerBoxMaterial = new THREE.MeshStandardMaterial({
    map: flowerBoxTexture,
    aoMap: flowerBoxAoMap,
    aoMapIntensity: 1,
    roughness: 1,
    roughnessMap: flowerBoxRough,
    normalMap: flowerBoxNormal
  })

  // 加载纹理
  const texture1 = new THREE.Texture()

  // 加载图片
  const imgLoader = new THREE.ImageLoader()
  imgLoader.load('texture/pngTexture/lightModel.png', function (img) {
    // 将图片值赋于纹理
    texture1.image = img
    texture1.needsUpdate = true
  })

  // // 创建gltf加载器
  const loader = new GLTFLoader()
  loader.load('model/off8.gltf', function (obj) {
    console.log(obj)

    obj.scene.traverse(function (node) {
      if (node instanceof THREE.Mesh) {
        node.receiveShadow = true
      }
      if (node instanceof THREE.Object3D) {
        node.castShadow = true
        node.receiveShadow = true
      }
      if (node.name.includes('大理石墙面')) {
        node.material = marbleWallMaterial
        node.receiveShadow = false
        node.castShadow = false
      }
      if (node.name.includes('大理石地板')) {
        node.material = floorMaterial
      }
      if (node.name.includes('立方体54')) {
        node.material = windowFloorMaterial
      }
      if (node.name.includes('立方体56')) {
        node.material = windowFloorMaterial
      }
      if (node.name.includes('凳子')) {
        node.material = tableMaterial
      }
      if (node.name.includes('草')) {
        node.material = grassMaterial
      }
      if (node.name.includes('整体墙面')) {
        node.material = moreWallMaterial
        node.material.transparent = false
      }
      if (node.name.includes('立方体46') || node.name.includes('立方体47')) {
        node.material = windowBorderMaterial
      }
      if (node.name.includes('花坛')) {
        node.material = flowerBoxMaterial
      }
      if (node.name.includes('窗户')) {
        node.material = glassMaterial
        node.castShadow = false
      }
      if (node.name.includes('灯')) {
        node.material.transparent = true
        node.castShadow = false
      }
      if (node.name.includes('内嵌墙面')) {
        node.material = windowFloorMaterial
      }
      if (node.name.includes('立方体41') || node.name.includes('立方体40')) {
        node.material = moreWallMaterial
      }
      obj.scene.scale.set(2, 2, 2)
      obj.scene.position.set(0, 5, 0)
      scene.value.add(obj.scene)
      state.value = false
    })
    initLight()
  })

  // 加载HDR贴图
  // const hdr = new RGBELoader()
  // hdr.loadAsync('texture/hdr/天空2.hdr').then((texture) => {
  //   texture.mapping = THREE.EquirectangularReflectionMapping
  //   // scene.value.rotation.y = Math.PI * 1.3
  //   scene.value.background = texture
  //   scene.value.environment = texture
  //   renderer.value.toneMappingExposure = 10
  // })
}

const showSky = () => {
  // 加载HDR贴图
  const hdr = new RGBELoader()
  hdr.loadAsync('texture/hdr/天空2.hdr').then((texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping
    // scene.value.rotation.y = Math.PI * 1.3
    scene.value.background = texture
    scene.value.environment = texture
    renderer.value.toneMappingExposure = 10
  })
}

// 初始化光线
const initLight = () => {
  const ambientLight = new THREE.AmbientLight('0xfffff', 0.35) // 环境光
  scene.value.add(ambientLight)

  // 创建客厅主光
  const livingLight = new THREE.PointLight('white', 0.14) // 点光源
  livingLight.position.set(81, 126, 90)
  // 这两个值决定生成阴影密度 默认512
  livingLight.shadow.mapSize.height = 4096
  livingLight.shadow.mapSize.width = 4096
  livingLight.shadow.bias = -0.001
  livingLight.decay = 2
  livingLight.castShadow = true
  scene.value.add(livingLight)

  // const livingLightModel = gui.value.addFolder('主灯环境强度设置')
  // livingLightModel.add(livingLight, 'intensity', 0, 1)
  // livingLightModel.add(livingLight, 'decay', 0, 50)
  // livingLightModel.add(livingLight.position, 'x', 0, 150)
  // livingLightModel.add(livingLight.position, 'y', 0, 150)
  // livingLightModel.add(livingLight.position, 'z', 0, 150)
  // livingLightModel.add(ambientLight, 'intensity', 0, 1)

  // 设置墙面灯光
  // 第一盏灯
  const geometry = new THREE.SphereGeometry(3, 20, 16)
  const material = new THREE.MeshBasicMaterial({ color: 'white' })
  const sphere1 = new THREE.Mesh(geometry, material)
  sphere1.position.set(0, 89, -57) // 右侧墙面灯光位置
  scene.value.add(sphere1)

  const spotLight1 = new THREE.SpotLight(0xffee88, 0.8, 100, Math.PI / 4)
  spotLight1.position.set(0, 90, -57)
  spotLight1.castShadow = true
  spotLight1.penumbra = 1
  spotLight1.decay = 1
  spotLight1.target = sphere1
  scene.value.add(spotLight1)

  // 第二盏灯
  const sphere2 = new THREE.Mesh(geometry, material)
  sphere2.position.set(35, 89, -57) // 右侧墙面灯光位置
  scene.value.add(sphere2)

  const spotLight2 = new THREE.SpotLight(0xffee88, 0.8, 100, Math.PI / 4)
  spotLight2.position.set(35, 90, -57)
  spotLight2.castShadow = true
  spotLight2.penumbra = 1
  spotLight2.decay = 1
  spotLight2.target = sphere2
  scene.value.add(spotLight2)

  // 第三盏灯
  const sphere3 = new THREE.Mesh(geometry, material)
  sphere3.position.set(65, 89, -57) // 右侧墙面灯光位置
  scene.value.add(sphere3)

  const spotLight3 = new THREE.SpotLight(0xffee88, 0.8, 100, Math.PI / 4)
  spotLight3.position.set(65, 90, -57)
  spotLight3.castShadow = true
  spotLight3.penumbra = 1
  spotLight3.decay = 1
  spotLight3.target = sphere3
  scene.value.add(spotLight3)

  // 设置左侧靠窗灯光
  // 第一盏靠窗点光源
  const PointLight1 = new THREE.PointLight('white', 0.5)
  PointLight1.decay = 1
  PointLight1.distance = 200
  scene.value.add(PointLight1)

  const sphere4 = new THREE.Mesh(geometry, material)
  sphere4.position.set(20, 113.5, 200) // 右侧墙面灯光位置
  sphere4.add(PointLight1)
  scene.value.add(sphere4)

  // 第二盏靠窗点光源
  const PointLight2 = new THREE.PointLight('white', 1)
  PointLight2.decay = 1
  PointLight2.distance = 100
  scene.value.add(PointLight2)

  const sphere5 = new THREE.Mesh(geometry, material)
  sphere5.position.set(80, 113.5, 200) // 右侧墙面灯光位置
  sphere5.add(PointLight2)
  scene.value.add(sphere5)

  // 第三盏靠窗点光源
  const PointLight3 = new THREE.PointLight('white', 0.5)
  PointLight3.decay = 1
  PointLight3.distance = 100
  scene.value.add(PointLight3)

  const sphere6 = new THREE.Mesh(geometry, material)
  sphere6.position.set(130, 113.5, 200) // 右侧墙面灯光位置
  sphere6.add(PointLight3)
  scene.value.add(sphere6)

  // 设置二楼灯光
  // 二楼点光源1
  const PointLight4 = new THREE.PointLight('white', 0.3)
  PointLight4.position.set(-50, 142, 0) // 右侧墙面灯光位置
  PointLight4.decay = 2
  PointLight4.distance = 100
  PointLight4.castShadow = true
  scene.value.add(PointLight4)

  const sphere7 = new THREE.Mesh(geometry, material)
  sphere7.position.set(-50, 147, 0) // 右侧墙面灯光位置
  scene.value.add(sphere7)

  // 二楼点光源2
  const PointLight5 = new THREE.PointLight('white', 0.3)
  PointLight5.position.set(-50, 142, 50) // 右侧墙面灯光位置
  PointLight5.decay = 2
  PointLight5.distance = 100
  PointLight5.castShadow = true
  scene.value.add(PointLight5)

  const sphere8 = new THREE.Mesh(geometry, material)
  sphere8.position.set(-50, 147, 50) // 右侧墙面灯光位置
  scene.value.add(sphere8)

  const rectLight = new THREE.RectAreaLight(0xffffff, 0.4, 250, 95)
  rectLight.position.set(80, 113.4, 190)
  rectLight.lookAt(80, 130, 190)
  scene.value.add(rectLight)

  const rectLight2 = new THREE.RectAreaLight(0xffffff, 0.4, 350, 190)
  rectLight2.position.set(40, 142, 45)
  rectLight2.lookAt(40, 150, 45)
  scene.value.add(rectLight2)

  const rectLight3 = new THREE.RectAreaLight(0xffffff, 0.5, 350, 100)
  rectLight3.position.set(18, 87.6, -99.5)
  rectLight3.lookAt(18, 96, -99.5)
  scene.value.add(rectLight3)

  const rectLight4 = new THREE.RectAreaLight(0xffffff, 1.1, 210, 254)
  rectLight4.position.set(-141, 66, 92)
  rectLight4.lookAt(-141, 10, 92)
  scene.value.add(rectLight4)

  const rectLight5 = new THREE.RectAreaLight(0xffffff, 2, 45, 78)
  rectLight5.position.set(22, 84, 22)
  rectLight5.lookAt(22, 10, 22)
  scene.value.add(rectLight5)

  // 窗户光目标对象
  const test = new THREE.Object3D()
  test.position.set(80, -53, 200)
  scene.value.add(test)
  // 创建窗户光
  const windowLight = new THREE.DirectionalLight(0xffffff, 0)
  windowLight.position.set(200, 133, 660)

  windowLight.target = test
  windowLight.castShadow = true
  windowLight.shadow.mapSize.height = 4096
  windowLight.shadow.mapSize.width = 4096
  windowLight.shadow.camera.near = -500 // 产生阴影的最近距离
  windowLight.shadow.camera.far = 1000 // 产生阴影的最远距离
  windowLight.shadow.camera.left = -700 // 产生阴影距离位置的最左边位置
  windowLight.shadow.camera.right = 700 // 最右边
  windowLight.shadow.camera.top = 500 // 最上边
  windowLight.shadow.camera.bottom = -500 // 最下面
  windowLight.shadow.bias = -0.001
  scene.value.add(windowLight)

  // const windowLightModel = gui.value.addFolder('窗户光调试')
  // windowLightModel.add(windowLight.position, 'x', 0, 200)
  // windowLightModel.add(windowLight.position, 'y', 0, 200)
  // windowLightModel.add(windowLight.position, 'z', 100, 1000)
  // windowLightModel.add(windowLight, 'intensity', 0, 1)

  // const testModel = gui.value.addFolder('窗户光目标物体位置')
  // testModel.add(test.position, 'x', -200, 200)
  // testModel.add(test.position, 'y', -200, 200)
  // testModel.add(test.position, 'z', -200, 200)

  const indoorLightGeometry = new THREE.CylinderGeometry(2, 2, 1, 25)
  const indoorLightMaterial = new THREE.MeshBasicMaterial({ color: 'white' })
  const indoorLight1 = new THREE.Mesh(indoorLightGeometry, indoorLightMaterial)
  indoorLight1.position.set(-61, 67, -10) // 右侧墙面灯光位置
  scene.value.add(indoorLight1)
  //
  const indoorLight3 = new THREE.Mesh(indoorLightGeometry, indoorLightMaterial)
  indoorLight3.position.set(-150, 67, -10) // 右侧墙面灯光位置
  scene.value.add(indoorLight3)

  const indoorLight4 = new THREE.Mesh(indoorLightGeometry, indoorLightMaterial)
  indoorLight4.position.set(-176, 67, 61) // 右侧墙面灯光位置
  scene.value.add(indoorLight4)

  const indoorLight5 = new THREE.Mesh(indoorLightGeometry, indoorLightMaterial)
  indoorLight5.position.set(-70, 58, 61) // 右侧墙面灯光位置
  scene.value.add(indoorLight5)

  const indoorLight6 = new THREE.Mesh(indoorLightGeometry, indoorLightMaterial)
  indoorLight6.position.set(-181, 67, 128) // 右侧墙面灯光位置
  scene.value.add(indoorLight6)

  // // 用于位置打点
  // const test1 = new THREE.Mesh(geometry, material)
  // test1.position.set(-20, 45, -20)
  // test1.castShadow = true
  // scene.value.add(test1)
  //
  // const cameraValue1 = gui.value.addFolder('轨迹打点')
  // cameraValue1.add(test1.position, 'x', -200, 200)
  // cameraValue1.add(test1.position, 'y', 0, 200)
  // cameraValue1.add(test1.position, 'z', -200, 200)

  // const switchControlModel = gui.value.addFolder('开启轨道动画')
  // switchControlModel.add(switchControl, 'ON', true, false)
  // console.log(switchControl.ON)
}

const switchControl = reactive({ ON: true })

// 调试插件
// const gui = ref(null)
// gui.value = new dat.GUI()

// 初始化控制器
const control = ref(null)
const initControl = () => {
  // control.value = new OrbitControls(camera.value, renderer.value.domElement)
}

// 建立鼠标移动操作
const mouse = ref(new THREE.Vector3(0, 0, 1))

const onDocumentMouseMove = (event) => {
  mouse.value.x = (event.clientX - window.innerWidth / 2) / 3
  mouse.value.y = (event.clientY - window.innerHeight / 2) / 3
}

// 轨道打点
const curve = ref(
  new THREE.CatmullRomCurve3([
    new THREE.Vector3(160, 60, -20),
    new THREE.Vector3(100, 45, -35),
    new THREE.Vector3(40, 35, -35)
  ])
)

// 创建样条曲线，作为运动轨迹
// const createLine = () => {
//   const geometry = new THREE.BufferGeometry().setFromPoints(curve.value.getPoints(5000))
//   // 材质对象
//   const material = new THREE.LineBasicMaterial({
//     color: 'red'
//   })
//   // 线条模型对象
//   const line = new THREE.Line(geometry, material)
//   scene.value.add(line) // 线条对象添加到场景中
// }

// 渲染器更新
const progress = ref(0)
const render = () => {
  requestAnimationFrame(animate)
  if (switchControl.ON) {
    if (progress.value <= 1 - 0.0004 * 20) {
      const point = curve.value.getPointAt(progress.value) // 获取样条曲线指定点坐标，作为相机的位置
      const pointBox = curve.value.getPointAt(progress.value + 0.0004 * 20) // 获取样条曲线指定点坐标
      camera.value.position.set(point.x, point.y + 5, point.z)
      camera.value.lookAt(
        -mouse.value.x * 0.01 + pointBox.x - 5,
        -mouse.value.y * 0.005 + pointBox.y + 5,
        pointBox.z + 5
      )
      progress.value += mouse.value.x * 0.00003
      if (progress.value < 0) {
        progress.value = 0
      }
    } else {
      progress.value = 1 - 0.0004 * 20
    }
  }
}

// 初始化动画
const animate = () => {
  // 更新控制器
  if (renderer.value) {
    renderer.value.clear()
    renderer.value.clearDepth()
    renderer.value.render(toRaw(scene.value), camera.value)
    render()
    // requestAnimationFrame(render) // 浏览器自带获取hz刷新时间，每一帧重新渲染three.js
  }
}

onMounted(async () => {
  initScene()
  initCamera()
  initRender()

  document.addEventListener('mousemove', onDocumentMouseMove)
  await initModel()
  // initLight()
  initControl()
  animate()
})

const clearScene = () => {
  cancelAnimationFrame(animate)
  scene.value.traverse((child) => {
    if (child.material) {
      child.material.dispose()
    }
    if (child.geometry) {
      child.geometry.dispose()
    }
    child = null
  })
  renderer.value.forceContextLoss()
  renderer.value.dispose()
  scene.value.clear()
  camera.value = null
  control.value = null
  renderer.value.domElement = null
  renderer.value = null
  console.log('clearScene')
}

const clearGroup = (group) => {
  const clearCache = (item) => {
    item.geometry.dispose()
    item.material.dispose()
  }
  const removeObj = (obj) => {
    let arr = obj.children.filter((x) => x)
    arr.forEach((item) => {
      if (item.children.length) {
        removeObj(item)
      } else {
        clearCache(item)
        item.clear()
      }
    })
    obj.clear()
    arr = null
  }
  removeObj(group)
}

onBeforeUnmount(() => {
  // 删除gui
  // document
  //   .getElementsByClassName('ac')[0]
  //   .removeChild(document.getElementsByClassName('main')[0])
  document.removeEventListener('mousemove', onDocumentMouseMove)
  document.querySelector('.loadEffect').style.display = 'none'
  clearInterval(timer1.value)
  clearTimeout(timer2.value)
  clearScene()
  // clearGroup(scene.value.children)
  scene.value.remove(scene.value.children) // 删除组
  console.log('页面销毁完毕')
})
</script>

<style lang="less" scoped>
.container {
  width: 100vw;
  height: 100vh;
  position: absolute;
  background-color: #1c2147;
  left: 0;
  top: 0;
}
.fanhui {
  z-index: 999;
  position: absolute;
  top: 2vh;
  left: 2vw;

  .fanhui1 {
    z-index: 999;
    width: 40px;
    height: 40px;
    //transform: rotateZ(90deg);
  }
}

.fanhui:hover {
  cursor: pointer;
}

.toggleDisplay {
  position: absolute;
  top: 13px;
  left: 125px;
  .toggleBtn {
    cursor: pointer;
    width: 135px;
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
  margin-top: 25%;
  margin-left: 50%;
  transform: translate(-50%, -50%);
  position: relative;
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
