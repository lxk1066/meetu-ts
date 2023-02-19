import axios from "axios";
import type { AxiosInstance } from "axios";
import { BackendURL } from "../../project.config";

const request: AxiosInstance = axios.create({
  baseURL: BackendURL,
});

export default request;
