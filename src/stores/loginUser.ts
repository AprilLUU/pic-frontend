import { ref } from "vue"
import { defineStore } from "pinia"
import { getLoginUserUsingGet, listSpaceVoByPageUsingPost } from "@/api"

export const useLoginUserStore = defineStore("loginUser", () => {
  const loginUser = ref<API.LoginUserVO>({})
  const space = ref<API.SpaceVO>({})

  const fetchLoginUser = async () => {
    const res = (await getLoginUserUsingGet()) as API.BaseResponseLoginUserVO_
    if (res.code === 0 && res.data) {
      loginUser.value = res.data
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
    fetchLoginUserSpace,
    space,
    setSpace
  }
})
