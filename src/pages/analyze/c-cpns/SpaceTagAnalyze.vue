<script setup lang="ts">
import { computed, ref, watchEffect } from "vue"
import VChart from "vue-echarts"
import "echarts"
import "echarts-wordcloud"
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
const { tagData: dataList } = storeToRefs(analyzeStore)

const loading = ref(true)

/**
 * 加载数据
 */
const fetchData = async () => {
  loading.value = true
  await analyzeStore.getSpaceTagAnalyze({
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
  const tagData = dataList.value.map((item) => ({
    name: item.tag,
    value: item.count
  }))

  return {
    tooltip: {
      trigger: "item",
      formatter: (params: any) => `${params.name}: ${params.value} 次`
    },
    series: [
      {
        type: "wordCloud",
        gridSize: 10,
        sizeRange: [12, 50], // 字体大小范围
        rotationRange: [-90, 90],
        shape: "circle",
        textStyle: {
          color: () =>
            `rgb(${Math.round(Math.random() * 255)}, ${Math.round(
              Math.random() * 255
            )}, ${Math.round(Math.random() * 255)})` // 随机颜色
        },
        data: tagData
      }
    ]
  }
})
</script>

<template>
  <div class="space-tag-analyze">
    <a-card title="图库标签词云">
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
