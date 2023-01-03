export interface User {
  name: string;
  img: string;
}

export interface Post {
  user: User;
  createdAt: string;
  title: string;
  tags: string[];
  imgs: string[];
  numLikes: number;
  arrLikes: number[];
  numComments: number;
  arrComments: string[];
}
