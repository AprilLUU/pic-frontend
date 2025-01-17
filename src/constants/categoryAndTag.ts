import { storeToRefs } from "pinia"
import { useHomeStore } from "@/stores"

const homeStore = useHomeStore()
const { tagList, categoryList } = storeToRefs(homeStore)
const tagOptions = tagList.value.map((data: string) => ({
  label: data,
  value: data
}))
const categoryOptions = categoryList.value.map((data: string) => ({
  label: data,
  value: data
}))

export {
  tagOptions,
  categoryOptions
}