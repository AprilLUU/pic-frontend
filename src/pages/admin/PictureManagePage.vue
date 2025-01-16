<script setup lang="ts">
import { onMounted, reactive, ref } from "vue"
import { message } from "ant-design-vue"

import { listPictureByPageUsingPost } from "@/api"
import usePictureOperation from "@/hooks/usePictureOperation"
import { FormArea } from "@/base-ui/form-area"
import PictureTable from "./c-cpns/PictureTable.vue"
import { pictureFormList } from "./config"

// 定义数据
const dataList = ref<API.Picture[]>([])
const total = ref(0)

// 获取数据
const fetchData = async () => {
  const res = (await listPictureByPageUsingPost({
    ...searchParams,
    nullSpaceId: true
  })) as API.BaseResponsePagePicture_
  if (res.code === 0 && res.data) {
    dataList.value = res.data.records ?? []
    total.value = res.data.total ?? 0
  } else {
    message.error("获取数据失败，" + res.message)
  }
}

// 页面加载时获取数据，请求一次
onMounted(() => fetchData())

// 搜索条件
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: "createTime",
  sortOrder: "ascend"
})

const handleUpdateSearchParams = (field: string, value: string) => {
  // console.log(field, value)
  searchParams[field as keyof API.PictureQueryRequest] = value as any
}

// 搜索数据
const handleSearch = () => {
  // 重置页码
  searchParams.current = 1
  fetchData()
}

// 表格变化之后，重新获取数据
const handleTableChange = (page: any) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  fetchData()
}

const { handleDelete, handleReview } = usePictureOperation()
const handleDeleteAndFetchData = (id: string) => {
  handleDelete(id).then(() => {
    fetchData()
  })
}
const handleReviewAndFetchData = (
  picture: API.Picture,
  reviewStatus: number
) => {
  handleReview(picture.id!, reviewStatus).then(() => {
    fetchData()
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
      :dataList="dataList"
      :searchParams="searchParams"
      :total="total"
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
