import { store } from "./init";

interface msgObj {
  from_uid: string;
  to_uid: string;
  message: string;
  time: number;
  hasRead: boolean;
}

export async function getLastMessage(
  uid: string,
  fromId: string,
  toId: string
): Promise<msgObj[]> {
  const db: IDBDatabase | number = await store(uid, fromId, toId);
  const objectStore = (db as IDBDatabase)
    .transaction(["message"], "readonly")
    .objectStore("message");
  const objectIndex = objectStore.index("time");
  return await new Promise((resolve) => {
    const request = objectIndex.openCursor();
    const results: msgObj[] = [];
    request.onsuccess = (e) => {
      const cursor = (e.target as any).result;
      if (cursor) {
        results.push(cursor.value);
        cursor.continue();
      } else {
        // 使用index索引查询默认会按照索引升序排序，取出数组中最后一项便是时间最新的记录
        resolve([results[results.length - 1]]);
      }
    };
  });
}
