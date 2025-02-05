<script setup lang="ts">
import { ref } from "vue"
import { VueCropper } from "vue-cropper"
import "vue-cropper/dist/index.css"
interface Props {
  space?: API.SpaceVO
  imageUrl?: string
  loading?: boolean
  cropperStyle?: any
  editingUser?: API.UserVO
  canEnterEdit?: boolean
  canExitEdit?: boolean
  canEdit?: boolean
  showEdit?: boolean
}

defineProps<Props>()
const emit = defineEmits([
  "confirm:editPicture",
  "enter:edit",
  "exit:edit",
  "rotate:left",
  "rotate:right",
  "change:scale"
])

// 编辑器组件的引用
const cropperRef = ref()

// 向左旋转
const rotateLeft = () => {
  cropperRef.value.rotateLeft()
  emit("rotate:left")
}

// 向右旋转
const rotateRight = () => {
  cropperRef.value.rotateRight()
  emit("rotate:right")
}

// 缩放
const changeScale = (num: number) => {
  cropperRef.value.changeScale(num)
  emit("change:scale", num)
}

defineExpose({ cropperRef })

// 确认裁剪
const handleConfirm = () => {
  cropperRef.value.getCropBlob((blob: Blob) => {
    emit("confirm:editPicture", blob)
  })
}

// 进入编辑
const enterEdit = () => emit("enter:edit")
// 退出编辑
const exitEdit = () => emit("exit:edit")
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
    <div class="image-edit-actions" v-if="showEdit">
      <!-- 协同编辑操作 -->
      <a-space>
        <a-button v-if="editingUser" disabled>
          {{ editingUser.userName }}正在编辑
        </a-button>
        <a-button v-if="canEnterEdit" type="primary" ghost @click="enterEdit">
          进入编辑
        </a-button>
        <a-button v-if="canExitEdit" danger ghost @click="exitEdit">
          退出编辑
        </a-button>
      </a-space>
    </div>
    <!-- 图片操作 -->
    <div class="image-cropper-actions">
      <a-space>
        <a-button @click="rotateLeft" :disabled="!canEdit">向左旋转</a-button>
        <a-button @click="rotateRight" :disabled="!canEdit">向右旋转</a-button>
        <a-button @click="changeScale(1)" :disabled="!canEdit">放大</a-button>
        <a-button @click="changeScale(-1)" :disabled="!canEdit">缩小</a-button>
        <a-button
          type="primary"
          :loading="loading"
          :disabled="!canEdit"
          @click="handleConfirm"
        >
          确认
        </a-button>
      </a-space>
    </div>
  </div>
</template>

<style scoped>
.image-edit-actions {
  text-align: left;
  margin-bottom: 16px;
}
.image-cropper-actions {
  text-align: left;
}
</style>
