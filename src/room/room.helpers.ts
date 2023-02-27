import { resolve } from 'path';

export const getImagePath = (name: string) => {
  return resolve(__dirname, '..', '..', 'src', 'images', name);
};
