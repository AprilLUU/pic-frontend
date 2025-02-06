<script setup lang="ts">
import { message } from "ant-design-vue"
import { storeToRefs } from "pinia"
import { onUnmounted, ref } from "vue"
import { useRouter } from "vue-router"
import { useLoginUserStore, usePictureStore } from "@/stores"

interface Props {
  picture?: API.PictureVO
  spaceId?: string
  onSuccess?: (newPicture: API.PictureVO) => void
}
const props = withDefaults(defineProps<Props>(), {
  spaceId: ""
})

const loading = ref<boolean>(false)
const prompt = ref<string>()
const loginUserStore = useLoginUserStore()
const { loginUser } = storeToRefs(loginUserStore)
const pictureStore = usePictureStore()
const { generateTaskId: taskId } = storeToRefs(pictureStore)
const router = useRouter()

/**
 * 创建任务
 */
const createTask = async () => {
  if (!prompt.value) return
  message.info("正在生成图片，请稍后")
  const code = await pictureStore.createTextToImageTask(prompt.value)
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
      const res = await pictureStore.getTextToImageTask()
      if (res?.taskStatus === "SUCCEEDED") {
        message.success("生成图片任务成功，正在上传中")
        clearPolling()
        const params: API.PictureUploadRequest = {
          picName: prompt.value! + Date.now(),
          fileUrl: res.results[0].url,
          spaceId: props.spaceId
        }
        const data = await pictureStore.uploadPitureByUrl(params)
        props.onSuccess?.(data ?? {})
        loading.value = false
      } else if (res?.taskStatus === "FAILED") {
        message.error("扩图任务失败" + res.message)
        loading.value = false
        clearPolling()
      }
    } catch (err) {
      console.error("轮询任务状态失败", err)
      message.error("检测任务状态失败，请稍后重试")
      loading.value = false
      clearPolling()
    }
  }, 3000) // 每隔 3 秒轮询一次
}

// 清理定时器，避免内存泄漏
onUnmounted(() => clearPolling())

// 上传
const handleUpload = async () => {
  if (!loginUser) {
    message.info("请先登录")
    router.push("/user/login")
  }
  loading.value = true
  await createTask()
}
</script>

<template>
  <div id="urlUpload">
    <a-input-group v-if="!picture" compact style="margin-bottom: 16px">
      <a-input
        v-model:value="prompt"
        style="width: calc(100% - 120px)"
        placeholder="请输入图片生成提示"
      />
      <a-button
        type="primary"
        :loading="loading"
        @click="handleUpload"
        style="width: 120px"
      >
        AI 生成
      </a-button>
    </a-input-group>
    <img v-if="picture?.url" :src="picture?.url" alt="avatar" />
  </div>
</template>

<style scoped>
#urlUpload {
  margin-bottom: 16px;
}
#urlUpload img {
  max-width: 100%;
  max-height: 480px;
  display: block;
  margin: 0 auto;
}
</style>
