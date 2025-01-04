<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue"
import { message } from "ant-design-vue"
import dayjs from "dayjs"
import { deleteUserUsingPost, listUserVoByPageUsingPost } from "@/api"

const columns = [
  {
    title: "id",
    dataIndex: "id"
  },
  {
    title: "账号",
    dataIndex: "userAccount"
  },
  {
    title: "用户名",
    dataIndex: "userName"
  },
  {
    title: "头像",
    dataIndex: "userAvatar"
  },
  {
    title: "简介",
    dataIndex: "userProfile"
  },
  {
    title: "用户角色",
    dataIndex: "userRole"
  },
  {
    title: "创建时间",
    dataIndex: "createTime"
  },
  {
    title: "操作",
    key: "action"
  }
]

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

// 分页参数
const pagination = computed(() => {
  return {
    current: searchParams.current,
    pageSize: searchParams.pageSize,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total: number) => `共 ${total} 条`
  }
})

// 表格变化之后，重新获取数据
const handleTableChange = (page: any) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  fetchData()
}

// 搜索数据
const handleSearch = () => {
  // 重置页码
  searchParams.current = 1
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
    <a-form layout="inline" :model="searchParams" @finish="handleSearch">
      <a-form-item label="账号">
        <a-input
          v-model:value="searchParams.userAccount"
          placeholder="输入账号"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="用户名">
        <a-input
          v-model:value="searchParams.userName"
          placeholder="输入用户名"
          allow-clear
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">搜索</a-button>
      </a-form-item>
    </a-form>
    <div style="margin-bottom: 16px" />
    <!-- 表格 -->
    <a-table
      :columns="columns"
      :data-source="dataList"
      :pagination="pagination"
      :scroll="{ x: 'max-content' }"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'userAvatar'">
          <a-image :src="record.userAvatar" :width="60" />
        </template>
        <template v-if="column.dataIndex === 'userRole'">
          <div v-if="record.userRole === 'admin'">
            <a-tag color="green">管理员</a-tag>
          </div>
          <div v-else>
            <a-tag color="blue">普通用户</a-tag>
          </div>
        </template>
        <template v-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
        <template v-if="column.key === 'action'">
          <a-button danger @click="handleDelete(record.id)">删除</a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>

<style scoped></style>
