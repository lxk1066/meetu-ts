/**
 * 获取本地存储中的所有数据库，即当前用户的所有聊天记录
 * @param {String} uid 当前登录用户id
 * @returns {Promise<IDBDatabaseInfo[]>}
 */
export const getDatabases = async (uid: string): Promise<IDBDatabaseInfo[]> => {
  const dbs = window.indexedDB.databases
    ? await window.indexedDB.databases()
    : [];
  const pattern = new RegExp(`^meetu_${uid}_\\d+_\\d+$`);
  return dbs.filter((item) => pattern.test(item.name as string));
};
