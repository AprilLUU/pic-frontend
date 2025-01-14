<script setup lang="ts">
import { message } from "ant-design-vue"
import { onMounted, reactive, ref } from "vue"
import { getSpaceVoByIdUsingGet, listPictureVoByPageUsingPost } from "@/api"
import PictureList from "@/components/PictureList.vue"
import { formatSize } from "@/utils"

const props = defineProps<{
  id: string
}>()
const space = ref<API.SpaceVO>({})
const percent = ref(0)

// 获取空间详情
const fetchSpaceDetail = async () => {
  try {
    const res = (await getSpaceVoByIdUsingGet({
      id: props.id
    })) as API.BaseResponseSpaceVO_
    if (res.code === 0 && res.data) {
      space.value = res.data
      // console.log(space.value)
      // console.log(typeof space.value.totalSize)
      // console.log(typeof space.value.maxSize)
      // console.log(typeof percent.value)
      // 网络请求之后 计算百分比 避免传递给子组件类型错误
      percent.value = Number(
        ((space.value.totalSize! * 100) / space.value.maxSize!).toFixed(1)
      )
      // console.log(typeof percent.value)
    } else {
      message.error("获取空间详情失败，" + res.message)
    }
  } catch (e: any) {
    message.error("获取空间详情失败：" + e.message)
  }
}

onMounted(() => {
  fetchSpaceDetail()
})

// 数据
const dataList = ref<API.SpaceVO[]>([])
const total = ref(0)
const loading = ref(true)

// 搜索条件
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 12,
  sortField: "createTime",
  sortOrder: "descend"
})

// 分页参数
const onPageChange = () => fetchData()

// 获取数据
const fetchData = async () => {
  loading.value = true
  // 转换搜索参数
  const params = {
    spaceId: props.id,
    ...searchParams
  }
  const res = (await listPictureVoByPageUsingPost(
    params
  )) as API.BaseResponsePagePictureVO_
  if (res.code === 0 && res.data) {
    dataList.value = res.data.records ?? []
    total.value = res.data.total ?? 0
  } else {
    message.error("获取数据失败，" + res.message)
  }
  loading.value = false
}

// console.log(space.value.totalSize, space.value.maxSize)
// console.log(percent)

// 页面加载时请求一次
onMounted(() => {
  fetchData()
})
</script>

<template>
  <div id="spaceDetailPage">
    <!-- 空间信息 -->
    <a-flex justify="space-between">
      <h2>{{ space.spaceName }}（私有空间）</h2>
      <a-space size="middle">
        <a-button
          type="primary"
          :href="`/add_picture?spaceId=${id}`"
          target="_blank"
        >
          创建图片
        </a-button>
        <a-tooltip
          :title="`占用空间 ${formatSize(space.totalSize)} / ${formatSize(space.maxSize)}`"
        >
          <a-progress type="circle" :percent="percent" :size="42" />
        </a-tooltip>
      </a-space>
    </a-flex>
    <!-- 图片列表 -->
    <PictureList
      :dataList="dataList"
      :loading="loading"
      :showOp="true"
      :onReload="fetchData"
    />
    <a-pagination
      style="text-align: right"
      v-model:current="searchParams.current"
      v-model:pageSize="searchParams.pageSize"
      :total="total"
      :show-total="() => `图片总数 ${total} / ${space.maxCount}`"
      @change="onPageChange"
    />
  </div>
</template>

<style scoped></style>
