<template>
  <div class="box">
    <div id="threeBox" ref="threeBox"></div>
  </div>
  <div class="tips">点击进入触及科技办公区</div>
  <audio ref="audio" preload="auto" autoplay loop :src="require('@/assets/背景音效1.mp3')"></audio>
  <loadingPage :info="state"  :home="true"></loadingPage>
</template>
<script setup>
// defineExpose
import { onMounted, onBeforeUnmount, reactive, ref, toRaw } from 'vue'
import * as THREE from 'three'
import { useRouter } from 'vue-router'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// 导入hdr图像加载器
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js' // rebe加载器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js'
// import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper'
import { Reflector } from 'three/examples/jsm/objects/Reflector.js'
import dat from 'dat.gui'
import loadingPage from '@/components/loading/loadingPage'

// const domEle = ref(null) // DOM节点

const selectObject = ref(null) //  选中的模型
// eslint-disable-next-line no-undef

const pathArr = reactive([
  {
    name: 'YS',
    path: '/advantage'
  },
  {
    name: 'JS',
    path: '/technology'
  },
  {
    name: 'CG',
    path: '/success'
  },
  {
    name: 'GY',
    path: '/us'
  },
  {
    name: '17-13',
    path: '/interior'
  }
])
const threeBox = ref(null)
const router = useRouter()
onMounted(() => {
  init()
  animate()
})
onBeforeUnmount(() => {
  // 销毁页面时，清除定时器
  if (logoTimer.value) {
    clearInterval(logoTimer.value)
    logoTimer.value = null
  }
  if (loModel.value) {
    scene.remove(loModel.value)
  }
})
const scene = new THREE.Scene()
const camera = ref(null)
let renderer = null
let controls = null
let gui = null
const init = () => {
  camera.value = new THREE.PerspectiveCamera(
    30,
    threeBox.value.offsetWidth / threeBox.value.offsetHeight,
    0.1,
    2000
  )
  // camera.value.up.y = 100
  camera.value.castShadow = true
  camera.value.lookAt(new THREE.Vector3(0, 20, 0)) // 将相机指向场景
  // camera.value.position.set(-24, -3, 129)
  camera.value.position.set(-24, 5, 136)
  // const cameraHelper = new THREE.CameraHelper(camera.value)
  // scene.add(cameraHelper)
  skyTexture()
  // console.log(skyTexture)

  gui = new dat.GUI()
  const cameraValue = gui.addFolder('相机位置')
  cameraValue.add(camera.value.position, 'x', -1000, 1000)
  cameraValue.add(camera.value.position, 'y', -1000, 1000)
  cameraValue.add(camera.value.position, 'z', -1000, 1000)
  scene.add(camera.value)

  // 平面光
  const rectLight = new THREE.RectAreaLight(0xeeeeee, 1, 300, 300)
  // rectLight.position.set(1118, -646, 3324)
  rectLight.position.set(2442, -646, 1118)
  rectLight.lookAt(0, 0, 0)
  scene.add(rectLight)

  const rect1 = gui.addFolder('平面光1')
  rect1.add(rectLight.position, 'x', -10000, 10000)
  rect1.add(rectLight.position, 'y', -10000, 10000)
  rect1.add(rectLight.position, 'z', -10000, 10000)
  rect1.add(rectLight, 'intensity', 0, 3)

  // 平行光(有阴影)
  const directionalLight = new THREE.DirectionalLight('white', 0.3)
  // directionalLight.position.set(-2852, 457, 1780)
  directionalLight.position.set(16, 1118, 2442)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 1024
  directionalLight.shadow.mapSize.height = 1024
  directionalLight.shadow.camera.near = 50
  directionalLight.shadow.camera.far = 5000
  directionalLight.shadow.camera.left = -100 // 产生阴影距离位置的最左边位置
  directionalLight.shadow.camera.right = 100 // 最右边
  directionalLight.shadow.camera.top = 100 // 最上边
  directionalLight.shadow.camera.bottom = -100 // 最下面
  directionalLight.shadow.bias = -0.0005
  // directionalLight.shadow.radius = 0.1
  // directionalLight.name = 'dirlight'
  // directionalLight.shadowCameraVisible = true
  scene.add(directionalLight)
  const dire = gui.addFolder('平行光')
  dire.add(directionalLight.position, 'x', -10000, 10000)
  dire.add(directionalLight.position, 'y', -10000, 10000)
  dire.add(directionalLight.position, 'z', -10000, 10000)
  dire.add(directionalLight, 'intensity', 0, 3)

  // 添加半球光
  const hemisphereLight = new THREE.HemisphereLight('white', 1)
  // hemisphereLight.position.set(457, 236, 236)
  hemisphereLight.position.set(949, 16, 457)
  scene.add(hemisphereLight)
  const hemispherexx = gui.addFolder('半球光')
  hemispherexx.add(hemisphereLight.position, 'x', -10000, 10000)
  hemispherexx.add(hemisphereLight.position, 'y', -10000, 10000)
  hemispherexx.add(hemisphereLight.position, 'z', -10000, 10000)
  hemispherexx.add(hemisphereLight, 'intensity', 0, 3)

  // 环境光
  // const ambient = new THREE.AmbientLight(0xfff6c3, 0.5)
  const ambient = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambient)

  // 导入整体模型
  gltfLoadModel(scene, './model/zl11.gltf')
  // 渲染器
  renderer = new THREE.WebGLRenderer({
    // autoClear: true,
    antialias: true,
    logarithmicDepthBuffer: true
  })
  renderer.setClearColor(0x0000) // canvas画布颜色
  renderer.setSize(threeBox.value.offsetWidth, threeBox.value.offsetHeight) // canvas 画布大小
  renderer.shadowMap.enabled = true // 让渲染器支持投影
  // 设置渲染器像素比
  renderer.setPixelRatio(window.devicePixelRatio)
  threeBox.value.appendChild(renderer.domElement)
  // 控制器
  controls = new OrbitControls(camera.value, renderer.domElement)
  // 禁止滚轮缩放模型
  controls.enableZoom = false
  // 禁止右键拖曳
  controls.enablePan = false
  // 禁止旋转
  controls.enableRotate = false
  // 控制器垂直方向最大旋转角度（理解为逆时针旋转角度）
  // controls.maxPolarAngle = 1.59
  // 控制器垂直方向最大小旋转角度（理解为顺时针旋转角度）
  // controls.minPolarAngle = 1.54
  // 控制器水平角度的旋转限制(最大)
  // controls.maxAzimuthAngle = 0
  // 控制器水平角度的旋转限制(最小)
  // controls.minAzimuthAngle = -0.1
  // 监听点击事件
  threeBox.value.addEventListener('click', onMouseDblclick, false)
  threeBox.value.addEventListener('mousemove', onMouseEnter, false)
  // 监听窗口变化
  window.addEventListener('resize', windowSize, false)

  scene.position.set(30, -14, -9)
  scene.rotation.set(0, 3.8, 0)

  const sceneValue = gui.addFolder('模型位置')
  sceneValue.add(scene.position, 'x', -100, 100)
  sceneValue.add(scene.position, 'y', -100, 100)
  sceneValue.add(scene.position, 'z', -100, 100)
  // console.log(scene)
  const sceneValue1 = gui.addFolder('模型旋转')
  sceneValue1.add(scene.rotation, 'x', -100, 100)
  sceneValue1.add(scene.rotation, 'y', -100, 100)
  sceneValue1.add(scene.rotation, 'z', -100, 100)
}
// 鼠标位置
const mouse = ref(null)
mouse.value = new THREE.Vector2()
// 监听鼠标移动（左右摇晃）
window.addEventListener('mousemove', (event) => {
  if (document.querySelector('.tips')) {
    document.querySelector('.tips').style.left = event.pageX + 20 + 'px'
    document.querySelector('.tips').style.top = event.pageY + 20 + 'px'
  }
  mouse.value.x = (event.clientX / window.innerWidth - 5).toFixed(2)
  mouse.value.y = (event.clientY / window.innerHeight - 5).toFixed(2)
  if (camera.value) {
    camera.value.position.x = -50 - mouse.value.x * 10
    camera.value.position.y = 40 + mouse.value.y * 8
  }
})
window.addEventListener('mousedown', (e) => {
  console.log(e.button)
})
// 天空
const skyTexture = () => {
  // 加载hdr环境图
  const rgbeLoader = new RGBELoader()
  // 资源较大，使用异步加载
  rgbeLoader.loadAsync('./texture/hdr/sky.hdr').then((texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping
    // 将加载的材质texture设置给背景和环境
    scene.background = texture
    // scene.environment = texture
  })
}
const windowSize = () => {
  if (threeBox.value) {
    // 更新摄像头宽高
    camera.value.aspect =
      threeBox.value.offsetWidth / threeBox.value.offsetHeight
    // 更新渲染器宽高
    renderer.setSize(threeBox.value.offsetWidth, threeBox.value.offsetHeight)
  }
}
const onMouseEnter = (event) => {
  const intersects = getIntersects(event)
  // 获取选中最近的Mesh对象
  // instance坐标是对象，右边是类，判断对象是不是属于这个类的
  if (intersects.length !== 0 && intersects[0].object.type === 'Mesh') {
    const selectObject = intersects[0].object
    // console.log(intersects[0]?.object?.parent)
    switch (selectObject.name) {
      case 'CG':
      case 'GY':
        document.body.style.cursor = 'pointer'
        showLogos(selectObject, -1.5)
        // outlineObj(selectObject)
        shinyObj(selectObject)
        break
      case 'JS':
        document.body.style.cursor = 'pointer'
        showLogos(selectObject, 0)
        // outlineObj(selectObject)
        shinyObj(selectObject)
        break
      case 'YS':
        document.body.style.cursor = 'pointer'
        showLogos(selectObject, -4.5)
        // outlineObj(selectObject)
        shinyObj(selectObject)
        break
      case '1-多边形':
        outlineObj(selectObject)
        break
      default:
        document.body.style.cursor = 'default'
        clearInterval(logoTimer.value)
        // 移除所有的图标模型，并且复原模型原来的颜色
        scene.traverse(item => {
          // console.log(item)
          if (item.name === 'lo') {
            scene.remove(item)
          }
          if (item.name === 'CG' || item.name === 'GY' || item.name === 'JS' || item.name === 'YS') {
            item.material.emissive.r = 0.8
            item.material.emissive.g = 0.8
            item.material.emissive.b = 0.8
          }
          if (item.name === '大楼玻璃_2') {
            item.material.emissive.b = 0
          }
        })
        logoTimer.value = null
        outlinePass.value = null
        composer.value = null
    }
  }
  if (intersects[0]?.object?.parent?.name === '17-13' && intersects[0].object.parent.type === 'Object3D') {
    document.body.style.cursor = 'pointer'
    document.querySelector('.tips').style.visibility = 'visible'
    showLogos(intersects[0].object.parent, 5)
    shinyMainObj(intersects[0]?.object?.parent)
    // outlineObj(intersects[0].object.parent)
  } else {
    document.querySelector('.tips').style.visibility = 'hidden'
  }
}
const composer = ref(null) // 后期处理
const outlinePass = ref(null) // 发光
// 呼吸灯
const outlineObj = (selectedObjects) => {
  // 创建一个EffectComposer（效果组合器）对象，然后在该对象上添加后期处理通道。
  composer.value = new EffectComposer(renderer)
  // 新建一个场景通道  为了覆盖到原理来的场景上
  const renderPass = new RenderPass(scene, toRaw(camera.value))
  // 物体边缘发光通道
  outlinePass.value = new OutlinePass(
    new THREE.Vector2(threeBox.value.clientWidth, threeBox.value.clientHeight),
    scene,
    toRaw(camera.value)
  )
  outlinePass.value.renderToScreen = true
  outlinePass.value.edgeStrength = 3 // 亮度
  outlinePass.value.edgeGlow = 0.5 // 光晕[0,1] 边缘微光强度
  outlinePass.value.edgeThickness = 1.5 // 边框宽度，高光厚度
  outlinePass.value.usePatternTexture = false // 是否使用父级的材质，纹理覆盖
  outlinePass.value.pulsePeriod = 0 // 呼吸闪烁的速度，数值越大，律动越慢
  outlinePass.value.usePatternTexture = false // 是否使用贴图
  outlinePass.value.visibleEdgeColor.set('yellow') // 设置显示的颜色
  outlinePass.value.hiddenEdgeColor.set('white') // 设置隐藏的颜色
  outlinePass.value.selectedObjects = [selectedObjects]
  // const loader = new THREE.ObjectLoader() // object 指 场景中的某个模型对象
  // composer.value = loader.parse(JSON.stringify(composer.value))
  composer.value.setSize(
    threeBox.value.offsetWidth,
    threeBox.value.offsetHeight
  )
  composer.value.addPass(renderPass)
  // 通过配置该对象，使它可以渲染我们的场景，并应用额外的后期处理步骤，在render循环中，使用EffectComposer渲染场景、应用通道，并输出结果。
  // 眩光通道outlinePass插入到composer
  composer.value.addPass(outlinePass.value)
  // 自定义的着色器通道 作为参数
  const effectFXAA = new ShaderPass(FXAAShader)
  // eslint-disable-next-line dot-notation
  effectFXAA.uniforms['resolution'].value.set(
    1 / threeBox.value.offsetWidth,
    1 / threeBox.value.offsetHeight
  )
  composer.value.addPass(effectFXAA)
}

