<script setup lang="ts">
import "vue-cropper/dist/index.css"
import { VueCropper } from "vue-cropper"
import { computed, onMounted, ref } from "vue"
import ModalArea from "@/base-ui/modal-area/src/ModalArea.vue"
import { usePictureStore } from "@/stores"

interface Props {
  imageUrl?: string
  picture?: API.PictureVO
  spaceId?: string
  onSuccess?: (newPicture: API.PictureVO) => void
}

const props = defineProps<Props>()

const pictureStore = usePictureStore()

const loading = ref(false)

const modalRef = ref()
const openModal = computed(() => modalRef.value?.openModal)
const closeModal = computed(() => modalRef.value?.closeModal)
defineExpose({
  openModal,
  closeModal
})

// 编辑器组件的引用
const cropperRef = ref()

// 向左旋转
const rotateLeft = () => {
  cropperRef.value.rotateLeft()
}

// 向右旋转
const rotateRight = () => {
  cropperRef.value.rotateRight()
}

// 缩放
const changeScale = (num: number) => {
  cropperRef.value.changeScale(num)
}

// 确认裁剪
const handleConfirm = () => {
  cropperRef.value.getCropBlob((blob: Blob) => {
    const fileName = (props.picture?.name || "image") + ".png"
    const file = new File([blob], fileName, { type: blob.type })
    // 上传图片
    handleUpload({ file })
  })
}

/**
 * 截图实现原理 html2canvas
 * 1. 获取img元素
 * 2. 创建canvas元素操作img
 * 3. 使用canvas裁剪图片 canvas.drawImage(img)
 *    截图的区域可以根据截图框相对于图片的偏移量来计算
 * 4. 返回截图的二进制流Blob，canvas.toBlob
 */

/**
 * 上传
 * @param file
 */
const handleUpload = async ({ file }: any) => {
  loading.value = true
  const params: API.PictureUploadRequest = props.picture
    ? { id: props.picture.id }
    : {}
  params.spaceId = props.spaceId
  const data = await pictureStore.uploadPitureByFile(params, file)
  props.onSuccess?.(data ?? {})
  closeModal.value()
  loading.value = false
}
</script>

<template>
  <ModalArea ref="modalRef" class="image-cropper" title="编辑图片">
    <vue-cropper
      ref="cropperRef"
      :img="imageUrl"
      :autoCrop="true"
      :fixedBox="false"
      :centerBox="true"
      :canMove="false"
      :canMoveBox="true"
      :info="true"
      outputType="png"
    />
    <div style="margin-bottom: 16px" />
    <!-- 图片操作 -->
    <div class="image-cropper-actions">
      <a-space>
        <a-button @click="rotateLeft">向左旋转</a-button>
        <a-button @click="rotateRight">向右旋转</a-button>
        <a-button @click="changeScale(1)">放大</a-button>
        <a-button @click="changeScale(-1)">缩小</a-button>
        <a-button type="primary" :loading="loading" @click="handleConfirm"
          >确认</a-button
        >
      </a-space>
    </div>
  </ModalArea>
</template>

<style scoped>
.image-cropper .image-cropper-actions{
  text-align: center;
}

.image-cropper .vue-cropper {
  height: 400px !important;
}
</style>
