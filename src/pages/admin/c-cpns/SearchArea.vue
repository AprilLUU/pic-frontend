<script setup lang="ts">
import { type FromList } from "../types"

interface Props {
  searchParams: any
  fromList: FromList[]
}

const props = defineProps<Props>()
const emit = defineEmit(["update:searchParams", "search"])
// const searchParams = defineModel()

const handleValueChange = (value: string, field: string) => {
  emit("update:searchParams", { ...props.searchParams, [field]: value })
}

const handleSerch = () => {
  emit("search:formSearch")
}
</script>

<template>
  <div class="search-area">
    <a-form layout="inline" :model="searchParams" @finish="handleSearch">
      <template v-for="item in fromList" :key="item.label">
        <a-form-item :label="item.label" :name="item.name">
          <template v-if="item.type === 'input'">
            <a-input
              :value="searchParams[item.field]"
              :placeholder="item.placeholder"
              :allow-clear="item.allowClear"
              :style="item.styleObj"
              @update:model-value="handleValueChange(value, item.field)"
            />
          </template>
          <template v-else-if="item.type === 'select'">
            <a-select
              :value="searchParams[item.field]"
              :mode="item.mode"
              :options="item.options"
              :placeholder="item.placeholder"
              :allow-clear="item.allowClear"
              :style="item.styleObj"
              @update:model-value="handleValueChange(value, item.field)"
            />
          </template>
        </a-form-item>
      </template>
      <a-form-item>
        <a-button type="primary" html-type="submit">搜索</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped></style>
