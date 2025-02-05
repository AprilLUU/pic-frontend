<script setup lang="ts">
import { computed, onUnmounted, ref, watchEffect } from "vue"
import ModalArea from "@/base-ui/modal-area/src/ModalArea.vue"
import { useLoginUserStore, usePictureStore } from "@/stores"
import PictureEditArea from "@/base-ui/picture-edit-area/src/PictureEditArea.vue"
import PictureEditWebSocket from "@/utils/websocket"
import {
  PICTURE_EDIT_ACTION_ENUM,
  PICTURE_EDIT_MESSAGE_TYPE_ENUM,
  SPACE_TYPE_ENUM
} from "@/constants"
import { getSpaceVoByIdUsingGet } from "@/api"
import { message } from "ant-design-vue"

interface Props {
  imageUrl?: string
  picture?: API.PictureVO
  spaceId?: string
  onSuccess?: (newPicture: API.PictureVO) => void
}

const props = defineProps<Props>()
const pictureStore = usePictureStore()
const loading = ref(false)

const space = ref<API.SpaceVO>()
// 获取空间信息
const fetchSpace = async () => {
  // 获取数据
  if (props.spaceId) {
    const res = (await getSpaceVoByIdUsingGet({
      id: props.spaceId
    })) as any
    if (res.code === 0 && res.data) {
      space.value = res.data
    }
  }
}
watchEffect(() => fetchSpace())
// 是否为团队空间
const isTeamSpace = computed(
  () => space.value?.spaceType === SPACE_TYPE_ENUM.TEAM
)

const handleConfimEditPicture = (blob: Blob) => {
  const fileName = (props.picture?.name || "image") + ".png"
  const file = new File([blob], fileName, { type: blob.type })
  handleUpload(file)
}

// 上传
const handleUpload = async (file: any) => {
  loading.value = true
  const params: API.PictureUploadRequest = { id: props.picture?.id }
  params.spaceId = props.spaceId
  const data = await pictureStore.uploadPitureByFile(params, file)
  props.onSuccess?.(data ?? {})
  closeModal()
  loading.value = false
}

// --------- 实时编辑 ---------
const loginUserStore = useLoginUserStore()
const loginUser = loginUserStore.loginUser
// 正在编辑的用户
const editingUser = ref<API.UserVO>()
// 没有用户正在编辑中，可进入编辑
const canEnterEdit = computed(() => !editingUser.value)
// 正在编辑的用户是本人，可退出编辑
const canExitEdit = computed(() => editingUser.value?.id === loginUser.id)
// 可以编辑
const canEdit = computed(() => {
  // 私人空间默认可编辑
  if (!isTeamSpace.value) return true
  return editingUser.value?.id === loginUser.id
})

// WebSocket 实例
let websocket: PictureEditWebSocket | null
const pictureEditAreaRef = ref()

// 初始化 WebSocket 连接，绑定事件
const initWebsocket = () => {
  const pictureId = props.picture?.id
  if (!pictureId) return

  // 防止之前的连接未释放
  if (websocket) websocket.disconnect()
  // 创建 WebSocket 实例
  websocket = new PictureEditWebSocket(pictureId)
  // 建立 WebSocket 连接
  websocket.connect()

  // 监听通知消息
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.INFO, (msg) => {
    console.log("收到通知消息：", msg)
    message.info(msg.message)
  })

  // 监听错误消息
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.ERROR, (msg) => {
    console.log("收到错误消息：", msg)
    message.error(msg.message)
  })

  // 监听进入编辑状态消息
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.ENTER_EDIT, (msg) => {
    console.log("收到进入编辑状态消息：", msg)
    message.info(msg.message)
    editingUser.value = msg.user
  })

  // 监听编辑操作消息
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.EDIT_ACTION, (msg) => {
    console.log("收到编辑操作消息：", msg)
    message.info(msg.message)
    const cropperRef = pictureEditAreaRef.value?.cropperRef
    switch (msg.editAction) {
      case PICTURE_EDIT_ACTION_ENUM.ROTATE_LEFT:
        cropperRef.value?.rotateLeft()
        break
      case PICTURE_EDIT_ACTION_ENUM.ROTATE_RIGHT:
        cropperRef.value.rotateRight()
        break
      case PICTURE_EDIT_ACTION_ENUM.ZOOM_IN:
        cropperRef.value.changeScale(1)
        break
      case PICTURE_EDIT_ACTION_ENUM.ZOOM_OUT:
        cropperRef.value.changeScale(-1)
        break
    }
  })

  // 监听退出编辑状态消息
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.EXIT_EDIT, (msg) => {
    console.log("收到退出编辑状态消息：", msg)
    message.info(msg.message)
    editingUser.value = undefined
  })
}

onUnmounted(() => {
  // 断开连接
  if (websocket) websocket.disconnect()
  editingUser.value = undefined
})

const modalRef = ref()
// pictureId变化时，初始化 WebSocket 连接
// 团队空间才有websocket实时编辑
const openModal = () => {
  if (isTeamSpace.value) initWebsocket()
  modalRef.value?.openModal()
}

// 关闭弹窗
const closeModal = () => {
  // 断开连接
  if (websocket) websocket.disconnect()
  editingUser.value = undefined
  modalRef.value?.closeModal()
}
defineExpose({
  openModal,
  closeModal
})

// 进入编辑状态
const enterEdit = () => {
  if (websocket) {
    // 发送进入编辑状态的消息
    websocket.sendMessage({
      type: PICTURE_EDIT_MESSAGE_TYPE_ENUM.ENTER_EDIT
    })
  }
}

// 退出编辑状态
const exitEdit = () => {
  if (websocket) {
    // 发送退出编辑状态的消息
    websocket.sendMessage({
      type: PICTURE_EDIT_MESSAGE_TYPE_ENUM.EXIT_EDIT
    })
  }
}

// 编辑图片操作
const editAction = (action: string) => {
  if (websocket) {
    // 发送编辑操作的请求
    websocket.sendMessage({
      type: PICTURE_EDIT_MESSAGE_TYPE_ENUM.EDIT_ACTION,
      editAction: action
    })
  }
}
// 缩放
const changeScale = (num: number) => {
  if (num > 0) {
    editAction(PICTURE_EDIT_ACTION_ENUM.ZOOM_IN)
  } else {
    editAction(PICTURE_EDIT_ACTION_ENUM.ZOOM_OUT)
  }
}
</script>

<template>
  <ModalArea ref="modalRef" class="image-cropper" title="编辑图片">
    <PictureEditArea
      ref="pictureEditAreaRef"
      :imageUrl="imageUrl"
      :loading="loading"
      :space="space"
      :cropperStyle="{ height: '400px' }"
      :canEnterEdit="canEnterEdit"
      :canExitEdit="canExitEdit"
      :canEdit="canEdit"
      :editingUser="editingUser"
      :showEdit="isTeamSpace"
      @confirm:editPicture="handleConfimEditPicture"
      @enter:edit="enterEdit"
      @exit:edit="exitEdit"
      @rotate:left="editAction(PICTURE_EDIT_ACTION_ENUM.ROTATE_LEFT)"
      @rotate:right="editAction(PICTURE_EDIT_ACTION_ENUM.ROTATE_RIGHT)"
      @change:scale="changeScale"
    />
  </ModalArea>
</template>

<style scoped></style>
