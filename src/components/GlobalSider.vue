<script setup lang="ts">
import { SPACE_TYPE_ENUM } from "@/constants"
import { useLoginUserStore } from "@/stores"
import {
  PictureOutlined,
  TeamOutlined,
  UserOutlined
} from "@ant-design/icons-vue"
import { storeToRefs } from "pinia"
import { computed, h, ref, watchEffect } from "vue"
import { useRouter } from "vue-router"

// 菜单列表
const fixedMenuItems = [
  {
    key: "/",
    label: "公共图库",
    icon: () => h(PictureOutlined)
  },
  {
    key: "/my_space",
    label: "我的空间",
    icon: () => h(UserOutlined)
  },
  {
    key: "/add_space?type=" + SPACE_TYPE_ENUM.TEAM,
    label: "创建团队",
    icon: () => h(TeamOutlined)
  }
]

const router = useRouter()
const loginUserStore = useLoginUserStore()
const { teamSpaceList } = storeToRefs(loginUserStore)

// 当前选中菜单
const current = ref<string[]>([])
// 监听路由变化，更新当前选中菜单
router.afterEach((to) => (current.value = [to.path]))

// 路由跳转事件
const handleMenuClick = ({ key }: { key: string }) => {
  router.push(key)
}

const menuItems = computed(() => {
  // 没有团队空间，只展示固定菜单
  if (teamSpaceList.value.length < 1) return fixedMenuItems
  // 展示团队空间分组
  const teamSpaceSubMenus = teamSpaceList.value.map((spaceUser) => {
    const space = spaceUser.space
    return {
      key: "/space/" + spaceUser.spaceId,
      label: space?.spaceName
    }
  })
  const teamSpaceMenuGroup = {
    type: "group",
    label: "我的团队",
    key: "teamSpace",
    children: teamSpaceSubMenus
  }
  return [...fixedMenuItems, teamSpaceMenuGroup]
})

/**
 * 监听变量，改变时触发数据的重新加载
 */
watchEffect(() => {
  // 登录才加载
  if (loginUserStore.loginUser.id) {
    loginUserStore.fetchTeamSpaceList()
  }
})
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
