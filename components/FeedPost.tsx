import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { IPost } from "../custom";
import ImageFeed from "./ImageFeed";
import ProfileSmall from "./ProfileSmall";

type IFeedPostProps = {
  docData: QueryDocumentSnapshot<DocumentData>;
};

export default function FeedPost({ docData }: IFeedPostProps) {
  const post: IPost = { ...(docData.data() as IPost), id: docData.id };
  return (
    <>
      <ProfileSmall post={post} />
      <ImageFeed post={post} />
    </>
  );
}
