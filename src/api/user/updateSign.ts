/**
 * 修改个性签名
 */
import request from "@/utils/request";
import type { AxiosResponse } from "axios";

function updateSign(sign: string, token: string): Promise<AxiosResponse> {
  return request({
    method: "post",
    url: "/api/user/updateSign",
    data: { sign: sign },
    headers: { Authorization: token },
  });
}

export default updateSign;
