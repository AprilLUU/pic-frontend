<script setup lang="ts">
import { reactive } from "vue"
import { storeToRefs } from "pinia"
import { useAdminStore } from "@/stores"
import { FormArea } from "@/base-ui/form-area"
import PictureTable from "./c-cpns/PictureTable.vue"
import { pictureFormList } from "./config"
import { useAdmin, usePictureOperation } from "@/hooks"

const adminStore = useAdminStore()
const { picDataList, picDataTotal } = storeToRefs(adminStore)
// 搜索条件
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: "createTime",
  sortOrder: "ascend"
})

const { handleUpdateSearchParams, handleSearch, handleTableChange } = useAdmin(
  adminStore.fetchPicData,
  searchParams
)

const { handleDelete, handleReview } = usePictureOperation()
const handleDeleteAndFetchData = (id: string) => {
  handleDelete(id).then(() => {
    adminStore.fetchPicData(searchParams)
  })
}
const handleReviewAndFetchData = (
  picture: API.Picture,
  reviewStatus: number
) => {
  handleReview(picture.id!, reviewStatus).then(() => {
    adminStore.fetchPicData(searchParams)
  })
}
</script>

<template>
  <div id="PictureManagePage">
    <!-- 创建图片 -->
    <a-flex justify="space-between">
      <h2>图片管理</h2>
      <a-space>
        <a-button type="primary" href="/add_picture">创建图片</a-button>
        <a-button type="primary" href="/add_picture/batch" ghost
          >批量创建图片</a-button
        >
      </a-space>
    </a-flex>
    <div style="margin-bottom: 16px"></div>
    <!-- 搜索表单 -->
    <FormArea
      :formData="searchParams"
      :formList="pictureFormList"
      @update:formData="handleUpdateSearchParams"
      @submit:formSubmit="handleSearch"
    />
    <!-- 表格 -->
    <PictureTable
      :dataList="picDataList"
      :searchParams="searchParams"
      :total="picDataTotal"
      @change:tableChange="handleTableChange"
      @change:delete="handleDeleteAndFetchData"
      @change:review="handleReviewAndFetchData"
    />
  </div>
</template>

<style scoped>
#PictureManagePage :deep(.ant-form-item) {
  margin-bottom: 16px;
}
</style>
