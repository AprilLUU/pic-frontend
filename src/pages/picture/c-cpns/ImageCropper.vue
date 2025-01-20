<script setup lang="ts">
import { computed, ref } from "vue"
import ModalArea from "@/base-ui/modal-area/src/ModalArea.vue"
import { usePictureStore } from "@/stores"
import PictureEditArea from "@/base-ui/picture-edit-area/src/PictureEditArea.vue"

interface Props {
  imageUrl?: string
  picture?: API.PictureVO | API.Picture
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

const handleConfimEditPicture = (blob: Blob) => {
  const fileName = (props.picture?.name || "image") + ".png"
  const file = new File([blob], fileName, { type: blob.type })
  handleUpload(file)
}

// 上传
const handleUpload = async (file: any) => {
  loading.value = true
  const params: API.PictureUploadRequest = { id: props.picture?.id }
  params.spaceId = props.spaceId
  const data = await pictureStore.uploadPitureByFile(params, file)
  props.onSuccess?.(data ?? {})
  closeModal.value()
  loading.value = false
}
</script>

<template>
  <ModalArea ref="modalRef" class="image-cropper" title="编辑图片">
    <PictureEditArea
      :imageUrl="imageUrl"
      :loading="loading"
      :cropperStyle="{ height: '400px' }"
      @confirm:editPicture="handleConfimEditPicture"
    />
  </ModalArea>
</template>

<style scoped></style>
