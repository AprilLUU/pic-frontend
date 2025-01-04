<script setup lang="ts">
import { message } from "ant-design-vue"
import { EditOutlined, DeleteOutlined, DownloadOutlined } from "@ant-design/icons-vue"
import { computed } from "vue"
import { useRouter } from "vue-router"

import { deletePictureUsingPost } from "@/api"
import { useLoginUserStore } from "@/stores"
import { downloadImage, formatSize } from "@/utils"

interface Props {
  picture: API.PictureVO
}

const props = defineProps<Props>()

const loginUserStore = useLoginUserStore()
// 是否具有编辑权限
// loginUser变化时重新计算
const canEdit = computed(() => {
  const loginUser = loginUserStore.loginUser
  // 未登录不可编辑
  if (!loginUser.id) return false
  // 仅本人或管理员可编辑
  const user = props.picture.user || {}
  return loginUser.id === user.id || loginUser.userRole === "admin"
})

const router = useRouter()
// 编辑
const handleEdit = () => {
  router.push("/add_picture?id=" + props.picture.id)
}
// 删除
const handleDelete = async () => {
  const id = props.picture.id
  if (!id) {
    return
  }
  const res = (await deletePictureUsingPost({ id })) as any
  if (res.code === 0) {
    message.success("删除成功")
  } else {
    message.error("删除失败")
  }
}

// 处理下载
const handledownload = () => {
  downloadImage(props.picture.url)
}
</script>

<template>
  <div class="picture-detail">
    <a-card title="图片信息">
      <a-descriptions :column="1">
        <a-descriptions-item label="作者">
          <a-space>
            <a-avatar :size="24" :src="picture.user?.userAvatar" />
            <div>{{ picture.user?.userName }}</div>
          </a-space>
        </a-descriptions-item>
        <a-descriptions-item label="名称">
          {{ picture.name ?? "未命名" }}
        </a-descriptions-item>
        <a-descriptions-item label="简介">
          {{ picture.introduction ?? "-" }}
        </a-descriptions-item>
        <a-descriptions-item label="分类">
          {{ picture.category ?? "默认" }}
        </a-descriptions-item>
        <a-descriptions-item label="标签">
          <a-tag v-for="tag in picture.tags" :key="tag">
            {{ tag }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="格式">
          {{ picture.picFormat ?? "-" }}
        </a-descriptions-item>
        <a-descriptions-item label="宽度">
          {{ picture.picWidth ?? "-" }}
        </a-descriptions-item>
        <a-descriptions-item label="高度">
          {{ picture.picHeight ?? "-" }}
        </a-descriptions-item>
        <a-descriptions-item label="宽高比">
          {{ picture.picScale ?? "-" }}
        </a-descriptions-item>
        <a-descriptions-item label="大小">
          {{ formatSize(picture.picSize) }}
        </a-descriptions-item>
      </a-descriptions>
      <!-- 操作按钮 -->
      <a-space wrap>
        <a-button type="primary" @click="handledownload">
          免费下载
          <template #icon>
            <DownloadOutlined />
          </template>
        </a-button>
        <a-button v-if="canEdit" type="default" @click="handleEdit">
          编辑
          <template #icon>
            <EditOutlined />
          </template>
        </a-button>
        <a-button v-if="canEdit" danger @click="handleDelete">
          删除
          <template #icon>
            <DeleteOutlined />
          </template>
        </a-button>
      </a-space>
    </a-card>
  </div>
</template>

<style scoped></style>
