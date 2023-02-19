/**
 * 发送好友申请
 */
import request from "@/utils/request";
import type { AxiosResponse } from "axios";

function addFriendRequest(
  token: string,
  muid: string,
  message: string
): Promise<AxiosResponse> {
  return request({
    method: "post",
    url: "/api/user/addFriendRequest",
    data: { muid, message },
    headers: { Authorization: token },
  });
}

export default addFriendRequest;
