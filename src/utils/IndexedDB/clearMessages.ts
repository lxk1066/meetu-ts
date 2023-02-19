import { store } from "./init";
// 清空某个用户的聊天记录
export async function clearMessages(uid: string, fromId: string, toId: string) {
  const db: number | IDBDatabase = await store(uid, fromId, toId);
  const objectStore = (db as IDBDatabase)
    .transaction(["message"], "readwrite")
    .objectStore("message");
  objectStore.clear();
}
