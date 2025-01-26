<script setup lang="ts">
import { computed, reactive } from "vue"
import { storeToRefs } from "pinia"
import { FormArea } from "@/base-ui/form-area"
import { spaceUserFormList } from "./config"
import { useAdminStore } from "@/stores"
import { useAdmin } from "@/hooks"
import SpaceUserTable from "./c-cpns/SpaceUserTable.vue"

// 定义属性
interface Props {
  id: string
}

const props = defineProps<Props>()

const adminStore = useAdminStore()
const { spaceUserDataList } = storeToRefs(adminStore)

const params = computed<API.SpaceUserQueryRequest>(() => ({
  spaceId: props.id
}))
useAdmin(adminStore.fetchSpaceUserData, params.value)

// 添加用户
const formData = reactive<API.SpaceUserAddRequest>({})
const handleUpdateFormData = (field: string, value: string) => {
  formData[field as keyof API.SpaceUserAddRequest] = value
}
const handleSubmit = () => {
  if (!params.value.spaceId) return
  adminStore.addSpaceUser({
    ...formData,
    spaceId: params.value.spaceId
  })
}

const handleEdit = (value: string, data: API.SpaceUser) => {
  data.spaceRole = value
  adminStore.editSpaceRole({
    id: data.id,
    spaceRole: value
  })
}
const handleDelete = (id: string) => {
  console.log(id)
  if (!id) return
  adminStore.deleteSpaceUser(id, params.value)
}
</script>

<template>
  <div id="SpaceManagePage">
    <!-- 创建空间 -->
    <div style="margin-bottom: 16px"></div>
    <!-- 搜索表单 -->
    <FormArea
      :formData="formData"
      :formList="spaceUserFormList"
      @update:formData="handleUpdateFormData"
      @submit:formSubmit="handleSubmit"
    />
    <!-- 表格 -->
    <SpaceUserTable
      :dataList="spaceUserDataList"
      @change:edit="handleEdit"
      @change:delete="handleDelete"
    />
  </div>
</template>

<style scoped>
#SpaceManagePage :deep(.ant-form-item) {
  margin-bottom: 16px;
}
</style>
