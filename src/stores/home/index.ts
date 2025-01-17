import { ref } from "vue"
import { defineStore } from "pinia"
import { message } from "ant-design-vue"
import {
  listPictureTagCategoryUsingGet,
  listPictureVoByPageUsingPost
} from "@/api"

export const useHomeStore = defineStore("home", () => {
  // 数据
  const dataList = ref<API.PictureVO[]>([])
  const total = ref(0)
  // 分类和标签选项
  const categoryList = ref<string[]>([])
  const tagList = ref<string[]>([])

  // 获取数据
  const fetchData = async (params: API.PictureQueryRequest) => {
    const res = (await listPictureVoByPageUsingPost(
      params
    )) as API.BaseResponsePagePictureVO_
    if (res.code === 0 && res.data) {
      dataList.value = res.data.records ?? []
      total.value = res.data.total ?? 0
    } else {
      message.error("获取数据失败，" + res.message)
    }
  }
  // 获取标签和分类选项
  const getTagCategoryOptions = async () => {
    const res =
      (await listPictureTagCategoryUsingGet()) as API.BaseResponsePictureTagCategoryVO_
    if (res.code === 0 && res.data) {
      categoryList.value = res.data.categoryList ?? []
      tagList.value = res.data.tagList ?? []
    } else {
      message.error("加载分类标签失败，" + res.message)
    }
  }
  // 清空store状态
  const clearState = () => {
    dataList.value = []
    total.value = 0
    categoryList.value = []
    tagList.value = []
  }

  return {
    dataList,
    total,
    categoryList,
    tagList,
    fetchData,
    getTagCategoryOptions,
    clearState
  }
})
