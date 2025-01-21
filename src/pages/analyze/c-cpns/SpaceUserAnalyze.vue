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
const { userData: dataList } = storeToRefs(analyzeStore)

const loading = ref(true)
const userId = ref<string>()
const timeDimension = ref<"day" | "week" | "month">("day")
const timeDimensionOptions = [
  {
    label: "日",
    value: "day"
  },
  {
    label: "周",
    value: "week"
  },
  {
    label: "月",
    value: "month"
  }
]

const handleSearch = (value: string) => (userId.value = value)

/**
 * 加载数据
 */
const fetchData = async () => {
  loading.value = true
  await analyzeStore.getSpaceUserAnalyze({
    queryAll: props.queryAll,
    queryPublic: props.queryPublic,
    spaceId: props.spaceId,
    timeDimension: timeDimension.value,
    userId: userId.value
  })
  loading.value = false
}
/**
 * 监听变量，改变时触发数据的重新加载
 */
watchEffect(() => fetchData())

const options = computed(() => {
  const periods = dataList.value.map((item) => item.period) // 时间区间
  const counts = dataList.value.map((item) => item.count) // 上传数量

  return {
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: periods, name: "时间区间" },
    yAxis: { type: "value", name: "上传数量" },
    series: [
      {
        name: "上传数量",
        type: "line",
        data: counts,
        smooth: true, // 平滑折线
        emphasis: {
          focus: "series"
        }
      }
    ]
  }
})
</script>

<template>
  <div class="space-user-analyze">
    <a-card title="空间图片用户分析">
      <v-chart
        :option="options"
        :autoresize="true"
        style="height: 320px; max-width: 100%"
        :loading="loading"
      />
      <template #extra>
        <a-space>
          <a-segmented
            v-model:value="timeDimension"
            :options="timeDimensionOptions"
          />
          <a-input-search
            placeholder="请输入用户 id"
            enter-button="搜索用户"
            @search="handleSearch"
          />
        </a-space>
      </template>
    </a-card>
  </div>
</template>

<style scoped></style>
