import { defineStore } from "pinia"
import { useRouter } from "vue-router"
import { message } from "ant-design-vue"
import { ref } from "vue"
import {
  addSpaceUsingPost,
  getSpaceByIdUsingGet,
  getSpaceVoByIdUsingGet,
  listPictureVoByPageUsingPost,
  listSpaceLevelUsingGet,
  searchPictureByColorUsingPost,
  updateSpaceUsingPost
} from "@/api"
import { useLoginUserStore } from "../loginUser"
import { editPictureByBatchUsingPost } from "@/api"
import { SPACE_TYPE_ENUM } from "@/constants"

export const useSpaceStore = defineStore("space", () => {
  const loginUserStore = useLoginUserStore()
  const router = useRouter()
  const space = ref<API.SpaceVO | API.Space>({})
  const detailSpace = ref<API.SpaceVO>({})
  const picDataList = ref<API.SpaceVO[]>([])
  const picDataTotal = ref(0)
  const spaceLevelList = ref<API.SpaceLevel[]>([])

  // 创建空间页面请求
  const getSpaceById = async (id: string) => {
    const res = (await getSpaceByIdUsingGet({
      id
    })) as API.BaseResponseSpace_
    if (res.code === 0 && res.data) {
      const data = res.data
      space.value = data
    } else {
      message.error("获取空间失败", +res.message!)
    }
  }

  // 获取空间详情请求
  const getSpaceVoById = async (id: string) => {
    try {
      const res = (await getSpaceVoByIdUsingGet({
        id
      })) as API.BaseResponseSpaceVO_
      if (res.code === 0 && res.data) {
        detailSpace.value = res.data
      } else {
        message.error("获取空间详情失败，" + res.message)
      }
    } catch (e: any) {
      message.error("获取空间详情失败：" + e.message)
    }
  }

  // 空间详情图片列表
  const fetchSpacePicture = async (params: API.PictureQueryRequest) => {
    const res = (await listPictureVoByPageUsingPost(
      params
    )) as API.BaseResponsePagePictureVO_
    if (res.code === 0 && res.data) {
      picDataList.value = res.data.records ?? []
      picDataTotal.value = res.data.total ?? 0
    } else {
      message.error("获取数据失败，" + res.message)
    }
  }

  // 创建修改空间请求
  // 获取空间级别
  const fetchSpaceLevelList = async () => {
    const res = (await listSpaceLevelUsingGet()) as any
    if (res.code === 0 && res.data) {
      spaceLevelList.value = res.data
    } else {
      message.error("加载空间级别失败，" + res.message)
    }
  }

  const addOrUpdateSpace = async (params: any) => {
    const spaceId = space.value?.id
    let res
    if (spaceId) {
      res = (await updateSpaceUsingPost({
        id: spaceId,
        ...params
      })) as any
    } else {
      res = (await addSpaceUsingPost({
        ...params
      })) as any
    }

    if (res.code === 0 && res.data) {
      message.success("操作成功")
      // 如果是创建空间 设置全局空间状态
      if (!spaceId && params.spaceType === SPACE_TYPE_ENUM.PRIVATE) {
        await loginUserStore.fetchLoginUserSpace()
      } else {
        await loginUserStore.fetchTeamSpaceList()
      }
      // 跳转到空间详情页
      const path = `/space/${spaceId ?? res.data}`
      router.push({
        path
      })
    } else {
      message.error("操作失败，" + res.message)
    }
  }

  // 空间详情请求
  const searchPitureByColor = async (color: string) => {
    const res = (await searchPictureByColorUsingPost({
      picColor: color,
      spaceId: detailSpace.value.id
    })) as any
    if (res.code === 0 && res.data) {
      const data = res.data ?? []
      picDataList.value = data
      picDataTotal.value = data.length
    } else {
      message.error("获取数据失败，" + res.message)
    }
  }

  const editPictureByBatch = async (values: any) => {
    if (!picDataList.value.length) return
    const res = (await editPictureByBatchUsingPost({
      pictureIdList: picDataList.value.map((picture) => picture.id),
      spaceId: detailSpace.value.id,
      ...values
    })) as any
    if (res.code === 0 && res.data) {
      message.success("操作成功")
    } else {
      message.error("操作失败，" + res.message)
    }
  }

  // 清空store状态
  const clearState = () => {
    space.value = {}
    spaceLevelList.value = []
  }

  return {
    space,
    spaceLevelList,
    detailSpace,
    picDataList,
    picDataTotal,
    getSpaceById,
    getSpaceVoById,
    fetchSpacePicture,
    fetchSpaceLevelList,
    addOrUpdateSpace,
    searchPitureByColor,
    editPictureByBatch,
    clearState
  }
})
