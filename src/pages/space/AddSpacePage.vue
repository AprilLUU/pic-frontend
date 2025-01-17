<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from "vue"
import { useRoute } from "vue-router"
import { FormArea } from "@/base-ui/form-area"
import { spaceEditFormList } from "./config"
import { formatSize } from "@/utils"
import { useSpaceStore } from "@/stores"
import { storeToRefs } from "pinia"

const spaceStore = useSpaceStore()
const { space, spaceLevelList } = storeToRefs(spaceStore)

const spaceForm = reactive<API.SpaceAddRequest | API.SpaceUpdateRequest>({})
const loading = ref(false)
const route = useRoute()
spaceEditFormList[spaceEditFormList.length - 1].name = route.query?.id
  ? "修改"
  : "创建"

// 更新表单数据
const handleUpdateFormData = (field: string, value: string) => {
  spaceForm[field as keyof API.SpaceAddRequest] = value as any
}
// 提交
const handleSubmit = async (values: any) => {
  loading.value = true
  spaceStore.addOrUpdateSpace(values)
  loading.value = false
}
// 获取老数据
const getOldSpace = async () => {
  // 获取数据
  const id = route.query?.id as string
  if (id) {
    await spaceStore.getSpaceById(id)
    spaceForm.spaceName = space.value!.spaceName
    spaceForm.spaceLevel = space.value!.spaceLevel
  }
}

onMounted(() => {
  spaceStore.fetchSpaceLevelList()
  getOldSpace()
})
onUnmounted(() => {
  space.value = {}
})
</script>

<template>
  <div id="addSpacePage">
    <h2 style="margin-bottom: 16px">
      {{ route.query?.id ? "修改空间" : "创建空间" }}
    </h2>
    <FormArea
      :formData="spaceForm"
      :formList="spaceEditFormList"
      formLayout="vertical"
      :loading="loading"
      @update:formData="handleUpdateFormData"
      @submit:formSubmit="handleSubmit"
    />
    <a-card title="空间级别介绍">
      <a-typography-paragraph>
        * 目前仅支持开通普通版，如需升级空间，请联系
        <a href="#" target="_blank">管理员</a>。
      </a-typography-paragraph>
      <a-typography-paragraph
        v-for="spaceLevel in spaceLevelList"
        :key="spaceLevel.text"
      >
        {{ spaceLevel.text }}： 大小 {{ formatSize(spaceLevel.maxSize) }}， 数量
        {{ spaceLevel.maxCount }}
      </a-typography-paragraph>
    </a-card>
  </div>
</template>

<style scoped>
#addSpacePage {
  max-width: 720px;
  margin: 0 auto;
}
</style>
