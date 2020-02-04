import { Connection, ISOLATION_LEVEL } from "tedious";

export const commit = (con: Connection) => () =>
  new Promise<void>((resolve, reject) => {
    try {
      con.commitTransaction(err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  });

export const rollback = (con: Connection) => () =>
  new Promise<void>((resolve, reject) => {
    try {
      con.rollbackTransaction(err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  });

export const beginTransaction = (
  connection: Connection,
  name?: string,
  isolationLevel?: ISOLATION_LEVEL,
) =>
  new Promise<{
    commit: () => Promise<void>;
    rollback: () => Promise<void>;
  }>((resolve, reject) => {
    try {
      return connection.beginTransaction(
        err => {
          if (err) reject(err);
          else {
            resolve({
              commit: commit(connection),
              rollback: rollback(connection),
            });
          }
        },
        name,
        isolationLevel,
      );
    } catch (error) {
      reject(error);
    }
  });

export const withTransaction = <T = any>(
  callback: (con: Connection) => Promise<T>,
) => async (connection: Connection) => {
  try {
    const { commit, rollback } = await beginTransaction(connection);
    try {
      const ret = await callback(connection);
      await commit();
      return ret;
    } catch (error) {
      await rollback();
      return Promise.reject(error);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};
