/**
 * 修改密码
 */
import request from "@/utils/request";
import type { AxiosResponse } from "axios";

function changePassword(
  token: string,
  password: string
): Promise<AxiosResponse> {
  return request.post("/api/user/changePassword", {
    token,
    password,
  });
}

export default changePassword;
