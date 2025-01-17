<script setup lang="ts">
import { reactive, ref } from "vue"
import { FormArea } from "@/base-ui/form-area"
import { taskFormList } from "./config"
import { usePictureStore } from "@/stores"

const pictureStore = usePictureStore()

const formData = reactive<API.PictureUploadByBatchRequest>({
  count: 10
})

const loading = ref(false)

const handleUpdateFormData = (field: string, value: string) => {
  formData[field as keyof API.PictureUploadByBatchRequest] = value as any
}

const handleSubmit = async (values: any) => {
  loading.value = true
  await pictureStore.uploadPictureByBatch(formData)
  loading.value = false
}
</script>

<template>
  <div id="addPictureBatchPage">
    <h2 style="margin-bottom: 16px">批量创建图片</h2>
    <FormArea
      :loading="loading"
      :formData="formData"
      :formList="taskFormList"
      formLayout="vertical"
      @update:formData="handleUpdateFormData"
      @submit:formSubmit="handleSubmit"
    />
  </div>
</template>

<style scoped>
#addPictureBatchPage {
  width: 600px;
  margin: 0 auto;
}
</style>
