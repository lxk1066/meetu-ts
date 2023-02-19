/**
 * 根据MUID搜索用户
 */
import request from "@/utils/request";
import type { AxiosResponse } from "axios";

function searchMUID(muid: string, token: string): Promise<AxiosResponse> {
  return request({
    method: "post",
    url: "/api/user/searchMUID",
    data: { muid: muid },
    headers: { Authorization: token },
  });
}

export default searchMUID;
