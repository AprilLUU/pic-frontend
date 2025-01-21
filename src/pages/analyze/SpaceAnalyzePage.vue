<script setup lang="ts">
import { useLoginUserStore } from "@/stores"
import { computed } from "vue"
import { useRoute } from "vue-router"
import SpaceSizeAnalyze from "./c-cpns/SpaceSizeAnalyze.vue"
import SpaceUserAnalyze from "./c-cpns/SpaceUserAnalyze.vue"
import SpaceRankAnalyze from "./c-cpns/SpaceRankAnalyze.vue"
import SpaceTagAnalyze from "./c-cpns/SpaceTagAnalyze.vue"
import SpaceCategoryAnalyze from "./c-cpns/SpaceCategoryAnalyze.vue"
import SpaceUsageAnalyze from "./c-cpns/SpaceUsageAnalyze.vue"

const route = useRoute()

// 空间 id
const spaceId = computed(() => {
  return route.query?.spaceId as string
})

// 是否查询所有空间
const queryAll = computed(() => {
  return !!route.query?.queryAll
})

// 是否查询公共空间
const queryPublic = computed(() => {
  return !!route.query?.queryPublic
})

const loginUserStore = useLoginUserStore()
const loginUser = loginUserStore.loginUser

const isAdmin = computed(() => {
  return loginUser.userRole === "admin"
})
</script>

<template>
  <div id="spaceAnalyzePage">
    <h2>
      空间图库分析 -
      <span v-if="queryAll"> 全部空间 </span>
      <span v-else-if="queryPublic"> 公共图库 </span>
      <span v-else>
        <a :href="`/space/${spaceId}`">id：{{ spaceId }}</a>
      </span>
    </h2>
    <a-row :gutter="[16, 16]">
      <!-- 空间使用分析 -->
      <a-col :xs="24" :md="12">
        <SpaceUsageAnalyze
          :spaceId="spaceId"
          :queryAll="queryAll"
          :queryPublic="queryPublic"
        />
      </a-col>
      <!-- 空间分类分析 -->
      <a-col :xs="24" :md="12">
        <SpaceCategoryAnalyze
          :spaceId="spaceId"
          :queryAll="queryAll"
          :queryPublic="queryPublic"
        />
      </a-col>
      <!-- 标签分析 -->
      <a-col :xs="24" :md="12">
        <SpaceTagAnalyze
          :spaceId="spaceId"
          :queryAll="queryAll"
          :queryPublic="queryPublic"
        />
      </a-col>
      <!-- 图片大小分段分析 -->
      <a-col :xs="24" :md="12">
        <SpaceSizeAnalyze
          :spaceId="spaceId"
          :queryAll="queryAll"
          :queryPublic="queryPublic"
        />
      </a-col>
      <!-- 用户上传行为分析 -->
      <a-col :xs="24" :md="12">
        <SpaceUserAnalyze
          :spaceId="spaceId"
          :queryAll="queryAll"
          :queryPublic="queryPublic"
        />
      </a-col>
      <!-- 空间使用排行分析 -->
      <a-col v-if="isAdmin" :xs="24" :md="12">
        <SpaceRankAnalyze />
      </a-col>
    </a-row>
  </div>
</template>

<style scoped></style>
