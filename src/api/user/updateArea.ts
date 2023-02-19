/**
 * 修改地区
 */
import request from "@/utils/request";
import type { AxiosResponse } from "axios";

function updateArea(area: string, token: string): Promise<AxiosResponse> {
  return request({
    method: "post",
    url: "/api/user/updateArea",
    data: { area: area },
    headers: { Authorization: token },
  });
}

export default updateArea;
