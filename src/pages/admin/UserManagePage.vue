<script setup lang="ts">
import { reactive } from "vue"
import { storeToRefs } from "pinia"
import { FormArea } from "@/base-ui/form-area"
import UserTable from "./c-cpns/UserTable.vue"
import { userFormList } from "./config"
import { useAdminStore } from "@/stores"
import { useAdmin } from "@/hooks"

const adminStore = useAdminStore()
const { userDataList, userDataTotal } = storeToRefs(adminStore)

// 搜索条件
const searchParams = reactive<API.UserQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: "createTime",
  sortOrder: "ascend"
})

const { handleUpdateSearchParams, handleSearch, handleTableChange } = useAdmin(
  adminStore.fetchUserData,
  searchParams
)

const handleDelete = (id: string) => {
  if (!id) return
  adminStore.deleteUser(id, searchParams)
}
</script>

<template>
  <div id="userManagePage">
    <!-- 搜索表单 -->
    <FormArea
      :formData="searchParams"
      :formList="userFormList"
      @update:formData="handleUpdateSearchParams"
      @submit:formSubmit="handleSearch"
    />
    <div style="margin-bottom: 16px" />
    <!-- 表格 -->
    <UserTable
      :dataList="userDataList"
      :searchParams="searchParams"
      :total="userDataTotal"
      @change:tableChange="handleTableChange"
      @change:delete="handleDelete"
    />
  </div>
</template>

<style scoped></style>
