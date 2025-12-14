import type { FormList } from "@/base-ui/form-area"
import { getOptions } from "@/constants"

const { tagOptions, categoryOptions } = getOptions()

export const taskFormList: FormList[] = [
  {
    label: "关键词",
    name: "searchText",
    field: "searchText",
    type: "input",
    placeholder: "请输入关键词",
    allowClear: true
  },
  {
    label: "抓取数量",
    name: "count",
    field: "count",
    type: "input-number",
    placeholder: "请输入数量",
    styleObj: { width: "100%" },
    min: 1,
    max: 30,
    allowClear: true
  },
  {
    label: "名称前缀",
    name: "namePrefix",
    field: "namePrefix",
    type: "input",
    placeholder: "请输入名称前缀，会自动补充序号",
    allowClear: true
  },
  {
    name: "执行任务",
    type: "button",
    styleObj: { width: "100%" }
  }
]

export const pictureEditFormList: FormList[] = [
  {
    label: "名称",
    name: "name",
    field: "name",
    type: "input",
    placeholder: "请输入名称",
    allowClear: true
  },
  {
    label: "简介",
    name: "introduction",
    field: "introduction",
    type: "textarea",
    placeholder: "请输入简介",
    sizeObj: { minRows: 2, maxRows: 5 },
    allowClear: true
  },
  {
    label: "情感极性分类",
    name: "category",
    field: "category",
    type: "auto-complete",
    options: categoryOptions,
    placeholder: "请输入情感极性分类",
    allowClear: true
  },
  {
    label: "标签",
    name: "tags",
    field: "tags",
    type: "select",
    options: tagOptions,
    placeholder: "请输入标签",
    allowClear: true,
    mode: "tags"
  },
  {
    type: "button",
    styleObj: { width: "100%" }
  }
]
