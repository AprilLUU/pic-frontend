<script setup lang="ts">
import {
  PIC_REVIEW_STATUS_ENUM,
  PIC_REVIEW_STATUS_MAP
} from "@/constants/picture"
import { useAdminTable } from "@/hooks"
import { formatTime } from "@/utils"

interface Props {
  searchParams: API.PictureQueryRequest
  dataList: API.Picture[]
  total: number
}

const props = defineProps<Props>()
const emit = defineEmits([
  "change:tableChange",
  "change:delete",
  "change:review"
])

const columns = [
  {
    title: "id",
    dataIndex: "id",
    width: 80
  },
  {
    title: "图片",
    dataIndex: "url"
  },
  {
    title: "名称",
    dataIndex: "name"
  },
  {
    title: "简介",
    dataIndex: "introduction",
    ellipsis: true
  },
  {
    title: "类型",
    dataIndex: "category"
  },
  {
    title: "标签",
    dataIndex: "tags"
  },
  {
    title: "图片信息",
    dataIndex: "picInfo"
  },
  {
    title: "图片 id",
    dataIndex: "userId",
    width: 80
  },
  {
    title: "空间 id",
    dataIndex: "spaceId",
    width: 80
  },
  {
    title: "审核信息",
    dataIndex: "reviewMessage"
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

const { pagination, handleTableChange, handleDelete, handleReview } =
  useAdminTable(props, emit)
</script>

<template>
  <div class="picture-table">
    <a-table
      :columns="columns"
      :data-source="dataList"
      :pagination="pagination"
      :scroll="{ x: 'max-content' }"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'url'">
          <a-image :src="record.url" :width="120" />
        </template>
        <!-- 标签 -->
        <template v-if="column.dataIndex === 'tags'">
          <a-space wrap>
            <a-tag v-for="tag in JSON.parse(record.tags || '[]')" :key="tag">{{
              tag
            }}</a-tag>
          </a-space>
        </template>
        <!-- 图片信息 -->
        <template v-if="column.dataIndex === 'picInfo'">
          <div>格式：{{ record.picFormat }}</div>
          <div>宽度：{{ record.picWidth }}</div>
          <div>高度：{{ record.picHeight }}</div>
          <div>宽高比：{{ record.picScale }}</div>
          <div>大小：{{ (record.picSize / 1024).toFixed(2) }}KB</div>
        </template>
        <!-- 审核信息 -->
        <template v-if="column.dataIndex === 'reviewMessage'">
          <div>
            审核状态：{{
              PIC_REVIEW_STATUS_MAP[
                record.reviewStatus as keyof typeof PIC_REVIEW_STATUS_MAP
              ]
            }}
          </div>
          <div>审核信息：{{ record.reviewMessage }}</div>
          <div>审核人ID：{{ record.reviewerId }}</div>
          <div v-if="record.reviewTime">
            审核时间：{{ formatTime(record.reviewTime) }}
          </div>
        </template>
        <template v-if="column.dataIndex === 'createTime'">
          {{ formatTime(record.createTime) }}
        </template>
        <template v-if="column.dataIndex === 'editTime'">
          {{ formatTime(record.editTime) }}
        </template>
        <template v-if="column.key === 'action'">
          <a-space wrap>
            <a-button
              v-if="record.reviewStatus !== PIC_REVIEW_STATUS_ENUM.PASS"
              type="link"
              @click="() => handleReview(record, PIC_REVIEW_STATUS_ENUM.PASS)"
            >
              通过
            </a-button>
            <a-button
              v-if="record.reviewStatus !== PIC_REVIEW_STATUS_ENUM.REJECT"
              type="link"
              danger
              @click="() => handleReview(record, PIC_REVIEW_STATUS_ENUM.REJECT)"
            >
              拒绝
            </a-button>
            <a-button type="link" :href="`/add_picture?id=${record.id}`"
              >编辑</a-button
            >
            <a-button type="link" danger @click="() => handleDelete(record.id)"
              >删除</a-button
            >
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<style scoped></style>
