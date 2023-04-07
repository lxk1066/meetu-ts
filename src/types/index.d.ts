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
  data?: { postId?: string | number };
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
  star: string;
  muid: string;
  uid?: number | string;
  username?: string;
  profile?: string;
  updated_time: string;
  pictures: Picture[];
}

export declare interface Message {
  id: number;
  profile: string;
  to: "own" | "other";
  type: "string" | "photo" | "video";
  msg: string;
}

export declare interface Info {
  id?: string;
  username?: string;
  profile?: string;
}

export declare interface Comment {
  id: number;
  content: string;
  rootCommentId: number | string;
  toCommentId: number | string;
  art_id: number | string;
  user_id: number | string;
  username: string;
  created_time: number | string;
  profile?: string;
}

export declare interface NewComment extends Comment {
  subComments?: Comment[];
}
