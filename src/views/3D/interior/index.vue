<template>
  <div ref="container" class="model">
  </div>
  <!-- 点击箭头 -->
  <div class="jiantou" v-if="show" @click="clickAnimate">
    <img src="@/assets/images/箭头1.png" alt="" class="jiantou1">
  </div>
  <!-- 返回 -->
  <div class="fanhui" v-if="show" @click="clickBack">
    <img src="@/assets/images/后退1.png" alt="" class="fanhui1">
  </div>
  <loadingPage :info="state"></loadingPage>
</template>

<script setup>
// import { useRouter } from 'vue-router'
import * as THREE from 'three'
import { Loading } from '@/components/loading/loading.js'
import { Water } from 'three/addons/objects/Water.js'
// 导入控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { onBeforeUnmount, onMounted, ref, toRaw } from 'vue'
import Animations from '@/utils/animations'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
import router from '@/router/index'
import loadingPage from '@/components/loading/loadingPage'

onMounted(async () => {
  // 加载器
  // loading()
  // await loadingInit()
  init() // 初始化场景
  initCamera() // 初始化相机
  initRender() // 初始化渲染器
  await initModel() // 初始化模型
  initLight() // 初始化光线
  initControl() // 初始化控制器
  animate() // 初始化动画
  state.value = false
  // loadingHide()
})

const state = ref(true)

// 控制箭头显示
const show = ref(false)
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
// 模型
const model = ref()
// logo顶部光源
const topLightModel = ref()
// logo边光
const logoLightModel = ref()
// 外墙
const wall = ref()
// 地面
const ground = ref()
// 灯架
const lampBracket = ref()
// 背景墙
const groundWall = ref()
// 背景墙左侧
const groundWallLeft = ref()
// 背景墙上侧
const groundWallTop = ref()
// 水池
const pond = ref()
// 水
const water = ref()
// 初始化场景
const scene = ref(null)
const init = () => {
  // 1.创建场景
  scene.value = new THREE.Scene()
}

// 初始化相机
const camera = ref(null)
const initCamera = () => {
  camera.value = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.value.position.set(-37, 20, -70)
  // eslint-disable-next-line camelcase
  // const y_axis = new THREE.Vector3(0, 1, 0)
  // // 旋转180度
  // const quaternion = new THREE.Quaternion()
  // const radian = Math.PI
  // camera.value.position.applyQuaternion(quaternion.setFromAxisAngle(y_axis, radian))
  scene.value.add(camera)
}

// 初始化渲染器
const renderer = ref(null)
const container = ref(null)
const initRender = () => {
  renderer.value = new THREE.WebGLRenderer({ antialias: true })
  // renderer.value = new THREE.WebGLRenderer({ antialias: true, canvas: true })
  renderer.value.setSize(container.value.clientWidth, container.value.clientHeight)
  // 告诉渲染器需要阴影效果
  renderer.value.shadowMap.enabled = true
  // 色调映射的曝光级别。默认是1
  renderer.value.toneMappingExposure = Math.pow(10, 5.0)
  // 物理光照
  // renderer.value.physicallyCorrectLights = true
  renderer.value.shadowMap.type = THREE.PCFSoftShadowMap // 使用Percentage-Closer Soft Shadows (PCSS) 算法来过滤阴影映射
  container.value.appendChild(renderer.value.domElement)
}

