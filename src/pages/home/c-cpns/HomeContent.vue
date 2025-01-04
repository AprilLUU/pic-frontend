<script setup lang="ts">
import { useHomeStore } from "@/stores";
import { storeToRefs } from "pinia";
import { computed } from "vue"
import { useRouter } from "vue-router"

interface Props {
  searchParams: API.PictureQueryRequest
}

const props = defineProps<Props>()
const emit = defineEmits(["update:searchParams"])

const homeStore = useHomeStore()
const { dataList, loading, total } = storeToRefs(homeStore)

const router = useRouter()
const handlePictureClick = (picture: API.PictureVO) => {
  router.push({
    path: `/picture/${picture.id}`
  })
}

// 分页参数
const pagination = computed(() => {
  return {
    current: props.searchParams.current ?? 1,
    pageSize: props.searchParams.pageSize ?? 10,
    total: total.value,
    // 切换页号时，会修改搜索参数并获取数据
    onChange: (page: number, pageSize: number) => {
      emit("update:searchParams", {
        current: page,
        pageSize
      })
    }
  }
})
</script>

<template>
  <div class="home-content">
    <a-list
      :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }"
      :data-source="dataList"
      :pagination="pagination"
      :loading="loading"
    >
      <template #renderItem="{ item: picture }">
        <a-list-item style="padding: 0">
          <!-- 单张图片 -->
          <a-card
            hoverable
            @click="(pirture: API.PictureVO) => handlePictureClick(picture)"
          >
            <template #cover>
              <img
                style="height: 180px; object-fit: cover"
                :alt="picture.name"
                :src="picture.url"
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
          </a-card>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<style scoped>
.home-content {
  margin-bottom: 16px;
}
</style>
