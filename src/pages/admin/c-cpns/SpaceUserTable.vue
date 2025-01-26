<script setup lang="ts">
import { SPACE_ROLE_OPTIONS } from "@/constants"
import { useAdminTable } from "@/hooks"
import { formatTime } from "@/utils"

interface Props {
  dataList: API.SpaceUser[]
}

const props = defineProps<Props>()
const emit = defineEmits(["change:delete", "change:edit"])

// 表格列
const columns = [
  {
    title: "用户",
    dataIndex: "userInfo"
  },
  {
    title: "角色",
    dataIndex: "spaceRole"
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

const { handleDelete } = useAdminTable(props, emit)
const editSpaceRole = (value: string, record: API.SpaceUser) => {
  emit("change:edit", value, record)
}
</script>

<template>
  <div class="picture-table">
    <a-table
      :columns="columns"
      :data-source="dataList"
      :scroll="{ x: 'max-content' }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'userInfo'">
          <a-space>
            <a-avatar :src="record.user?.userAvatar" />
            {{ record.user?.userName }}
          </a-space>
        </template>
        <template v-if="column.dataIndex === 'spaceRole'">
          <a-select
            :value="record.spaceRole"
            :options="SPACE_ROLE_OPTIONS"
            @change="(value: any) => editSpaceRole(value, record)"
          />
        </template>
        <template v-else-if="column.dataIndex === 'createTime'">
          {{ formatTime(record.createTime) }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space wrap>
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
