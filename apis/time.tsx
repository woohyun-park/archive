// time을 손쉽게 변환하기 위한 api

import dayjs from "dayjs";
import { FieldValue } from "firebase/firestore";

export function displayCreatedAt(createdAt: Date | FieldValue) {
  const curDate = dayjs(new Date());
  const postDate = dayjs(createdAt as Date);
  if (curDate.diff(postDate) < 0) return "0초 전";
  if (curDate.diff(postDate) < 60000)
    return `${curDate.diff(postDate, "s")}초 전`;
  if (curDate.diff(postDate) < 3600000)
    return `${curDate.diff(postDate, "m")}분 전`;
  if (curDate.diff(postDate) < 86400000)
    return `${curDate.diff(postDate, "h")}시간 전`;
  if (curDate.diff(postDate) < 86400000 * 3)
    return `${curDate.diff(postDate, "d")}일 전`;
  return postDate.format("MM월 DD, YYYY");
}
