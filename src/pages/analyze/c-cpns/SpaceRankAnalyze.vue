<script setup lang="ts">
import { computed, ref, watchEffect } from "vue"
import VChart from "vue-echarts"
import "echarts"
import { useAnalyzeStore } from "@/stores"
import { storeToRefs } from "pinia"

const analyzeStore = useAnalyzeStore()
const { rankData: dataList } = storeToRefs(analyzeStore)

const loading = ref(true)

/**
 * 加载数据
 */
const fetchData = async () => {
  loading.value = true
  await analyzeStore.getSpaceRankAnalyze()
  loading.value = false
}
/**
 * 监听变量，改变时触发数据的重新加载
 */
watchEffect(() => fetchData())

const options = computed(() => {
  const spaceNames = dataList.value.map((item) => item.spaceName)
  const usageData = dataList.value.map((item) =>
    Number((item.totalSize / (1024 * 1024)).toFixed(2))
  ) // 转为 MB

  return {
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: spaceNames
    },
    yAxis: {
      type: "value",
      name: "空间使用量 (MB)"
    },
    series: [
      {
        name: "空间使用量 (MB)",
        type: "bar",
        data: usageData,
        itemStyle: {
          color: "#5470C6" // 自定义柱状图颜色
        }
      }
    ]
  }
})
</script>

<template>
  <div class="space-rank-analyze">
    <a-card title="空间使用排行">
      <v-chart
        :option="options"
        style="height: 320px; max-width: 100%"
        :autoresize="true"
      />
    </a-card>
  </div>
</template>

<style scoped></style>
