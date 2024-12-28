import checkAccess from "@/access/checkAccess"
import router from "@/router"
import { useLoginUserStore } from "@/stores/loginUser"

const mapMenuToRoute = (menus: any): any => {
  const loginUserStore = useLoginUserStore()
  const allRoutes = router.getRoutes()
  const route = allRoutes.find((route) => route.path === menus.key)
  return checkAccess(loginUserStore.loginUser, route?.meta?.access as string)
}

export default mapMenuToRoute
