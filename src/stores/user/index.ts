import { defineStore } from "pinia"
import { message } from "ant-design-vue"
import { useRouter } from "vue-router"
import { userLoginUsingPost, userRegisterUsingPost } from "@/api"
import { useLoginUserStore } from "../loginUser"

export const useUserStore = defineStore("user", () => {
  const loginUserStore = useLoginUserStore()
  const router = useRouter()

  const userRegister = async (values: any) => {
    const res = (await userRegisterUsingPost(values)) as any
    // 注册成功，跳转到登录页面
    if (res.code === 0 && res.data) {
      message.success("注册成功")
      router.push({
        path: "/user/login",
        replace: true
      })
    } else {
      message.error("注册失败，" + res.message)
    }
  }

  const userLogin = async (values: any) => {
    const res = (await userLoginUsingPost(
      values
    )) as API.BaseResponseLoginUserVO_
    // console.log(res)
    if (res.code === 0 && res.data) {
      message.success("登录成功")
      loginUserStore.setLoginUser(res.data)
      // 获取用户空间信息
      await loginUserStore.fetchLoginUserSpace()
      router.replace({ path: "/" })
    } else {
      message.error(`登录失败，${res.message}`)
    }
  }
  // 清空store状态
  const clearState = () => {}

  return {
    userRegister,
    userLogin,
    clearState
  }
})
