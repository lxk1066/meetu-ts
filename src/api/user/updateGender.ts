/**
 * 修改性别
 */
import request from "@/utils/request";
import type { AxiosResponse } from "axios";

function updateGender(gender: string, token: string): Promise<AxiosResponse> {
  return request({
    method: "post",
    url: "/api/user/updateGender",
    data: { gender: gender },
    headers: { Authorization: token },
  });
}

export default updateGender;
