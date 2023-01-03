export interface User {
  name: string;
  img: string;
}

export interface Post {
  id: number;
  user: User;
  createdAt: string;
  title: string;
  tags: string[];
  imgs: string[];
  color: string;
  numLikes: number;
  arrLikes: number[];
  numComments: number;
  arrComments: string[];
}
