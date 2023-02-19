/**
 * 发送`修改邮箱`的验证码邮件
 */
import request from "@/utils/request";
import type { AxiosResponse } from "axios";

function sendModifyMailboxLetter(token: string): Promise<AxiosResponse> {
  return request({
    method: "post",
    url: "/api/user/ModifyMailboxLetter",
    headers: { Authorization: token },
  });
}

export default sendModifyMailboxLetter;
