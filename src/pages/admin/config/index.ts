import { type FormList } from "@/base-ui/form-area"
import {
  getOptions,
  PIC_REVIEW_STATUS_OPTIONS,
  SPACE_LEVEL_OPTIONS,
  SPACE_TYPE_OPTIONS
} from "@/constants"

const { tagOptions, categoryOptions } = getOptions()

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
    label: "情感极性分类",
    name: "category",
    field: "category",
    type: "auto-complete",
    options: categoryOptions,
    placeholder: "请输入类型",
    styleObj: { minWidth: "180px" },
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
    label: "空间类别",
    name: "spaceType",
    field: "spaceType",
    type: "select",
    placeholder: "请输入空间类别",
    allowClear: true,
    styleObj: { minWidth: "180px" },
    options: SPACE_TYPE_OPTIONS
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

const spaceUserFormList: FormList[] = [
  {
    label: "用户 id",
    name: "userId",
    field: "userId",
    type: "input",
    placeholder: "请输入用户 id",
    allowClear: true
  },
  {
    name: "添加用户",
    type: "button"
  }
]

export { pictureFormList, userFormList, spaceFormList, spaceUserFormList }
