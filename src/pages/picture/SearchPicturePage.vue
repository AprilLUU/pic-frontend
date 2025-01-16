<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useRoute } from "vue-router"
import { message } from "ant-design-vue"
import {
  getPictureVoByIdUsingGet,
  searchPictureByPictureUsingPost
} from "@/api"
import PictureItem from "@/components/PictureItem.vue"
import PictureList from "@/components/PictureList.vue"

const picture = ref<API.PictureVO>()
const route = useRoute()
const id = computed(() => route.query?.pictureId)
const dataList = ref<API.ImageSearchResult[]>([])
const loading = ref(false)

// 获取搜图结果
const fetchData = async () => {
  loading.value = true

  const res = (await searchPictureByPictureUsingPost({
    pictureId: id.value as string
  })) as any
  if (res.code === 0 && res.data) {
    dataList.value = res.data ?? []
  } else {
    message.error("获取数据失败，" + res.message)
  }

  loading.value = false
}

// 获取老数据
const getOldPicture = async () => {
  // 获取数据
  if (id.value) {
    const res = (await getPictureVoByIdUsingGet({
      id: id.value as string
    })) as API.BaseResponsePictureVO_
    if (res.code === 0 && res.data) {
      picture.value = res.data
    }
  }
}

onMounted(() => {
  getOldPicture()
  fetchData()
})
</script>

<template>
  <div id="SearchPicturePage">
    <h2 style="margin-bottom: 16px">以图搜图</h2>
    <h3 style="margin-bottom: 16px">原图</h3>
    <PictureItem class="search-picture" :picture="picture!" :showMeta="false" />
    <h3 style="margin: 16px 0">识图结果</h3>
    <PictureList :dataList="dataList" :loading="loading" :showMeta="false" />
  </div>
</template>

<style scoped>
#SearchPicturePage .search-picture {
  width: 240px;
}
</style>
