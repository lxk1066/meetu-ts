/**
 * 获取用户个人信息
 */
import request from "@/utils/request";
import type { AxiosResponse } from "axios";
import type { UserInfo } from "@/types";

interface ResponseData {
  code: number;
  data: UserInfo;
}

function getPersonInfo(
  uid: string | number
): Promise<AxiosResponse<ResponseData>> {
  return request({
    method: "get",
    url: `/api/user/getPersonInfo/${uid}`,
  });
}

export default getPersonInfo;
