/**
 * 获取头像
 */
import request from "@/utils/request";

function getProfile(filename: string): string {
  return request.defaults.baseURL + "/api/user/getProfile/" + filename;
}

export default getProfile;
