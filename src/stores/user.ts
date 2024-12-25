import { ref } from "vue"
import { defineStore } from "pinia"

export const useUserStore = defineStore("loginUser", () => {
  const loginUser = ref<any>({
    userName: "未登录"
  })

  const fetchLoginUser = async () => {
    setTimeout(() => {
      loginUser.value = {
        userName: "测试用户",
        id: 1
      }
    }, 3000)
  }

  return {
    loginUser,
    fetchLoginUser
  }
})
