/**
 * 获取当前用户的好友列表
 */
import request from "@/utils/request";
import type { AxiosResponse } from "axios";

function getAllFriends(token: string): Promise<AxiosResponse> {
  return request({
    method: "post",
    url: "/api/user/getAllFriends",
    headers: { Authorization: token },
  });
}

export default getAllFriends;
