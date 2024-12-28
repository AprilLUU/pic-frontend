import { ref } from "vue"
import { defineStore } from "pinia"
import { getLoginUserUsingGet } from "@/api"

export const useLoginUserStore = defineStore("loginUser", () => {
  const loginUser = ref<API.LoginUserVO>({})

  const fetchLoginUser = async () => {
    const res = (await getLoginUserUsingGet()) as API.BaseResponseLoginUserVO_
    if (res.code === 0 && res.data) {
      loginUser.value = res.data
    }
  }

  const setLoginUser = (user: API.LoginUserVO) => {
    loginUser.value = user
  }

  return {
    loginUser,
    fetchLoginUser,
    setLoginUser
  }
})
