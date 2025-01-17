import { onMounted } from "vue"

const useAdmin = (fetchData: any, searchParams: any) => {
  // 页面加载时获取数据，请求一次
  onMounted(() => fetchData(searchParams))
  // 更新搜索参数
  const handleUpdateSearchParams = (field: string, value: string) => {
    searchParams[field as any] = value as any
  }
  // 搜索数据
  const handleSearch = () => {
    // 重置页码
    searchParams.current = 1
    fetchData(searchParams)
  }
  // 表格变化之后，重新获取数据
  const handleTableChange = (page: any) => {
    searchParams.current = page.current
    searchParams.pageSize = page.pageSize
    fetchData(searchParams)
  }

  return {
    handleUpdateSearchParams,
    handleSearch,
    handleTableChange
  }
}

export default useAdmin
