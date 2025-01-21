import type { FormList } from "@/base-ui/form-area"
import { categoryOptions, tagOptions } from "@/constants"

// 分类、标签和命名规则表单配置
export const batchEditPictureFormList: FormList[] = [
  {
    name: "category",
    field: "category",
    type: "auto-complete",
    placeholder: "请输入分类",
    allowClear: true,
    options: categoryOptions
  },
  {
    name: "tags",
    field: "tags",
    type: "select",
    placeholder: "请输入标签",
    allowClear: true,
    mode: "tags",
    options: tagOptions
  },
  {
    name: "nameRule",
    field: "nameRule",
    type: "input",
    placeholder: "请输入命名规则，输入 {序号} 可动态生成",
    allowClear: true
  },
  {
    name: "提交",
    type: "button",
    styleObj: { width: "100%" }
  }
]
