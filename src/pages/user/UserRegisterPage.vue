<script lang="ts" setup>
import { reactive } from "vue"
import { message } from "ant-design-vue"
import { FormArea } from "@/base-ui/form-area"
import { registerFormList } from "./config"
import { useUserStore } from "@/stores"

const formState = reactive<API.UserRegisterRequest>({
  userAccount: "",
  userPassword: "",
  checkPassword: ""
})

const userStore = useUserStore()

const handleUpdateFormData = (field: string, value: string) => {
  formState[field as keyof API.UserRegisterRequest] = value as any
}

const handleSubmit = async (values: API.UserRegisterRequest) => {
  // 校验两次输入的密码是否一致
  if (values.userPassword !== values.checkPassword) {
    message.error("两次输入的密码不一致")
    return
  }
  userStore.userRegister(values)
}
</script>

<template>
  <div id="userRegisterPage">
    <h2 class="title">云图库 - 用户注册</h2>
    <div class="desc">企业级智能协同云图库</div>
    <FormArea
      :formData="formState"
      :formList="registerFormList"
      formLayout="vertical"
      autoComplete="off"
      @update:formData="handleUpdateFormData"
      @submit:formSubmit="handleSubmit"
    />
    <div class="tips">
      已有账号？
      <RouterLink to="/user/login">去登录</RouterLink>
    </div>
  </div>
</template>

<style scoped>
#userRegisterPage {
  max-width: 360px;
  margin: 0 auto;
}

.title {
  text-align: center;
  margin-bottom: 16px;
}

.desc {
  text-align: center;
  color: #bbb;
  margin-bottom: 16px;
}

.tips {
  color: #bbb;
  text-align: right;
  font-size: 13px;
  margin-bottom: 16px;
}
</style>
