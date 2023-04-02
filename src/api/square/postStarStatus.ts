/**
 * 获取帖子点赞状态
 * @param {String | Number} postId 帖子ID
 * @param {String | Number} userId 用户ID
 */
import request from "@/utils/request";
import type { AxiosResponse } from "axios";

function postStarStatus(
  postId: string | number,
  userId: string | number
): Promise<AxiosResponse> {
  return request({
    method: "get",
    url: `/api/square/postStarStatus`,
    params: {
      postId: postId,
      userId: userId,
    },
  });
}

export default postStarStatus;
