<script setup lang="ts">
import GlbalHeader from "@/components/GlbalHeader.vue"
</script>

<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <GlbalHeader />
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <!-- <a-layout-footer class="footer">
        <a href="https://www.codefather.cn" target="_blank"> 这是一个云图库项目～～ </a>
      </a-layout-footer> -->
    </a-layout>
  </div>
</template>

<style scoped>
#basicLayout .header {
  padding: 0 20px;
  margin-bottom: 16px;
  color: unset;
  background: white;
}

#basicLayout .content {
  background: linear-gradient(to right, #fefefe, #fff);
  /* margin-bottom: 28px; */
  padding: 20px;
}

#basicLayout .footer {
  background: #efefef;
  padding: 16px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}
</style>
