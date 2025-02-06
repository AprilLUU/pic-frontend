<script setup lang="ts">
import { message } from "ant-design-vue"
import { storeToRefs } from "pinia"
import { ref } from "vue"
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
const fileUrl = ref<string>()
const loginUserStore = useLoginUserStore()
const { loginUser } = storeToRefs(loginUserStore)
const pictureStore = usePictureStore()
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
  const params: API.PictureUploadRequest = { fileUrl: fileUrl.value }
  if (props.picture) params.id = props.picture.id
  if (props.spaceId) params.spaceId = props.spaceId
  const data = await pictureStore.uploadPitureByUrl(params)
  props.onSuccess?.(data ?? {})
  loading.value = false
}
</script>

<template>
  <div id="urlUpload">
    <a-input-group v-if="!picture" compact style="margin-bottom: 16px">
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
      >
        提交
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
