/**
 * 查询某个MUID是否为当前用户的好友
 */
import request from "@/utils/request";
import type { AxiosResponse } from "axios";

function isOwnFriend(token: string, muid: string): Promise<AxiosResponse> {
  return request({
    method: "post",
    url: "/api/user/isOwnFriend",
    data: { muid: muid },
    headers: { Authorization: token },
  });
}

export default isOwnFriend;
