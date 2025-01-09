import type { FormList } from "@/base-ui/form-area"

export const registerFormList: FormList[] = [
  {
    name: "userAccount",
    field: "userAccount",
    type: "input",
    placeholder: "请输入账号",
    allowClear: true,
    rules: [{ required: true, message: "请输入账号" }]
  },
  {
    name: "userPassword",
    field: "userPassword",
    type: "input-password",
    placeholder: "请输入密码",
    allowClear: true,
    rules: [
      { required: true, message: "请输入密码" },
      { min: 8, message: "密码长度不能小于 8 位" }
    ]
  },
  {
    name: "checkPassword",
    field: "checkPassword",
    type: "input-password",
    placeholder: "请输入确认密码",
    allowClear: true,
    rules: [
      { required: true, message: "请输入确认密码" },
      { min: 8, message: "确认密码长度不能小于 8 位" }
    ]
  },
  {
    name: "注册",
    type: "button",
    styleObj: { width: "100%" }
  }
]

export const loginFormList: FormList[] = [
  {
    name: "userAccount",
    field: "userAccount",
    type: "input",
    placeholder: "请输入账号",
    allowClear: true,
    rules: [{ required: true, message: "请输入账号" }]
  },
  {
    name: "userPassword",
    field: "userPassword",
    type: "input-password",
    placeholder: "请输入密码",
    allowClear: true,
    rules: [
      { required: true, message: "请输入密码" },
      { min: 8, message: "密码不能小于 8 位" }
    ]
  },
  {
    name: "登录",
    type: "button",
    styleObj: { width: "100%" }
  }
]
