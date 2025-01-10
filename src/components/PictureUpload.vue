<script lang="ts" setup>
import { ref } from "vue"
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons-vue"
import { message } from "ant-design-vue"
import { uploadPictureUsingPost } from "@/api"

interface Props {
  picture?: API.PictureVO | API.Picture
  spaceId: string
  onSuccess?: (newPicture: API.PictureVO) => void
}
const props = defineProps<Props>()

const loading = ref<boolean>(false)

const beforeUpload = (file: any) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png"
  if (!isJpgOrPng) {
    message.error("不支持上传该格式的图片，推荐 jpg 或 png")
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error("不能上传超过 2M 的图片")
  }
  return isJpgOrPng && isLt2M
}

const handleUpload = async ({ file }: any) => {
  loading.value = true
  try {
    const params: API.PictureUploadRequest = props.picture
      ? { id: props.picture.id }
      : {}
    if (props.spaceId) {
      params.spaceId = props.spaceId
    }
    const res = (await uploadPictureUsingPost(
      params,
      {},
      file
    )) as API.BaseResponsePictureVO_
    if (res.code === 0 && res.data) {
      props.onSuccess?.(res.data)
    } else {
      message.error("上传图片失败" + res.message)
    }
  } catch (err) {
    message.error("上传图片失败" + err)
  }
  loading.value = false
}
</script>

<template>
  <div id="pictureUpload">
    <a-upload
      list-type="picture-card"
      :show-upload-list="false"
      :before-upload="beforeUpload"
      :custom-request="handleUpload"
    >
      <img v-if="picture?.url" :src="picture?.url" />
      <div v-else>
        <loading-outlined v-if="loading"></loading-outlined>
        <plus-outlined v-else></plus-outlined>
        <div class="ant-upload-text">点击或者拖拽上传图片</div>
      </div>
    </a-upload>
  </div>
</template>

<style scoped>
#pictureUpload :deep(.ant-upload) {
  width: 100%;
  height: 100%;
  min-width: 152px;
  min-height: 152px;
}

#pictureUpload img {
  max-width: 100%;
  max-height: 480px;
}

/* .file-uploader .ant-upload[data-v-xxx] */
/* 故而选不中子组件中的元素 */
/* 加入deep */
/* :deep .file-uploader[data-v-xxx] .ant-upload */
/* .file-uploader .ant-upload {
  background: #000;
} */

/* 不加scoped 会编译上父组件的data-v-xxx 从而可以生效 */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
