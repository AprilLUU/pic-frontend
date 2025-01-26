import { SPACE_PERMISSION_ENUM } from "@/constants"
import { usePictureStore, useSpaceStore } from "@/stores"
import { storeToRefs } from "pinia"
import { computed } from "vue"

// 通用权限检查函数
const usePermission = (checkType: "picture" | "space") => {
  const spaceStore = useSpaceStore()
  const { detailSpace } = storeToRefs(spaceStore)
  const loginUserStore = usePictureStore()
  const { detailPicture } = storeToRefs(loginUserStore)

  let check: any
  if (checkType === "picture") check = detailPicture
  else check = detailSpace
  
  function createPermissionChecker(permission: string) {
    return computed<boolean>(() => {
      return (check.value.permissionList ?? []).includes(permission)
    })
  }
  // 定义权限检查
  const canManageSpaceUser = createPermissionChecker(
    SPACE_PERMISSION_ENUM.SPACE_USER_MANAGE
  )
  const canUploadPicture = createPermissionChecker(
    SPACE_PERMISSION_ENUM.PICTURE_UPLOAD
  )
  const canEditPicture = createPermissionChecker(
    SPACE_PERMISSION_ENUM.PICTURE_EDIT
  )
  const canDeletePicture = createPermissionChecker(
    SPACE_PERMISSION_ENUM.PICTURE_DELETE
  )

  return {
    canDeletePicture,
    canEditPicture,
    canManageSpaceUser,
    canUploadPicture
  }
}

export default usePermission
