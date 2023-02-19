/**
 * 用户注册
 */
import request from "@/utils/request";
import type { AxiosResponse } from "axios";

function register(
  username: string,
  password: string,
  email: string,
  emailVerifyCode: string
): Promise<AxiosResponse> {
  return request.post("/api/user/reg", {
    username: username,
    password: password,
    email: email,
    emailVerifyCode: emailVerifyCode,
  });
}

export default register;
