/**
 * 上传头像
 */
import request from "@/utils/request";
import type { AxiosResponse } from "axios";

function uploadProfile(
  fileData: FormData,
  token: string
): Promise<AxiosResponse> {
  return request({
    method: "post",
    url: "/api/user/uploadProfile",
    data: fileData,
    headers: { Authorization: token },
  });
}

export default uploadProfile;
