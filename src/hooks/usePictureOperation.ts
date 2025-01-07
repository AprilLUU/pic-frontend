import { message } from "ant-design-vue"
import { deletePictureUsingPost, doPictureReviewUsingPost } from "@/api"
import { PIC_REVIEW_STATUS_ENUM } from "@/constants/picture"

const usePictureOperation = () => {
  // 删除数据
  const handleDelete = async (id: string) => {
    if (!id) return
    const res = (await deletePictureUsingPost({ id })) as any
    if (res.code === 0) {
      message.success("删除成功")
      return true
    } else {
      message.error("删除失败")
      return false
    }
  }

  const handleReview = async (picture: API.Picture, reviewStatus: number) => {
    const reviewMessage =
      reviewStatus === PIC_REVIEW_STATUS_ENUM.PASS
        ? "管理员操作通过"
        : "管理员操作拒绝"
    const res = (await doPictureReviewUsingPost({
      id: picture.id,
      reviewStatus,
      reviewMessage
    })) as any
    if (res.code === 0) {
      message.success("审核操作成功")
      return true
    } else {
      message.error("审核操作失败，" + res.message)
      return false
    }
  }

  return {
    handleDelete,
    handleReview
  }
}

export default usePictureOperation