// 四个广告牌发光
const shinyObj = (selectObj) => {
  selectObj.material.emissive.r = 2
  selectObj.material.emissive.g = 1.5
  selectObj.material.emissive.b = 10
}

// 主楼发光
const shinyMainObj = (selectObj) => {
  selectObj.children.forEach(item => {
    if (item.name === '大楼玻璃_2') {
      item.material.emissive.b = 3.5
    }
  })
}

const logoModel = ref(null) // 图标模型
const loModel = ref(null)
const fbxLoader = new GLTFLoader()
// logo图标定时器
const logoTimer = ref(null)
// 封装显示图标的函数
const showLogos = (selectObject, num) => {
  const box = new THREE.Box3().expandByObject(toRaw(selectObject))
  const v3 = new THREE.Vector3()
  box.getSize(v3)
  selectObject.traverse((obj) => {
    // 导入图标
    fbxLoader.load('./model/lo.gltf', function (object) {
      logoModel.value = object
      loModel.value = logoModel.value.scenes[0].children[0]
      const { x, y, z } = obj.position
      loModel.value.position.set(x, y + v3.y + num, z)
      if (logoTimer.value) {
        clearInterval(logoTimer.value)
        logoTimer.value = null
      }
      // 判断是否已经存在图标模型
      let flag = false
      scene.traverse(item => {
        if (item.name === 'lo') {
          flag = true
          logoTimer.value = setInterval(() => {
            item.rotation.y += 16
          }, 100)
        }
      })
      if (!flag) {
        scene.add(loModel.value)
      }
    })
  })
}

