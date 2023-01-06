import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { IPost } from "../custom";
import ImagePost from "./ImagePost";
import ProfileSmall from "./ProfileSmall";

type IFeedPostProps = {
  post: IPost;
};

export default function FeedPost({ post }: IFeedPostProps) {
  return (
    <>
      <ProfileSmall post={post} />
      <ImagePost post={post} style="feed" />
    </>
  );
}
