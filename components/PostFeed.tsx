import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { IPost, IUser } from "../custom";
import Image from "./Image";
import ProfileSmall from "./ProfileSmall";

type IPostFeedProps = {
  post: IPost;
  user: IUser;
};

export default function PostFeed({ post, user }: IPostFeedProps) {
  return (
    <>
      <ProfileSmall post={post} user={user} />
      <Image post={post} style="feed" />
    </>
  );
}
