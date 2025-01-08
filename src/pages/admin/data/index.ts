import { type FromList } from "../types"
import { PIC_REVIEW_STATUS_OPTIONS } from "@/constants/picture"

const pictureFromList: FromList[] = [
  {
    searchText: {
      placeholder: "从名称和简介搜索",
      allowClear: true
    },
    category: {
      placeholder: "请输入类型",
      allowClear: true
    },
    tags: {
      placeholder: "请输入标签",
      allowClear: true,
      styleObj: { minWidth: "180px" },
      mode: "tags"
    },
    reviewStatus: {
      placeholder: "请输入审核状态",
      allowClear: true,
      styleObj: { minWidth: "180px" },
      options: PIC_REVIEW_STATUS_OPTIONS
    }
  }
]

const userFormList: FromList[] = [
  {
    placeholder: "输入账号",
    allowClear: true
  },
  {
    placeholder: "输入用户名",
    allowClear: true
  }
]

export {
  pictureFromList,
  userFormList
}
