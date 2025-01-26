<script setup lang="ts">
import { onMounted, reactive, ref } from "vue"
import { storeToRefs } from "pinia"
import PictureList from "@/components/PictureList.vue"
import HomeCategoryTagBar from "./c-cpns/HomeCategoryTagBar.vue"
import { useHomeStore } from "@/stores"

const homeStore = useHomeStore()
const { dataList, tagList, total} = storeToRefs(homeStore)
const loading = ref(false)
// 搜索条件
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 12,
  sortField: "createTime",
  sortOrder: "descend"
})

const fetchData = async () => {
  loading.value = true
  homeStore.fetchData(searchParams)
  loading.value = false
}
// 页面加载时请求一次
onMounted(() => fetchData())
const handlePageChange = () => fetchData()
const handleSearch = (payload?: any) => {
  const { selectedCategory = "", selectedTagList = [] } = payload ?? {}
  // 重置搜索条件
  searchParams.current = 1
  // 转换搜索参数
  const params: API.PictureQueryRequest = {
    ...searchParams,
    tags: []
  }
  // 如果选择了分类，则添加到搜索参数中
  if (selectedCategory !== "all") params.category = selectedCategory
  // 如果选择了标签，则添加到搜索参数中
  selectedTagList.forEach((useTag: boolean, index: number) => {
    if (useTag) params.tags?.push(tagList.value[index])
  })

  homeStore.fetchData(params)
}
</script>

<template>
  <div id="homePage">
    <!-- 搜索框 -->
    <div class="search-bar">
      <a-input-search
        placeholder="从海量图片中搜索"
        v-model:value="searchParams.searchText"
        enter-button="搜索"
        size="large"
        @search="handleSearch"
      />
    </div>
    <!-- 分类 + 标签 -->
    <HomeCategoryTagBar @search="handleSearch" />
    <!-- 图片列表 -->
    <PictureList :dataList="dataList" :loading="loading" :showOp="true" />
    <a-pagination
      style="text-align: right"
      v-model:current="searchParams.current"
      v-model:pageSize="searchParams.pageSize"
      :total="total"
      @change="handlePageChange"
    />
  </div>
</template>

<style scoped>
#homePage .search-bar {
  max-width: 480px;
  margin: 0 auto 16px;
}
</style>
