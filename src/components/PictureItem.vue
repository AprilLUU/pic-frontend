<script setup lang="ts">
import { useRouter } from "vue-router"
import { message } from "ant-design-vue"
import {
  ShareAltOutlined,
  SearchOutlined,
  DeleteOutlined,
  EditOutlined
} from "@ant-design/icons-vue"
import { deletePictureUsingPost } from "@/api"

interface Props {
  picture: any
  onReload?: any
  showOp?: boolean
  showMeta?: boolean
  onShare?: any
}

const props = withDefaults(defineProps<Props>(), {
  showOp: false,
  showMeta: true
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

// 编辑
const handleSearch = (picture: API.PictureVO, e: MouseEvent) => {
  e.stopPropagation()
  router.push({
    path: "/search_picture",
    query: {
      pictureId: picture.id
    }
  })
}

const handleShare = (picture: API.PictureVO, e: MouseEvent) => {
  props?.onShare(picture, e)
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
            <a-tag color="green">
              {{ picture.category ?? "默认" }}
            </a-tag>
            <a-tag v-for="tag in picture.tags" :key="tag">
              {{ tag }}
            </a-tag>
          </a-flex>
        </template>
      </a-card-meta>
      <template v-if="showOp" #actions>
        <SearchOutlined @click="(e: MouseEvent) => handleSearch(picture, e)" />
        <ShareAltOutlined @click="(e: MouseEvent) => handleShare(picture, e)" />
        <EditOutlined @click="(e: MouseEvent) => handleEdit(picture, e)" />
        <DeleteOutlined @click="(e: MouseEvent) => handleDelete(picture, e)" />
      </template>
    </a-card>
  </div>
</template>

<style scoped>
.picture-item img {
  height: 180px;
  object-fit: cover;
}
</style>
