<script setup lang="ts">
import PictureItem from "./PictureItem.vue"

interface Props {
  dataList?: API.PictureVO[] | API.ImageSearchResult[]
  loading?: boolean
  showOp?: boolean
  showMeta?: boolean
  onReload?: any
  onShare?: any
  canEdit?: boolean
  canDelete?: boolean
}
withDefaults(defineProps<Props>(), {
  dataList: () => [],
  loading: false,
  showMeta: true,
  showOp: false,
  canEdit: false,
  canDelete: false
})
</script>

<template>
  <div class="picture-list">
    <a-list
      :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }"
      :data-source="dataList"
      :loading="loading"
    >
      <template #renderItem="{ item: picture }">
        <a-list-item style="padding: 0">
          <!-- 单张图片 -->
          <PictureItem
            :picture="picture"
            :showOp="showOp"
            :showMeta="showMeta"
            :onReload="onReload"
            :onShare="onShare"
            :canEdit="canEdit"
            :canDelete="canDelete"
          />
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<style scoped>
.picture-list {
  margin-bottom: 16px;
}
</style>
