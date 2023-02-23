import { IDict } from "../libs/custom";

// className을 props로 전달할 때 props로 들어온 것들을 덮어쓰기 위한 함수

// let classA = 'p-4 bg-red-200 mx-6';
// let classB = 'p-2 font-bold m-3';
// let classC = mergeTailwindClasses(a, b);
// console.log(classC); // bg-red-200 font-bold m-3 mx-6 p-2

// 참조: https://github.com/tailwindlabs/tailwindcss/issues/1010

export function mergeTailwindClasses(...classStrings: string[]) {
  let classHash: IDict<string> = {};
  classStrings.map((str) => {
    str.split(/\s+/g).map((token) => (classHash[token.split("-")[0]] = token));
  });
  return Object.values(classHash).sort().join(" ");
}
