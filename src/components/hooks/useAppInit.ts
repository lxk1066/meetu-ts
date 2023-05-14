/**
 * App.vue的全局初始化操作
 */
import { useStore } from "@/stores";
import verifyToken from "@/api/user/verifyToken";
import { TokenKey, UidKey } from "@/project.config";
import { useListenMsg } from "@/components/hooks/useListenMsg";

import type { Socket } from "socket.io-client";

export async function useAppInit(socket: Socket) {
  const store = useStore();

  // 一进来就立即与服务器建立socket.io连接
  const token = localStorage.getItem(TokenKey);
  const uid = localStorage.getItem(UidKey);
  if (token && uid) {
    const { data: res } = await verifyToken(token);
    if (res.code === 200) {
      if (!socket.connected) socket.connect();
      socket.on("connect", () => {
        console.log("connect", socket.id);
        socket.emit("set-user-id", uid);
        (socket as any).uid = uid;

        // 更新当前用户的在线状态
        socket.emit("online-message", (socket as any).uid);
        console.log("online-message");
        socket.on("online-message-reply-own", (isOnline) => {
          store.changeOnlineStatus(isOnline);
        });

        socket.on("disconnect", () => {
          console.log("disconnect", socket.id); // undefined
        });

        // 全局监听消息
        useListenMsg({ socket, userId: uid as string });
      });
    }
  }
}
