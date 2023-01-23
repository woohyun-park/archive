import { Ref } from "react";
import { DEFAULT, IPost, IUser } from "../custom";
import Box from "./Box";
import PostAction from "./PostAction";
import ProfileSmall from "./ProfileSmall";

type IPostFeedProps = {
  post: IPost | null;
  user: IUser | null;
};

export default function PostFeed({ post, user }: IPostFeedProps) {
  return (
    <>
      {post && user && (
        <>
          <ProfileSmall post={post} user={user} type="post" />
          <Box post={post} />
          <PostAction post={post} />
        </>
      )}
    </>
  );
}
