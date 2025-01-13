<script setup lang="ts">
import { message } from "ant-design-vue"
import { reactive, ref } from "vue"
import { uploadPictureByBatchUsingPost } from "@/api"
import { useRouter } from "vue-router"
import { FormArea } from "@/base-ui/form-area"
import { taskFormList } from "./config"

const formData = reactive<API.PictureUploadByBatchRequest>({
  count: 10
})

const loading = ref(false)

const router = useRouter()

const handleUpdateFormData = (field: string, value: string) => {
  formData[field as keyof API.PictureUploadByBatchRequest] = value as any
}

const handleSubmit = async (values: any) => {
  loading.value = true
  const res = (await uploadPictureByBatchUsingPost({
    ...formData
  })) as any
  if (res.code === 0 && res.data) {
    message.success(`创建成功，共 ${res.data} 条`)
    router.push({
      path: "/"
    })
  } else {
    message.error("创建失败，" + res.message)
  }
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
