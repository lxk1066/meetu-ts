import axios from "axios";
import { showNotify } from "vant";
import type { AxiosInstance } from "axios";
import { BackendURL } from "@/project.config";

const request: AxiosInstance = axios.create({
  baseURL: BackendURL,
});

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 请求响应报错
    showNotify({ type: "danger", message: "网络错误" });
    return Promise.reject(error);
  }
);

export default request;
