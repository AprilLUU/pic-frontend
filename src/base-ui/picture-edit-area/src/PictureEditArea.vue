<script setup lang="ts">
import { ref } from "vue"
import { VueCropper } from "vue-cropper"
import "vue-cropper/dist/index.css"
interface Props {
  imageUrl?: string
  loading?: boolean
  cropperStyle?: any
}

defineProps<Props>()
const emit = defineEmits(["confirm:editPicture"])

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
    emit("confirm:editPicture", blob)
  })
}
</script>

<template>
  <div class="picture-edit-area">
    <vue-cropper
      ref="cropperRef"
      :img="imageUrl"
      :autoCrop="true"
      :fixedBox="false"
      :centerBox="true"
      :canMove="false"
      :canMoveBox="true"
      :info="true"
      :style="cropperStyle"
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
        <a-button type="primary" :loading="loading" @click="handleConfirm">
          确认
        </a-button>
      </a-space>
    </div>
  </div>
</template>

<style scoped>
.image-cropper-actions {
  text-align: center;
}
</style>
