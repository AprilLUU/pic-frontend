<script setup lang="ts">
import { onMounted, reactive } from "vue"
import { storeToRefs } from "pinia"
import HomeContent from "./c-cpns/HomeContent.vue"
import HomeCategoryTagBar from "./c-cpns/HomeCategoryTagBar.vue"
import { useHomeStore } from "@/stores"

const homeStore = useHomeStore()
const { tagList } = storeToRefs(homeStore)

// 搜索条件
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 12,
  sortField: "createTime",
  sortOrder: "descend"
})

// 页面加载时请求一次
onMounted(() => {
  homeStore.fetchData(searchParams)
})

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

const handleUpdateSearchParams = (newParams: any) => {
  searchParams.current = newParams.current
  searchParams.pageSize = newParams.pageSize
  homeStore.fetchData(searchParams)
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
    <HomeContent
      :searchParams="searchParams"
      @update:searchParams="handleUpdateSearchParams"
    />
  </div>
</template>

<style scoped>
#homePage .search-bar {
  max-width: 480px;
  margin: 0 auto 16px;
}
</style>
