/**
 * 项目的配置文件
 */

// 后端服务器地址
export const BackendURL: string = import.meta.env.VITE_BASE_URL;

// websocket服务端地址
export const SocketURL: string = import.meta.env.VITE_WEBSOCKET_URL;

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

// 本地存储(localStorage)的token key键名
export const TokenKey = "meetu_jwt_token";

// 本地存储(localStorage)的用户ID key
export const UidKey = "meetu_uid";

// 不需要登录鉴权的路由列表
export const noAuthRoutes = [
  "/register",
  "/login",
  "/changePassword/",
  "/square",
  "/square/postDetail/",
];

// 需要登录授权的路由列表(不含全部)
export const authRoutes = ["/square/pubPost"];