// 初始化模型
const initModel = async () => {
  // 底部平面
  const planeGeometry = new THREE.PlaneGeometry(1000, 1000)
  const planeMaterial = new THREE.MeshLambertMaterial({
    color: 'white',
    side: THREE.DoubleSide
  })
  const plane = new THREE.Mesh(planeGeometry, planeMaterial)
  plane.rotation.x = 0.5 * Math.PI
  plane.position.y = -5
  plane.receiveShadow = true // 可以接收阴影
  scene.value.add(plane)

  // 创建gltf加载器
  const loader = new GLTFLoader()
  await loader.loadAsync('model/interior/door.glb', (obj) => {
  }).then(obj => {
    obj.scene.traverse(function (node) {
      if (node instanceof THREE.Mesh) {
        node.receiveShadow = true
      }
      if (node instanceof THREE.Object3D) {
        node.castShadow = true
        node.receiveShadow = true
      }
      if (node.isMesh) {
        node.material.emissive = node.material.color
        node.material.emissiveMap = node.material.map
      }
      model.value = obj.scene.children[0].children
      obj.scene.position.x = -50
      scene.value.add(obj.scene)
    })

    // 获取模型
    model.value.forEach(async (item) => {
      if (item.name === '墙') {
        wall.value = item
        await wallMaterial() // 墙材质
      } else if (item.name === 'logo灯') {
        logoLightModel.value = item
        await logoLightModelMaterial()
      } else if (item.name === '灯') {
        topLightModel.value = item
        await topLightModelMaterial()
      } else if (item.name === '大理石地板1') {
        ground.value = item
        await groundMaterial()
      } else if (item.name === '灯柱') {
        lampBracket.value = item
        await lampBracketMaterial()
      } else if (item.name === '墙面1') {
        groundWall.value = item
        await groundWallMaterial()
      } else if (item.name === '背景墙左侧') {
        groundWallLeft.value = item
        await groundWallLeftMaterial()
      } else if (item.name === '背景墙顶部') {
        groundWallTop.value = item
        await groundWallTopMaterial()
      } else if (item.name === '水池') {
        pond.value = item
        await pondMaterial()
      } else if (item.name === '水') {
        water.value = item
        await waterMaterial()
      }
    })
  }).then((obj) => {
    // load.value.hide()
    show.value = true
  })
}

