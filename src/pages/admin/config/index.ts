import { type FormList } from "@/base-ui/form-area"
import { PIC_REVIEW_STATUS_OPTIONS } from "@/constants/picture"
import { SPACE_LEVEL_OPTIONS } from "@/constants/space"

const pictureFormList: FormList[] = [
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
    type: "input",
    placeholder: "请输入类型",
    allowClear: true
  },
  {
    label: "标签",
    name: "tags",
    field: "tags",
    type: "select",
    placeholder: "请输入标签",
    allowClear: true,
    styleObj: { minWidth: "180px" },
    mode: "tags"
  },
  {
    label: "审核状态",
    name: "reviewStatus",
    field: "reviewStatus",
    type: "select",
    placeholder: "请输入审核状态",
    allowClear: true,
    styleObj: { minWidth: "180px" },
    options: PIC_REVIEW_STATUS_OPTIONS
  },
  {
    name: "搜索",
    type: "button"
  }
]

const userFormList: FormList[] = [
  {
    label: "账号",
    name: "userAccount",
    field: "userAccount",
    type: "input",
    placeholder: "输入账号",
    allowClear: true
  },
  {
    label: "用户名",
    name: "userName",
    field: "userName",
    type: "input",
    placeholder: "输入用户名",
    allowClear: true
  },
  {
    name: "搜索",
    type: "button"
  }
]

const spaceFormList: FormList[] = [
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
    label: "用户 id",
    name: "userId",
    field: "userId",
    type: "input",
    placeholder: "请输入用户 id",
    allowClear: true
  },
  {
    name: "搜索",
    type: "button"
  }
]

export { pictureFormList, userFormList, spaceFormList }
