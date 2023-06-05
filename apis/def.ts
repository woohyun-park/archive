import { IComment, IPost, IUser } from "types/common";

// 전역적으로 사용되는 definition이 저장되어있는 api
const colors = require("tailwindcss/colors");

export const COLOR = {
  "black-f": colors.black,
  black: colors.gray[900],
  white: colors.white,
  "gray-1f": colors.gray[800],
  "gray-1": colors.gray[700],
  "gray-2f": colors.gray[500],
  "gray-2": colors.gray[400],
  "gray-3f": colors.gray[300],
  "gray-3": colors.gray[200],
  "gray-4f": colors.gray[100],
  "gray-4": colors.gray[50],
  red: colors.red[500],
  orange: colors.orange[500],
  amber: colors.amber[500],
  yellow: colors.yellow[500],
  lime: colors.lime[500],
  green: colors.green[500],
  emerald: colors.emerald[500],
  teal: colors.teal[500],
  cyan: colors.cyan[500],
  sky: colors.sky[500],
  blue: colors.blue[500],
  indigo: colors.indigo[500],
  violet: colors.violet[500],
  purple: colors.purple[500],
  fuchsia: colors.fuchsia[500],
  pink: colors.pink[500],
} as const;

export const DEFAULT: {
  user: IUser;
  comment: IComment;
  post: IPost;
} = {
  user: {
    id: "",
    email: "",
    displayName: "유저",
    photoURL:
      "https://res.cloudinary.com/dl5qaj6le/image/upload/v1672976914/archive/static/default_user_photoURL.png",
    txt: "이것은 테스트용 유저입니다",
    followers: [],
    followings: [],
    createdAt: new Date(),
  },
  comment: {
    id: "",
    uid: "",
    pid: "",
    txt: "이것은 테스트용 댓글입니다",
    createdAt: new Date(),
  },
  post: {
    id: "",
    uid: "",
    title: "타이틀",
    txt: "이것은 테스트용 포스트입니다",
    imgs: [
      "https://res.cloudinary.com/dl5qaj6le/image/upload/v1664891643/archive/static/carousel_temp.png",
    ],
    color: COLOR.indigo,
    tags: ["태그1", "태그2"],
    createdAt: new Date(),
  },
};

export const SIZE = {
  icon: "32px",
  iconSm: "24px",
  iconXs: "16px",
};
