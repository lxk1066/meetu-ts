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
