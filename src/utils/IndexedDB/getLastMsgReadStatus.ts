// 获取最新消息的已读状态

import { getLastMessage } from "@/utils/IndexedDB/getLastMessage";

export async function getLastMsgReadStatus(
  uid: string,
  fromId: string,
  toId: string
) {
  const lastMsg = await getLastMessage(uid, fromId, toId);
  return lastMsg[0].hasRead;
}
