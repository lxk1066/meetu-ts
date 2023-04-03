import type { AxiosResponse } from "axios";
import type { BaseInfo } from ".";

export declare function searchMUID(
  muid: string,
  token: string
): Promise<AxiosResponse>;

export declare interface Notice {
  id: string;
  type: string;
  from: string;
  to: string;
  message: string;
  data?: { postId?: string | number };
  time: number;
}

export declare interface MuidUserInfo extends BaseInfo {
  uid: string;
  gender: string;
  sign: string;
  area: string;
}
