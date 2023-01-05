export const SIZE = {
  icon: "24px",
};

export const COLOR = {
  txt1: "#000000",
  txt2: "#4A4A4A",
  txt3: "#D9D9D9",
  txtDark1: "#FFFFFF",
  txtDark2: "#818181",
  txtDark3: "#4A4A4A",
  txtBtn: "#FFFFFF",
  txtBtnDark: "#000000",
  bg1: "#FFFFFF",
  bgDark1: "#2C2C2C",
  bg2: "#D9D9D9",
  bgDark2: "#D9D9D9",
  btn: "#000000",
  btnDark: "#FFFFFF",
};

export interface IUser {
  uid: string;
  displayName: string;
  photoURL: string;
  tags: string[];
  scraps: string[];
  followers: string[];
  followings: string[];
}

export interface IPost {
  id?: string;
  uid: string;
  createdAt: string;
  title: string;
  tags: string[];
  text: string;
  imgs: string[];
  color: string;
  likes: number[];
  comments: IComment[];
}

export interface IComment {
  id: string;
  user: IUser;
  createdAt: string;
  text: string;
}

export const TEMP = {
  posts: [
    {
      id: 0,
      user: {
        name: "iamdooddi",
        img: "https://res.cloudinary.com/dl5qaj6le/image/upload/v1664891276/archive/static/profile_temp.png",
      },
      title: "노티드",
      tags: ["카페", "도넛", "디저트"],
      text: "",
      imgs: [
        "https://res.cloudinary.com/dl5qaj6le/image/upload/v1664891643/archive/static/carousel_temp.png",
      ],
      color: "",
      createdAt: "6시간 전",
      numLikes: 0,
      arrLikes: [],
      numComments: 0,
      arrComments: [],
    },
    {
      id: 1,
      user: {
        name: "blugalore",
        img: "https://res.cloudinary.com/dl5qaj6le/image/upload/v1664891276/archive/static/profile_temp.png",
      },
      title: "오래 속삭여도 좋을 이야기",
      tags: ["시집", "문학동네", "이은규"],
      text: "",
      imgs: [],
      color: "#EC6B71",
      createdAt: "1일 전",
      numLikes: 0,
      arrLikes: [],
      numComments: 0,
      arrComments: [],
    },
  ],
};
