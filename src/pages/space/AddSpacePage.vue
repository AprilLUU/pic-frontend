<script setup lang="ts">
import { message } from "ant-design-vue"
import { onMounted, reactive, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import {
  addSpaceUsingPost,
  getSpaceByIdUsingGet,
  listSpaceLevelUsingGet,
  updateSpaceUsingPost
} from "@/api"
import { FormArea } from "@/base-ui/form-area"
import { spaceEditFormList } from "./config"
import { formatSize } from "@/utils"
import { useLoginUserStore } from "@/stores"

const space = ref<API.SpaceVO | API.Space>()
const spaceForm = reactive<API.SpaceAddRequest | API.SpaceUpdateRequest>({})
const loading = ref(false)
const spaceLevelList = ref<API.SpaceLevel[]>([])
const router = useRouter()
const route = useRoute()
const loginUserStore = useLoginUserStore()
spaceEditFormList[spaceEditFormList.length - 1].name = route.query?.id
  ? "修改"
  : "创建"

// 获取空间级别
const fetchSpaceLevelList = async () => {
  const res = (await listSpaceLevelUsingGet()) as any
  if (res.code === 0 && res.data) {
    spaceLevelList.value = res.data
  } else {
    message.error("加载空间级别失败，" + res.message)
  }
}
// 更新表单数据
const handleUpdateFormData = (field: string, value: string) => {
  spaceForm[field as keyof API.SpaceAddRequest] = value as any
}
// 提交
const handleSubmit = async (values: any) => {
  const spaceId = space.value?.id
  loading.value = true

  let res
  if (spaceId) {
    res = (await updateSpaceUsingPost({
      id: spaceId,
      ...values
    })) as any
  } else {
    res = (await addSpaceUsingPost({
      id: spaceId,
      ...values
    })) as any
  }

  if (res.code === 0 && res.data) {
    message.success("操作成功")
    // 如果是创建空间 设置全局空间状态
    if (!spaceId) await loginUserStore.fetchLoginUserSpace()
    // 跳转到空间详情页
    const path = `/space/${spaceId ?? res.data}`
    router.push({
      path
    })
  } else {
    message.error("操作失败，" + res.message)
  }
  
  loading.value = false
}
// 获取老数据
const getOldSpace = async () => {
  // 获取数据
  const id = route.query?.id as string
  if (id) {
    const res = (await getSpaceByIdUsingGet({
      id
    })) as API.BaseResponseSpace_
    if (res.code === 0 && res.data) {
      const data = res.data
      space.value = data
      spaceForm.spaceName = data.spaceName
      spaceForm.spaceLevel = data.spaceLevel
    }
  }
}

onMounted(() => {
  fetchSpaceLevelList()
  getOldSpace()
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
