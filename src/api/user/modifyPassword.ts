/**
 * 发送`修改密码`的邮件
 */
import request from "@/utils/request";
import type { AxiosResponse } from "axios";

function sendModifyPasswordEmail(token: string): Promise<AxiosResponse> {
  return request({
    method: "post",
    url: "/api/user/updatePasswordEmail",
    headers: { Authorization: token },
  });
}

export default sendModifyPasswordEmail;
