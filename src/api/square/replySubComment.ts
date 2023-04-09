/**
 * 回复某条子评论
 */
import request from "@/utils/request";
import type { AxiosResponse } from "axios";

function replySubComment(
  token: string,
  postId: number | string,
  content: string,
  rootCommentId: number | string,
  toCommentId: number | string
): Promise<AxiosResponse> {
  return request({
    method: "post",
    url: `/api/square/replySubComment`,
    data: {
      postId,
      content,
      rootCommentId,
      toCommentId,
    },
    headers: { Authorization: token },
  });
}

export default replySubComment;
