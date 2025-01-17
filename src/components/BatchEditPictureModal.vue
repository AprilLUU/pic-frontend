<script setup lang="ts">
import { computed, reactive, ref } from "vue"
import FormArea from "@/base-ui/form-area/src/FormArea.vue"
import ModalArea from "@/base-ui/modal-area/src/ModalArea.vue"
import { batchEditPictureFormList } from "./config"

const emit = defineEmits(["submit:formSubmit"])

const modalRef = ref()
const openModal = computed(() => modalRef.value?.openModal)
const closeModal = computed(() => modalRef.value?.closeModal)
defineExpose({
  openModal,
  closeModal
})

// 初始化表单数据
const formData = reactive<API.PictureEditByBatchRequest>({
  category: "", // 分类
  tags: [], // 标签
  nameRule: "" // 命名规则
})

const handleUpdateFormData = (field: string, value: string) => {
  formData[field as keyof API.PictureEditByBatchRequest] = value as any
}

const handleSubmit = async (values: any) => {
  emit("submit:formSubmit", values)
}
</script>

<template>
  <ModalArea ref="modalRef">
    <a-typography-paragraph type="secondary"
      >* 只对当前页面的图片生效</a-typography-paragraph
    >
    <FormArea
      :formData="formData"
      :formList="batchEditPictureFormList"
      formLayout="vertical"
      @update:formData="handleUpdateFormData"
      @submit:formSubmit="handleSubmit"
    />
  </ModalArea>
</template>

<style scoped></style>
