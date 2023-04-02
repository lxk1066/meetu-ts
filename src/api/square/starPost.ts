/**
 * 点赞帖子
 * @param {String | Number} postId 帖子ID
 * @param {String} token
 */
import request from "@/utils/request";
import type { AxiosResponse } from "axios";

function starPost(
  postId: string | number,
  token: string
): Promise<AxiosResponse> {
  return request({
    method: "post",
    url: `/api/square/starPost`,
    data: {
      postId: postId,
    },
    headers: { Authorization: token },
  });
}

export default starPost;
