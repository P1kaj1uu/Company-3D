import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
import router from '@/router/index'
// 初始化动画中调tween的update() --> TWEEN && TWEEN.update()  animate()中
const Animations = {
  // 相机移动
  animateCamera: (camera, controls, newP, newT, time = 2000, callBack) => {
    const tween = new TWEEN.Tween({
      // 原来位置 from
      x1: camera.position.x, // 相机x
      y1: camera.position.y, // 相机y
      z1: camera.position.z, // 相机z
      x2: controls.target.x, // 控制点的中心点x
      y2: controls.target.y, // 控制点的中心点y
      z2: controls.target.z // 控制点的中心点z
    })
    // 到哪个位置 to
    tween.to({
      x1: newP.x + 20,
      y1: newP.y,
      z1: newP.z - 10,
      x2: newT.x,
      y2: newT.y,
      z2: newT.z
    },
    // 时间
    time
    )
    // 更新
    tween.onUpdate(function (object) {
      camera.position.x = object.x1
      camera.position.y = object.y1
      camera.position.z = object.z1
      controls.target.x = object.x2
      controls.target.y = object.y2
      controls.target.z = object.z2
      // controls.update()
    })
    // onComplete并不是等到动画播放完毕后才触发而是在动画一开始的时候就会触发
    tween.onComplete(function () {
      controls.enabled = true
      callBack()
      // 路由跳转
      router.push('/indoor')
    })
    tween.easing(TWEEN.Easing.Cubic.InOut)
    tween.start()
  }

}
export default Animations
