import { IDict } from "../apis/def";

export async function wrapPromise(
  callback: Function,
  delay: number
): Promise<IDict<any>> {
  let res: IDict<any> = {};
  await Promise.all([
    callback(),
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(0);
      }, delay);
    }),
  ]).then((values) => {
    res = values[0];
  });
  return res;
}
