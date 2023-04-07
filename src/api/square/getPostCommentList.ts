/**
 * 获取帖子的所有评论（已登录）
 */
import request from "@/utils/request";
import type { AxiosResponse } from "axios";

function getPostCommentList(
  token: string,
  postId: number | string
): Promise<AxiosResponse> {
  return request({
    method: "post",
    url: `/api/square/getPostCommentList`,
    data: {
      postId,
    },
    headers: { Authorization: token },
  });
}

export default getPostCommentList;
