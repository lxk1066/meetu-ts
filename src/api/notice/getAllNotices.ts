/**
 * 获取当前用户的所有通知
 */
import request from "@/utils/request";
import type { AxiosResponse } from "axios";
import type { Notice } from "@/types/apis";

interface ResponseData {
  code: number;
  data: {
    notices: Notice[];
  };
}

function getAllNotices(token: string): Promise<AxiosResponse<ResponseData>> {
  return request({
    method: "post",
    url: "/api/user/getAllNotices",
    headers: { Authorization: token },
  });
}

export default getAllNotices;
