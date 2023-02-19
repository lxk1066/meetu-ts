/**
 * 用户登录
 */
import request from "@/utils/request";
import type { AxiosResponse } from "axios";

function login(username: string, password: string): Promise<AxiosResponse> {
  return request.post("/api/user/login", {
    username: username,
    password: password,
  });
}

export default login;
