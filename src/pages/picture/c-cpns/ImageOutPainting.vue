<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue"
import { storeToRefs } from "pinia"
import ModalArea from "@/base-ui/modal-area/src/ModalArea.vue"
import { usePictureStore } from "@/stores"
import { message } from "ant-design-vue"

interface Props {
  picture?: API.PictureVO | API.Picture
  spaceId?: string
  onSuccess?: (newPicture: API.PictureVO) => void
}

const props = defineProps<Props>()
const pictureStore = usePictureStore()
const { taskId } = storeToRefs(pictureStore)

const loading = ref(false)
const resultImageUrl = ref<string>()

const modalRef = ref()
const openModal = computed(() => modalRef.value?.openModal)
const closeModal = computed(() => modalRef.value?.closeModal)
defineExpose({
  openModal,
  closeModal
})

/**
 * 创建任务
 */
const createTask = async () => {
  if (!props.picture?.id) return
  message.info("正在生成图片，请稍后")
  const code = await pictureStore.createPictureOutPaintingTask(props.picture.id)
  // 创建成功 开始轮询
  if (code === 0) startPolling()
}

// 轮询定时器
let pollingTimer: ReturnType<typeof setInterval> | null = null
// 清理轮询定时器
const clearPolling = () => {
  if (pollingTimer) {
    clearInterval(pollingTimer)
    pollingTimer = null
    taskId.value = undefined
  }
}

// 开始轮询
const startPolling = () => {
  if (!taskId.value) return

  pollingTimer = setInterval(async () => {
    try {
      const res = await pictureStore.getPictureOutPaintingTask()
      if (res?.taskStatus === "SUCCEEDED") {
        message.success("扩图任务成功")
        resultImageUrl.value = res.outputImageUrl
        clearPolling()
      } else if (res?.taskStatus === "FAILED") {
        message.error("扩图任务失败" + res.message)
        clearPolling()
      }
    } catch (err) {
      console.error("轮询任务状态失败", err)
      message.error("检测任务状态失败，请稍后重试")
      clearPolling()
    }
  }, 3000) // 每隔 3 秒轮询一次
}

// 清理定时器，避免内存泄漏
onUnmounted(() => clearPolling())

// 上传
const handleUpload = async () => {
  loading.value = true
  // const queryIndex = resultImageUrl.value?.indexOf("?")
  // let fileUrl =
  //   queryIndex === -1
  //     ? resultImageUrl.value
  //     : resultImageUrl.value?.slice(0, queryIndex)
  // const fileNameIndex = fileUrl!.lastIndexOf("/")
  // const suffixIndex = fileUrl!.lastIndexOf(".")
  // const fileName = fileUrl!.slice(fileNameIndex + 1, suffixIndex)
  // fileUrl = fileUrl?.replace(fileName, props.picture!.name!)
  // console.log(fileUrl)
  // 设置picName，让图片能正确更新
  const params: API.PictureUploadRequest = {
    id: props.picture?.id,
    picName: props.picture?.name,
    fileUrl: resultImageUrl.value,
    spaceId: props.spaceId
  }
  const data = await pictureStore.uploadPitureByUrl(params)
  props.onSuccess?.(data ?? {})
  closeModal.value()
  loading.value = false
}
</script>

<template>
  <ModalArea ref="modalRef" title="AI扩图">
    <a-row :gutter="16">
      <a-col :span="12">
        <h4>原始图片</h4>
        <img class="image" :src="picture?.url" :alt="picture?.name" />
      </a-col>
      <a-col :span="12">
        <h4>扩图结果</h4>
        <img
          v-if="resultImageUrl"
          class="image"
          :src="resultImageUrl"
          :alt="picture?.name"
        />
      </a-col>
    </a-row>
    <div style="margin-bottom: 16px" />
    <a-flex :gap="16" justify="center">
      <a-button type="primary" ghost :loading="!!taskId" @click="createTask">
        生成图片
      </a-button>
      <a-button
        v-if="resultImageUrl"
        type="primary"
        :loading="loading"
        @click="handleUpload"
      >
        应用结果
      </a-button>
    </a-flex>
  </ModalArea>
</template>

<style scoped>
.image {
  max-width: 100%;
}
</style>
