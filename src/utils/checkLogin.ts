/**
 * 全局路由守卫，检测是否登录的工具函数
 */

import { useStore } from "@/stores";
import verifyToken from "@/api/user/verifyToken";

export async function checkLogin(token: string | null, uid: string | null) {
  const store = useStore();
  if (token && uid) {
    //  去服务器验证token
    const { data: res } = await verifyToken(token);
    store.changeLoginStatus(res.code == 200);
    return res.code === 200;
  } else {
    store.changeLoginStatus(false);
    return false;
  }
}