// 初始化光线
const initLight = () => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 1) // 环境光
  scene.value.add(ambientLight)

  // 创建客厅主光
  const bulbGeometry = new THREE.SphereGeometry(0, 16, 16)
  const pointBall = new THREE.MeshStandardMaterial({
    emissive: 0xffffee,
    emissiveIntensity: 1,
    color: 0x000000
  })
  const livingLight = new THREE.PointLight(0xffee88, 3, 1, 1) // 点光源
  livingLight.shadow.bias = 0
  // 设置光照投射阴影
  livingLight.castShadow = true
  // 设置阴影模糊度
  livingLight.shadow.radius = 10
  // 设置阴影清晰度
  livingLight.shadow.mapSize.set(4096, 4096)
  // 光的光源距离衰减(默认不衰减0)
  livingLight.distance = 0
  // 沿着光照距离的衰减量
  livingLight.decay = 2
  // 光功率
  livingLight.power = 3
  livingLight.position.set(-20, 60, 0)
  livingLight.add(new THREE.Mesh(bulbGeometry, pointBall))
  scene.value.add(livingLight)

  // 吧台主光组
  const bulbGeometry1 = new THREE.SphereGeometry(1, 16, 16)
  const pointBall1 = new THREE.MeshStandardMaterial({
    emissive: 0xffffee,
    emissiveIntensity: 1,
    color: 0x000000
  })
  const livingLight1 = new THREE.PointLight(0xffee88, 0.7, 1, 1) // 点光源
  livingLight1.shadow.bias = 0
  // 设置光照投射阴影
  livingLight1.castShadow = true
  // 设置阴影模糊度
  livingLight1.shadow.radius = 30
  // 设置阴影清晰度
  livingLight1.shadow.mapSize.set(10000, 10000)
  // 光的光源距离衰减(默认不衰减0)
  livingLight1.distance = 0
  // // 沿着光照距离的衰减量
  livingLight1.decay = 1
  // 光功率5
  livingLight1.power = 7
  livingLight1.position.set(-40, 40.037, -45)
  livingLight1.add(new THREE.Mesh(bulbGeometry1, pointBall1))
  scene.value.add(livingLight1)

  // 水面主光组
  const geometry = new THREE.SphereGeometry(0, 20, 16)
  const material = new THREE.MeshBasicMaterial({ color: 'white' })
  const sphere = new THREE.Mesh(geometry, material)
  const geometry2 = new THREE.SphereGeometry(0, 20, 16)
  const material2 = new THREE.MeshBasicMaterial({ color: 'white' })
  const sphere2 = new THREE.Mesh(geometry2, material2)
  const geometry3 = new THREE.SphereGeometry(0, 20, 16)
  const material3 = new THREE.MeshBasicMaterial({ color: 'white' })
  const sphere3 = new THREE.Mesh(geometry3, material3)
  sphere.position.set(38, 39, -67) // 灯光位置
  sphere2.position.set(38, 39, -47) // 灯光位置
  sphere3.position.set(38, 39, -30) // 灯光位置
  scene.value.add(sphere)
  scene.value.add(sphere2)
  scene.value.add(sphere3)

  const spotLight1 = new THREE.SpotLight(0xffee88, 0.4, 80, Math.PI / 8, 0.5)
  spotLight1.position.set(37, 41, -67)
  spotLight1.castShadow = true
  spotLight1.decay = 1
  spotLight1.target = sphere
  scene.value.add(spotLight1)

  const spotLight2 = new THREE.SpotLight(0xffee88, 0.4, 80, Math.PI / 8, 0.5)
  spotLight2.position.set(37, 41, -47)
  spotLight2.castShadow = true
  spotLight2.decay = 1
  spotLight2.target = sphere2
  scene.value.add(spotLight2)

  const spotLight3 = new THREE.SpotLight(0xffee88, 0.4, 80, Math.PI / 8, 0.5)
  spotLight3.position.set(37, 41, -30)
  spotLight3.castShadow = true
  spotLight3.decay = 1
  spotLight3.target = sphere3
  scene.value.add(spotLight3)

  // 吧台射灯
  const geometry4 = new THREE.SphereGeometry(0, 20, 16)
  const material4 = new THREE.MeshBasicMaterial({ color: 'white' })
  const sphere4 = new THREE.Mesh(geometry4, material4)
  const geometry5 = new THREE.SphereGeometry(0, 20, 16)
  const material5 = new THREE.MeshBasicMaterial({ color: 'white' })
  const sphere5 = new THREE.Mesh(geometry5, material5)
  const geometry6 = new THREE.SphereGeometry(0, 20, 16)
  const material6 = new THREE.MeshBasicMaterial({ color: 'white' })
  const sphere6 = new THREE.Mesh(geometry6, material6)
  sphere4.position.set(-5, 40, -36) // 灯光位置
  sphere5.position.set(-28, 40, -36) // 灯光位置
  sphere6.position.set(-52, 40, -36) // 灯光位置
  scene.value.add(sphere4)
  scene.value.add(sphere5)
  scene.value.add(sphere6)

  const spotLight4 = new THREE.SpotLight(0xffee88, 0.5, 80, Math.PI / 4, 0.5)
  spotLight4.position.set(-5, 41, -36.5)
  spotLight4.castShadow = true
  spotLight4.decay = 1
  spotLight4.target = sphere4
  scene.value.add(spotLight4)
  const spotLight5 = new THREE.SpotLight(0xffee88, 0.5, 80, Math.PI / 4, 0.5)
  spotLight5.position.set(-28, 41, -36.5)
  spotLight5.castShadow = true
  spotLight5.decay = 1
  spotLight5.target = sphere5
  scene.value.add(spotLight5)
  const spotLight6 = new THREE.SpotLight(0xffee88, 0.5, 80, Math.PI / 4, 0.5)
  spotLight6.position.set(-52, 41, -36.5)
  spotLight6.castShadow = true
  spotLight6.decay = 1
  spotLight6.target = sphere6
  scene.value.add(spotLight6)

  // logo灯光
  // const geometry7 = new THREE.SphereGeometry(1, 20, 16)
  // const material7 = new THREE.MeshBasicMaterial({ color: 'white' })
  // const sphere7 = new THREE.Mesh(geometry7, material7)
  // sphere7.position.set(-40, 23, -35) // 灯光位置
  // scene.value.add(sphere7)
  // const spotLight7 = new THREE.SpotLight(0xffee88, 0.5, 80, Math.PI / 4, 0.5)
  // spotLight7.position.set(-40, 25, -35.5)
  // spotLight7.castShadow = true
  // spotLight7.decay = 1
  // spotLight7.target = sphere7
  // scene.value.add(spotLight7)
}

