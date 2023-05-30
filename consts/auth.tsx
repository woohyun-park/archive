import { onboarding_1, onboarding_2, onboarding_3 } from "assets";

import { IUser } from "apis/def";

export const AUTH_USER_DEFAULT: IUser = {
  id: "",
  email: "",
  displayName: "",
  photoURL:
    "https://res.cloudinary.com/dl5qaj6le/image/upload/v1672976914/archive/static/default_user_photoURL.png",
  txt: "",
  followers: [],
  followings: [],
  createdAt: new Date(),
};

export const AUTH_ONBOARDING_MESSAGE: [JSX.Element, string][] = [
  [
    <>
      나의 일상과 취향을
      <br />
      한곳에 아카이브해요
    </>,
    onboarding_1,
  ],
  [
    <>
      나만의 태그를 통해
      <br />
      손쉽게 분류하고 검색해요
    </>,
    onboarding_2,
  ],
  [
    <>
      같은 관심사를 가진 사람들의
      <br />
      아카이브를 둘러봐요
    </>,
    onboarding_3,
  ],
];
