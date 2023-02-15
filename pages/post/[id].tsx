import { useRouter } from "next/router";
import {
  db,
  deletePost,
  getData,
  getDatasByQuery,
  getPath,
} from "../../apis/firebase";
import ProfileSmall from "../../components/ProfileSmall";
import { IComment, ILike, IPost, IScrap, IUser, SIZE } from "../../libs/custom";
import Image from "next/image";
import { collection, orderBy, query, where } from "firebase/firestore";
import React, { Children, useEffect, useState } from "react";
import Btn from "../../components/atoms/Btn";
import IconBtn from "../../components/atoms/IconBtn";
import { useUser } from "../../stores/useUser";
import PostTitle from "../../components/atoms/PostTitle";
import CommentBox from "../../components/CommentBox";
import Motion from "../../motions/Motion";
import { useFeed } from "../../stores/useFeed";
import { useModal } from "../../stores/useModal";

interface IPostProps {
  initPost: IPost;
  initUser: IUser;
}

export default function Post({ initPost, initUser }: IPostProps) {
  const { curUser } = useUser();
  const { setPosts, posts } = useFeed();
  const router = useRouter();
  const [post, setPost] = useState<IPost>(initPost);
  const { setModalLoader } = useModal();

  useEffect(() => {
    setModalLoader(false);
  }, []);

  function handleModify() {
    router.push(
      {
        pathname: "/add",
        query: { post: JSON.stringify(post) },
      },
      "/modify"
    );
  }

  async function handleDelete() {
    if (confirm("정말 삭제하시겠습니까?")) {
      await deletePost(post?.id as string);
      alert("삭제되었습니다");
      setTimeout(
        () => setPosts([...posts].filter((e) => e.id !== post?.id)),
        500
      );
    } else {
      console.log(post);
    }
    router.push("/");
  }

  return (
    <>
      <Motion type="fade">
        {initPost === null && initUser === null ? (
          <div>존재하지 않는 페이지입니다</div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <IconBtn icon="back" onClick={router.back} />
              {curUser.id === initUser.id && (
                <div className="flex items-center">
                  <IconBtn
                    icon="modify"
                    onClick={handleModify}
                    size={SIZE.iconSm}
                  />
                  <IconBtn icon="delete" onClick={handleDelete} />
                </div>
              )}
            </div>
            {post.imgs.length === 0 ? (
              <div
                className="w-[calc(100%+32px)] -translate-x-4 pb-[50%]"
                id="post_d1"
              ></div>
            ) : (
              <div className="relative pb-[100%] w-[calc(100%+32px)] -translate-x-4">
                <Image
                  src={post.imgs[0]}
                  alt=""
                  className="object-cover"
                  fill
                />
              </div>
            )}
            <ProfileSmall post={post} user={initUser} type="post" />
            <PostTitle post={post} />
            <div className="flex flex-wrap justify-end w-full mb-8">
              {Children.toArray(
                post.tags.map((tag, i) => (
                  <Btn
                    label={`#${tag}`}
                    onClick={() => router.push(`/tag/${tag}`)}
                    style={{
                      margin: "0.125rem",
                      paddingRight: "0.5rem",
                      paddingLeft: "0.5rem",
                    }}
                  />
                ))
              )}
            </div>
            <div className="mt-1 mb-4 whitespace-pre-wrap">{post.txt}</div>
            <CommentBox post={post} user={curUser} setPost={setPost} />
          </>
        )}
        <style jsx>{`
          #post_d1 {
            background-color: ${post.color};
          }
        `}</style>
      </Motion>
    </>
  );
}

interface IServerSidePaths {
  params: IServerSideProps;
}
interface IServerSideProps {
  id: string;
}

export async function getServerSidePaths() {
  const paths = await getPath("posts", "id");
  return { paths, fallback: false };
}

export async function getServerSideProps({ params }: IServerSidePaths) {
  const initPost = await getData<IPost>("posts", params.id);
  if (initPost === null)
    return {
      props: {
        initPost,
        initUser: null,
        initLikes: null,
        initComments: null,
        initScraps: null,
      },
    };
  const initUser = await getData<IUser>("users", initPost.uid as string);

  const id = initPost.id as string;
  const likes = await getDatasByQuery(
    query(collection(db, "likes"), where("pid", "==", id))
  );
  const scraps = await getDatasByQuery(
    query(collection(db, "scraps"), where("pid", "==", id))
  );
  const comments = await getDatasByQuery(
    query(
      collection(db, "comments"),
      where("pid", "==", id),
      orderBy("createdAt", "desc")
    )
  );

  initPost.likes = likes ? (likes as ILike[]) : [];
  initPost.scraps = scraps ? (scraps as IScrap[]) : [];
  initPost.comments = comments ? (comments as IComment[]) : [];
  return { props: { initPost, initUser } };
}
