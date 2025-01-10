<script setup lang="ts">
import { useLoginUserStore } from "@/stores"
import { PictureOutlined, UserOutlined } from "@ant-design/icons-vue"
import { h, ref } from "vue"
import { useRouter } from "vue-router"

// 菜单列表
const menuItems = [
  {
    key: "/",
    label: "公共图库",
    icon: () => h(PictureOutlined)
  },
  {
    key: "/my_space",
    label: "我的空间",
    icon: () => h(UserOutlined)
  }
]

const router = useRouter()
const loginUserStore = useLoginUserStore()

// 当前选中菜单
const current = ref<string[]>([])
// 监听路由变化，更新当前选中菜单
router.afterEach((to) => {
  current.value = [to.path]
})

// 路由跳转事件
const handleMenuClick = ({ key }: { key: string }) => {
  router.push({
    path: key
  })
}
</script>

<template>
  <div id="globalSider">
    <a-layout-sider
      v-if="loginUserStore.loginUser.id"
      class="sider"
      width="200"
      breakpoint="lg"
      collapsed-width="0"
    >
      <a-menu
        mode="inline"
        v-model:selectedKeys="current"
        :items="menuItems"
        @click="handleMenuClick"
      />
    </a-layout-sider>
  </div>
</template>

<style scoped>
#globalSider :deep(.ant-layout-sider-zero-width-trigger) {
  background: #91caff !important;
}
</style>
