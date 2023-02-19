/**
 * 通过muid获取用户个人信息
 */
import request from "@/utils/request";
import type { AxiosResponse } from "axios";

function getMuidUserInfo(muid: string | number): Promise<AxiosResponse> {
  return request({
    method: "get",
    url: `/api/user/getMuidUserInfo/${muid}`,
  });
}

export default getMuidUserInfo;
