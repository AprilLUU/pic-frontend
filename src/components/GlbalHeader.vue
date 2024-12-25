<script lang="ts" setup>
import { h, ref } from "vue"
import { HomeOutlined } from "@ant-design/icons-vue"
import { type MenuProps } from "ant-design-vue"
import { RouterLink } from "vue-router"
import { useRouter } from "vue-router"
import { useUserStore } from "@/stores/user"

const current = ref<string[]>([])
const items = ref<MenuProps["items"]>([
  {
    key: "/home",
    icon: () => h(HomeOutlined),
    label: "主页",
    title: "主页"
  },
  {
    key: "/about",
    label: "关于",
    title: "关于"
  }
])
const router = useRouter()
router.afterEach((to, from, next) => {
  current.value = [to.path]
})
const onMenuClick = ({ key }: { key: string }) => {
  router.push({
    path: key
  })
}

const userStore = useUserStore()
userStore.fetchLoginUser()
</script>

<template>
  <div id="globalHeader">
    <a-row>
      <a-col flex="200px">
        <RouterLink to="/">
          <div class="title-bar">
            <img class="logo" src="../assets/avatar.jpeg" alt="avatar" />
            <div class="title">云图库</div>
          </div>
        </RouterLink>
      </a-col>
      <a-col flex="auto">
        <a-menu
          v-model:selectedKeys="current"
          mode="horizontal"
          :items="items"
          @click="onMenuClick"
        />
      </a-col>
      <a-col flex="120px">
        <div class="user-login-status">
          <div v-if="userStore.loginUser.id">
            {{ userStore.loginUser.userName ?? "anonymous" }}
          </div>
          <div v-else>
            <a-button type="primary" href="/user/login">登录</a-button>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: black;
  font-size: 18px;
  margin-left: 16px;
}

.logo {
  height: 48px;
}
</style>
