/**
 * 获取用户的MUID
 */
import request from "@/utils/request";
import type { AxiosResponse } from "axios";

function getUserMUID(uid: string | number): Promise<AxiosResponse> {
  return request({
    method: "get",
    url: `/api/user/getUserMUID/${uid}`,
  });
}

export default getUserMUID;
