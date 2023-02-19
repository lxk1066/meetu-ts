/**
 * 发布帖子
 */
import request from "@/utils/request";
import type { AxiosResponse } from "axios";

function publishPost(
  token: string,
  formData: FormData
): Promise<AxiosResponse> {
  return request({
    method: "post",
    url: "/api/square/publishPost",
    data: formData,
    headers: { Authorization: token },
  });
}

export default publishPost;
