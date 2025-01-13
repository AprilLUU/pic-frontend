<script setup lang="ts">
import { useRouter } from "vue-router"
import { message, Space } from "ant-design-vue"
import { DeleteOutlined, EditOutlined } from "@ant-design/icons-vue"
import { deletePictureUsingPost } from "@/api"

interface Props {
  picture: API.PictureVO
  onReload?: any
  showOp?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showOp: false
})
const spaceId = props.picture.spaceId
const query = spaceId ? { spaceId } : {}
const router = useRouter()
const handlePictureClick = (id: string) => {
  router.push({
    path: `/picture/${id}`,
    query
  })
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
    <a-card hoverable @click="() => handlePictureClick(picture.id)">
      <template #cover>
        <img
          style="height: 180px; object-fit: cover"
          :alt="picture.name"
          :src="picture.thumbnailUrl ?? picture.url"
        />
      </template>
      <a-card-meta :title="picture.name">
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
        <a-space @click="(e: MouseEvent) => handleEdit(picture, e)">
          <EditOutlined />
          编辑
        </a-space>
        <a-space @click="(e: MouseEvent) => handleDelete(picture, e)">
          <DeleteOutlined />
          删除
        </a-space>
      </template>
    </a-card>
  </div>
</template>

<style scoped></style>
