import { useRouter } from "next/router";
import { HiPencil, HiX } from "react-icons/hi";
import {
  db,
  deletePost,
  getData,
  getDataByRef,
  getDatasByQuery,
  getPath,
} from "../../apis/firebase";
import Action from "../../components/Action";
import ProfileSmall from "../../components/ProfileSmall";
import { IComment, ILike, IPost, IScrap, IUser, SIZE } from "../../custom";
import { useStore } from "../../apis/zustand";
import Image from "next/image";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import MotionFade from "../../motions/motionFade";
import React, { RefObject, useEffect, useRef, useState } from "react";
import Textarea from "../../components/atoms/Textarea";
import Btn from "../../components/atoms/Btn";
import MotionFloatList from "../../motions/MotionFloatList";
import Comment from "../../components/Comment";
import IconBtn from "../../components/atoms/IconBtn";

interface IPostProps {
  initPost: IPost;
  initUser: IUser;
}

export default function Post({ initPost, initUser }: IPostProps) {
  const { gCurUser } = useStore();
  const router = useRouter();
  const [post, setPost] = useState<IPost>(initPost);
  const [submitListener, setSubmitListener] = useState<boolean | null>(null);

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
    } else {
      console.log(post);
    }
    router.push("/");
  }
  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setComment(e.target.value);
  }
  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    const tempComment: IComment = {
      uid: gCurUser.id,
      pid: post.id || "",
      txt: comment,
      createdAt: serverTimestamp(),
    };
    const ref = await addDoc(collection(db, "comments"), tempComment);
    await updateDoc(ref, {
      id: ref.id,
    });
    const newComment = await getDataByRef<IComment>(ref);
    setPost({
      ...post,
      comments: [newComment, ...(post.comments as IComment[])],
    });
    setComment("");
    setSubmitListener(!submitListener);
  }
  async function handleDeleteComment(e: React.MouseEvent<HTMLDivElement>) {
    const id = e.currentTarget.id;
    await deleteDoc(doc(db, "comments", id));
    setPost({
      ...post,
      comments: [...(post.comments as IComment[])].filter(
        (comment) => comment.id !== id
      ),
    });
  }

  const [comment, setComment] = useState("");
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const actionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (submitListener !== null)
      actionRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [submitListener]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <MotionFade>
        {initPost === null && initUser === null ? (
          <div>존재하지 않는 페이지입니다</div>
        ) : (
          <>
            <div className="flex items-baseline justify-between">
              <IconBtn
                type="back"
                style="margin: 16px 0;"
                onClick={router.back}
              />
              {gCurUser.id === initUser.id && (
                <div className="flex items-center pt-6 mt-12">
                  <IconBtn
                    type="modify"
                    onClick={handleModify}
                    size={SIZE.iconSm}
                  />
                  <IconBtn type="delete" onClick={handleDelete} />
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
            <h1 className="mb-4 text-5xl">{post.title}</h1>
            <div className="flex flex-wrap justify-end w-full mb-8">
              {post.tags.map((tag, i) => (
                <Btn
                  key={i}
                  onClick={() => router.push(`/tag/${tag}`)}
                  style="margin: 0.125rem; padding-right: 0.5rem; padding-left: 0.5rem"
                >
                  {`#${tag}`}
                </Btn>
              ))}
            </div>
            <div className="mt-1 mb-4 whitespace-pre-wrap">{post.txt}</div>
            <Action
              post={post}
              curUser={gCurUser}
              onCommentClick={() => {
                commentRef.current?.scrollIntoView({ behavior: "smooth" });
                setTimeout(() => commentRef.current?.focus({}), 500);
              }}
              ref={actionRef}
            />
            <MotionFloatList
              data={(post.comments && post.comments.slice(0, 10)) || []}
              callBack={(comment: IComment) => (
                <Comment
                  comment={comment}
                  onClick={handleDeleteComment}
                  key={comment.id}
                />
              )}
            />
            {post.comments && post.comments?.length > 10 && (
              <div className="mb-2 text-xs text-center hover:cursor-pointer">
                {"모두보기"}
              </div>
            )}
            <div className="sticky bottom-0 flex items-center justify-between w-full py-4 bg-white">
              <div className="profileImg-small">
                <Image src={gCurUser.photoURL} alt="" fill />
              </div>
              <Textarea
                placeholder={`${gCurUser.displayName}(으)로 댓글 달기...`}
                value={comment}
                onChange={handleChange}
                ref={commentRef}
                autoFocus={router.query.isCommentFocused ? true : false}
                style={{
                  marginLeft: "0.5rem",
                  marginRight: "0.5rem ",
                }}
              />
              <Btn onClick={handleSubmit}>게시</Btn>
            </div>
          </>
        )}

        <style jsx>{`
          #post_d1 {
            background-color: ${post.color};
          }
        `}</style>
      </MotionFade>
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
