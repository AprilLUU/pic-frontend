<script setup lang="ts">
import { message } from "ant-design-vue"
import { onMounted, reactive, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { editPictureUsingPost, getPictureByIdUsingGet } from "@/api"
import PictureUpload from "@/components/PictureUpload.vue"
import UrlUpload from "@/components/UrlUpload.vue"

const picture = ref<API.PictureVO | API.Picture>()
const pictureForm = reactive<API.PictureEditRequest>({})

const uploadType = ref<"file" | "url">("file")

const router = useRouter()

const handleSubmit = async (values: any) => {
  const pictureId = picture.value?.id
  if (!pictureId) return
  const res = (await editPictureUsingPost({
    id: pictureId,
    ...values
  })) as any
  if (res.code === 0 && res.data) {
    message.success("修改成功")
    // 跳转到图片详情页
    router.push({
      path: `/picture/${pictureId}`
    })
  } else {
    message.error("修改失败，" + res.message)
  }
}

const onSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
  pictureForm.name = newPicture.name
}

const route = useRoute()

// 获取老数据
const getOldPicture = async () => {
  // 获取数据
  const id = route.query?.id as string
  if (id) {
    const res = (await getPictureByIdUsingGet({
      id
    })) as API.BaseResponsePicture_
    if (res.code === 0 && res.data) {
      const data = res.data
      picture.value = data
      pictureForm.name = data.name
      pictureForm.introduction = data.introduction
      pictureForm.category = data.category
      pictureForm.tags = JSON.parse(data.tags ?? "[]")
    }
  }
}

onMounted(() => {
  getOldPicture()
})
</script>

<template>
  <div id="addPicturePage">
    <h2 style="margin-bottom: 16px">
      {{ route.query?.id ? "修改图片" : "创建图片" }}
    </h2>
    <!-- 选择上传方式 -->
    <a-tabs v-model:activeKey="uploadType"
      >>
      <a-tab-pane key="file" tab="文件上传">
        <PictureUpload :picture="picture" :onSuccess="onSuccess" />
      </a-tab-pane>
      <a-tab-pane key="url" tab="URL 上传" force-render>
        <UrlUpload :picture="picture" :onSuccess="onSuccess" />
      </a-tab-pane>
    </a-tabs>
    <a-form
      v-if="picture"
      layout="vertical"
      :model="pictureForm"
      @finish="handleSubmit"
    >
      <a-form-item label="名称" name="name">
        <a-input v-model:value="pictureForm.name" placeholder="请输入名称" />
      </a-form-item>
      <a-form-item label="简介" name="introduction">
        <a-textarea
          v-model:value="pictureForm.introduction"
          placeholder="请输入简介"
          :autoSize="{ minRows: 2, maxRows: 5 }"
          allowClear
        />
      </a-form-item>
      <a-form-item label="分类" name="category">
        <a-auto-complete
          v-model:value="pictureForm.category"
          placeholder="请输入分类"
          allowClear
        />
      </a-form-item>
      <a-form-item label="标签" name="tags">
        <a-select
          v-model:value="pictureForm.tags"
          mode="tags"
          placeholder="请输入标签"
          allowClear
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%">
          {{ route.query?.id ? "修改" : "创建" }}
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped>
#addPicturePage {
  max-width: 720px;
  margin: 0 auto;
}
</style>
