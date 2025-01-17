import { ref } from "vue"
import { defineStore } from "pinia"
import { message } from "ant-design-vue"
import { useRouter } from "vue-router"
import {
  getLoginUserUsingGet,
  listSpaceVoByPageUsingPost,
  userLogoutUsingPost
} from "@/api"

export const useLoginUserStore = defineStore("loginUser", () => {
  const loginUser = ref<API.LoginUserVO>({})
  const space = ref<API.SpaceVO>({})
  const router = useRouter()

  const fetchLoginUser = async () => {
    const res = (await getLoginUserUsingGet()) as API.BaseResponseLoginUserVO_
    if (res.code === 0 && res.data) {
      loginUser.value = res.data
    }
  }

  const logout = async () => {
    const res = (await userLogoutUsingPost()) as any
    if (res.code === 0) {
      // 退出登录 清空store状态
      loginUser.value = {}
      space.value = {}
      message.success("退出登录成功")
      router.push("/user/login")
    } else {
      message.error("退出登录失败," + res.message)
    }
  }

  const setLoginUser = (user: API.LoginUserVO) => {
    loginUser.value = user
  }

  // 对用户空间进行权限校验
  const fetchLoginUserSpace = async () => {
    // 获取用户空间信息
    const res = (await listSpaceVoByPageUsingPost({
      userId: loginUser.value.id,
      current: 1,
      pageSize: 1
    })) as API.BaseResponsePageSpaceVO_

    if (res.code === 0 && res.data) {
      if (res.data?.records!.length > 0) {
        space.value = res.data.records![0]
      }
    }
  }

  const setSpace = (newSpace: API.SpaceVO) => {
    space.value = newSpace
    // console.log(newSpace, space.value)
  }

  return {
    loginUser,
    fetchLoginUser,
    setLoginUser,
    logout,
    fetchLoginUserSpace,
    space,
    setSpace
  }
})
