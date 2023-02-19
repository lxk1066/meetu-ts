/**
 * 获取当前用户的所有通知数量
 */
import request from "@/utils/request";
import type { AxiosResponse } from "axios";

function getAllNoticesNumber(token: string): Promise<AxiosResponse> {
  return request({
    method: "post",
    url: "/api/user/getAllNoticesNumber",
    headers: { Authorization: token },
  });
}

export default getAllNoticesNumber;
