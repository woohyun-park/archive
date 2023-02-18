import { useRouter } from "next/router";
import { IPost, IUser } from "../libs/custom";
import { useStatus } from "../stores/useStatus";
import { useUser } from "../stores/useUser";
import Action from "./Action";
import PostBox from "./PostBox";
import PostImg from "./PostImg";
import PostTag from "./PostTag";
import PostTitle from "./PostTitle";
import Profile from "./Profile";
import WrapMotion from "./wrappers/WrapMotion";
import WrapScroll from "./wrappers/WrapScroll";

interface IPostProps {
  type: "feed" | "post";
  post: IPost;
}

export default function Post({ type, post }: IPostProps) {
  const { curUser } = useUser();
  const { setModalLoader } = useStatus();

  const router = useRouter();

  return (
    <>
      {post.author ? (
        type === "feed" ? (
          <>
            <WrapMotion type="float" className="px-4 py-1 bg-white">
              <WrapScroll>
                <Profile
                  post={post}
                  user={post.author as IUser}
                  info="time"
                  action={
                    curUser.id === post.uid ? "modifyAndDelete" : undefined
                  }
                />
                <PostBox post={post} />
                <PostTitle post={post} />
                <PostTag tags={post.tags} />
                <Action
                  post={post}
                  curUser={curUser}
                  onCommentClick={() => {
                    setModalLoader(true);
                    router.push(
                      {
                        pathname: `/post/${post.id}`,
                        query: { isCommentFocused: true },
                      },
                      `/post/${post.id}`
                    );
                  }}
                />
              </WrapScroll>
            </WrapMotion>
          </>
        ) : type === "post" ? (
          <>
            <PostImg imgs={post.imgs} color={post.color} />
            {curUser.id === post.uid ? (
              <Profile post={post} user={post.author} info="time" />
            ) : (
              <Profile
                post={post}
                user={post.author}
                info="time"
                action="follow"
              />
            )}
            <PostTitle post={post} />
            <PostTag tags={post.tags} style={{ marginBottom: "2rem" }} />
            <div className="mt-1 mb-4 whitespace-pre-wrap">{post.txt}</div>
          </>
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
    </>
  );
}
