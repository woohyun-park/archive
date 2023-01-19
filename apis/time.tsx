import dayjs from "dayjs";
import { FieldValue } from "firebase/firestore";
import { IPost } from "../custom";

const TIME = {
  displayCreatedAt: (createdAt: FieldValue | Date | undefined | null) => {
    if (!createdAt) return null;
    const curDate = dayjs(new Date());
    const postDate = dayjs(createdAt as Date);
    if (curDate.diff(postDate) < 60000) {
      return `${curDate.diff(postDate, "s")}초 전`;
    } else if (curDate.diff(postDate) < 3600000) {
      return `${curDate.diff(postDate, "m")}분 전`;
    } else if (curDate.diff(postDate) < 86400000) {
      return `${curDate.diff(postDate, "h")}시간 전`;
    } else if (curDate.diff(postDate) < 86400000 * 3) {
      return `${curDate.diff(postDate, "d")}일 전`;
    } else {
      return postDate.format("MM월 DD, YYYY");
    }
  },
};

export default TIME;
