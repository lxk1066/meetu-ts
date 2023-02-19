/**
 * 拒绝好友请求
 */
import request from "@/utils/request";
import type { AxiosResponse } from "axios";

function disagreeFriendRequest(
  token: string,
  noticeId: string
): Promise<AxiosResponse> {
  return request({
    method: "post",
    url: "/api/user/disagreeFriendRequest",
    data: { noticeId: noticeId },
    headers: { Authorization: token },
  });
}

export default disagreeFriendRequest;
