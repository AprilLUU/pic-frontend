<script setup lang="ts">
import { reactive } from "vue"
import { RouterLink } from "vue-router"
import { FormArea } from "@/base-ui/form-area"
import { loginFormList } from "./config"
import { useUserStore } from "@/stores"

const formState = reactive<API.UserLoginRequest>({
  userAccount: "",
  userPassword: ""
})

const userStore = useUserStore()

const handleUpdateFormData = (field: string, value: string) => {
  formState[field as keyof API.UserLoginRequest] = value as any
}

const handleSubmit = async (values: API.UserLoginRequest) => {
  userStore.userLogin(values)
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
