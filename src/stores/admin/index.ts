import { defineStore } from "pinia"
import { ref } from "vue"
import {
  deleteSpaceUsingPost,
  deleteUserUsingPost,
  listPictureByPageUsingPost,
  listSpaceByPageUsingPost,
  listUserVoByPageUsingPost
} from "@/api"
import { message } from "ant-design-vue"

export const useAdminStore = defineStore("admin", () => {
  // 定义数据
  const picDataList = ref<API.Picture[]>([])
  const picDataTotal = ref(0)

  const userDataList = ref<API.UserVO[]>([])
  const userDataTotal = ref(0)

  const spaceDataList = ref<API.Space[]>([])
  const spaceDataTotal = ref(0)

  // 获取数据
  const fetchPicData = async (params: API.PictureQueryRequest) => {
    const res = (await listPictureByPageUsingPost({
      ...params,
      nullSpaceId: true
    })) as API.BaseResponsePagePicture_
    if (res.code === 0 && res.data) {
      picDataList.value = res.data.records ?? []
      picDataTotal.value = res.data.total ?? 0
    } else {
      message.error("获取数据失败，" + res.message)
    }
  }

  // 获取数据
  const fetchUserData = async (params: API.UserQueryRequest) => {
    const res = (await listUserVoByPageUsingPost({
      ...params
    })) as API.BaseResponsePageUserVO_
    if (res.code === 0 && res.data) {
      userDataList.value = res.data.records ?? []
      userDataTotal.value = res.data.total ?? 0
    } else {
      message.error("获取数据失败，" + res.message)
    }
  }

  // 删除用户
  const deleteUser = async (id: string, searchParams: API.UserQueryRequest) => {
    const res = (await deleteUserUsingPost({ id })) as any
    if (res.code === 0) {
      message.success("删除成功")
      // 刷新数据
      fetchUserData(searchParams)
    } else {
      message.error("删除失败")
    }
  }

  // 获取数据
  const fetchSpaceData = async (params: API.UserQueryRequest) => {
    const res = (await listSpaceByPageUsingPost({
      ...params
    })) as API.BaseResponsePageSpace_
    if (res.code === 0 && res.data) {
      spaceDataList.value = res.data.records ?? []
      spaceDataTotal.value = res.data.total ?? 0
    } else {
      message.error("获取数据失败，" + res.message)
    }
  }

  const deleteSpace = async (
    id: string,
    searchParams: API.SpaceQueryRequest
  ) => {
    const res = (await deleteSpaceUsingPost({ id })) as any
    if (res.code === 0) {
      message.success("删除成功")
      // 刷新数据
      fetchSpaceData(searchParams)
    } else {
      message.error("删除失败")
    }
  }
  // 清空store状态
  const clearState = () => {}

  return {
    picDataList,
    picDataTotal,
    userDataList,
    userDataTotal,
    spaceDataList,
    spaceDataTotal,
    fetchPicData,
    fetchUserData,
    fetchSpaceData,
    deleteUser,
    deleteSpace,
    clearState
  }
})
