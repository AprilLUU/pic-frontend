import dayjs from "dayjs"
import type { FormList } from "@/base-ui/form-area"
import { getOptions, SPACE_LEVEL_OPTIONS } from "@/constants"

const { tagOptions, categoryOptions } = getOptions()

const spaceEditFormList: FormList[] = [
  {
    label: "空间名称",
    name: "spaceName",
    field: "spaceName",
    type: "input",
    placeholder: "请输入空间名称",
    allowClear: true
  },
  {
    label: "空间级别",
    name: "spaceLevel",
    field: "spaceLevel",
    type: "select",
    placeholder: "请输入空间级别",
    allowClear: true,
    styleObj: { minWidth: "180px" },
    options: SPACE_LEVEL_OPTIONS
  },
  {
    type: "button",
    styleObj: { width: "100%" }
  }
]

const rangePresets = [
  { label: "过去 7 天", value: [dayjs().add(-7, "d"), dayjs()] },
  { label: "过去 14 天", value: [dayjs().add(-14, "d"), dayjs()] },
  { label: "过去 30 天", value: [dayjs().add(-30, "d"), dayjs()] },
  { label: "过去 90 天", value: [dayjs().add(-90, "d"), dayjs()] }
]

const pictureSearchFormList: FormList[] = [
  {
    label: "关键词",
    name: "searchText",
    field: "searchText",
    type: "input",
    placeholder: "从名称和简介搜索",
    allowClear: true
  },
  {
    label: "分类",
    name: "category",
    field: "category",
    type: "auto-complete",
    placeholder: "请输入分类",
    options: categoryOptions,
    styleObj: { minWidth: "180px" },
    allowClear: true
  },
  {
    label: "标签",
    name: "tags",
    field: "tags",
    type: "select",
    mode: "tags",
    placeholder: "请输入标签",
    options: tagOptions,
    styleObj: { minWidth: "180px" },
    allowClear: true
  },
  {
    label: "日期",
    name: "dateRange",
    field: "dateRange",
    type: "date-range-picker",
    styleObj: { width: "400px" },
    dateRangePicker: {
      rangePresets: rangePresets,
      format: "YYYY/MM/DD HH:mm:ss",
      placeholder: ["编辑开始日期", "编辑结束时间"],
      showTime: true
    }
  },
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
    type: "input",
    placeholder: "请输入简介",
    allowClear: true
  },
  {
    label: "宽度",
    name: "picWidth",
    field: "picWidth",
    type: "input-number",
    styleObj: { minWidth: "220px" },
    placeholder: "请输入宽度"
  },
  {
    label: "高度",
    name: "picHeight",
    field: "picHeight",
    type: "input-number",
    styleObj: { minWidth: "220px" },
    placeholder: "请输入高度"
  },
  {
    label: "格式",
    name: "picFormat",
    field: "picFormat",
    type: "input",
    placeholder: "请输入格式",
    allowClear: true
  },
  {
    name: "搜索",
    type: "button",
    styleObj: { width: "96px" }
  }
]

export { spaceEditFormList, pictureSearchFormList }
