<script setup lang="ts">
import { getPictureVoByIdUsingGet } from "@/api"
import { message } from "ant-design-vue"
import { onMounted, ref } from "vue"
import PictureDetail from "./c-cpns/PictureDetail.vue"

const props = defineProps<{
  id: string
}>()

const picture = ref<API.PictureVO>({})

// 获取图片详情
const fetchPictureDetail = async () => {
  try {
    const res = (await getPictureVoByIdUsingGet({
      id: props.id
    })) as API.BaseResponsePictureVO_
    if (res.code === 0 && res.data) {
      picture.value = res.data
    } else {
      message.error("获取图片详情失败，" + res.message)
    }
  } catch (e: any) {
    message.error("获取图片详情失败：" + e.message)
  }
}

onMounted(() => {
  fetchPictureDetail()
})
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
        <PictureDetail :picture="picture" />
      </a-col>
    </a-row>
  </div>
</template>

<style scoped>
.image-preview {
  display: flex;
  justify-content: center;
}
</style>
