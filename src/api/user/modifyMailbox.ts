/**
 * 修改邮箱地址
 */
import request from "@/utils/request";
import type { AxiosResponse } from "axios";

function modifyMailbox(
  token: string,
  verifyCode: string,
  newEmail: string
): Promise<AxiosResponse> {
  return request({
    method: "post",
    url: "/api/user/modifyMailbox",
    data: { verifyCode: verifyCode, newEmail: newEmail },
    headers: { Authorization: token },
  });
}

export default modifyMailbox;