// 点击事件
const onMouseDblclick = (event) => {
  const intersects = getIntersects(event)
  // 获取选中最近的Mesh对象
  // instance坐标是对象，右边是类，判断对象是不是属于这个类的
  if (intersects.length !== 0 && intersects[0].object.type === 'Mesh') {
    // console.log('选中 Mesh!')
    selectObject.value = intersects[0].object
    switch (selectObject.value.name) {
      case 'CG':
      case 'JS':
      case 'GY':
      case 'YS':
        changePath(selectObject)
        break
      case '1-多边形':
        changeScene(selectObject)
        break
    }
  }
  if (intersects[0]?.object?.parent?.name === '17-13' && intersects[0].object.parent.type === 'Object3D') {
    changePath(intersects[0].object.parent)
  }
}
// 跳转
const changePath = (selectObject) => {
  if (selectObject.name === '17-13') {
    router.push('/interior')
  } else {
    pathArr.forEach((item) => {
      if (item.name === selectObject.value.name) {
        router.push(item.path)
      }
    })
  }
}

const changeScene = (selectObject) => {
  console.log('更换场景', selectObject)
}
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
  const intersects = rayCaster.intersectObjects(scene.children, true)
  // 返回选中的对象
  return intersects
}
const textureLoader = new THREE.TextureLoader()
const marbleWallTexture = textureLoader.load(require('../../../assets/images/home/orange_tiles_1_glossiness.png'))
const marbleWallNormal = textureLoader.load(require('../../../assets/images/home/orange_tiles_1_normal.png'))
// 创建右侧墙面材质
const marbleWallMaterial = new THREE.MeshStandardMaterial({
  map: marbleWallTexture,
  // aoMap: marbleWallAoMap,
  aoMapIntensity: 1,
  roughness: 1,
  // roughnessMap: marbleWallRough,
  normalMap: marbleWallNormal
  // bumpMap: marbleWallDisplacement
  // side: THREE.DoubleSide // 双面贴图
})
// 加载GLTF模型
// show:显示或隐藏
const modelAll = ref(null) // 所有模型的mesh
const state = ref(true)
// 商场模型的mesh
const gltfLoadModel = async (scene, path, show) => {
  // 加载 GLB GLTF 模型
  const gltfLoader = new GLTFLoader()
  await gltfLoader.loadAsync(path).then((object) => {
    object.scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true
        obj.receiveShadow = true
        obj.material.emissive = obj.material.color
        obj.material.emissiveMap = obj.material.map
      }
      if (obj.name === '透明房子') {
        blankHouse(obj)
      } else if (obj.name === '主体' || obj.name === '玻璃' || obj.name === '大门') {
        twinTower(obj)
      } else if (obj.name === '伞' || obj.name === '底座' || obj.name === '边框' || obj.name === '支架') {
        umbrella(obj)
      } else if (
        obj.name.indexOf('台阶') !== -1 ||
        obj.name.indexOf('主体边框') !== -1 ||
        obj.name.indexOf('大楼外框') !== -1 ||
        obj.name.indexOf('外墙') !== -1 ||
        obj.name.indexOf('管道') !== -1
      ) {
        obj.material = marbleWallMaterial
        changeMaterial(obj, '台阶')
      } else if (obj.name.indexOf('树根') !== -1) {
        changeMaterial(obj, 'trunk')
      } else if (obj.name === '树叶') {
        foliage(obj)
      } else if (obj.name === '土堆') {
        mound(obj)
      } else if (obj.name === '土堆边框') {
        biankuang(obj)
      } else if (obj.name.indexOf('左右两侧') !== -1) {
        wall(obj)
      } else if (obj.name.indexOf('大楼玻璃') !== -1) {
        buildGlass(obj)
      } else if (obj.name.indexOf('ad') !== -1) {
        advert(obj)
      } else if (obj.name === '发光边') {
        outline(obj)
      } else if (obj.name === 'led') {
        led(obj)
      } else if (obj.name === 'ledk1') {
        ledk1(obj)
      } else if (obj.name === '前墙面_1' || obj.name === '前墙面') {
        frontWall(obj)
      } else if (obj.name === 'PEOPLE' || obj.name === 'PEOPLE_1' || obj.name === 'PEOPLE_2') {
        people(obj)
      } else if (obj.name === '屋檐' || obj.name === '屋檐_1' || obj.name === '底部屋檐' || obj.name === '底部屋檐_1' || obj.name === '黑边' || obj.name === '门') {
        eaves(obj)
      } else if (obj.name === '屋檐1') {
        eaves1(obj)
      } else if (obj.name === '树坛' || obj.name === '树坛_1') {
        altarTrees(obj)
      } else if (obj.name === '台阶') {
        const geometry = new THREE.PlaneGeometry(200, 200)
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
    })
    modelAll.value = object.scene
    scene.add(object.scene)
    state.value = false
  })
}
// 前墙面
const frontWall = (frontWall) => {
  const text = textTure('qqm')
  // text.repeat.set(12, 10)
  text.repeat.set(10, 10)
  frontWall.material = new THREE.MeshStandardMaterial({
    // emissive: 0xaaaaaa,
    map: text
  })
}
const led = (led) => {
  const text = textTure('led')
  // text.repeat.set(12, 10)
  text.repeat.set(1, 1)
  led.material = new THREE.MeshStandardMaterial({
    // emissive: 0xaaaaaa,
    map: text
  })
}
const ledk1 = (ledk1) => {
  const text = textTure('qqm')
  // text.repeat.set(12, 10)
  text.repeat.set(10, 10)
  ledk1.material = new THREE.MeshStandardMaterial({
    // emissive: 0xaaaaaa,
    map: text
  })
}
// 人
const people = (people) => {
  people.material = new THREE.MeshStandardMaterial({
    color: 0x231922
  })
}
// 伞等
const umbrella = (umbrella) => {
  umbrella.material = new THREE.MeshStandardMaterial({
    color: 0x000f1a
  })
}
// 屋檐等
const eaves = (eaves) => {
  eaves.material = new THREE.MeshStandardMaterial({
    color: 0x000000
  })
}
// 屋檐1
const eaves1 = (eaves1) => {
  const text = textTure('wall')
  // text.repeat.set(12, 10)
  text.repeat.set(10, 10)
  eaves1.material = new THREE.MeshStandardMaterial({
    // emissive: 0xaaaaaa,
    map: text
  })
}
// 树坛
const altarTrees = (altarTrees) => {
  altarTrees.material = new THREE.MeshStandardMaterial({
    color: 0x8e8e8e
  })
}
// 土堆
const mound = (mound) => {
  mound.material = new THREE.MeshStandardMaterial({
    color: 0x3e230f
  })
}
// 土堆边框
const biankuang = (biankuang) => {
  biankuang.material = new THREE.MeshStandardMaterial({
    color: 0x6e3630
  })
}
// 发光边
const outline = (outline) => {
  outline.material = new THREE.MeshStandardMaterial({ color: 0x888888 })
}
// 换材质
const changeMaterial = (obj, name) => {
  obj.material = new THREE.MeshStandardMaterial({
    map: textTure(name)
  })
}
// 树叶
const foliage = (foliage) => {
  const text = textTure('leaf')
  text.repeat.set(1, 1)
  foliage.material = new THREE.MeshStandardMaterial({
    map: text
  })
}
// 广告
const advert = (advert) => {
  const index = advert.name.indexOf('_')
  let name = advert.name
  if (index !== -1) {
    name = advert.name.slice(0, index)
  }
  const text = textTure(name)
  text.repeat.set(1, 1)
  advert.material = new THREE.MeshStandardMaterial({
    map: text
  })
}
// 大楼玻璃
const buildGlass = (build) => {
  const text = textTure('buildGlass')
  text.repeat.set(9, 8)
  build.material = new THREE.MeshStandardMaterial({
    opacity: 0.2,
    // transparent: true,
    // color: '#8c91ab',
    color: '#6197b7',
    map: text
  })
}
// 主楼底座的左右两侧
const wall = (wall) => {
  const textTureImg = textTure('wall')
  textTureImg.repeat.set(8, 8)
  wall.material = new THREE.MeshStandardMaterial({
    // opacity: 0.9,
    // transparent: true,
    // color: '#8c91ab',
    map: textTureImg
  })
}
// 改透明房子
const blankHouse = (house) => {
  house.material = new THREE.MeshStandardMaterial({
    opacity: 0.3,
    transparent: true,
    color: '#8c91ab'
  })
}
//  改双子塔
const twinTower = (tower) => {
  tower.material = new THREE.MeshPhysicalMaterial({
    color: 0x016bbb,
    // specular: 0xffffff,
    // shininess: 100,
    metalness: 0.9, // 金属
    roughness: 0.4, // 粗糙度
    reflectivity: 0.7, // 反射率
    ior: 0.8 // 折射率
    // metalnessMap: textTure("主体"),
  })
}
const textTure = (path) => {
  const imgUrl = require(`../../../assets/images/home/${path}.jpg`)
  const texture = new THREE.TextureLoader().load(imgUrl)
  texture.encoding = THREE.sRGBEncoding
  // texture.flipY = false
  texture.needsUpdate = true
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(32, 32)
  return texture
}
const animate = () => {
  resize()
  requestAnimationFrame(animate)
}
const clock = new THREE.Clock() // 时钟
const resize = () => {
  if (renderer) {
    renderer.clear()
    renderer.render(toRaw(scene), camera.value)
    renderer.clearDepth()
  }
  // 更新摄像头矩阵
  if (camera.value) {
    camera.value.updateProjectionMatrix()
  }
  // 后期处理
  if (composer.value) {
    const time = clock.getDelta()
    // 更新后期处理
    composer.value.render(time)
  }
  if (controls) {
    // 更新控制器
    controls.update()
  }
}
onBeforeUnmount(() => {
  outlinePass.value = null
  composer.value = null
  // 删除gui
  document
    .getElementsByClassName('ac')[0]
    .removeChild(document.getElementsByClassName('main')[0])
  clearScene()
  scene.remove(scene.children) // 删除组
  console.log('页面销毁完毕')
})

