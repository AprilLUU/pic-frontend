<script setup lang="ts">
import { ref } from "vue"

interface Props {
  title?: string
  isShowFooter?: boolean
}
withDefaults(defineProps<Props>(), {
  title: "默认标题",
  isShowFooter: false
})
const visible = ref(false)
const openModal = () => (visible.value = true)
const closeModal = () => (visible.value = false)
defineExpose({
  openModal,
  closeModal
})
</script>

<template>
  <a-modal
    v-model:open="visible"
    :title="title"
    :footer="isShowFooter"
    @cancel="closeModal"
  >
    <slot></slot>
  </a-modal>
</template>

<style scoped></style>
