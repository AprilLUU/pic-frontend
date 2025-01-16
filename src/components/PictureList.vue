<script setup lang="ts">
import { ref } from "vue"
import { BASE_URL } from "@/config"
import PictureItem from "./PictureItem.vue"
import ShareModal from "./ShareModal.vue"

interface Props {
  dataList?: API.PictureVO[] | API.ImageSearchResult[]
  loading?: boolean
  showOp?: boolean
  showMeta?: boolean
  onReload?: any
}
withDefaults(defineProps<Props>(), {
  dataList: () => [],
  loading: false,
  showMeta: true,
  showOp: false
})

// 分享弹窗引用
const shareModalRef = ref<typeof ShareModal>()
// 分享链接
const shareLink = ref<string>()

// 分享
const onShare = (picture: API.PictureVO, e: Event) => {
  e.stopPropagation()
  shareLink.value = `${BASE_URL}/picture/${picture.id}`
  shareModalRef.value?.openModal()
}
</script>

<template>
  <div class="picture-list">
    <a-list
      :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }"
      :data-source="dataList"
      :loading="loading"
    >
      <template #renderItem="{ item: picture }">
        <a-list-item style="padding: 0">
          <!-- 单张图片 -->
          <PictureItem
            :picture="picture"
            :showOp="showOp"
            :showMeta="showMeta"
            :onReload="onReload"
            :onShare="onShare"
          />
        </a-list-item>
      </template>
      <ShareModal ref="shareModalRef" :link="shareLink" />
    </a-list>
  </div>
</template>

<style scoped>
.picture-list {
  margin-bottom: 16px;
}
</style>
