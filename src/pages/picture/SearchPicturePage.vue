<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue"
import { storeToRefs } from "pinia"
import { useRoute } from "vue-router"
import PictureItem from "@/components/PictureItem.vue"
import PictureList from "@/components/PictureList.vue"
import { usePictureStore } from "@/stores"

const pictureStore = usePictureStore()
const { searchPicture: picture, searchDataList: dataList } =
  storeToRefs(pictureStore)
const route = useRoute()
const id = computed(() => route.query?.pictureId)
const loading = ref(false)

// 获取搜图结果
const fetchData = async () => {
  loading.value = true
  if (id.value) {
    // 获取搜索原图
    pictureStore.getPictureVoById(id.value as string, true)
    // 获取搜索列表
    pictureStore.searchPictureByPicture(id.value as string)
  }
  loading.value = false
}

onMounted(() => fetchData())
onUnmounted(() => {
  pictureStore.searchDataList = []
  pictureStore.searchPicture = {}
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
