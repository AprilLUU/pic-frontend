import { ref } from "vue"
import { defineStore } from "pinia"
import { message } from "ant-design-vue"
import {
  getSpaceCategoryAnalyzeUsingPost,
  getSpaceRankAnalyzeUsingPost,
  getSpaceSizeAnalyzeUsingPost,
  getSpaceTagAnalyzeUsingPost,
  getSpaceUsageAnalyzeUsingPost,
  getSpaceUserAnalyzeUsingPost
} from "@/api"

export const useAnalyzeStore = defineStore("analyze", () => {
  const usageData = ref<API.SpaceUsageAnalyzeResponse>({})
  const categoryData = ref<API.SpaceCategoryAnalyzeResponse[]>([])
  const tagData = ref<API.SpaceTagAnalyzeResponse[]>([])
  const sizeData = ref<API.SpaceSizeAnalyzeResponse[]>([])
  const userData = ref<API.SpaceUserAnalyzeResponse[]>([])
  const rankData = ref<any[]>([])

  const getSpaceUsageAnalyze = async (params: API.SpaceUsageAnalyzeRequest) => {
    const res = (await getSpaceUsageAnalyzeUsingPost(
      params
    )) as API.BaseResponseSpaceUsageAnalyzeResponse_
    if (res.code === 0 && res.data) {
      usageData.value = res.data
    } else {
      message.error("获取数据失败，" + res.message)
    }
  }

  const getSpaceCategoryAnalyze = async (
    params: API.SpaceCategoryAnalyzeRequest
  ) => {
    const res = (await getSpaceCategoryAnalyzeUsingPost(params)) as any
    if (res.code === 0 && res.data) {
      categoryData.value = res.data ?? []
    } else {
      message.error("获取数据失败，" + res.message)
    }
  }

  const getSpaceTagAnalyze = async (params: API.SpaceTagAnalyzeRequest) => {
    const res = (await getSpaceTagAnalyzeUsingPost(params)) as any
    if (res.code === 0 && res.data) {
      tagData.value = res.data ?? []
    } else {
      message.error("获取数据失败，" + res.message)
    }
  }

  const getSpaceSizeAnalyze = async (params: API.SpaceSizeAnalyzeRequest) => {
    const res = (await getSpaceSizeAnalyzeUsingPost(params)) as any
    if (res.code === 0 && res.data) {
      sizeData.value = res.data ?? []
    } else {
      message.error("获取数据失败，" + res.message)
    }
  }

  const getSpaceUserAnalyze = async (params: API.SpaceUserAnalyzeRequest) => {
    const res = (await getSpaceUserAnalyzeUsingPost(params)) as any
    if (res.code === 0 && res.data) {
      userData.value = res.data ?? []
    } else {
      message.error("获取数据失败，" + res.message)
    }
  }

  const getSpaceRankAnalyze = async (params?: API.SpaceRankAnalyzeRequest) => {
    const res = (await getSpaceRankAnalyzeUsingPost(params ?? {})) as any
    if (res.code === 0 && res.data) {
      rankData.value = res.data ?? []
    } else {
      message.error("获取数据失败，" + res.message)
    }
  }

  // 清空store状态
  const clearState = () => {
    usageData.value = {}
    categoryData.value = []
    tagData.value = []
    sizeData.value = []
    userData.value = []
    rankData.value = []
  }

  return {
    usageData,
    categoryData,
    tagData,
    sizeData,
    userData,
    rankData,
    getSpaceUsageAnalyze,
    getSpaceCategoryAnalyze,
    getSpaceTagAnalyze,
    getSpaceSizeAnalyze,
    getSpaceUserAnalyze,
    getSpaceRankAnalyze,
    clearState
  }
})
