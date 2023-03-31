// 전역적으로 사용되는 setting이 저장되어있는 api

import { IDict, IUser } from "./interface";
const colors = require("tailwindcss/colors");

export const DEFAULT: { user: IUser } = {
  user: {
    id: "",
    email: "",
    displayName: "",
    photoURL:
      "https://res.cloudinary.com/dl5qaj6le/image/upload/v1672976914/archive/static/default_user_photoURL.png",
    txt: "",
    followers: [],
    followings: [],
    createdAt: new Date(),
  },
};

export const SIZE = {
  icon: "32px",
  iconSm: "24px",
  iconXs: "16px",
};

export const COLOR: IDict<string> = {
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
};
