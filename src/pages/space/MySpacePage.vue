<script setup lang="ts">
import { onMounted } from "vue"
import { useRouter } from "vue-router"
import { message } from "ant-design-vue"
import { useLoginUserStore } from "@/stores"
import { storeToRefs } from "pinia"

const router = useRouter()
const loginUserStore = useLoginUserStore()
const { loginUser, privateSpace } = storeToRefs(loginUserStore)

// 检查用户是否有个人空间
const checkUserSpace = async () => {
  if (!loginUser.value.id) {
    router.replace("/user/login")
    return
  }
  // 获取用户空间信息
  if (privateSpace.value.id) {
    router.replace(`/space/${privateSpace.value.id}`)
  } else {
    router.replace("/add_space")
    message.warn("请先创建空间")
  }
}

// 在页面加载时检查用户空间
onMounted(() => checkUserSpace())
</script>

<template>
  <div id="mySpace">
    <p>正在跳转，请稍候...</p>
  </div>
</template>

<style scoped></style>
