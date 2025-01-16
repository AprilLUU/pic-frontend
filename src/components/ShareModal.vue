<script setup lang="ts">
import { ModalArea } from "@/base-ui/modal-area"
import { computed, ref } from "vue"

interface Props {
  link?: string
}

withDefaults(defineProps<Props>(), {
  link: ""
})

const modalRef = ref()
const openModal = computed(() => modalRef.value?.openModal)
defineExpose({
  openModal
})
</script>

<template>
  <div class="share-modal">
    <ModalArea ref="modalRef" title="分享图片">
      <div class="share-content">
        <h4>复制分享链接</h4>
        <a-typography-link copyable>
          {{ link }}
        </a-typography-link>
        <div style="margin-bottom: 16px" />
        <h4>手机扫码查看</h4>
        <a-qrcode :value="link" />
      </div>
    </ModalArea>
  </div>
</template>

<style scoped>
/* .share-content {
  display: flex;
  flex-direction: column;
  align-items: center;
} */
</style>