// 初始化控制器
const control = ref(null)
const initControl = () => {
  control.value = new OrbitControls(camera.value, renderer.value.domElement)
  // 禁止滚轮缩放模型
  control.value.enableZoom = false
  control.value.enable = false
  // 禁止旋转
  control.value.enableRotate = false
  // 禁止右键拖曳
  control.value.enablePan = false
  // 控制器垂直方向最大旋转角度（理解为逆时针旋转角度）
  control.value.maxPolarAngle = 1.6
  // 控制器垂直方向最大小旋转角度（理解为顺时针旋转角度）
  control.value.minPolarAngle = 1.55
  // 控制器水平角度的旋转限制(最大)
  control.value.maxAzimuthAngle = 0
  // 控制器水平角度的旋转限制(最小)
  control.value.minAzimuthAngle = -0.15
}

// 渲染器更新
// 设置时间
// const clock = new THREE.Clock()
// const render = () => {
//   // 设置时间
//   // const clock = new THREE.Clock()
//   // const time = clock.getDelta()
//   // 添加控制器阻尼(鼠标拖动空间改变视角) ，让控制器更有真实感 ，必须要在动画循环中调用controls的 .update()
//   // requestAnimationFrame(render) // 浏览器自带获取hz刷新时间，每一帧重新渲染three.js
// }

// 初始化动画
const animate = () => {
  TWEEN && TWEEN.update()
  // const time = clock.getDelta()
  // camera.value.position.x = -40 - ((mouse.value.x * 5 - camera.value.position.x) * time * 2)
  // camera.value.position.y = 20 + ((mouse.value.y * 3 - camera.value.position.y) * time)
  // 更新控制器
  if (renderer.value) {
    // console.log(time)
    renderer.value.clear()
    renderer.value.render(toRaw(scene.value), camera.value)
    renderer.value.clearDepth()
    // control.value.update()
    requestAnimationFrame(animate)
  }
}

// 墙材质
const wallMaterial = () => {
  // 导入纹理
  const textureLoader = new THREE.TextureLoader()
  const moreWallTexture = textureLoader.load('texture/moreWall/wfnhfaq_2K_Albedo.jpg')
  const moreWallNormal = textureLoader.load('texture/moreWall/wfnhfaq_2K_Normal.jpg')
  const moreWallRough = textureLoader.load('texture/moreWall/wfnhfaq_2K_Roughness.jpg')
  const moreWallAoMap = textureLoader.load('texture/moreWall/wfnhfaq_2K_AO.jpg')
  // texture纹理显示
  // 贴图
  wall.value.material = new THREE.MeshStandardMaterial({
    map: moreWallTexture,
    aoMap: moreWallAoMap,
    aoMapIntensity: 1,
    roughness: 1,
    roughnessMap: moreWallRough,
    normalMap: moreWallNormal
  })
}

// logo灯光
const logoLightModelMaterial = () => {
  // logoLightModel.value.position.y = 70
}

// 顶部灯
const topLightModelMaterial = () => {
}

// 地板
const groundMaterial = () => {
  const textureLoader = new THREE.TextureLoader()
  const floorTexture = textureLoader.load('texture/floor/uh1kefxv_2K_Albedo.jpg')
  const floorAoMap = textureLoader.load('texture/floor/uh1kefxv_2K_AO.jpg')
  const floorRough = textureLoader.load('texture/floor/uh1kefxv_2K_Roughness.jpg')
  const floorNormal = textureLoader.load('texture/floor/uh1kefxv_2K_Normal.jpg')
  const floorDisplacement = textureLoader.load('texture/floor/uh1kefxv_2K_Displacement.jpg')
  floorTexture.repeat.set(8, 4)
  floorTexture.wrapS = THREE.MirroredRepeatWrapping
  floorTexture.wrapT = THREE.MirroredRepeatWrapping
  floorAoMap.repeat.set(8, 4)
  floorAoMap.wrapS = THREE.MirroredRepeatWrapping
  floorAoMap.wrapT = THREE.MirroredRepeatWrapping
  floorRough.repeat.set(8, 4)
  floorRough.wrapS = THREE.MirroredRepeatWrapping
  floorRough.wrapT = THREE.MirroredRepeatWrapping
  floorNormal.repeat.set(8, 4)
  floorNormal.wrapS = THREE.MirroredRepeatWrapping
  floorNormal.wrapT = THREE.MirroredRepeatWrapping
  floorDisplacement.repeat.set(8, 4)
  floorDisplacement.wrapS = THREE.MirroredRepeatWrapping
  floorDisplacement.wrapT = THREE.MirroredRepeatWrapping
  ground.value.material = new THREE.MeshStandardMaterial({
    // color: '#f0f0f0',
    map: floorTexture,
    aoMap: floorAoMap,
    aoMapIntensity: 1,
    roughness: 1,
    roughnessMap: floorRough,
    normalMap: floorNormal,
    displacementMap: floorDisplacement
  })
}

