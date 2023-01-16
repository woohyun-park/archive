import { DEFAULT, IPost, IUser } from "../custom";
import Box from "./Box";
import PostAction from "./PostAction";
import ProfileSmall from "./ProfileSmall";

type IPostFeedProps = {
  post: IPost;
  user: IUser;
};

export default function PostFeed({ post, user }: IPostFeedProps) {
  return (
    <>
      {
        <>
          <ProfileSmall post={post} user={user} style="feed" />
          <Box post={post} style="feed" />
          <PostAction post={post} style="feed" />
        </>
      }
    </>
  );
}
