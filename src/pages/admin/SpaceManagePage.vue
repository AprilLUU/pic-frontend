<script setup lang="ts">
import { reactive } from "vue"
import { storeToRefs } from "pinia"
import { FormArea } from "@/base-ui/form-area"
import SpaceTable from "./c-cpns/SpaceTable.vue"
import { spaceFormList } from "./config"
import { useAdminStore } from "@/stores"
import { useAdmin } from "@/hooks"

const adminStore = useAdminStore()
const { spaceDataList, spaceDataTotal } = storeToRefs(adminStore)

// 搜索条件
const searchParams = reactive<API.SpaceQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: "createTime",
  sortOrder: "ascend"
})
const { handleUpdateSearchParams, handleSearch, handleTableChange } = useAdmin(
  adminStore.fetchSpaceData,
  searchParams
)
const handleDelete = (id: string) => {
  if (!id) return
  adminStore.deleteSpace(id, searchParams)
}
</script>

<template>
  <div id="SpaceManagePage">
    <!-- 创建空间 -->
    <a-flex justify="space-between">
      <h2>空间管理</h2>
      <a-space>
        <a-button type="primary" href="/add_space"> 创建空间 </a-button>
        <a-button type="primary" ghost href="/space_analyze?queryPublic=1">
          分析公共图库
        </a-button>
        <a-button type="primary" ghost href="/space_analyze?queryAll=1">
          分析全空间
        </a-button>
      </a-space>
    </a-flex>
    <div style="margin-bottom: 16px"></div>
    <!-- 搜索表单 -->
    <FormArea
      :formData="searchParams"
      :formList="spaceFormList"
      @update:formData="handleUpdateSearchParams"
      @submit:formSubmit="handleSearch"
    />
    <!-- 表格 -->
    <SpaceTable
      :dataList="spaceDataList"
      :searchParams="searchParams"
      :total="spaceDataTotal"
      @change:tableChange="handleTableChange"
      @change:delete="handleDelete"
    />
  </div>
</template>

<style scoped>
#SpaceManagePage :deep(.ant-form-item) {
  margin-bottom: 16px;
}
</style>
