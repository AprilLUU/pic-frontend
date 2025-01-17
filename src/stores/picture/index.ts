import { defineStore } from "pinia"
import { message } from "ant-design-vue"
import { useRouter } from "vue-router"
import { ref } from "vue"
import {
  editPictureUsingPost,
  getPictureByIdUsingGet,
  getPictureVoByIdUsingGet,
  searchPictureByPictureUsingPost,
  uploadPictureByBatchUsingPost,
  uploadPictureByUrlUsingPost,
  uploadPictureUsingPost
} from "@/api"

export const usePictureStore = defineStore("picture", () => {
  const router = useRouter()
  const picture = ref<API.PictureVO | API.Picture>()
  const detailPicture = ref<API.PictureVO>({})
  const searchPicture = ref<API.PictureVO>({})
  const searchDataList = ref<API.ImageSearchResult[]>([])

  const uploadPitureByFile = async (
    params: API.PictureUploadRequest,
    file: any
  ) => {
    try {
      const res = (await uploadPictureUsingPost(
        params,
        {},
        file
      )) as API.BaseResponsePictureVO_
      if (res.code === 0 && res.data) {
        return res.data
      } else {
        message.error("上传图片失败" + res.message)
      }
    } catch (err) {
      message.error("上传图片失败" + err)
    }
  }

  const uploadPitureByUrl = async (params: API.PictureUploadRequest) => {
    try {
      const res = (await uploadPictureByUrlUsingPost(
        params
      )) as API.BaseResponsePictureVO_
      if (res.code === 0 && res.data) {
        return res.data
      } else {
        message.error("上传图片失败" + res.message)
      }
    } catch (err) {
      message.error("上传图片失败" + err)
    }
  }

  const uploadPictureByBatch = async (
    formData: API.PictureUploadByBatchRequest
  ) => {
    const res = (await uploadPictureByBatchUsingPost({
      ...formData
    })) as any
    if (res.code === 0 && res.data) {
      message.success(`创建成功，共 ${res.data} 条`)
      router.push({
        path: "/"
      })
    } else {
      message.error("创建失败，" + res.message)
    }
  }

  const getPictureById = async (id: string) => {
    const res = (await getPictureByIdUsingGet({
      id
    })) as API.BaseResponsePicture_
    if (res.code === 0 && res.data) {
      const data = res.data
      picture.value = data
      return data
    }
  }

  const editPiture = async (values: any, spaceId: string, editName: string) => {
    const pictureId = picture.value?.id
    if (!pictureId) return
    const res = (await editPictureUsingPost({
      id: pictureId,
      spaceId: spaceId,
      ...values
    })) as any
    if (res.code === 0 && res.data) {
      message.success(`${editName}成功`)
      // 跳转到图片详情页
      router.push({
        path: `/picture/${pictureId}`
      })
    } else {
      message.error(`${editName}失败, ${res.message}`)
    }
  }

  const getPictureVoById = async (id: string, isSearch: boolean = false) => {
    try {
      const res = (await getPictureVoByIdUsingGet({
        id
      })) as API.BaseResponsePictureVO_
      if (res.code === 0 && res.data) {
        if (!isSearch) detailPicture.value = res.data
        else searchPicture.value = res.data
      } else {
        message.error("获取图片详情失败，" + res.message)
      }
    } catch (e: any) {
      message.error("获取图片详情失败：" + e.message)
    }
  }

  const searchPictureByPicture = async (id: string) => {
    const res = (await searchPictureByPictureUsingPost({
      pictureId: id
    })) as any
    if (res.code === 0 && res.data) {
      searchDataList.value = res.data ?? []
    } else {
      message.error("获取数据失败，" + res.message)
    }
  }

  // 清空store状态
  const clearState = () => {
    picture.value = undefined
    detailPicture.value = {}
    searchPicture.value = {}
  }

  return {
    picture,
    detailPicture,
    searchPicture,
    searchDataList,
    uploadPitureByUrl,
    uploadPictureByBatch,
    uploadPitureByFile,
    getPictureById,
    getPictureVoById,
    editPiture,
    searchPictureByPicture,
    clearState
  }
})
