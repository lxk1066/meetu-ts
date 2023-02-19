/**
 * 获取本地存储中的所有数据库，即所有的聊天记录
 * @returns {Promise<IDBDatabaseInfo[]>}
 */
export const getDatabases = async (): Promise<IDBDatabaseInfo[]> => {
  const dbs = window.indexedDB.databases
    ? await window.indexedDB.databases()
    : [];
  const pattern = /^meetu_\d+_\d+_\d+$/;
  return dbs.filter((item) => pattern.test(item.name as string));
};
