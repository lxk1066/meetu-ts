/**
 * 全局监听服务器转发过来的消息，并将消息存储到本地
 */

import type { Socket } from "socket.io-client";
import { addMessage } from "@/utils/IndexedDB/addMessage";

interface Options {
  socket: Socket;
  userId: string;
  isRead?: boolean;
}

export const useListenMsg = (
  { socket, userId, isRead = false }: Options,
  cb?: Function
) => {
  socket.on("private-message", (fromId, toId, msg, time) => {
    // 将消息存储到本地
    addMessage(userId, fromId, toId, {
      from_uid: fromId,
      to_uid: toId,
      message: msg,
      time: time,
      hasRead: isRead,
    });

    // 执行回调
    cb && cb({ fromId, toId, msg, time });
  });
};
