<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from "vue"
import { storeToRefs } from "pinia"
import { useRoute } from "vue-router"
import { FormArea } from "@/base-ui/form-area"
import { spaceEditFormList } from "./config"
import { formatSize } from "@/utils"
import { useSpaceStore } from "@/stores"
import { SPACE_TYPE_ENUM, SPACE_TYPE_MAP } from "@/constants"
import ACCESS_ENUM from "@/access/accessEnum"

const spaceStore = useSpaceStore()
const { space, spaceLevelList } = storeToRefs(spaceStore)

const spaceForm = reactive<any>({})
const loading = ref(false)

const route = useRoute()
if (route.query?.id) {
  spaceEditFormList[spaceEditFormList.length - 1].name = "修改"
  route.meta.access = ACCESS_ENUM.ADMIN
} else {
  spaceEditFormList[spaceEditFormList.length - 1].name = "创建"
  route.meta.access = ACCESS_ENUM.USER
}

console.log(route)

// 空间类别
const spaceType = computed(() => {
  if (route.query?.type) {
    return Number(route.query.type)
  }
  return SPACE_TYPE_ENUM.PRIVATE
})

// 更新表单数据
const handleUpdateFormData = (field: string, value: string) => {
  spaceForm[field] = value
}
// 提交
const handleSubmit = async (values: any) => {
  loading.value = true
  const params: API.SpaceAddRequest = {
    ...values,
    spaceType: spaceType.value
  }
  spaceStore.addOrUpdateSpace(params)
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
onUnmounted(() => (space.value = {}))
</script>

<template>
  <div id="addSpacePage">
    <h2 style="margin-bottom: 16px">
      {{
        route.query?.id
          ? `修改${SPACE_TYPE_MAP[spaceType]}`
          : `创建${SPACE_TYPE_MAP[spaceType]}`
      }}
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
