// time을 손쉽게 변환하기 위한 api

import { FieldValue } from "firebase/firestore";
import { format, register } from "timeago.js";

type IRegister = [string, string][];

const localeFunc = (
  number: number,
  index: number,
  totalSec?: number
): [string, string] => {
  const ko: IRegister = [
    ["지금", "지금"],
    ["%s초 전", "%s초 후"],
    ["1분 전", "1분 후"],
    ["%s분 전", "%s분 후"],
    ["1시간 전", "1시간 후"],
    ["%s시간 전", "%s시간 후"],
    ["1일 전", "1일 후"],
    ["%s일 전", "%s일 후"],
    ["1주 전", "1주 후"],
    ["%s주 전", "%s주 후"],
    ["1달 전", "1달 후"],
    ["%s달 전", "%s달 후"],
    ["1년 전", "1년 후"],
    ["%s년 전", "%s년 후"],
  ];
  return ko[index];
};

register("ko-KR", localeFunc);

export function displayCreatedAt(createdAt: Date | FieldValue) {
  return format(createdAt as Date, navigator.language);
}
