/**
 * 发送邮件验证码
 */
import request from "@/utils/request";
import type { AxiosResponse } from "axios";

function sendEmailVerifyCode(email: string): Promise<AxiosResponse> {
  return request.post("/api/user/email", {
    email: email,
  });
}

export default sendEmailVerifyCode;
