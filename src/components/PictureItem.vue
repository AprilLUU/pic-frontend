<script setup lang="ts">
import { useRouter } from "vue-router"
import { message } from "ant-design-vue"
import {
  ShareAltOutlined,
  FrownOutlined,
  DeleteOutlined,
  EditOutlined,
  // SearchOutlined
} from "@ant-design/icons-vue"
import { deletePictureUsingPost } from "@/api"
import { ref } from "vue"
import SentimentAnalysisModal from "./SentimentAnalysisModal.vue"

interface Props {
  picture: any
  onReload?: any
  showOp?: boolean
  showMeta?: boolean
  onShare?: any
  canEdit?: boolean
  canDelete?: boolean
  canAnalyzeSentiment?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showOp: false,
  showMeta: true,
})
const spaceId = props.picture?.spaceId
const query = spaceId ? { spaceId } : {}
const router = useRouter()

const handlePictureClick = (id: string) => {
  if (props.picture?.thumbUrl) {
    window.open(props.picture?.fromUrl, "_blank")
  } else {
    router.push({
      path: `/picture/${id}`,
      query
    })
  }
}

const handleShare = (picture: API.PictureVO, e: MouseEvent) => {
  props?.onShare(picture, e)
}

// // 编辑
// const handleSearch = (picture: API.PictureVO, e: MouseEvent) => {
//   e.stopPropagation()
//   router.push({
//     path: "/search_picture",
//     query: {
//       pictureId: picture.id
//     }
//   })
// }

// 情感分析弹窗
const sentimentModalVisible = ref(false)

const openSentimentModal = (e: MouseEvent) => {
  e.stopPropagation()
  sentimentModalVisible.value = true
}

// 编辑
const handleEdit = (picture: API.PictureVO, e: MouseEvent) => {
  e.stopPropagation()
  router.push({
    path: "/add_picture",
    query: {
      id: picture.id,
      spaceId: picture.spaceId
    }
  })
}

// 删除
const handleDelete = async (picture: API.PictureVO, e: MouseEvent) => {
  e.stopPropagation()
  const id = picture.id
  if (!id) return
  const res = (await deletePictureUsingPost({ id })) as any
  if (res.code === 0) {
    message.success("删除成功")
    // 让外层刷新
    props?.onReload()
  } else {
    message.error("删除失败")
  }
}

const chooseTagColor = (tag: string) => {
  let tagColor = "default"
  switch (tag) {
    case "积极":
      tagColor = "success"
      break
    case "中性":
      break
    case "消极":
      tagColor = "error"
      break
    default:
      break
  }
  return tagColor
}
</script>

<template>
  <div class="picture-item">
    <a-card hoverable @click="() => handlePictureClick(picture.id ?? '')">
      <template #cover>
        <img v-if="picture?.thumbUrl" style="" :src="picture?.thumbUrl" />
        <img
          v-else
          style="height: 180px; object-fit: cover"
          :alt="picture?.name"
          :src="picture?.thumbnailUrl ?? picture?.url"
        />
      </template>
      <a-card-meta v-if="showMeta" :title="picture.name">
        <template #description>
          <a-flex>
            <a-tag :color="chooseTagColor(picture.category)">
              {{ picture.category ?? "未进行情感分析" }}
            </a-tag>
            <a-tag v-for="tag in picture.tags" :key="tag">
              {{ tag }}
            </a-tag>
          </a-flex>
        </template>
      </a-card-meta>
      <template v-if="showOp" #actions>
        <!-- <SearchOutlined
          @click="(e: MouseEvent) => handleSearch(e)"
        /> -->
        <FrownOutlined v-if="canAnalyzeSentiment" @click="(e: MouseEvent) => openSentimentModal(e)" />
        <ShareAltOutlined @click="(e: MouseEvent) => handleShare(picture, e)" />
        <EditOutlined
          v-if="canEdit"
          @click="(e: MouseEvent) => handleEdit(picture, e)"
        />
        <DeleteOutlined
          v-if="canDelete"
          @click="(e: MouseEvent) => handleDelete(picture, e)"
        />
      </template>
    </a-card>
  </div>

  <!-- 情感分析弹窗 -->
  <SentimentAnalysisModal
    :visible="sentimentModalVisible"
    :picture="picture"
    @update:visible="sentimentModalVisible = $event"
  />
</template>

<style scoped>
.picture-item img {
  height: 180px;
  object-fit: cover;
}
</style>
