/**
 * 获取帖子的前几条评论（未登录）
 */
import request from "@/utils/request";
import type { AxiosResponse } from "axios";

function getPostComment(postId: number | string): Promise<AxiosResponse> {
  return request({
    method: "get",
    url: `/api/square/getPostComment/${postId}`,
  });
}

export default getPostComment;
