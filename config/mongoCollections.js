import { dbConnection } from './mongoConnection.js';

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

export const users = getCollectionFn('users');
export const reviews = getCollectionFn('reviews');
export const posts = getCollectionFn('posts');
export const comment = getCollectionFn('comment');
export const sessionTokens = getCollectionFn('sessionTokens');