/**
 * 获取指定用户的所有帖子
 * @param {String | Number} uid 用户ID
 */
import request from "@/utils/request";
import type { AxiosResponse } from "axios";

function getUserPostList(uid: string | number): Promise<AxiosResponse> {
  return request({
    method: "get",
    url: `/api/square/getUserPostList/${uid}`,
  });
}

export default getUserPostList;
