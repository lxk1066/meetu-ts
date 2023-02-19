/**
 * 验证jwt_token是否正确
 */
import request from "@/utils/request";
import type { AxiosResponse } from "axios";

function verifyToken(token: string): Promise<AxiosResponse> {
  return request({
    method: "get",
    url: "/api/user/verifyToken",
    headers: { Authorization: token },
  });
}

export default verifyToken;
