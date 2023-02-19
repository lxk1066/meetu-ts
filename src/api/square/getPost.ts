/**
 * 获取指定ID的帖子数据
 * @param {String | Number} postId 帖子ID
 */
import request from "@/utils/request";
import type { AxiosResponse } from "axios";

function getPostList(postId: string): Promise<AxiosResponse> {
  return request({
    method: "get",
    url: `/api/square/getPost/${postId}`,
  });
}

export default getPostList;