const clearScene = () => {
  cancelAnimationFrame(animate)
  scene.traverse((child) => {
    if (child.material) {
      child.material.dispose()
    }
    if (child.geometry) {
      child.geometry.dispose()
    }
    child = null
  })
  renderer.forceContextLoss()
  renderer.dispose()
  scene.clear()
  camera.value = null
  renderer.domElement = null
  renderer = null
  console.log('clearScene')
}

// const clearGroup = (group) => {
//   const clearCache = (item) => {
//     item.geometry.dispose()
//     item.material.dispose()
//   }
//   const removeObj = (obj) => {
//     let arr = obj.children.filter((x) => x)
//     arr.forEach((item) => {
//       if (item.children.length) {
//         removeObj(item)
//       } else {
//         clearCache(item)
//         item.clear()
//       }
//     })
//     obj.clear()
//     arr = null
//   }
//   removeObj(group)
// }

// onBeforeUnmount(() => {
//   clearScene()
//   clearGroup(scene.value.children)
//   scene.value.remove(scene.value.children) // 删除组
//   console.log('页面销毁完毕')
// })
</script>
<style lang="less" scoped>
.box {
  position: relative;
}

#threeBox {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  // z-index: -1;
}

.tips {
  visibility: hidden;
  position: absolute;
  font-size: 17px;
  font-weight: 600;
}

.btn {
  width: 100px;
  height: 100px;
  background-color: #0af9ba;
  position: absolute;
}
</style>
