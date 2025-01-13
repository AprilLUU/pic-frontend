<script setup lang="ts">
import { reactive } from "vue"
import { useRouter, RouterLink } from "vue-router"
import { userLoginUsingPost } from "@/api"
import { useLoginUserStore } from "@/stores/loginUser"
import { message } from "ant-design-vue"

import { FormArea } from "@/base-ui/form-area"
import { loginFormList } from "./config"

const formState = reactive<API.UserLoginRequest>({
  userAccount: "",
  userPassword: ""
})

const loginUserStore = useLoginUserStore()
const router = useRouter()

const handleUpdateFormData = (field: string, value: string) => {
  formState[field as keyof API.UserLoginRequest] = value as any
}

const handleSubmit = async (values: API.UserLoginRequest) => {
  const res = (await userLoginUsingPost(values)) as API.BaseResponseLoginUserVO_
  // console.log(res)
  if (res.code === 0 && res.data) {
    message.success("登录成功")
    loginUserStore.setLoginUser(res.data)
    // 获取用户空间信息
    await loginUserStore.fetchLoginUserSpace()
    router.replace({ path: "/" })
  } else {
    message.error(`登录失败，${res.message}`)
  }
}
</script>

<template>
  <div id="userLoginPage">
    <h2 class="title">云图库 - 用户登录</h2>
    <div class="desc">企业级智能协同云图库</div>
    <FormArea
      :formData="formState"
      :formList="loginFormList"
      formLayout="vertical"
      autoComplete="off"
      @update:formData="handleUpdateFormData"
      @submit:formSubmit="handleSubmit"
    />
    <div class="tips">
      没有账号？
      <RouterLink to="/user/register">去注册</RouterLink>
    </div>
  </div>
</template>

<style scoped>
#userLoginPage {
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
  margin-bottom: 16px;
  color: #bbb;
  font-size: 13px;
  text-align: right;
}
</style>
