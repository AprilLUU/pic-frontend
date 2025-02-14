import { createRouter, createWebHistory } from "vue-router"
import ACCESS_ENUM from "@/access/accessEnum"
import { usePermission } from "@/hooks"
import { useLoginUserStore } from "@/stores"

const canVisitPage = (to: any, from: any, next: any) => {
  const { canManageSpaceUser } = usePermission("space")
  if (canManageSpaceUser.value) next()
  else next("/noAuth")
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "主页",
      component: () => import("@/pages/home/HomePage.vue")
    },
    {
      path: "/user/login",
      name: "用户登录",
      component: () => import("@/pages/user/UserLoginPage.vue")
    },
    {
      path: "/user/register",
      name: "用户注册",
      component: () => import("@/pages/user/UserRegisterPage.vue")
    },
    {
      path: "/admin/userManage",
      name: "用户管理",
      component: () => import("@/pages/admin/UserManagePage.vue"),
      meta: {
        access: ACCESS_ENUM.ADMIN
      }
    },
    {
      path: "/admin/pictureManage",
      name: "图片管理",
      component: () => import("@/pages/admin/PictureManagePage.vue"),
      meta: {
        access: ACCESS_ENUM.ADMIN
      }
    },
    {
      path: "/admin/spaceManage",
      name: "空间管理",
      component: () => import("@/pages/admin/SpaceManagePage.vue"),
      meta: {
        access: ACCESS_ENUM.ADMIN
      }
    },
    {
      path: "/spaceUserManage/:id",
      name: "空间成员管理",
      component: () => import("@/pages/admin/SpaceUserManagePage.vue"),
      props: true,
      meta: {
        access: ACCESS_ENUM.USER
      },
      beforeEnter: canVisitPage
    },
    {
      path: "/add_picture",
      name: "创建图片",
      component: () => import("@/pages/picture/AddPicturePage.vue"),
      meta: {
        access: ACCESS_ENUM.USER
      }
    },
    {
      path: "/picture/:id",
      name: "图片详情",
      component: () => import("@/pages/picture/PictureDetailPage.vue"),
      props: true,
      meta: {
        access: ACCESS_ENUM.USER
      }
    },
    {
      path: "/add_picture/batch",
      name: "批量创建图片",
      component: () => import("@/pages/picture/AddPictureBatchPage.vue"),
      meta: {
        access: ACCESS_ENUM.ADMIN
      }
    },
    {
      path: "/search_picture",
      name: "图片搜索",
      component: () => import("@/pages/picture/SearchPicturePage.vue"),
      meta: {
        access: ACCESS_ENUM.USER
      }
    },
    {
      path: "/add_space",
      name: "创建空间",
      component: () => import("@/pages/space/AddSpacePage.vue"),
      beforeEnter: (to, from, next) => {
        const loginUserStore = useLoginUserStore()
        if (to.query?.id) {
          // 修改空间页面仅限管理员访问
          if (loginUserStore.loginUser.userRole === ACCESS_ENUM.ADMIN) {
            next()
            return
          } else {
            next("/noAuth")
            return
          }
        }
        next()
      },
      meta: {
        access: ACCESS_ENUM.USER
      }
    },
    {
      path: "/my_space",
      name: "我的空间",
      component: () => import("@/pages/space/MySpacePage.vue"),
      meta: {
        access: ACCESS_ENUM.USER
      }
    },
    {
      path: "/space/:id",
      name: "空间详情",
      component: () => import("@/pages/space/SpaceDetailPage.vue"),
      props: true,
      meta: {
        access: ACCESS_ENUM.USER
      }
    },
    {
      path: "/space_analyze",
      name: "空间分析",
      component: () => import("@/pages/analyze/SpaceAnalyzePage.vue"),
      meta: {
        access: ACCESS_ENUM.USER
      }
      // 空间分析页面 管理员访问时没有请求空间详情
      // 为了兼容管理员进行空间分析 仅对空间详情页的按钮权限进行控制
      // beforeEnter: canVisitPage
    },
    {
      path: "/noAuth",
      name: "无权限",
      component: () => import("@/pages/noAuth/NoAuthPage.vue")
    },
    {
      path: "/:pathMatch(.*)*",
      name: "404",
      component: () => import("@/pages/notFound/NotFoundPage.vue")
    }
  ]
})

export default router
