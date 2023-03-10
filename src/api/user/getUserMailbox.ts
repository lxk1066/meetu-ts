/**
 * 获取用户的邮箱地址
 */
import request from "@/utils/request";
import type { AxiosResponse } from "axios";

function getUserMailbox(token: string): Promise<AxiosResponse> {
  return request({
    method: "post",
    url: "/api/user/getMailbox",
    headers: { Authorization: token },
  });
}

export default getUserMailbox;
