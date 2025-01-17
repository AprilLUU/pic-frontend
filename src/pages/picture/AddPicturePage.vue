<script setup lang="ts">
import { storeToRefs } from "pinia"
import { type ComputedRef } from "vue"
import { computed, onMounted, onUnmounted, reactive, ref } from "vue"
import { useRoute } from "vue-router"
import PictureUpload from "@/pages/picture/c-cpns/PictureUpload.vue"
import UrlUpload from "@/pages/picture/c-cpns//UrlUpload.vue"
import { FormArea } from "@/base-ui/form-area"
import { pictureEditFormList } from "./config"
import { usePictureStore } from "@/stores"

const pictureStore = usePictureStore()
const { picture } = storeToRefs(pictureStore)
const pictureForm = reactive<API.PictureEditRequest>({})

const uploadType = ref<"file" | "url">("file")

const route = useRoute()
// 空间 id
const spaceId = computed(() => {
  return route.query?.spaceId
}) as ComputedRef<string>

const editName = route.query?.id ? "修改" : "创建"
pictureEditFormList[pictureEditFormList.length - 1].name = editName

const handleUpdateFormData = (field: string, value: string) => {
  pictureForm[field as keyof API.PictureEditRequest] = value as any
}

const handleSubmit = async (values: any) => {
  pictureStore.editPiture(values, spaceId.value as string, editName)
}

const onSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
  pictureForm.name = newPicture.name
}

// 获取老数据
const getOldPicture = async () => {
  // 获取数据
  const id = route.query?.id as string
  let data
  if (id) data = await pictureStore.getPictureById(id)
  if (data) {
    pictureForm.name = data.name
    pictureForm.introduction = data.introduction
    pictureForm.category = data.category
    pictureForm.tags = JSON.parse(data.tags ?? "[]")
  }
}

onMounted(() => getOldPicture())
onUnmounted(() => (picture.value = undefined))
</script>

<template>
  <div id="addPicturePage">
    <h2 style="margin-bottom: 16px">
      {{ route.query?.id ? "修改图片" : "创建图片" }}
    </h2>
    <a-typography-paragraph v-if="spaceId" type="secondary">
      保存至空间：<a :href="`/space/${spaceId}`" target="_blank">{{
        spaceId
      }}</a>
    </a-typography-paragraph>
    <!-- 选择上传方式 -->
    <a-tabs v-model:activeKey="uploadType"
      >>
      <a-tab-pane key="file" tab="文件上传">
        <PictureUpload
          :picture="picture"
          :onSuccess="onSuccess"
          :spaceId="spaceId"
        />
      </a-tab-pane>
      <a-tab-pane key="url" tab="URL 上传" force-render>
        <UrlUpload
          :picture="picture"
          :onSuccess="onSuccess"
          :spaceId="spaceId"
        />
      </a-tab-pane>
    </a-tabs>
    <FormArea
      v-if="picture"
      :formData="pictureForm"
      :formList="pictureEditFormList"
      formLayout="vertical"
      @update:formData="handleUpdateFormData"
      @submit:formSubmit="handleSubmit"
    />
  </div>
</template>

<style scoped>
#addPicturePage {
  max-width: 720px;
  margin: 0 auto;
}
</style>
