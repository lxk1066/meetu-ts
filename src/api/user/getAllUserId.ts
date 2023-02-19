/**
 * 获取所有用户的uid
 */
import request from "@/utils/request";
import type { AxiosResponse } from "axios";

function getAllUserId(token: string): Promise<AxiosResponse> {
  return request({
    method: "post",
    url: "/api/user/getAllUserId",
    headers: { Authorization: token },
  });
}

export default getAllUserId;
