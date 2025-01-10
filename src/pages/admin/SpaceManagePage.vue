<script setup lang="ts">
import { onMounted, reactive, ref } from "vue"
import { message } from "ant-design-vue"

import { deleteSpaceUsingPost, listSpaceByPageUsingPost } from "@/api"
import { FormArea } from "@/base-ui/form-area"
import SpaceTable from "./c-cpns/SpaceTable.vue"
import { spaceFormList } from "./config"

// 定义数据
const dataList = ref<API.Space[]>([])
const total = ref(0)

// 获取数据
const fetchData = async () => {
  const res = (await listSpaceByPageUsingPost({
    ...searchParams
  })) as API.BaseResponsePageSpace_
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
const searchParams = reactive<API.SpaceQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: "createTime",
  sortOrder: "ascend"
})

const handleUpdateSearchParams = (field: string, value: string) => {
  searchParams[field as keyof API.SpaceQueryRequest] = value as any
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

const handleDelete = async (id: string) => {
  if (!id) return
  const res = (await deleteSpaceUsingPost({ id })) as any
  if (res.code === 0) {
    message.success("删除成功")
    // 刷新数据
    fetchData()
  } else {
    message.error("删除失败")
  }
}
</script>

<template>
  <div id="SpaceManagePage">
    <!-- 创建空间 -->
    <a-flex justify="space-between">
      <h2>空间管理</h2>
      <a-space>
        <a-button type="primary" href="/add_space" target="_blank"
          >创建空间</a-button
        >
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
      :dataList="dataList"
      :searchParams="searchParams"
      :total="total"
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