// 灯架材质
const lampBracketMaterial = () => {
  const textureLoader = new THREE.TextureLoader()
  const Color = textureLoader.load('model/interior/dengjia/shiny_wood_04_diffuse.png')
  const glossiness = textureLoader.load('model/interior/dengjia/shiny_wood_04_glossiness.png')
  const normal = textureLoader.load('model/interior/dengjia/shiny_wood_04_normal.png')
  lampBracket.value.material = new THREE.MeshStandardMaterial({
    map: Color,
    metalnessMap: glossiness, // 金属，镜面贴图
    normalMap: normal // 法线
  })
}

// 背景墙材质
const groundWallMaterial = () => {
  const textureLoader = new THREE.TextureLoader()
  const Color = textureLoader.load('model/interior/dengjia/shiny_wood_04_diffuse.png')
  const glossiness = textureLoader.load('model/interior/dengjia/shiny_wood_04_glossiness.png')
  const normal = textureLoader.load('model/interior/dengjia/shiny_wood_04_normal.png')
  groundWall.value.material = new THREE.MeshStandardMaterial({
    map: Color,
    metalnessMap: glossiness, // 金属，镜面贴图
    normalMap: normal // 法线
  })
}

// 背景墙左侧材质
const groundWallLeftMaterial = () => {
  // 导入纹理
  const textureLoader = new THREE.TextureLoader()
  const moreWallTexture = textureLoader.load('texture/moreWall/wfnhfaq_2K_Albedo.jpg')
  const moreWallNormal = textureLoader.load('texture/moreWall/wfnhfaq_2K_Normal.jpg')
  const moreWallRough = textureLoader.load('texture/moreWall/wfnhfaq_2K_Roughness.jpg')
  const moreWallAoMap = textureLoader.load('texture/moreWall/wfnhfaq_2K_AO.jpg')
  // texture纹理显示
  // 贴图
  groundWallLeft.value.material = new THREE.MeshStandardMaterial({
    map: moreWallTexture,
    aoMap: moreWallAoMap,
    aoMapIntensity: 1,
    roughness: 1,
    roughnessMap: moreWallRough,
    normalMap: moreWallNormal
  })
}

// 背景墙上侧
const groundWallTopMaterial = () => {
  // 导入纹理
  const textureLoader = new THREE.TextureLoader()
  const moreWallTexture = textureLoader.load('texture/moreWall/wfnhfaq_2K_Albedo.jpg')
  const moreWallNormal = textureLoader.load('texture/moreWall/wfnhfaq_2K_Normal.jpg')
  const moreWallRough = textureLoader.load('texture/moreWall/wfnhfaq_2K_Roughness.jpg')
  const moreWallAoMap = textureLoader.load('texture/moreWall/wfnhfaq_2K_AO.jpg')
  // texture纹理显示
  // 贴图
  groundWallTop.value.material = new THREE.MeshStandardMaterial({
    map: moreWallTexture,
    aoMap: moreWallAoMap,
    aoMapIntensity: 1,
    roughness: 1,
    roughnessMap: moreWallRough,
    normalMap: moreWallNormal
  })
}

// 水池
const pondMaterial = () => {
  const textureLoader = new THREE.TextureLoader()
  const Color = textureLoader.load('model/interior/水池/old_stone_pavement_25_95_diffuse.jpg')
  const normal = textureLoader.load('model/interior/水池/old_stone_pavement_25_95_normal.jpg')
  // 设置纹理重复的模式
  // 设置中心点 旋转原点 x,y
  // Color.center.set(0.5, 0)
  // 旋转
  // Color.rotation = Math.PI / 2
  Color.repeat.set(5, 5)
  Color.wrapS = THREE.MirroredRepeatWrapping
  Color.wrapT = THREE.MirroredRepeatWrapping
  pond.value.material = new THREE.MeshStandardMaterial({
    map: Color,
    normalMap: normal // 法线
  })
}

