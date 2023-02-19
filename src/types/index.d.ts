export declare interface BaseInfo {
  id?: string;
  uid?: string;
  profile: string;
  username: string;
}

export declare interface UserInfo extends BaseInfo {
  gender: string;
  sign: string;
  area: string;
  muid: string;
}

export declare interface NoticeInfo extends BaseInfo {
  id: string;
  uid: string;
  message: string;
  type: string;
  time: number;
}

export declare interface Picture {
  pic_id: number;
  pic_name: string;
  pic_updated_time: string;
}

export declare interface Post {
  art_id: number;
  title: string;
  content: string;
  muid: string;
  uid?: number | string;
  username?: string;
  profile?: string;
  updated_time: string;
  pictures: Picture[];
}
