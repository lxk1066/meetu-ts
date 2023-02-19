/**
 * 修改MUID
 */
import request from "@/utils/request";
import type { AxiosResponse } from "axios";

function modifyUserMUID(
  token: string,
  newMUID: string
): Promise<AxiosResponse> {
  return request({
    method: "post",
    url: "/api/user/updateMUID",
    data: { newMUID },
    headers: { Authorization: token },
  });
}

export default modifyUserMUID;
