/**
 * 项目的配置文件
 */

// 后端服务器地址
export const BackendURL: string = import.meta.env.VITE_BASE_URL;

// 邮箱地址的正则表达式
export const emailPattern: RegExp =
  /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

// 用户密码的正则表达式
export const passwordPattern: RegExp =
  /^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9,._!@#$^&*]{8,20}$/;

// 记录不需要被KeepAlive缓存的组件名，
// 需要注意：KeepAlive组件的include/exclude只接收直接子组件，不支持隔代子组件
export const noCacheList: string[] = [
  "meetuChatWindow",
  "meetuChat",
  "meetuSquarePostDetail",
  "meetuNotices",
  "meetuEditUserInfo",
  "meetuSettings",
  "meetuDetail",
  "meetuPublishPost",
];
