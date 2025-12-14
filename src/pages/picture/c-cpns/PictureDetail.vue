<script setup lang="ts">
import {
  ShareAltOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  FrownOutlined
} from "@ant-design/icons-vue"
import { computed, type ComputedRef, ref } from "vue"
import { useRoute, useRouter } from "vue-router"

import { useLoginUserStore } from "@/stores"
import { downloadImage, formatSize, toHexColor } from "@/utils"
import { PIC_REVIEW_STATUS_ENUM } from "@/constants/picture"
import checkAccess from "@/access/checkAccess"
import ACCESS_ENUM from "@/access/accessEnum"
import { storeToRefs } from "pinia"
import usePictureOperation from "@/hooks/usePictureOperation"
import { usePermission } from "@/hooks"
import SentimentAnalysisModal from "../../../components/SentimentAnalysisModal.vue"

interface Props {
  picture: API.PictureVO
  onShare?: any
}

const props = defineProps<Props>()
const emit = defineEmits(["fetchNewPicture"])

const loginUserStore = useLoginUserStore()
const { loginUser } = storeToRefs(loginUserStore)

// 权限
// 是否具有编辑权限
// loginUser变化时重新计算
const route = useRoute()
let canEdit: ComputedRef<boolean>
let canDelete: ComputedRef<boolean>
const { canDeletePicture, canEditPicture } = usePermission("picture")
// 公共图库的图片详情页 控制权限
const canEditCommonPicture = computed(() => {
  const loginUser = loginUserStore.loginUser
  // 未登录不可编辑
  if (!loginUser.id) return false
  // 仅本人或管理员可编辑
  // const user = props.picture.user || {}
  return loginUser.id === props.picture.userId || loginUser.userRole === "admin"
})
// 空间的图片详情页 控制权限
if (route.query?.spaceId) {
  canEdit = canEditPicture
  canDelete = canDeletePicture
} else {
  canEdit = canEditCommonPicture
  canDelete = canEditCommonPicture
}

const router = useRouter()
// 编辑
const handleEdit = () => {
  router.push({
    path: "/add_picture",
    query: {
      id: props.picture.id,
      spaceId: props.picture.spaceId
    }
  })
}
// 处理下载
const handledownload = () => {
  downloadImage(props.picture.url)
}

const handleShare = () => props?.onShare()

// 情感分析弹窗状态
const sentimentModalVisible = ref(false)

const openSentimentModal = () => {
  sentimentModalVisible.value = true
}

const { handleDelete, handleReview } = usePictureOperation()
const handleDeleteAndJump = (id: string) => {
  handleDelete(id).then(() => {
    router.push("/")
  })
}
const handleReviewAndEmit = (picture: API.PictureVO, reviewStatus: number) => {
  handleReview(picture.id!, reviewStatus).then(() => {
    emit("fetchNewPicture")
  })
}
</script>

<template>
  <div class="picture-detail">
    <a-card title="图片信息">
      <a-descriptions :column="1">
        <a-descriptions-item label="作者">
          <a-space>
            <a-avatar :size="24" :src="picture?.user?.userAvatar" />
            <div>{{ picture?.user?.userName }}</div>
          </a-space>
        </a-descriptions-item>
        <a-descriptions-item label="名称">
          {{ picture.name ?? "未命名" }}
        </a-descriptions-item>
        <a-descriptions-item label="简介">
          {{ picture.introduction ?? "-" }}
        </a-descriptions-item>
        <a-descriptions-item label="情感极性分类">
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
        <a-descriptions-item label="主色调">
          <a-space>
            {{ picture.picColor ?? "-" }}
            <div
              v-if="picture.picColor"
              :style="{
                backgroundColor: toHexColor(picture.picColor),
                width: '16px',
                height: '16px'
              }"
            />
          </a-space>
        </a-descriptions-item>
      </a-descriptions>
      <!-- 操作按钮 -->
      <a-space wrap>
        <a-button type="primary" @click="openSentimentModal">
          情感分析
          <template #icon>
            <FrownOutlined />
          </template>
        </a-button>
        <a-button type="primary" ghost @click="handledownload">
          免费下载
          <template #icon>
            <DownloadOutlined />
          </template>
        </a-button>
        <a-button type="primary" ghost @click="handleShare">
          分享
          <template #icon>
            <ShareAltOutlined />
          </template>
        </a-button>
        <template
          v-if="
            checkAccess(loginUser, ACCESS_ENUM.ADMIN) && !route.query?.spaceId
          "
        >
          <a-button
            @click="
              () => handleReviewAndEmit(picture, PIC_REVIEW_STATUS_ENUM.PASS)
            "
          >
            通过
          </a-button>
          <a-button
            danger
            @click="
              () => handleReviewAndEmit(picture, PIC_REVIEW_STATUS_ENUM.REJECT)
            "
          >
            拒绝
          </a-button>
        </template>
        <a-button v-if="canEdit" type="default" @click="handleEdit">
          编辑
          <template #icon>
            <EditOutlined />
          </template>
        </a-button>
        <a-button
          v-if="canDelete"
          danger
          @click="() => handleDeleteAndJump(picture.id!)"
        >
          删除
          <template #icon>
            <DeleteOutlined />
          </template>
        </a-button>
      </a-space>
    </a-card>

    <!-- 情感分析弹窗 -->
    <SentimentAnalysisModal
      :visible="sentimentModalVisible"
      :picture="picture"
      @update:visible="sentimentModalVisible = $event"
    />
  </div>
</template>

<style scoped></style>
