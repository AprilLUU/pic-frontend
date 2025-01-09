<script setup lang="ts">
import { computed } from "vue"
import dayjs from "dayjs"

interface Props {
  searchParams: API.PictureQueryRequest
  dataList: API.Picture[]
  total: number
}

const props = defineProps<Props>()
const emit = defineEmits(["change:tableChange", "change:delete"])

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

// 分页参数
const pagination = computed(() => {
  return {
    current: props.searchParams.current,
    pageSize: props.searchParams.pageSize,
    total: props.total,
    showSizeChanger: true,
    showTotal: (total: number) => `共 ${total} 条`
  }
})

const handleTableChange = (page: any) => {
  emit("change:tableChange", page)
}

const handleDelete = (id: string) => {
  emit("change:delete", id)
}
</script>

<template>
  <div class="user-table">
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
          <a-button danger @click="() => handleDelete(record.id)">删除</a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>

<style scoped></style>
