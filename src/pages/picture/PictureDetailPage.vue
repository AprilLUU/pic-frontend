<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue"
import PictureDetail from "./c-cpns/PictureDetail.vue"
import ShareModal from "@/components/ShareModal.vue"
import { FRONTEND_BASE_URL } from "@/config"
import { usePictureStore } from "@/stores"
import { storeToRefs } from "pinia"

const props = defineProps<{
  id: string
}>()

const pictureStore = usePictureStore()
const { detailPicture: picture } = storeToRefs(pictureStore)

const fetchPictureDetail = () => pictureStore.getPictureVoById(props.id)
onMounted(() => fetchPictureDetail())
// 清空状态
onUnmounted(() => (picture.value = {}))

// 分享弹窗引用
const shareModalRef = ref<typeof ShareModal>()
// 分享链接
const shareLink = ref<string>()

// 分享
const onShare = () => {
  shareLink.value = `${FRONTEND_BASE_URL}/picture/${picture.value!.id}`
  shareModalRef.value?.openModal()
}
</script>

<template>
  <div id="pictureDetailPage">
    <a-row :gutter="[16, 16]">
      <!-- 图片展示区 -->
      <a-col :sm="24" :md="16" :xl="18">
        <a-card title="图片预览">
          <div class="image-preview">
            <a-image
              style="max-height: 600px; object-fit: contain"
              :src="picture.url"
            />
          </div>
        </a-card>
      </a-col>
      <!-- 图片信息区 -->
      <a-col :sm="24" :md="8" :xl="6">
        <PictureDetail
          :picture="picture"
          @fetchNewPicture="fetchPictureDetail"
          :onShare="onShare"
        />
      </a-col>
    </a-row>
    <ShareModal ref="shareModalRef" :link="shareLink" />
  </div>
</template>

<style scoped>
.image-preview {
  display: flex;
  justify-content: center;
}
</style>
