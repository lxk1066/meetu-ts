/**
 * 同意好友请求
 */
import request from "@/utils/request";
import type { AxiosResponse } from "axios";

function agreeFriendRequest(
  token: string,
  noticeId: string
): Promise<AxiosResponse> {
  return request({
    method: "post",
    url: "/api/user/agreeFriendRequest",
    data: { noticeId: noticeId },
    headers: { Authorization: token },
  });
}

export default agreeFriendRequest;
