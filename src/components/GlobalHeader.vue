<script lang="ts" setup>
import { h, ref, watchEffect } from "vue"
import {
  HomeOutlined,
  LogoutOutlined,
  UserOutlined
} from "@ant-design/icons-vue"
import { message, type MenuProps } from "ant-design-vue"
import { RouterLink } from "vue-router"
import { useRouter } from "vue-router"
import { storeToRefs } from "pinia"
import { useLoginUserStore } from "@/stores/loginUser"
import { userLogoutUsingPost } from "@/api"
import checkAccess from "@/access/checkAccess"

const loginUserStore = useLoginUserStore()
const { loginUser } = storeToRefs(loginUserStore)
const router = useRouter()

// 菜单
const current = ref<string[]>([])
const menus = [
  {
    key: "/",
    icon: () => h(HomeOutlined),
    label: "主页",
    title: "主页"
  },
  {
    key: "/add_picture",
    label: "创建图片",
    title: "创建图片"
  },
  {
    key: "/admin/userManage",
    label: "用户管理",
    title: "用户管理"
  },
  {
    key: "/admin/pictureManage",
    label: "图片管理",
    title: "图片管理"
  },
  {
    key: "/admin/spaceManage",
    label: "空间管理",
    title: "空间管理"
  }
]
const items = ref<MenuProps["items"]>([])
// 监听loginUser变化，更新items
// watchEffect执行函数收集依赖
watchEffect(() => {
  items.value = menus.filter((menu) => {
    const allRoutes = router.getRoutes()
    const route = allRoutes.find((route) => route.path === menu.key)
    return checkAccess(loginUser.value, route?.meta?.access as string)
  })
  // console.log(items.value)
})

router.afterEach((to, from, next) => {
  current.value = [to.path]
})

const onMenuClick = ({ key }: { key: string }) => {
  router.push({
    path: key
  })
}

// 用户注销
const handleLogout = async () => {
  const res = (await userLogoutUsingPost()) as any

  if (res.code === 0) {
    loginUserStore.setLoginUser({})
    message.success("退出登录成功")
    router.push("/user/login")
  } else {
    message.error("退出登录失败," + res.message)
  }
}
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
          <div v-if="loginUser.id">
            <a-dropdown>
              <a-space>
                <a-avatar :src="loginUser.userAvatar" />
                {{ loginUser.userName ?? "anonymous" }}
              </a-space>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <router-link to="/my_space">
                      <UserOutlined />
                      我的空间
                    </router-link>
                  </a-menu-item>
                  <a-menu-item @click="handleLogout">
                    <LogoutOutlined />
                    退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
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
