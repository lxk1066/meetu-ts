/**
 * 修改用户名
 */
import request from "@/utils/request";
import type { AxiosResponse } from "axios";

function updateUsername(
  username: string,
  token: string
): Promise<AxiosResponse> {
  return request({
    method: "post",
    url: "/api/user/updateUsername",
    data: { username: username },
    headers: { Authorization: token },
  });
}

export default updateUsername;
