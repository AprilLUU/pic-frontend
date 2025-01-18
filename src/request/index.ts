import axios from "axios"
import { message } from "ant-design-vue"
import { BACKEND_BASE_URL } from "@/config"

// 创建 Axios 实例
const myAxios = axios.create({
  baseURL: BACKEND_BASE_URL,
  timeout: 60000,
  withCredentials: true
})

// 全局请求拦截器
myAxios.interceptors.request.use(
  function (config) {
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// 全局响应拦截器
myAxios.interceptors.response.use(
  function (response) {
    const { data } = response
    // console.log(response)
    // 未登录
    if (data.code === 40100) {
      // 不是登录请求，并且用户目前不是已经在用户登录页面，则跳转到登录页面
      if (
        !response.request.responseURL.includes("user/get/login") &&
        !window.location.pathname.includes("/user/login")
      ) {
        message.warning("请先登录")
        setTimeout(() => {
          window.location.href = `/user/login`
        }, 500)
        // window.location.href = `/user/login?redirect=${window.location.href}`
      }
    }

    // 由于后端id字段为long类型 到前端js会发生溢出 因此在响应中转换成了string类型
    // 但某些字段在请求时为number类型 会发生类型不匹配问题
    // 因此 在响应拦截器中将非id字段的为数字的string类型字段转换成number类型
    // console.log(data)
    if (data.code === 0) {
      // 在某些接口 如注册 添加用户 直接返回的是用户id 此时 不进行转换
      if (typeof data.data !== "object") return data
      const numReg = /^[0-9]+$/
      const idReg = /id/i
      for (const key in data.data) {
        // if (key === "id") continue
        // 含id的字段不转换
        if (idReg.test(key)) continue
        const value = data.data[key]
        if (typeof value === "string" && numReg.test(value)) {
          data.data[key] = Number(value)
        }
      }
    }

    return data
  },
  function (error) {
    message.error("请求失败")
    // return Promise.reject(error)
    return error
  }
)

export default myAxios
