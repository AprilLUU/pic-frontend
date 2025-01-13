import router from "@/router"
import { useLoginUserStore } from "@/stores/loginUser"
import ACCESS_ENUM from "./accessEnum"
import checkAccess from "./checkAccess"

router.beforeEach(async (to, from, next) => {
  const loginUserStore = useLoginUserStore()
  let loginUser = loginUserStore.loginUser

  // // 如果之前没登陆过，自动登录
  if (!loginUser || !loginUser.userRole) {
    // 加 await 是为了等用户登录成功之后，再执行后续的代码
    await loginUserStore.fetchLoginUser()
    loginUser = loginUserStore.loginUser
    // 用户登录成功 获取用户空间信息
    if (loginUser.id) {
      await loginUserStore.fetchLoginUserSpace()
    }
  }

  const space = loginUserStore.space
  // 获取用户访问页面的spaceId
  let spaceId = ""
  if (to.path.includes("space") && !to.path.includes("Manage")) {
    spaceId = to.path.split("/")[2]
    // console.log(spaceId)
  } else if (to.path.includes("picture") && !to.path.includes("Manage")) {
    // 控制用户查看图片详情
    // 1. 拿到url路径的图片id
    // 2. 发送请求获取图片对象
    // 3. 校验空间id是否与用户空间id一致
    spaceId = to.query?.spaceId as string
    // console.log(spaceId)
  }

  const needAccess = (to.meta?.access as string) ?? ACCESS_ENUM.NOT_LOGIN
  // 要跳转的页面必须要登陆
  if (needAccess !== ACCESS_ENUM.NOT_LOGIN) {
    // 如果没登陆，跳转到登录页面
    if (
      !loginUser ||
      !loginUser.userRole ||
      loginUser.userRole === ACCESS_ENUM.NOT_LOGIN
    ) {
      // next(`/user/login?redirect=${to.fullPath}`)
      next(`/user/login`)
      return
    }
    // 如果用户空间存在 且 跳转到对应的空间 以及 对应空间的图片
    if (spaceId) {
      console.log(space)
      // 校验用户空间id与跳转id是否一致
      if (space?.id !== spaceId) {
        next("/noAuth")
        return
      }
    }
    // 如果已经登陆了，但是权限不足，那么跳转到无权限页面
    if (!checkAccess(loginUser, needAccess)) {
      next("/noAuth")
      return
    }
  }
  next()
})
