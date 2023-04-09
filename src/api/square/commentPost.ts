/**
 * 评论某篇帖子
 */
import request from "@/utils/request";
import type { AxiosResponse } from "axios";

function commentPost(
  token: string,
  postId: number | string,
  content: string
): Promise<AxiosResponse> {
  return request({
    method: "post",
    url: `/api/square/commentPost`,
    data: {
      postId,
      content,
    },
    headers: { Authorization: token },
  });
}

export default commentPost;
