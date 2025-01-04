import axios from "axios"
import { message } from "ant-design-vue"

// 创建 Axios 实例
const myAxios = axios.create({
  baseURL: "",
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

    // 将string类型字段转换成number类型
    if (data.code === 0) {
      const reg = /^[0-9]+$/
      for (const key in data.data) {
        if (key === "id") continue
        const value = data.data[key]
        if (typeof(value) === "string" && reg.test(value)) {
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
