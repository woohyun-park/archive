import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { IPost } from "../custom";
import Image from "./Image";
import ProfileSmall from "./ProfileSmall";

type IPostFeedProps = {
  post: IPost;
};

export default function PostFeed({ post }: IPostFeedProps) {
  return (
    <>
      <ProfileSmall post={post} />
      <Image post={post} style="feed" />
    </>
  );
}
