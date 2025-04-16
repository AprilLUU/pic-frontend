<script setup lang="ts">
import { ref } from "vue"
import { type FormList } from "../types"

interface Props {
  formData?: any
  formList?: FormList[]
  formLayout?: string
  loading?: boolean
  isShowReset?: boolean
  autoComplete?: string
}

const props = withDefaults(defineProps<Props>(), {
  formData: () => {},
  formList: () => [],
  formLayout: "inline",
  loading: false,
  isShowReset: false,
  autoComplete: "on"
})
const emit = defineEmits([
  "update:formData",
  "submit:formSubmit",
  "update:editTime",
  "reset:formData"
])
// const searchParams = defineModel()

const handleValueChange = (value: string, field: string) => {
  props.formList.forEach(((item) => {
    if (item.dependencies) {
      if (item.dependencies.includes(field)) {
        const effectVal = item.onChange?.(field, value)
        emit("update:formData", item.field, effectVal)
      }
    }
  }))
  emit("update:formData", field, value)
}

const handleSubmit = (values: any) => {
  emit("submit:formSubmit", values)
}

const dateRange = ref<any[]>([])

const handleRangeChange = (dates: any[]) => {
  emit("update:editTime", dates)
}

const handleResetClick = () => {
  dateRange.value = []
  emit("reset:formData")
}
</script>

<template>
  <div class="form-area">
    <a-form
      :layout="formLayout"
      :model="formData"
      :autoComplete="autoComplete"
      @finish="handleSubmit"
    >
      <template v-for="item in formList" :key="item.label">
        <a-form-item :label="item.label" :name="item.name" :rules="item.rules">
          <template v-if="item.type === 'input'">
            <a-input
              :value="formData[item.field!]"
              :placeholder="item.placeholder"
              :allow-clear="item.allowClear"
              :style="item.styleObj"
              @update:value="
                (value: string) => handleValueChange(value, item.field!)
              "
            />
          </template>
          <template v-if="item.type === 'input-number'">
            <a-input-number
              :value="formData[item.field!]"
              :placeholder="item.placeholder"
              :allow-clear="item.allowClear"
              :style="item.styleObj"
              :min="item.min"
              :max="item.max"
              @update:value="
                (value: string) => handleValueChange(value, item.field!)
              "
            />
          </template>
          <template v-if="item.type === 'input-password'">
            <a-input-password
              :value="formData[item.field!]"
              :placeholder="item.placeholder"
              :allow-clear="item.allowClear"
              :style="item.styleObj"
              @update:value="
                (value: string) => handleValueChange(value, item.field!)
              "
            />
          </template>
          <template v-if="item.type === 'textarea'">
            <a-textarea
              :value="formData[item.field!]"
              :placeholder="item.placeholder"
              :allow-clear="item.allowClear"
              :style="item.styleObj"
              :autoSize="item.sizeObj"
              @update:value="
                (value: string) => handleValueChange(value, item.field!)
              "
            />
          </template>
          <template v-if="item.type === 'auto-complete'">
            <a-auto-complete
              :value="formData[item.field!]"
              :placeholder="item.placeholder"
              :allow-clear="item.allowClear"
              :style="item.styleObj"
              :options="item.options"
              @update:value="
                (value: string) => handleValueChange(value, item.field!)
              "
            />
          </template>
          <template v-if="item.type === 'select'">
            <a-select
              :value="formData[item.field!]"
              :mode="item.mode"
              :options="item.options"
              :placeholder="item.placeholder"
              :allow-clear="item.allowClear"
              :style="item.styleObj"
              @update:value="
                (value: string) => handleValueChange(value, item.field!)
              "
            />
          </template>
          <template v-if="item.type === 'date-range-picker'">
            <a-range-picker
              :style="item.styleObj"
              v-model:value="dateRange"
              :show-time="item.dateRangePicker?.showTime"
              :placeholder="item.dateRangePicker?.placeholder"
              :format="item.dateRangePicker?.format"
              :presets="item.dateRangePicker?.rangePresets"
              @change="handleRangeChange"
            />
          </template>
          <template v-if="item.type === 'button'">
            <a-button
              :style="item.styleObj"
              type="primary"
              html-type="submit"
              :loading="loading"
            >
              {{ item.name }}
            </a-button>
            <a-button
              v-if="isShowReset"
              class="reset-btn"
              :style="item.styleObj"
              html-type="reset"
              @click="handleResetClick"
            >
              重置
            </a-button>
          </template>
        </a-form-item>
      </template>
    </a-form>
  </div>
</template>

<style scoped>
.reset-btn {
  margin-left: 16px;
}
</style>
