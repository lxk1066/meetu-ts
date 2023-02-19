import { store } from "./init";

export async function getAllMessages(
  uid: string,
  fromId: string,
  toId: string
): Promise<any[]> {
  const db: number | IDBDatabase = await store(uid, fromId, toId);
  const objectStore = (db as IDBDatabase)
    .transaction(["message"], "readonly")
    .objectStore("message");
  const objectIndex = objectStore.index("time"); // 按照时间的先后顺序排列
  return await new Promise((resolve) => {
    const request = objectIndex.openCursor();
    const results: any[] = [];
    request.onsuccess = (e: Event) => {
      const cursor = (e.target as any).result;
      if (cursor) {
        results.push(cursor.value);
        cursor.continue();
      } else {
        // 所有的object都在results里面
        resolve(results);
      }
    };
  });
}
