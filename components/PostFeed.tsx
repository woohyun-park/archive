import { IPost, IUser } from "../custom";
import Image from "./Image";
import PostAction from "./PostAction";
import ProfileSmall from "./ProfileSmall";

type IPostFeedProps = {
  post: IPost;
  user: IUser;
};

export default function PostFeed({ post, user }: IPostFeedProps) {
  return (
    <>
      {!post.isDeleted && (
        <>
          <ProfileSmall post={post} user={user} style="feed" />
          <Image post={post} style="feed" />
          <PostAction post={post} style="feed" />
        </>
      )}
    </>
  );
}
