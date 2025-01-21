<script setup lang="ts">
import { computed, ref, watchEffect } from "vue"
import VChart from "vue-echarts"
import "echarts"
import { useAnalyzeStore } from "@/stores"
import { storeToRefs } from "pinia"

interface Props {
  queryAll?: boolean
  queryPublic?: boolean
  spaceId?: string
}

const props = withDefaults(defineProps<Props>(), {
  queryAll: false,
  queryPublic: false
})

const analyzeStore = useAnalyzeStore()
const { sizeData: dataList } = storeToRefs(analyzeStore)

const loading = ref(true)

/**
 * 加载数据
 */
const fetchData = async () => {
  loading.value = true
  await analyzeStore.getSpaceSizeAnalyze({
    queryAll: props.queryAll,
    queryPublic: props.queryPublic,
    spaceId: props.spaceId
  })
  loading.value = false
}
/**
 * 监听变量，改变时触发数据的重新加载
 */
watchEffect(() => fetchData())

const options = computed(() => {
  const pieData = dataList.value.map((item) => ({
    name: item.sizeRange,
    value: item.count
  }))

  return {
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
      top: "bottom"
    },
    series: [
      {
        name: "图片大小",
        type: "pie",
        radius: "50%",
        data: pieData
      }
    ]
  }
})
</script>

<template>
  <div class="space-size-analyze">
    <a-card title="空间图片大小分析">
      <v-chart
        :option="options"
        :autoresize="true"
        style="height: 320px; max-width: 100%"
        :loading="loading"
      />
    </a-card>
  </div>
</template>

<style scoped></style>
