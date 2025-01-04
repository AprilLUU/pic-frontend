<script setup lang="ts">
import { useHomeStore } from "@/stores"
import { storeToRefs } from "pinia"
import { ref, onMounted } from "vue"

const emit = defineEmits(["search"])

const homeStore = useHomeStore()
const { categoryList, tagList } = storeToRefs(homeStore)
const selectedCategory = ref<string>("all")
const selectedTagList = ref<string[]>([])

onMounted(() => {
  homeStore.getTagCategoryOptions()
})
const handleSearch = () => {
  emit("search", {
    selectedCategory: selectedCategory.value,
    selectedTagList: selectedTagList.value
  })
}
</script>

<template>
  <div class="category-tag-bar">
    <a-tabs v-model:activeKey="selectedCategory" @change="handleSearch">
      <a-tab-pane key="all" tab="全部" />
      <a-tab-pane
        v-for="category in categoryList"
        :key="category"
        :tab="category"
      />
    </a-tabs>
    <div class="tag-bar">
      <span style="margin-right: 8px">标签：</span>
      <a-space :size="[0, 8]" wrap>
        <a-checkable-tag
          v-for="(tag, index) in tagList"
          :key="tag"
          v-model:checked="selectedTagList[index]"
          @change="handleSearch"
        >
          {{ tag }}
        </a-checkable-tag>
      </a-space>
    </div>
  </div>
</template>

<style scoped>
.tag-bar {
  margin-bottom: 16px;
}
</style>
