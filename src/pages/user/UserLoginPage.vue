<script setup lang="ts">
import { reactive } from "vue"
import { useRouter, RouterLink } from "vue-router"
import { userLoginUsingPost } from "@/api"
import { useLoginUserStore } from "@/stores/loginUser"
import { message } from "ant-design-vue"

const formState = reactive<API.UserLoginRequest>({
  userAccount: "",
  userPassword: ""
})

const loginUserStore = useLoginUserStore()
const router = useRouter()

const handleSubmit = async (values: API.UserLoginRequest) => {
  const res = (await userLoginUsingPost(values)) as API.BaseResponseLoginUserVO_
  // console.log(res)
  if (res.code === 0 && res.data) {
    message.success("登录成功")
    loginUserStore.setLoginUser(res.data)
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
    <a-form
      :model="formState"
      autocomplete="off"
      @finish="handleSubmit"
    >
      <a-form-item
        name="userAccount"
        :rules="[{ required: true, message: '请输入账号' }]"
      >
        <a-input
          v-model:value="formState.userAccount"
          placeholder="请输入账号"
        />
      </a-form-item>
      <a-form-item
        name="userPassword"
        :rules="[
          { required: true, message: '请输入密码' },
          { min: 8, message: '密码不能小于 8 位' }
        ]"
      >
        <a-input-password
          v-model:value="formState.userPassword"
          placeholder="请输入密码"
        />
      </a-form-item>
      <div class="tips">
        没有账号？
        <RouterLink to="/user/register">去注册</RouterLink>
      </div>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%">
          登录
        </a-button>
      </a-form-item>
    </a-form>
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
