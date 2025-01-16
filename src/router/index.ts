import { createRouter, createWebHistory } from "vue-router"
import ACCESS_ENUM from "@/access/accessEnum"

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
