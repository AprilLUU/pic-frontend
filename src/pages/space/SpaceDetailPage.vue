<script setup lang="ts">
import { message } from "ant-design-vue"
import { onMounted, reactive, ref } from "vue"
import { ColorPicker } from "vue3-colorpicker"
import "vue3-colorpicker/style.css"
import {
  getSpaceVoByIdUsingGet,
  listPictureVoByPageUsingPost,
  searchPictureByColorUsingPost
} from "@/api"
import PictureList from "@/components/PictureList.vue"
import { FormArea } from "@/base-ui/form-area"
import { pictureSearchFormList } from "./config"
import { formatSize } from "@/utils"

const props = defineProps<{
  id: string
}>()

// 数据
const dataList = ref<API.SpaceVO[]>([])
const total = ref(0)
const loading = ref(true)
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
// 页面加载时请求一次
onMounted(() => {
  fetchSpaceDetail()
  fetchData()
})
// 分页参数
const onPageChange = () => fetchData()

// 搜索条件
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 12,
  sortField: "createTime",
  sortOrder: "descend"
})

// 更新表单数据
const handleUpdateFormData = (field: string, value: string) => {
  searchParams[field as keyof API.PictureQueryRequest] = value as any
}
// 更新编辑时间
const handleUpdateEditTime = (dates: any[]) => {
  if (dates) {
    searchParams.startEditTime = dates[0].toDate()
    searchParams.endEditTime = dates[1].toDate()
  } else {
    searchParams.startEditTime = undefined
    searchParams.endEditTime = undefined
  }
}
// 重新搜索
const handleSubmit = async (values: any) => {
  searchParams.current = 1
  // console.log(searchParams)
  fetchData()
}
// 重置表单
const handleResetFormData = () => {
  Object.keys(searchParams).forEach((key: string) => {
    searchParams[key as keyof API.PictureQueryRequest] = undefined
  })
  searchParams.current = 1
  searchParams.pageSize = 12
  // console.log(searchParams)
  fetchData()
}

const onColorChange = async (color: string) => {
  const res = (await searchPictureByColorUsingPost({
    picColor: color,
    spaceId: props.id
  })) as any
  if (res.code === 0 && res.data) {
    const data = res.data ?? []
    dataList.value = data
    total.value = data.length
  } else {
    message.error("获取数据失败，" + res.message)
  }
}
</script>

<template>
  <div id="SpaceDetailPage">
    <!-- 搜索表单 -->
    <FormArea
      :formData="searchParams"
      :formList="pictureSearchFormList"
      formLayout="inline"
      :isShowReset="true"
      @update:formData="handleUpdateFormData"
      @update:editTime="handleUpdateEditTime"
      @submit:formSubmit="handleSubmit"
      @reset:formData="handleResetFormData"
    />
    <!-- 按颜色搜索 -->
    <a-form-item label="按颜色搜索" style="margin-top: 16px">
      <color-picker format="hex" @pureColorChange="onColorChange" />
    </a-form-item>
    <!-- 空间信息 -->
    <a-flex justify="space-between">
      <h2>{{ space.spaceName }}（私有空间）</h2>
      <a-space size="middle">
        <a-button type="primary" :href="`/add_picture?spaceId=${id}`">
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

<style scoped>
#SpaceDetailPage :deep(.ant-form-item) {
  margin-bottom: 16px;
}
</style>
