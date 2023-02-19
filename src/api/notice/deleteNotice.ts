/**
 * 删除指定通知
 */
import request from "@/utils/request";
import type { AxiosResponse } from "axios";

function deleteNotice(token: string, noticeId: string): Promise<AxiosResponse> {
  return request({
    method: "post",
    url: "/api/user/deleteNotice",
    data: { noticeId: noticeId },
    headers: { Authorization: token },
  });
}

export default deleteNotice;
