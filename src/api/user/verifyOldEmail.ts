/**
 * 验证旧邮箱地址
 */
import request from "@/utils/request";
import type { AxiosResponse } from "axios";

function verifyOldEmail(
  token: string,
  oldEmail: string
): Promise<AxiosResponse> {
  return request({
    method: "post",
    url: "/api/user/verifyOldEmail",
    data: { oldEmail },
    headers: { Authorization: token },
  });
}

export default verifyOldEmail;
