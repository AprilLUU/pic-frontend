<script setup lang="ts">
import { onMounted } from "vue"
import BasicLayout from "./layouts/BasicLayout.vue"
import { useHomeStore } from "./stores"
// import { useLoginUserStore } from "@/stores/loginUser"

// const loginUserStore = useLoginUserStore()
// loginUserStore.fetchLoginUser()
const homeStore = useHomeStore()
onMounted(() => {
  homeStore.getTagCategoryOptions()
})
</script>

<template>
  <BasicLayout />
</template>

<style scoped></style>