// 水面效果
const waterMaterial = () => {
  const water1 = new Water(
    water.value.geometry,
    {
      textureWidth: 512,
      textureHeight: 512,
      // 波纹法线
      waterNormals: new THREE.TextureLoader().load('model/interior/water/img.png', (texture) => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
      }),
      // 透明度
      alpha: 0.5,
      // 日光反射
      sunDirection: new THREE.Vector3(),
      // 日光反射
      sunColor: 0xffee88,
      // 水面反射
      waterColor: 0xffee88,
      // 水面倒影边缘清晰程度
      distortionScale: 8,
      // 雾体积
      fog: scene.value.fog !== undefined
    }
  )
  water.value.position.y = -30
  water1.position.set(-24.5, 0.2, -68)
  scene.value.add(water1)
}

// 自适应屏幕
window.addEventListener('resize', () => {
  // 更新摄像机
  camera.value.aspect = window.innerWidth / window.innerHeight
  // 更新摄像机投影矩阵
  camera.value.updateProjectionMatrix()

  // 更新渲染器
  renderer.value.setSize(window.innerWidth, window.innerHeight)
  // 设置渲染器的像素比
  renderer.value.setPixelRatio(window.devicePixelRatio)
})

// 光线对象
const raycaster = new THREE.Raycaster()
// 鼠标位置
const mouse = ref(null)
mouse.value = new THREE.Vector2()

// 监听鼠标移动（左右摇晃）
window.addEventListener('mousemove', (event) => {
  mouse.value.x = (event.clientX / window.innerWidth - 5).toFixed(2)
  mouse.value.y = (event.clientY / window.innerHeight - 5).toFixed(2)
  if (camera.value) {
    camera.value.position.x = -75 - mouse.value.x * 8
    camera.value.position.y = 40 + mouse.value.y * 5
  }
})

// 箭头点击事件
const clickAnimate = async () => {
  show.value = false
  await Animations.animateCamera(camera.value, control.value, { x: -30, y: 30, z: -40 }, { x: 0, y: 0, z: 0 }, 3000, () => {
  })
}

const clickBack = async () => {
  show.value = false
  router.push('/')
}

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
  // document.removeEventListener('mousemove', onDocumentMouseMove)
  clearScene()
  // clearGroup(scene.value.children)
  scene.value.remove(scene.value.children) // 删除组
  console.log('页面销毁完毕')
})

</script>

<style scoped lang="less">
.model {
  width: 100vw;
  height: 100vh;
  position: fixed;
  background-color: #1c2147;
  left: 0;
  top: 0;
}

// 箭头动画
.jiantou {
  z-index: 999;
  position: fixed;
  top: 35vh;
  left: 35vw;
  transition: All 0.4s ease-in-out;
  -webkit-transition: All 0.4s ease-in-out;
  -moz-transition: All 0.4s ease-in-out;
  -o-transition: All 0.4s ease-in-out;
  animation: finger infinite 4s;

  .jiantou1 {
    z-index: 999;
    width: 80px;
    transform: rotateZ(90deg);
  }
}

.fanhui {
  z-index: 999;
  position: fixed;
  top: 2vh;
  left: 2vw;

  .fanhui1 {
    z-index: 999;
    width: 40px;
    //transform: rotateZ(90deg);
  }
}

.fanhui:hover {
  cursor: pointer;
}

.jiantou:hover {
  cursor: pointer;
  transform: scale(1.2);
  -webkit-transform: scale(1.2);
  -moz-transform: scale(1.2);
  -o-transform: scale(1.2);
  -ms-transform: scale(1.2);
}

@keyframes finger {

  0% {

    transform: translate(-10px)
  }

  25% {
    transform: translate(10px)
  }

  50% {
    transform: translate(-10px)
  }

  75% {
    transform: translate(10px)
  }

  100% {
    transform: translate(-10px)
  }

}
</style>
