<script setup lang="ts">
import { ref, watch, computed } from "vue"
import { UploadOutlined } from "@ant-design/icons-vue"
import { analyzePictureEmotionUsingPost, testUploadFileUsingPost } from "@/api"
import { useHomeStore } from "@/stores"
import emitter from '@/utils/eventBus'

interface Props {
  picture: API.PictureVO
  visible: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(["update:visible"])
const homeStore = useHomeStore()

const sentimentText = ref(props.picture?.introduction || "")
const audioFile = ref<File | null>(null)
const sentimentAnalysisLoading = ref(false)
const sentimentPredictResult = ref(props.picture?.category || "未进行情感分析")
const buttonDisabled = computed(
  () => sentimentPredictResult.value !== "未进行情感分析"
)

watch(
  () => props.picture,
  (picture) => {
    sentimentPredictResult.value = picture?.category || "未进行情感分析"
    sentimentText.value = picture?.introduction || ""
  },
  { immediate: true }
)

const resultColorMap: Record<string, string> = {
  积极: "green",
  消极: "red",
  中性: "gray",
  未进行情感分析: "gray"
}

const handleAudioUpload = (file: File) => {
  audioFile.value = file
  return false
}

const handleClose = () => {
  emit("update:visible", false)
  sentimentAnalysisLoading.value = false
}

const handleSentimentAnalysis = async () => {
  sentimentAnalysisLoading.value = true
  try {
    if (audioFile.value) {
      const res = await testUploadFileUsingPost({
        file: audioFile.value
      })
      console.log(res)
    }
    const result = (await analyzePictureEmotionUsingPost({
      text: sentimentText.value,
      pictureId: props.picture.id
    })) as any
    console.log(result)
    sentimentPredictResult.value = result.data.category!
    emitter.emit('picture:updated', { id: props.picture.id! })
  } catch (error) {
    console.error("情感分析失败:", error)
  } finally {
    sentimentAnalysisLoading.value = false
  }
}
</script>

<template>
  <!-- 情感分析弹窗 -->
  <a-modal
    :visible="visible"
    title="情感分析"
    @ok="handleSentimentAnalysis"
    @cancel="handleClose"
    @update:visible="emit('update:visible', $event)"
    ok-text="分析"
    cancel-text="取消"
    :ok-button-props="{
      disabled: buttonDisabled,
      loading: sentimentAnalysisLoading
    }"
    :mask-closable="!sentimentAnalysisLoading"
  >
    <a-form layout="vertical">
      <a-form-item label="文本描述">
        <a-textarea
          v-model:value="sentimentText"
          placeholder="请输入文本描述"
          :rows="4"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="音频文件">
        <a-upload
          :before-upload="handleAudioUpload"
          accept="audio/*"
          :max-count="1"
          list-type="text"
        >
          <a-button>
            <template #icon>
              <UploadOutlined />
            </template>
            选择音频文件
          </a-button>
        </a-upload>
      </a-form-item>
      <a-form-item label="情感预测结果">
        <span :style="{ color: resultColorMap[sentimentPredictResult!] }">{{
          sentimentPredictResult
        }}</span>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped></style>
