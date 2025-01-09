<script setup lang="ts">
import { type FormList } from "../types"

interface Props {
  formData: any
  formList: FormList[]
  formLayout?: string
  loading?: boolean
  autoComplete?: string
}

withDefaults(defineProps<Props>(), {
  formLayout: "inline",
  loading: false,
  autoComplete: "on"
})
const emit = defineEmits(["update:formData", "submit:formSubmit"])
// const searchParams = defineModel()

const handleValueChange = (value: string, field: string) => {
  // console.log(value, field)
  emit("update:formData", field, value)
}

const handleSubmit = (values: any) => {
  emit("submit:formSubmit", values)
}
</script>

<template>
  <div class="search-area">
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
          <template v-else-if="item.type === 'textarea'">
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
          <template v-else-if="item.type === 'auto-complete'">
            <a-auto-complete
              :value="formData[item.field!]"
              :placeholder="item.placeholder"
              :allow-clear="item.allowClear"
              :style="item.styleObj"
              @update:value="
                (value: string) => handleValueChange(value, item.field!)
              "
            />
          </template>
          <template v-else-if="item.type === 'select'">
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
          <template v-else-if="item.type === 'button'">
            <a-button
              :style="item.styleObj"
              type="primary"
              html-type="submit"
              :loading="loading"
              >{{ item.name }}</a-button
            >
          </template>
        </a-form-item>
      </template>
    </a-form>
  </div>
</template>

<style scoped></style>
