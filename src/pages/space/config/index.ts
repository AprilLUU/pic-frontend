import type { FormList } from "@/base-ui/form-area"
import { SPACE_LEVEL_OPTIONS } from "@/constants/space"

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

export { spaceEditFormList }
