import { storeToRefs } from "pinia"
import { useHomeStore } from "@/stores"

/**
 * 应用初始化时，所有import模块均会被加载和执行，直接定义会导致在初始化Pinia之前访问store，导致报错
 * 解决：将store的引用放在函数内部，只有在调用时才会执行 （或采用动态加载模块的方式）
 */
const getOptions = () => {
  const homeStore = useHomeStore()
  const { tagList, categoryList } = storeToRefs(homeStore)
  const tagOptions = tagList.value.map((data: string) => ({
    label: data,
    value: data
  }))
  const categoryOptions = categoryList.value.map((data: string) => ({
    label: data,
    value: data
  }))

  return { tagOptions, categoryOptions }
}

export { getOptions }
