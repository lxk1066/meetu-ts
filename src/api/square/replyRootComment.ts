/**
 * 回复某条根评论
 */
import request from "@/utils/request";
import type { AxiosResponse } from "axios";

function replyRootComment(
  token: string,
  postId: number | string,
  content: string,
  rootCommentId: number | string
): Promise<AxiosResponse> {
  return request({
    method: "post",
    url: `/api/square/replyRootComment`,
    data: {
      postId,
      content,
      rootCommentId,
    },
    headers: { Authorization: token },
  });
}

export default replyRootComment;
