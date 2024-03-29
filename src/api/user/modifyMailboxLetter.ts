/**
 * 发送`修改邮箱`的验证码邮件
 */
import request from "@/utils/request";
import type { AxiosResponse } from "axios";

function sendModifyMailboxLetter(
  token: string,
  newEmail: string
): Promise<AxiosResponse> {
  return request({
    method: "post",
    url: "/api/user/ModifyMailboxLetter",
    headers: { Authorization: token },
    data: { newEmail },
  });
}

export default sendModifyMailboxLetter;
