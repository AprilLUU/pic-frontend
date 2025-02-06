import { defineStore } from "pinia"
import { message } from "ant-design-vue"
import { useRouter } from "vue-router"
import { ref } from "vue"
import {
  createPictureOutPaintingTaskUsingPost,
  createText2ImageTaskUsingPost,
  editPictureUsingPost,
  getPictureOutPaintingTaskUsingGet,
  getPictureVoByIdUsingGet,
  getText2ImageTaskUsingGet,
  searchPictureByPictureUsingPost,
  uploadPictureByBatchUsingPost,
  uploadPictureByUrlUsingPost,
  uploadPictureUsingPost
} from "@/api"

export const usePictureStore = defineStore("picture", () => {
  const router = useRouter()
  // 创建/修改图片页
  const picture = ref<API.PictureVO>()
  // 图片详情页
  const detailPicture = ref<API.PictureVO>({})
  // 图片搜索页
  const searchPicture = ref<API.PictureVO>({})
  const searchDataList = ref<API.ImageSearchResult[]>([])
  // AI扩图弹窗
  // 任务id
  const taskId = ref<string>()
  // 生成图片任务id
  const generateTaskId = ref<string>()

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
    const res = (await getPictureVoByIdUsingGet({
      id
    })) as API.BaseResponsePictureVO_
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

  const createPictureOutPaintingTask = async (pictureId: string) => {
    const res = (await createPictureOutPaintingTaskUsingPost({
      pictureId,
      // 可以根据需要设置扩图参数
      parameters: {
        xScale: 2,
        yScale: 2
      }
    })) as API.BaseResponseCreateOutPaintingTaskResponse_
    if (res.code === 0 && res.data) {
      message.success("创建任务成功，请耐心等待，不要退出界面")
      console.log(res.data.output?.taskId)
      taskId.value = res.data.output?.taskId ?? ""
      return res.code
    } else {
      message.error("创建任务失败，" + res.message)
    }
  }

  const getPictureOutPaintingTask = async () => {
    const res = (await getPictureOutPaintingTaskUsingGet({
      taskId: taskId.value
    })) as API.BaseResponseGetOutPaintingTaskResponse_
    if (res.code === 0 && res.data) {
      const taskResult = res.data.output
      return taskResult
    }
  }

  const createTextToImageTask = async (prompt: string) => {
    const res = (await createText2ImageTaskUsingPost({
      prompt
    })) as any
    if (res.code === 0 && res.data) {
      message.success("创建任务成功，请耐心等待，不要退出界面")
      console.log(res.data.output?.taskId)
      generateTaskId.value = res.data.output?.taskId ?? ""
      return res.code
    } else {
      message.error("创建任务失败，" + res.message)
    }
  }

  const getTextToImageTask = async () => {
    const res = (await getText2ImageTaskUsingGet({
      taskId: generateTaskId.value
    })) as any
    if (res.code === 0 && res.data) {
      const taskResult = res.data.output
      return taskResult
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
    taskId,
    generateTaskId,
    uploadPitureByUrl,
    uploadPictureByBatch,
    uploadPitureByFile,
    getPictureById,
    getPictureVoById,
    editPiture,
    searchPictureByPicture,
    createPictureOutPaintingTask,
    getPictureOutPaintingTask,
    createTextToImageTask,
    getTextToImageTask,
    clearState
  }
})
