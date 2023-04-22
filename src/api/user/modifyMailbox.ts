/**
 * 修改邮箱地址
 */
import request from "@/utils/request";
import type { AxiosResponse } from "axios";

function modifyMailbox(
  token: string,
  verifyCode: string,
  newEmail: string,
  oldEmailToken: string // 验证旧邮箱地址后返回的token
): Promise<AxiosResponse> {
  return request({
    method: "post",
    url: "/api/user/modifyMailbox",
    data: { verifyCode: verifyCode, newEmail: newEmail, token: oldEmailToken },
    headers: { Authorization: token },
  });
}

export default modifyMailbox;
