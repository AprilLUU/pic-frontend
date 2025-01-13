<script setup lang="ts">
import { uploadPictureByUrlUsingPost } from "@/api"
import { useLoginUserStore } from "@/stores"
import { message } from "ant-design-vue"
import { storeToRefs } from "pinia"
import { ref } from "vue"
import { useRouter } from "vue-router"

interface Props {
  picture?: API.PictureVO | API.Picture
  spaceId?: string
  onSuccess?: (newPicture: API.PictureVO) => void
}
const props = withDefaults(defineProps<Props>(), {
  spaceId: ""
})

const loading = ref<boolean>(false)
const fileUrl = ref<string>()
const loginUserStore = useLoginUserStore()
const { loginUser } = storeToRefs(loginUserStore)
const router = useRouter()

/**
 * 上传
 */
const handleUpload = async () => {
  if (!loginUser) {
    message.info("请先登录")
    router.push("/user/login")
  }
  loading.value = true
  try {
    const params: API.PictureUploadRequest = { fileUrl: fileUrl.value }
    if (props.picture) {
      params.id = props.picture.id
    }
    if (props.spaceId) {
      params.spaceId = props.spaceId
    }
    const res = (await uploadPictureByUrlUsingPost(
      params
    )) as API.BaseResponsePictureVO_
    if (res.code === 0 && res.data) {
      message.success("图片上传成功")
      // 将上传成功的图片信息传递给父组件
      props.onSuccess?.(res.data)
    } else {
      message.error("图片上传失败，" + res.message)
    }
  } catch (error) {
    message.error("图片上传失败")
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div id="urlUpload">
    <a-input-group compact style="margin-bottom: 16px">
      <a-input
        v-model:value="fileUrl"
        style="width: calc(100% - 120px)"
        placeholder="请输入图片 URL"
      />
      <a-button
        type="primary"
        :loading="loading"
        @click="handleUpload"
        style="width: 120px"
        >提交</a-button
      >
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
