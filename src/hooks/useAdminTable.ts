import { computed } from "vue"
import { useRouter } from "vue-router"

const useAdminTable = (props: any, emit: any) => {
  // 分页参数
  // 直接传total 会出现缓存不一致问题
  // total通过形参传递时不会再变化 导致computed更新不及时
  const pagination = computed(() => {
    return {
      current: props.searchParams.current,
      pageSize: props.searchParams.pageSize,
      total: props.total,
      showSizeChanger: true,
      showTotal: (total: number) => `共 ${total} 条`
    }
  })

  const handleTableChange = (page: any) => {
    emit("change:tableChange", page)
  }

  const handleDelete = (id: string) => {
    emit("change:delete", id)
  }

  const handleReview = (data: API.Picture, status: number) => {
    emit("change:review", data, status)
  }

  const router = useRouter()
  const handleBtnClick = (path: string) => router.push(path)

  return {
    pagination,
    handleTableChange,
    handleDelete,
    handleReview,
    handleBtnClick
  }
}

export default useAdminTable
