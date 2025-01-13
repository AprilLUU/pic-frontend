<script setup lang="ts">
import { computed } from "vue"
import dayjs from "dayjs"
import { SPACE_LEVEL_MAP } from "@/constants/space"
import { formatSize } from "@/utils"

interface Props {
  searchParams: API.SpaceQueryRequest
  dataList: API.Space[]
  total: number
}

const props = defineProps<Props>()
const emit = defineEmits(["change:tableChange", "change:delete"])

const columns = [
  {
    title: "id",
    dataIndex: "id",
    width: 80
  },
  {
    title: "空间名称",
    dataIndex: "spaceName"
  },
  {
    title: "空间级别",
    dataIndex: "spaceLevel"
  },
  {
    title: "使用情况",
    dataIndex: "spaceUseInfo"
  },
  {
    title: "用户 id",
    dataIndex: "userId",
    width: 80
  },
  {
    title: "创建时间",
    dataIndex: "createTime"
  },
  {
    title: "编辑时间",
    dataIndex: "editTime"
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
  <div class="space-table">
    <a-table
      :columns="columns"
      :data-source="dataList"
      :pagination="pagination"
      :scroll="{ x: 'max-content' }"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <!-- 空间级别 -->
        <template v-if="column.dataIndex === 'spaceLevel'">
          <a-tag>{{ SPACE_LEVEL_MAP[record.spaceLevel] }}</a-tag>
        </template>
        <!-- 使用情况 -->
        <template v-if="column.dataIndex === 'spaceUseInfo'">
          <div>
            大小：{{ formatSize(record.totalSize) }} /
            {{ formatSize(record.maxSize) }}
          </div>
          <div>数量：{{ record.totalCount }} / {{ record.maxCount }}</div>
        </template>
        <template v-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
        <template v-if="column.dataIndex === 'editTime'">
          {{ dayjs(record.editTime).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
        <template v-if="column.key === 'action'">
          <a-space wrap>
            <a-button
              type="link"
              :href="`/add_space?id=${record.id}`"
              target="_blank"
            >
              编辑
            </a-button>
            <a-button type="link" danger @click="handleDelete(record.id)"
              >删除</a-button
            >
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<style scoped></style>
