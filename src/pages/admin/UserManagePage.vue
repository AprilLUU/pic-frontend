<script setup lang="ts">
import { onMounted, reactive, ref } from "vue"
import { message } from "ant-design-vue"
import { deleteUserUsingPost, listUserVoByPageUsingPost } from "@/api"
import { FormArea } from "@/base-ui/form-area"
import UserTable from "./c-cpns/UserTable.vue"
import { userFormList } from "./config"

// 定义数据
const dataList = ref<API.UserVO[]>([])
const total = ref(0)

// 搜索条件
const searchParams = reactive<API.UserQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: "createTime",
  sortOrder: "ascend"
})

// 获取数据
const fetchData = async () => {
  const res = (await listUserVoByPageUsingPost({
    ...searchParams
  })) as API.BaseResponsePageUserVO_
  if (res.code === 0 && res.data) {
    dataList.value = res.data.records ?? []
    total.value = res.data.total ?? 0
  } else {
    message.error("获取数据失败，" + res.message)
  }
}

// 页面加载时获取数据，请求一次
onMounted(() => fetchData())

const handleUpdateSearchParams = (field: string, value: string) => {
  searchParams[field as keyof API.UserQueryRequest] = value as any
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

// 删除数据
const handleDelete = async (id: string) => {
  if (!id) return
  const res = (await deleteUserUsingPost({ id })) as any
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
  <div id="userManagePage">
    <!-- 搜索表单 -->
    <FormArea
      :formData="searchParams"
      :formList="userFormList"
      @update:formData="handleUpdateSearchParams"
      @submit:formSubmit="handleSearch"
    />
    <div style="margin-bottom: 16px" />
    <!-- 表格 -->
    <UserTable
      :dataList="dataList"
      :searchParams="searchParams"
      :total="total"
      @change:tableChange="handleTableChange"
      @change:delete="handleDelete"
    />
  </div>
</template>

<style scoped></style>
